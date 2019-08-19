import { EventTarget } from '../event-target';
import { ACTIVE_AUDIO_NODE_STORE, AUDIO_NODE_STORE, AUXILIARY_GAIN_NODE_STORE, EVENT_LISTENERS } from '../globals';
import { isAudioNode } from '../guards/audio-node';
import { isAudioNodeOutputConnection } from '../guards/audio-node-output-connection';
import { isAudioWorkletNode } from '../guards/audio-worklet-node';
import { connectNativeAudioNodeToNativeAudioNode } from '../helpers/connect-native-audio-node-to-native-audio-node';
import { deleteEventListenerOfAudioNode } from '../helpers/delete-event-listeners-of-audio-node';
import { disconnectNativeAudioNodeFromNativeAudioNode } from '../helpers/disconnect-native-audio-node-from-native-audio-node';
import { getAudioGraph } from '../helpers/get-audio-graph';
import { getAudioNodeConnections } from '../helpers/get-audio-node-connections';
import { getAudioParamConnections } from '../helpers/get-audio-param-connections';
import { getEventListenersOfAudioNode } from '../helpers/get-event-listeners-of-audio-node';
import { getNativeAudioNode } from '../helpers/get-native-audio-node';
import { getNativeAudioParam } from '../helpers/get-native-audio-param';
import { getNativeContext } from '../helpers/get-native-context';
import { getValueForKey } from '../helpers/get-value-for-key';
import { insertElementInSet } from '../helpers/insert-element-in-set';
import { isActiveAudioNode } from '../helpers/is-active-audio-node';
import { isPassiveAudioNode } from '../helpers/is-passive-audio-node';
import { pickElementFromSet } from '../helpers/pick-element-from-set';
import { setInternalState } from '../helpers/set-internal-state';
import { setInternalStateToPassiveWhenNecessary } from '../helpers/set-internal-state-to-passive-when-necessary';
import { testAudioNodeDisconnectMethodSupport } from '../helpers/test-audio-node-disconnect-method-support';
import { wrapAudioNodeDisconnectMethod } from '../helpers/wrap-audio-node-disconnect-method';
import {
    IAudioNode,
    IAudioNodeRenderer,
    IAudioParam,
    IMinimalBaseAudioContext,
    IMinimalOfflineAudioContext,
    INativeAudioNodeFaker
} from '../interfaces';
import {
    TActiveInputConnection,
    TAudioNodeConstructorFactory,
    TChannelCountMode,
    TChannelInterpretation,
    TInternalState,
    TInternalStateEventListener,
    TNativeAudioNode,
    TNativeAudioParam,
    TNativeAudioWorkletNode,
    TOutputConnection,
    TPassiveAudioNodeInputConnection,
    TPassiveAudioParamInputConnection
} from '../types';

const addAudioNode = <T extends IMinimalBaseAudioContext>(
    context: T,
    audioNode: IAudioNode<T>,
    audioNoderRender: T extends IMinimalOfflineAudioContext ? IAudioNodeRenderer<T, IAudioNode<T>> : null,
    nativeAudioNode: TNativeAudioNode
) => {
    const activeInputs: Set<TActiveInputConnection<T>>[] = [ ];

    for (let i = 0; i < nativeAudioNode.numberOfInputs; i += 1) {
        activeInputs.push(new Set());
    }

    const { nodes } = getAudioGraph(context);

    nodes.set(audioNode, {
        activeInputs,
        outputs: new Set<TOutputConnection<T>>(),
        passiveInputs: new WeakMap<IAudioNode<T>, Set<TPassiveAudioNodeInputConnection<T>>>(),
        renderer: audioNoderRender
    });
};

const addActiveInputConnectionToAudioNode = <T extends IMinimalBaseAudioContext>(
    activeInputs: Set<TActiveInputConnection<T>>[],
    source: IAudioNode<T>,
    [ output, input, eventListener ]: TPassiveAudioNodeInputConnection<T>,
    ignoreDuplicates: boolean
) => {
    insertElementInSet(
        activeInputs[input],
        [ source, output, eventListener ],
        (activeInputConnection) => (activeInputConnection[0] === source && activeInputConnection[1] === output),
        ignoreDuplicates
    );
};

