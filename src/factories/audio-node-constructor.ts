import { EventTarget } from '../event-target';
import { AUDIO_NODE_STORE } from '../globals';
import { isAudioNode } from '../guards/audio-node';
import { cacheTestResult } from '../helpers/cache-test-result';
import { getAudioGraph } from '../helpers/get-audio-graph';
import { getAudioNodeConnections } from '../helpers/get-audio-node-connections';
import { getAudioParamConnections } from '../helpers/get-audio-param-connections';
import { getNativeAudioNode } from '../helpers/get-native-audio-node';
import { getNativeAudioParam } from '../helpers/get-native-audio-param';
import { getNativeContext } from '../helpers/get-native-context';
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
    TNativeAudioDestinationNode,
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

const addConnectionToAudioNode = <T extends IMinimalBaseAudioContext>(
    source: IAudioNode<T>,
    destination: IAudioNode<T>,
    output: number,
    input: number
) => {
    const audioNodeConnectionsOfSource = getAudioNodeConnections(source);
    const audioNodeConnectionsOfDestination = getAudioNodeConnections(destination);

    audioNodeConnectionsOfSource.outputs.add([ destination, output, input ]);
    audioNodeConnectionsOfDestination.inputs[input].add([ source, output ]);
};

const addConnectionToAudioParam = <T extends IMinimalBaseAudioContext>(
    source: IAudioNode<T>,
    destination: IAudioParam,
    output: number
) => {
    const audioNodeConnections = getAudioNodeConnections(source);
    const audioParamConnections = getAudioParamConnections(source.context, destination);

    audioNodeConnections.outputs.add([ destination, output ]);
    audioParamConnections.inputs.add([ source, output ]);
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
                if (connection[0] === source && (output === undefined || connection[1] === output)) {
                    connectionsToInput.delete(connection);
                }
            }
        }
    }
};

const deleteInputsOfAudioParam = <T extends IMinimalBaseAudioContext>(
    source: IAudioNode<T>,
    destination: IAudioParam,
    output?: number
) => {
    const audioParamConnections = getAudioParamConnections(source.context, destination);

    for (const connection of audioParamConnections.inputs) {
        if (connection[0] === source && (output === undefined || connection[1] === output)) {
            audioParamConnections.inputs.delete(connection);
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

            AUDIO_NODE_STORE.set(this, nativeAudioNode);

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

            if (isAudioNode(destination)) {
                const nativeDestinationNode = getNativeAudioNode<T, TNativeAudioDestinationNode>(destination);
                const inputs = (<INativeAudioNodeFaker> nativeDestinationNode).inputs;

                try {
                    if (inputs !== undefined) {
                        this._nativeAudioNode.connect(inputs[input], output, 0);
                    } else {
                        this._nativeAudioNode.connect(nativeDestinationNode, output, input);
                    }

                    // @todo Calling connect() is only needed to throw possible errors when the nativeContext is an OfflineAudioContext.
                    if (isNativeOfflineAudioContext(nativeContext)) {
                        if (inputs !== undefined) {
                            this._nativeAudioNode.disconnect(inputs[input], output, 0);
                        } else {
                            this._nativeAudioNode.disconnect(nativeDestinationNode, output, input);
                        }
                    }
                } catch (err) {
                    // Bug #41: Only Chrome, Firefox and Opera throw the correct exception by now.
                    if (err.code === 12) {
                        throw createInvalidAccessError();
                    }

                    throw err; // tslint:disable-line:rxjs-throw-error
                }

                addConnectionToAudioNode(this, destination, output, input);

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

                // @todo Calling connect() is only needed to throw possible errors when the nativeContext is an OfflineAudioContext.
                if (isNativeOfflineAudioContext(nativeContext)) {
                    this._nativeAudioNode.disconnect(nativeAudioParam, output);
                }
            } catch (err) {
                // Bug #58: Only Firefox does throw an InvalidStateError yet.
                if (err.code === 12) {
                    throw createInvalidAccessError();
                }

                throw err; // tslint:disable-line:rxjs-throw-error
            }

            addConnectionToAudioParam(this, destination, output);
        }

        public disconnect (output?: number): void;
        public disconnect (destinationNode: IAudioNode<T>, output?: number, input?: number): void;
        public disconnect (destinationParam: IAudioParam, output?: number): void;
        public disconnect (destinationOrOutput?: number | IAudioNode<T> | IAudioParam, output?: number, input?: number): void {
            const nativeContext = getNativeContext(this._context);

            if (!isNativeOfflineAudioContext(nativeContext)) {
                if (destinationOrOutput === undefined) {
                    this._nativeAudioNode.disconnect();
                } else if (typeof destinationOrOutput === 'number') {
                    this._nativeAudioNode.disconnect(destinationOrOutput);
                } else if (isAudioNode(destinationOrOutput)) {
                    const nativeDestinationNode = getNativeAudioNode<T, TNativeAudioDestinationNode>(destinationOrOutput);

                    if ((<INativeAudioNodeFaker> nativeDestinationNode).inputs !== undefined) {
                        const inputs = <TNativeAudioNode[]> (<INativeAudioNodeFaker> nativeDestinationNode).inputs;
                        const numberOfInputs = inputs.length;

                        for (let i = 0; i < numberOfInputs; i += 1) {
                            if (input === undefined || input === i) {
                                if (output === undefined) {
                                    this._nativeAudioNode.disconnect(inputs[i]);
                                } else {
                                    this._nativeAudioNode.disconnect(inputs[i], output);
                                }
                            }
                        }
                    } else {
                        if (output === undefined) {
                            this._nativeAudioNode.disconnect(nativeDestinationNode);
                        } else if (input === undefined) {
                            this._nativeAudioNode.disconnect(nativeDestinationNode, output);
                        } else {
                            this._nativeAudioNode.disconnect(nativeDestinationNode, output, input);
                        }
                    }
                } else {
                    const nativeAudioParam = getNativeAudioParam(destinationOrOutput);

                    if (output === undefined) {
                        this._nativeAudioNode.disconnect(nativeAudioParam);
                    } else {
                        this._nativeAudioNode.disconnect(nativeAudioParam, output);
                    }
                }
            }

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
