import { EventTarget } from '../event-target';
import { AUDIO_NODE_STATE_STORE, AUDIO_NODE_STORE, AUDIO_NODE_SYMBOL_STORE, EVENT_LISTENERS } from '../globals';
import { isAudioNode } from '../guards/audio-node';
import { isAudioWorkletNode } from '../guards/audio-worklet-node';
import { cacheTestResult } from '../helpers/cache-test-result';
import { connectNativeAudioNodeToNativeAudioNode } from '../helpers/connect-native-audio-node-to-native-audio-node';
import { disconnectNativeAudioNodeFromNativeAudioNode } from '../helpers/disconnect-native-audio-node-from-native-audio-node';
import { getAudioGraph } from '../helpers/get-audio-graph';
import { getAudioNodeConnections } from '../helpers/get-audio-node-connections';
import { getAudioParamConnections } from '../helpers/get-audio-param-connections';
import { getEventListenersOfAudioNode } from '../helpers/get-event-listeners-of-audio-node';
import { getNativeAudioNode } from '../helpers/get-native-audio-node';
import { getNativeAudioParam } from '../helpers/get-native-audio-param';
import { getNativeContext } from '../helpers/get-native-context';
import { getSymbolOfAudioNode } from '../helpers/get-symbol-of-audio-node';
import { setInternalState } from '../helpers/set-internal-state';
import { setInternalStateToPassiveWhenNecessary } from '../helpers/set-internal-state-to-passive-when-necessary';
import {
    IAudioNode,
    IAudioNodeRenderer,
    IAudioParam,
    IMinimalBaseAudioContext,
    IMinimalOfflineAudioContext,
    INativeAudioNodeFaker
} from '../interfaces';
import { testAudioNodeDisconnectMethodSupport } from '../support-testers/audio-node-disconnect-method';
import {
    TAudioNodeConstructorFactory,
    TChannelCountMode,
    TChannelInterpretation,
    TInternalState,
    TNativeAudioNode,
    TNativeAudioParam
} from '../types';
import { wrapAudioNodeDisconnectMethod } from '../wrappers/audio-node-disconnect-method';

const addAudioNode = <T extends IMinimalBaseAudioContext>(
    context: T,
    audioNode: IAudioNode<T>,
    audioNoderRender: T extends IMinimalOfflineAudioContext ? IAudioNodeRenderer<T, IAudioNode<T>> : null,
    nativeAudioNode: TNativeAudioNode
) => {
    const audioGraph = getAudioGraph(context);

    const inputs = [ ];

    for (let i = 0; i < nativeAudioNode.numberOfInputs; i += 1) {
        inputs.push(new Set());
    }

    const audioNodeConnections = { inputs, outputs: new Set(), renderer: audioNoderRender };

    audioGraph.nodes.set(audioNode, audioNodeConnections);
    audioGraph.nodes.set(nativeAudioNode, audioNodeConnections);
};

const addConnectionToAudioNodeOfAudioContext = <T extends IMinimalBaseAudioContext>(
    source: IAudioNode<T>,
    destination: IAudioNode<T>,
    output: number,
    input: number
) => {
    const audioNodeConnectionsOfDestination = getAudioNodeConnections(destination);
    const audioNodeConnectionsOfSource = getAudioNodeConnections(source);
    const eventListeners = getEventListenersOfAudioNode(source);
    const symbol = getSymbolOfAudioNode(source);

    const eventListener = (type: TInternalState) => {
        const { inputs } = getAudioNodeConnections(destination);
        const nativeDestinationAudioNode = getNativeAudioNode(destination);
        const nativeSourceAudioNode = getNativeAudioNode(source);

        const connectionsToInput = inputs[input];

        for (const connection of connectionsToInput) {
            if (connection[1] !== null && connection[2] === output) {
                if (type === 'active' && connection[0] === symbol) {
                    connection[0] = source;

                    connectNativeAudioNodeToNativeAudioNode(nativeSourceAudioNode, nativeDestinationAudioNode, output, input);

                    if (AUDIO_NODE_STATE_STORE.get(destination) === 'passive') {
                        setInternalState(destination, 'active');
                    }
                } else if (type === 'passive' && connection[0] === source) {
                    connection[0] = symbol;

                    disconnectNativeAudioNodeFromNativeAudioNode(nativeSourceAudioNode, nativeDestinationAudioNode, output, input);
                }
            }
        }

        setInternalStateToPassiveWhenNecessary(destination, inputs);
    };

    eventListeners.add(eventListener);

    if (AUDIO_NODE_STATE_STORE.get(source) === 'active') {
        audioNodeConnectionsOfDestination.inputs[input].add([ source, eventListener, output ]);
    } else {
        audioNodeConnectionsOfDestination.inputs[input].add([ symbol, eventListener, output ]);
    }

    audioNodeConnectionsOfSource.outputs.add([ destination, output, input ]);
};