const addActiveInputConnectionToAudioParam = <T extends IMinimalBaseAudioContext>(
    activeInputs: Set<TActiveInputConnection<T>>,
    source: IAudioNode<T>,
    [ output, eventListener ]: TPassiveAudioParamInputConnection<T>,
    ignoreDuplicates: boolean
) => {
    insertElementInSet(
        activeInputs,
        [ source, output, eventListener ],
        (activeInputConnection) => (activeInputConnection[0] === source && activeInputConnection[1] === output),
        ignoreDuplicates
    );
};

const deleteActiveInputConnectionToAudioNode = <T extends IMinimalBaseAudioContext>(
    activeInputs: Set<TActiveInputConnection<T>>[],
    source: IAudioNode<T>,
    output: number,
    input: number
) => {
    return pickElementFromSet(
        activeInputs[input],
        (activeInputConnection) => (activeInputConnection[0] === source && activeInputConnection[1] === output)
    );
};

const deleteActiveInputConnectionToAudioParam = <T extends IMinimalBaseAudioContext>(
    activeInputs: Set<TActiveInputConnection<T>>,
    source: IAudioNode<T>,
    output: number
) => {
    return pickElementFromSet(
        activeInputs,
        (activeInputConnection) => (activeInputConnection[0] === source && activeInputConnection[1] === output)
    );
};

const addPassiveInputConnectionToAudioNode = <T extends IMinimalBaseAudioContext>(
    passiveInputs: WeakMap<IAudioNode<T>, Set<TPassiveAudioNodeInputConnection<T>>>,
    input: number,
    [ source, output, eventListener ]: TActiveInputConnection<T>,
    ignoreDuplicates: boolean
) => {
    const passiveInputConnections = passiveInputs.get(source);

    if (passiveInputConnections === undefined) {
        passiveInputs.set(source, new Set([ [ output, input, eventListener ] ]));
    } else {
        insertElementInSet(
            passiveInputConnections,
            [ output, input, eventListener ],
            (passiveInputConnection) => (passiveInputConnection[0] === output && passiveInputConnection[1] === input),
            ignoreDuplicates
        );
    }
};

const addPassiveInputConnectionToAudioParam = <T extends IMinimalBaseAudioContext>(
    passiveInputs: WeakMap<IAudioNode<T>, Set<TPassiveAudioParamInputConnection<T>>>,
    [ source, output, eventListener ]: TActiveInputConnection<T>,
    ignoreDuplicates: boolean
) => {
    const passiveInputConnections = passiveInputs.get(source);

    if (passiveInputConnections === undefined) {
        passiveInputs.set(source, new Set([ [ output, eventListener ] ]));
    } else {
        insertElementInSet(
            passiveInputConnections,
            [ output, eventListener ],
            (passiveInputConnection) => (passiveInputConnection[0] === output),
            ignoreDuplicates
        );
    }
};

const deletePassiveInputConnectionToAudioNode = <T extends IMinimalBaseAudioContext>(
    passiveInputs: WeakMap<IAudioNode<T>, Set<TPassiveAudioNodeInputConnection<T>>>,
    source: IAudioNode<T>,
    output: number,
    input: number
) => {
    const passiveInputConnections = getValueForKey(passiveInputs, source);
    const matchingConnection = pickElementFromSet(
        passiveInputConnections,
        (passiveInputConnection) => (passiveInputConnection[0] === output && passiveInputConnection[1] === input)
    );

    if (passiveInputConnections.size === 0) {
        passiveInputs.delete(source);
    }

    return matchingConnection;
};

const deletePassiveInputConnectionToAudioParam = <T extends IMinimalBaseAudioContext>(
    passiveInputs: WeakMap<IAudioNode<T>, Set<TPassiveAudioParamInputConnection<T>>>,
    source: IAudioNode<T>,
    output: number
) => {
    const passiveInputConnections = getValueForKey(passiveInputs, source);
    const matchingConnection = pickElementFromSet(
        passiveInputConnections,
        (passiveInputConnection) => (passiveInputConnection[0] === output)
    );

    if (passiveInputConnections.size === 0) {
        passiveInputs.delete(source);
    }

    return matchingConnection;
};

