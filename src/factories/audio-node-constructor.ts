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
import { IAudioNode, IAudioNodeRenderer, IAudioParam, INativeAudioNodeFaker } from '../interfaces';
import { testAudioNodeDisconnectMethodSupport } from '../support-testers/audio-node-disconnect-method';
import {
    TAudioNodeConstructorFactory,
    TChannelCountMode,
    TContext,
    TNativeAudioDestinationNode,
    TNativeAudioNode
} from '../types';
import { wrapAudioNodeDisconnectMethod } from '../wrappers/audio-node-disconnect-method';

const addAudioNode = (
    context: TContext,
    audioNode: IAudioNode,
    audioNoderRender: null | IAudioNodeRenderer,
    nativeAudioNode: TNativeAudioNode
) => {
    const audioGraphOfContext = getAudioGraph(context);

    const inputs = [ ];

    for (let i = 0; i < nativeAudioNode.numberOfInputs; i += 1) {
        inputs.push(new Set());
    }

    const audioNodeConnections = { inputs, outputs: new Set(), renderer: audioNoderRender };

    audioGraphOfContext.nodes.set(audioNode, audioNodeConnections);
    audioGraphOfContext.nodes.set(nativeAudioNode, audioNodeConnections);
};

const addConnectionToAudioNode = (source: IAudioNode, destination: IAudioNode, output: number, input: number) => {
    const audioNodeConnectionsOfSource = getAudioNodeConnections(source);
    const audioNodeConnectionsOfDestination = getAudioNodeConnections(destination);

    audioNodeConnectionsOfSource.outputs.add([ destination, output, input ]);
    audioNodeConnectionsOfDestination.inputs[input].add([ source, output ]);
};

const addConnectionToAudioParam = (context: TContext, source: IAudioNode, destination: IAudioParam, output: number) => {
    const audioNodeConnections = getAudioNodeConnections(source);
    const audioParamConnections = getAudioParamConnections(context, destination);

    audioNodeConnections.outputs.add([ destination, output ]);
    audioParamConnections.inputs.add([ source, output ]);
};

const removeAnyConnection = (source: IAudioNode) => {
    const audioNodeConnectionsOfSource = getAudioNodeConnections(source);

    for (const [ destination ] of Array.from(audioNodeConnectionsOfSource.outputs.values())) {
        if (isAudioNode(destination)) {
            const audioNodeConnectionsOfDestination = getAudioNodeConnections(destination);

            for (const connectionsToInput of audioNodeConnectionsOfDestination.inputs) {
                for (const connection of Array.from(connectionsToInput.values())) {
                    if (connection[0] === source) {
                        connectionsToInput.delete(connection);
                    }
                }
            }
        }
    }

    audioNodeConnectionsOfSource.outputs.clear();
};

const removeConnectionToAudioNode = (source: IAudioNode, destination: IAudioNode) => {
    const audioNodeConnectionsOfSource = getAudioNodeConnections(source);
    const audioNodeConnectionsOfDestination = getAudioNodeConnections(destination);

    for (const connection of Array.from(audioNodeConnectionsOfSource.outputs.values())) {
        if (connection[0] === destination) {
            audioNodeConnectionsOfSource.outputs.delete(connection);
        }
    }

    for (const connectionsToInput of audioNodeConnectionsOfDestination.inputs) {
        for (const connection of Array.from(connectionsToInput.values())) {
            if (connection[0] === source) {
                connectionsToInput.delete(connection);
            }
        }
    }
};

export const createAudioNodeConstructor: TAudioNodeConstructorFactory = (createInvalidAccessError, isNativeOfflineAudioContext) => {

    return class AudioNode extends EventTarget implements IAudioNode {

        public channelCount: number;

        public channelCountMode: TChannelCountMode;

        private _context: TContext;

        private _nativeAudioNode: INativeAudioNodeFaker | TNativeAudioNode;

        constructor (
            context: TContext,
            nativeAudioNode: INativeAudioNodeFaker | TNativeAudioNode,
            audioNodeRenderer: null | IAudioNodeRenderer
        ) {
            super();

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

        public get channelInterpretation () {
            return this._nativeAudioNode.channelInterpretation;
        }

        public set channelInterpretation (value) {
            this._nativeAudioNode.channelInterpretation = value;
        }

        public get context () {
            return this._context;
        }

        public get numberOfInputs () {
            return this._nativeAudioNode.numberOfInputs;
        }

        public get numberOfOutputs () {
            return this._nativeAudioNode.numberOfOutputs;
        }

        public addEventListener (
            type: string,
            listener: any, // @todo EventListenerOrEventListenerObject | null = null,
            options?: boolean | AddEventListenerOptions
        ): void {
            return this._nativeAudioNode.addEventListener(type, listener, options);
        }

        public connect (destinationNode: IAudioNode, output?: number, input?: number): IAudioNode;
        public connect (destinationParam: IAudioParam, output?: number): void;
        public connect (destination: IAudioNode | IAudioParam, output = 0, input = 0): void | IAudioNode {
            const nativeContext = getNativeContext(this._context);

            if (isAudioNode(destination)) {
                // Bug #41: Only Chrome, Firefox and Opera throw the correct exception by now.
                if (this._context !== destination.context) {
                    throw createInvalidAccessError();
                }

                if (!isNativeOfflineAudioContext(nativeContext)) {
                    const nativeDestinationNode = getNativeAudioNode<TNativeAudioDestinationNode>(destination);

                    if ((<INativeAudioNodeFaker> nativeDestinationNode).inputs !== undefined) {
                        const inputs = <TNativeAudioNode[]> (<INativeAudioNodeFaker> nativeDestinationNode).inputs;
                        const nativeInputDestinationNode = inputs[input];

                        this._nativeAudioNode.connect(nativeInputDestinationNode, output, input);
                    } else {
                        this._nativeAudioNode.connect(nativeDestinationNode, output, input);
                    }
                }

                addConnectionToAudioNode(this, destination, output, input);

                return destination;
            }

            const nativeAudioParam = getNativeAudioParam(destination);

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

                throw err;
            }

            addConnectionToAudioParam(this._context, this, destination, output);
        }

        public disconnect (destination?: IAudioNode): void {
            const nativeContext = getNativeContext(this._context);

            if (!isNativeOfflineAudioContext(nativeContext)) {
                if (destination === undefined) {
                    return this._nativeAudioNode.disconnect();
                }

                const nativeDestinationNode = getNativeAudioNode<TNativeAudioDestinationNode>(destination);

                if ((<INativeAudioNodeFaker> nativeDestinationNode).inputs !== undefined) {
                    for (const input of (<TNativeAudioNode[]> (<INativeAudioNodeFaker> nativeDestinationNode).inputs)) {
                        this._nativeAudioNode.disconnect(input);
                    }
                } else {
                    this._nativeAudioNode.disconnect(nativeDestinationNode);
                }
            }

            if (destination === undefined) {
                removeAnyConnection(this);
            } else {
                removeConnectionToAudioNode(this, destination);
            }
        }

        public removeEventListener (
            type: string,
            listener: any, // @todo EventListenerOrEventListenerObject | null = null,
            options?: EventListenerOptions | boolean
        ): void {
            return this._nativeAudioNode.removeEventListener(type, listener, options);
        }

    };

};