const addConnectionToAudioNodeOfOfflineAudioContext = <T extends IMinimalBaseAudioContext>(
    source: IAudioNode<T>,
    destination: IAudioNode<T>,
    output: number,
    input: number
) => {
    const audioNodeConnectionsOfDestination = getAudioNodeConnections(destination);
    const audioNodeConnectionsOfSource = getAudioNodeConnections(source);

    audioNodeConnectionsOfDestination.inputs[input].add([ source, null, output ]);
    audioNodeConnectionsOfSource.outputs.add([ destination, output, input ]);
};

const addConnectionToAudioParamOfAudioContext = <T extends IMinimalBaseAudioContext>(
    source: IAudioNode<T>,
    destination: IAudioParam,
    output: number
) => {
    const audioNodeConnections = getAudioNodeConnections(source);
    const audioParamConnections = getAudioParamConnections(source.context, destination);
    const eventListeners = getEventListenersOfAudioNode(source);
    const symbol = getSymbolOfAudioNode(source);

    const eventListener = (type: TInternalState) => {
        const { inputs } = getAudioParamConnections(source.context, destination);
        const nativeAudioNode = getNativeAudioNode(source);
        const nativeAudioParam = getNativeAudioParam(destination);

        for (const connection of inputs) {
            if (type === 'active') {
                if (connection[0] === symbol && connection[1] !== null && connection[2] === output) {
                    inputs.delete(connection);
                    inputs.add([ source, connection[1], connection[2] ]);

                    nativeAudioNode.connect(nativeAudioParam, output);
                }
            } else if (type === 'passive') {
                if (connection[0] === source && connection[1] !== null && connection[2] === output) {
                    inputs.delete(connection);
                    inputs.add([ symbol, connection[1], connection[2] ]);

                    nativeAudioNode.disconnect(nativeAudioParam, output);
                }
            }
        }
    };

    eventListeners.add(eventListener);

    if (AUDIO_NODE_STATE_STORE.get(source) === 'active') {
        audioParamConnections.inputs.add([ source, eventListener, output ]);
    } else {
        audioParamConnections.inputs.add([ symbol, eventListener, output ]);
    }

    audioNodeConnections.outputs.add([ destination, output ]);
};

const addConnectionToAudioParamOfOfflineAudioContext = <T extends IMinimalBaseAudioContext>(
    source: IAudioNode<T>,
    destination: IAudioParam,
    output: number
) => {
    const audioNodeConnections = getAudioNodeConnections(source);
    const audioParamConnections = getAudioParamConnections(source.context, destination);

    audioParamConnections.inputs.add([ source, null, output ]);
    audioNodeConnections.outputs.add([ destination, output ]);
};

const deleteInputsOfAudioNode = <T extends IMinimalBaseAudioContext>(
    source: IAudioNode<T>,
    destination: IAudioNode<T>,
    output?: number,
    input?: number
) => {
    const { inputs } = getAudioNodeConnections(destination);
    const length = inputs.length;

    for (let i = 0; i < length; i += 1) {
        if (input === undefined || input === i) {
            const connectionsToInput = inputs[i];

            for (const connection of connectionsToInput.values()) {
                const symbol = getSymbolOfAudioNode(source);

                if ((connection[0] === source || connection[0] === symbol) && (output === undefined || connection[2] === output)) {
                    const listener = connection[1];

                    if (listener !== null) {
                        const eventListeners = getEventListenersOfAudioNode(source);

                        eventListeners.delete(listener);
                    }

                    connectionsToInput.delete(connection);

                    if (connection[0] === source && listener !== null) {
                        disconnectNativeAudioNodeFromNativeAudioNode(
                            getNativeAudioNode(source),
                            getNativeAudioNode(destination),
                            output,
                            input
                        );
                    }
                }
            }
        }
    }

    setInternalStateToPassiveWhenNecessary(destination, inputs);
};

const deleteInputsOfAudioParam = <T extends IMinimalBaseAudioContext>(
    source: IAudioNode<T>,
    destination: IAudioParam,
    output?: number
) => {
    const audioParamConnections = getAudioParamConnections(source.context, destination);

    for (const connection of audioParamConnections.inputs) {
        const symbol = getSymbolOfAudioNode(source);

        if ((connection[0] === source || connection[0] === symbol) && (output === undefined || connection[2] === output)) {
            audioParamConnections.inputs.delete(connection);

            if (typeof connection[0] !== 'symbol') {
                if (output === undefined) {
                    getNativeAudioNode(source)
                        .disconnect(getNativeAudioParam(destination));
                } else {
                    getNativeAudioNode(source)
                        .disconnect(getNativeAudioParam(destination), output);
                }
            }
        }
    }
};