const addConnectionToAudioNodeOfAudioContext = <T extends IMinimalBaseAudioContext>(
    source: IAudioNode<T>,
    destination: IAudioNode<T>,
    output: number,
    input: number
) => {
    const { activeInputs, passiveInputs } = getAudioNodeConnections(destination);
    const { outputs } = getAudioNodeConnections(source);
    const eventListeners = getEventListenersOfAudioNode(source);

    const eventListener = <T extends IMinimalOfflineAudioContext ? null : TInternalStateEventListener> ((type) => {
        const nativeDestinationAudioNode = getNativeAudioNode(destination);
        const nativeSourceAudioNode = getNativeAudioNode(source);

        if (type === 'active') {
            const partialConnection = deletePassiveInputConnectionToAudioNode(passiveInputs, source, output, input);

            addActiveInputConnectionToAudioNode(activeInputs, source, partialConnection, false);
            connectNativeAudioNodeToNativeAudioNode(nativeSourceAudioNode, nativeDestinationAudioNode, output, input);

            if (isPassiveAudioNode(destination)) {
                setInternalState(destination, 'active');
            }
        } else if (type === 'passive') {
            const partialConnection = deleteActiveInputConnectionToAudioNode(activeInputs, source, output, input);

            addPassiveInputConnectionToAudioNode(passiveInputs, input, partialConnection, false);
            disconnectNativeAudioNodeFromNativeAudioNode(nativeSourceAudioNode, nativeDestinationAudioNode, output, input);

            if (isActiveAudioNode(destination)) {
                setInternalStateToPassiveWhenNecessary(destination, activeInputs);
            }
        }
    });

    if (insertElementInSet(
        outputs,
        [ destination, output, input ],
        (outputConnection) => (outputConnection[0] === destination && outputConnection[1] === output && outputConnection[2] === input),
        true
    )) {
        eventListeners.add(eventListener);

        if (isActiveAudioNode(source)) {
            addActiveInputConnectionToAudioNode(activeInputs, source, [ output, input, eventListener ], true);
        } else {
            addPassiveInputConnectionToAudioNode(passiveInputs, input, [ source, output, eventListener ], true);
        }
    }
};

const addConnectionToAudioNodeOfOfflineAudioContext = <T extends IMinimalBaseAudioContext>(
    source: IAudioNode<T>,
    destination: IAudioNode<T>,
    output: number,
    input: number
) => {
    const { activeInputs } = getAudioNodeConnections(destination);
    const { outputs } = getAudioNodeConnections(source);

    if (insertElementInSet(
        outputs,
        [ destination, output, input ],
        (outputConnection) => (outputConnection[0] === destination && outputConnection[1] === output && outputConnection[2] === input),
        true
    )) {
        addActiveInputConnectionToAudioNode(activeInputs, source, <TPassiveAudioNodeInputConnection<T>> [ output, input, null ], true);
    }
};

const addConnectionToAudioParamOfAudioContext = <T extends IMinimalBaseAudioContext>(
    source: IAudioNode<T>,
    destination: IAudioParam,
    output: number
) => {
    const { activeInputs, passiveInputs } = getAudioParamConnections(source.context, destination);
    const { outputs } = getAudioNodeConnections(source);
    const eventListeners = getEventListenersOfAudioNode(source);

    const eventListener = <T extends IMinimalOfflineAudioContext ? null : TInternalStateEventListener> ((type) => {
        const nativeAudioNode = getNativeAudioNode(source);
        const nativeAudioParam = getNativeAudioParam(destination);

        if (type === 'active') {
            const partialConnection = deletePassiveInputConnectionToAudioParam(passiveInputs, source, output);

            addActiveInputConnectionToAudioParam(activeInputs, source, partialConnection, false);

            nativeAudioNode.connect(nativeAudioParam, output);
        } else if (type === 'passive') {
            const partialConnection = deleteActiveInputConnectionToAudioParam(activeInputs, source, output);

            addPassiveInputConnectionToAudioParam(passiveInputs, partialConnection, false);

            nativeAudioNode.disconnect(nativeAudioParam, output);
        }
    });

    if (insertElementInSet(
        outputs,
        [ destination, output ],
        (outputConnection) => (outputConnection[0] === destination && outputConnection[1] === output),
        true
    )) {
        eventListeners.add(eventListener);

        if (isActiveAudioNode(source)) {
            addActiveInputConnectionToAudioParam(activeInputs, source, [ output, eventListener ], true);
        } else {
            addPassiveInputConnectionToAudioParam(passiveInputs, [ source, output, eventListener ], true);
        }
    }
};

const addConnectionToAudioParamOfOfflineAudioContext = <T extends IMinimalBaseAudioContext>(
    source: IAudioNode<T>,
    destination: IAudioParam,
    output: number
) => {
    const { activeInputs } = getAudioParamConnections(source.context, destination);
    const { outputs } = getAudioNodeConnections(source);

    if (insertElementInSet(
        outputs,
        [ destination, output ],
        (outputConnection) => (outputConnection[0] === destination && outputConnection[1] === output),
        true
    )) {
        addActiveInputConnectionToAudioParam(activeInputs, source, <TPassiveAudioParamInputConnection<T>> [ output, null ], true);
    }
};

const deleteActiveInputConnection = <T extends IMinimalBaseAudioContext>(
    activeInputConnections: Set<TActiveInputConnection<T>>,
    source: IAudioNode<T>,
    output: number
): null | TActiveInputConnection<T> => {
    for (const activeInputConnection of activeInputConnections) {
        if (activeInputConnection[0] === source && activeInputConnection[1] === output) {
            activeInputConnections.delete(activeInputConnection);

            return activeInputConnection;
        }
    }

    return null;
};

const deleteInputConnectionOfAudioNode = <T extends IMinimalBaseAudioContext>(
    source: IAudioNode<T>,
    destination: IAudioNode<T>,
    output: number,
    input: number
): [ null | TInternalStateEventListener, TInternalState ] => {
    const { activeInputs, passiveInputs } = getAudioNodeConnections(destination);

    const activeInputConnection = deleteActiveInputConnection(activeInputs[input], source, output);

    if (activeInputConnection === null) {
        const passiveInputConnection = deletePassiveInputConnectionToAudioNode(passiveInputs, source, output, input);

        return [ passiveInputConnection[2], 'passive' ];
    }

    return [ activeInputConnection[2], 'active' ];
};

const deleteInputConnectionOfAudioParam = <T extends IMinimalBaseAudioContext>(
    source: IAudioNode<T>,
    destination: IAudioParam,
    output: number
): [ null | TInternalStateEventListener, TInternalState ] => {
    const { activeInputs, passiveInputs } = getAudioParamConnections(source.context, destination);

    const activeInputConnection = deleteActiveInputConnection(activeInputs, source, output);

    if (activeInputConnection === null) {
        const passiveInputConnection = deletePassiveInputConnectionToAudioParam(passiveInputs, source, output);

        return [ passiveInputConnection[1], 'passive' ];
    }

    return [ activeInputConnection[2], 'active' ];
};

const deleteInputsOfAudioNode = <T extends IMinimalBaseAudioContext>(
    source: IAudioNode<T>,
    destination: IAudioNode<T>,
    output: number,
    input: number
) => {
    const [ listener, internalState ] = deleteInputConnectionOfAudioNode(source, destination, output, input);

    if (listener !== null) {
        deleteEventListenerOfAudioNode(source, listener);

        if (internalState === 'active') {
            disconnectNativeAudioNodeFromNativeAudioNode(
                getNativeAudioNode(source),
                getNativeAudioNode(destination),
                output,
                input
            );
        }
    }

    if (isActiveAudioNode(destination)) {
        const { activeInputs } = getAudioNodeConnections(destination);

        setInternalStateToPassiveWhenNecessary(destination, activeInputs);
    }
};

const deleteInputsOfAudioParam = <T extends IMinimalBaseAudioContext>(
    source: IAudioNode<T>,
    destination: IAudioParam,
    output: number
) => {
    const [ listener, internalState ] = deleteInputConnectionOfAudioParam(source, destination, output);

    if (listener !== null) {
        deleteEventListenerOfAudioNode(source, listener);

        if (internalState === 'active') {
            getNativeAudioNode(source)
                .disconnect(getNativeAudioParam(destination), output);
        }
    }
};

const deleteAnyConnection = <T extends IMinimalBaseAudioContext>(source: IAudioNode<T>) => {
    const audioNodeConnectionsOfSource = getAudioNodeConnections(source);

    for (const outputConnection of audioNodeConnectionsOfSource.outputs) {
        if (isAudioNodeOutputConnection(outputConnection)) {
            deleteInputsOfAudioNode(source, ...outputConnection);
        } else {
            deleteInputsOfAudioParam(source, ...outputConnection);
        }
    }

    audioNodeConnectionsOfSource.outputs.clear();
};