const deleteOutputsOfAudioNode = <T extends IMinimalBaseAudioContext>(
    source: IAudioNode<T>,
    destination: IAudioNode<T> | IAudioParam,
    output?: number,
    input?: number
) => {
    const audioNodeConnectionsOfSource = getAudioNodeConnections(source);

    for (const connection of audioNodeConnectionsOfSource.outputs.values()) {
        if (connection[0] === destination
            && (output === undefined || connection[1] === output)
            && (input === undefined || connection[2] === input)
        ) {
            audioNodeConnectionsOfSource.outputs.delete(connection);
        }
    }
};

const deleteAnyConnection = <T extends IMinimalBaseAudioContext>(source: IAudioNode<T>) => {
    const audioNodeConnectionsOfSource = getAudioNodeConnections(source);

    for (const [ destination ] of audioNodeConnectionsOfSource.outputs) {
        if (isAudioNode(destination)) {
            deleteInputsOfAudioNode(source, destination);
        } else {
            deleteInputsOfAudioParam(source, destination);
        }
    }

    audioNodeConnectionsOfSource.outputs.clear();
};

const deleteConnectionAtOutput = <T extends IMinimalBaseAudioContext>(source: IAudioNode<T>, output: number) => {
    const audioNodeConnectionsOfSource = getAudioNodeConnections(source);

    Array
        .from(audioNodeConnectionsOfSource.outputs)
        .filter((connection) => connection[1] === output)
        .forEach((connection) => {
            const [ destination ] = connection;

            if (isAudioNode(destination)) {
                deleteInputsOfAudioNode(source, destination, connection[1], connection[2]);
            } else {
                deleteInputsOfAudioParam(source, destination, connection[1]);
            }

            audioNodeConnectionsOfSource.outputs.delete(connection);
        });
};

const deleteConnectionToDestination = <T extends IMinimalBaseAudioContext>(
    source: IAudioNode<T>,
    destination: IAudioNode<T> | IAudioParam,
    output?: number,
    input?: number
) => {
    deleteOutputsOfAudioNode(source, destination, output, input);

    if (isAudioNode(destination)) {
        deleteInputsOfAudioNode(source, destination, output, input);
    } else {
        deleteInputsOfAudioParam(source, destination, output);
    }
};

export const createAudioNodeConstructor: TAudioNodeConstructorFactory = (
    createInvalidAccessError,
    createNotSupportedError,
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

            // Bug #12: Firefox and Safari do not support to disconnect a specific destination.
            // @todo Make sure this is not used with an OfflineAudioContext.
            if (!isNativeOfflineAudioContext(nativeContext) && true !== cacheTestResult(testAudioNodeDisconnectMethodSupport, () => {
                return testAudioNodeDisconnectMethodSupport(nativeContext);
            })) {
                wrapAudioNodeDisconnectMethod(nativeAudioNode);
            }

            AUDIO_NODE_STATE_STORE.set(this, internalState);
            AUDIO_NODE_STORE.set(this, nativeAudioNode);
            AUDIO_NODE_SYMBOL_STORE.set(this, Symbol());
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

                    if (isOffline || AUDIO_NODE_STATE_STORE.get(this) === 'passive') {
                        this._nativeAudioNode.disconnect(...connection);

                        // An AudioWorklet needs a connection because it otherwise may modifiy the input array.
                        if (isAudioWorkletNode(destination)) {
                            // @todo Only do this if no other connection is active.
                            nativeContext
                                .createGain()
                                .connect(connection[0]);
                        }
                    } else {
                        if (AUDIO_NODE_STATE_STORE.get(destination) === 'passive') {
                            setInternalState(destination, 'active');
                        }
                    }
                } catch (err) {
                    // Bug #41: Only Chrome, Firefox and Opera throw the correct exception by now.
                    if (err.code === 12) {
                        throw createInvalidAccessError();
                    }

                    throw err; // tslint:disable-line:rxjs-throw-error
                }

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

                if (isOffline || AUDIO_NODE_STATE_STORE.get(this) === 'passive') {
                    this._nativeAudioNode.disconnect(nativeAudioParam, output);
                }
            } catch (err) {
                // Bug #58: Only Firefox does throw an InvalidStateError yet.
                if (err.code === 12) {
                    throw createInvalidAccessError();
                }

                throw err; // tslint:disable-line:rxjs-throw-error
            }

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
                deleteConnectionAtOutput(this, destinationOrOutput);
            } else {
                deleteConnectionToDestination(this, destinationOrOutput, output, input);
            }
        }

    };

};