const deleteConnectionAtOutput = <T extends IMinimalBaseAudioContext>(source: IAudioNode<T>, output: number) => {
    const audioNodeConnectionsOfSource = getAudioNodeConnections(source);

    for (const outputConnection of audioNodeConnectionsOfSource.outputs) {
        if (outputConnection[1] === output) {
            if (isAudioNodeOutputConnection(outputConnection)) {
                deleteInputsOfAudioNode(source, ...outputConnection);
            } else {
                deleteInputsOfAudioParam(source, ...outputConnection);
            }

            audioNodeConnectionsOfSource.outputs.delete(outputConnection);
        }
    }
};

const deleteConnectionToDestination = <T extends IMinimalBaseAudioContext>(
    source: IAudioNode<T>,
    destination: IAudioNode<T> | IAudioParam,
    output?: number,
    input?: number
): number => {
    const audioNodeConnectionsOfSource = getAudioNodeConnections(source);

    return Array
        .from(audioNodeConnectionsOfSource.outputs)
        .filter((outputConnection) => (outputConnection[0] === destination
            && (output === undefined || outputConnection[1] === output)
            && (input === undefined || outputConnection[2] === input)))
        .reduce((numberOfDeletedConnections, outputConnection) => {
            if (isAudioNodeOutputConnection(outputConnection)) {
                deleteInputsOfAudioNode(source, ...outputConnection);
            } else {
                deleteInputsOfAudioParam(source, ...outputConnection);
            }

            audioNodeConnectionsOfSource.outputs.delete(outputConnection);

            return numberOfDeletedConnections + 1;
        }, 0);
};

export const createAudioNodeConstructor: TAudioNodeConstructorFactory = (
    cacheTestResult,
    createIndexSizeError,
    createInvalidAccessError,
    createNotSupportedError,
    detectCycles,
    isNativeOfflineAudioContext
) => {

    return class AudioNode<T extends IMinimalBaseAudioContext> extends EventTarget implements IAudioNode<T> {

        private _context: T;

        private _nativeAudioNode: INativeAudioNodeFaker | TNativeAudioNode;

        constructor (
            context: T,
            internalState: TInternalState,
            nativeAudioNode: INativeAudioNodeFaker | TNativeAudioNode,
            audioNodeRenderer: T extends IMinimalOfflineAudioContext ? IAudioNodeRenderer<T, IAudioNode<T>> : null
        ) {
            super(nativeAudioNode);

            this._context = context;
            this._nativeAudioNode = nativeAudioNode;

            const nativeContext = getNativeContext(context);

            // Bug #12: Safari does not support to disconnect a specific destination.
            // @todo Make sure this is not used with an OfflineAudioContext.
            if (!isNativeOfflineAudioContext(nativeContext) && true !== cacheTestResult(testAudioNodeDisconnectMethodSupport, () => {
                return testAudioNodeDisconnectMethodSupport(nativeContext);
            })) {
                wrapAudioNodeDisconnectMethod(nativeAudioNode);
            }

            if (internalState === 'active') {
                ACTIVE_AUDIO_NODE_STORE.add(this);
            }

            AUDIO_NODE_STORE.set(this, nativeAudioNode);
            EVENT_LISTENERS.set(this, new Set());

            addAudioNode(context, this, audioNodeRenderer, nativeAudioNode);
        }

        get channelCount (): number {
            return this._nativeAudioNode.channelCount;
        }

        set channelCount (value) {
            this._nativeAudioNode.channelCount = value;
        }

        get channelCountMode (): TChannelCountMode {
            return this._nativeAudioNode.channelCountMode;
        }

        set channelCountMode (value) {
            this._nativeAudioNode.channelCountMode = value;
        }

        get channelInterpretation (): TChannelInterpretation {
            return this._nativeAudioNode.channelInterpretation;
        }

        set channelInterpretation (value) {
            this._nativeAudioNode.channelInterpretation = value;
        }

        get context (): T {
            return this._context;
        }

        get numberOfInputs (): number {
            return this._nativeAudioNode.numberOfInputs;
        }

        get numberOfOutputs (): number {
            return this._nativeAudioNode.numberOfOutputs;
        }

        public connect <U extends IAudioNode<T>> (destinationNode: U, output?: number, input?: number): U;
        public connect (destinationParam: IAudioParam, output?: number): void;
        public connect <U extends IAudioNode<T>> (destination: U | IAudioParam, output = 0, input = 0): void | U {
            const nativeContext = getNativeContext(this._context);
            const isOffline = isNativeOfflineAudioContext(nativeContext);

            if (isAudioNode(destination)) {
                const nativeDestinationAudioNode = getNativeAudioNode(destination);

                try {
                    const connection = connectNativeAudioNodeToNativeAudioNode(
                        this._nativeAudioNode,
                        nativeDestinationAudioNode,
                        output,
                        input
                    );

                    if (isOffline || isPassiveAudioNode(this)) {
                        this._nativeAudioNode.disconnect(...connection);
                    } else if (isPassiveAudioNode(destination)) {
                        setInternalState(destination, 'active');
                    }

                    // An AudioWorklet needs a connection because it otherwise may truncate the input array.
                    // @todo Count the number of connections which depend on this auxiliary GainNode to know when it can be removed again.
                    if (isAudioWorkletNode(destination)) {
                        const auxiliaryGainNodes = AUXILIARY_GAIN_NODE_STORE.get(<TNativeAudioWorkletNode> nativeDestinationAudioNode);

                        if (auxiliaryGainNodes === undefined) {
                            const nativeGainNode = nativeContext.createGain();

                            nativeGainNode.connect(connection[0], 0, connection[2]);

                            AUXILIARY_GAIN_NODE_STORE.set(
                                <TNativeAudioWorkletNode> nativeDestinationAudioNode,
                                new Map([ [ input, nativeGainNode ] ])
                            );
                        } else if (auxiliaryGainNodes.get(input) === undefined) {
                            const nativeGainNode = nativeContext.createGain();

                            nativeGainNode.connect(connection[0], 0, connection[2]);

                            auxiliaryGainNodes.set(input, nativeGainNode);
                        }
                    }
                } catch (err) {
                    // Bug #41: Only Chrome, Firefox and Opera throw the correct exception by now.
                    if (err.code === 12) {
                        throw createInvalidAccessError();
                    }

                    throw err; // tslint:disable-line:rxjs-throw-error
                }

                detectCycles(this, destination);

                if (isOffline) {
                    addConnectionToAudioNodeOfOfflineAudioContext(this, destination, output, input);
                } else {
                    addConnectionToAudioNodeOfAudioContext(this, destination, output, input);
                }

                return destination;
            }

            const nativeAudioParam = getNativeAudioParam(destination);

            /*
             * Bug #147 & #153: Safari does not support to connect an input signal to the playbackRate AudioParam of an
             * AudioBufferSourceNode. This can't be easily detected and that's why the outdated name property is used here to identify
             * Safari.
             */
            if ((<TNativeAudioParam & { name: string }> nativeAudioParam).name === 'playbackRate') {
                throw createNotSupportedError();
            }

            try {
                this._nativeAudioNode.connect(nativeAudioParam, output);

                if (isOffline || isPassiveAudioNode(this)) {
                    this._nativeAudioNode.disconnect(nativeAudioParam, output);
                }
            } catch (err) {
                // Bug #58: Only Firefox does throw an InvalidStateError yet.
                if (err.code === 12) {
                    throw createInvalidAccessError();
                }

                throw err; // tslint:disable-line:rxjs-throw-error
            }

            detectCycles(this, destination);

            if (isOffline) {
                addConnectionToAudioParamOfOfflineAudioContext(this, destination, output);
            } else {
                addConnectionToAudioParamOfAudioContext(this, destination, output);
            }
        }

        public disconnect (output?: number): void;
        public disconnect (destinationNode: IAudioNode<T>, output?: number, input?: number): void;
        public disconnect (destinationParam: IAudioParam, output?: number): void;
        public disconnect (destinationOrOutput?: number | IAudioNode<T> | IAudioParam, output?: number, input?: number): void {
            if (destinationOrOutput === undefined) {
                deleteAnyConnection(this);
            } else if (typeof destinationOrOutput === 'number') {
                if (destinationOrOutput < 0 || destinationOrOutput >= this.numberOfOutputs) {
                    throw createIndexSizeError();
                }

                deleteConnectionAtOutput(this, destinationOrOutput);
            } else {
                if (output !== undefined && (output < 0 || output >= this.numberOfOutputs)) {
                    throw createIndexSizeError();
                }

                if (isAudioNode(destinationOrOutput)
                        && input !== undefined
                        && (input < 0 || input >= destinationOrOutput.numberOfInputs)) {
                    throw createIndexSizeError();
                }

                if (deleteConnectionToDestination(this, destinationOrOutput, output, input) === 0) {
                    throw createInvalidAccessError();
                }
            }
        }

    };

};
