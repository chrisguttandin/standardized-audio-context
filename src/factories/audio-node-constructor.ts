import { EventTarget } from '../event-target';
import { AUDIO_GRAPH, AUDIO_NODE_STORE, AUDIO_PARAM_STORE, CONTEXT_STORE } from '../globals';
import { isAudioNode } from '../guards/audio-node';
import { cacheTestResult } from '../helpers/cache-test-result';
import { getNativeContext } from '../helpers/get-native-context';
import { IAudioNode, IAudioNodeRenderer, IAudioParam, IMinimalBaseAudioContext, INativeAudioNodeFaker } from '../interfaces';
import { testAudioNodeDisconnectMethodSupport } from '../support-testers/audio-node-disconnect-method';
import { TAudioNodeConstructorFactory, TChannelCountMode, TNativeAudioContext, TNativeAudioNode } from '../types';
import { wrapAudioNodeDisconnectMethod } from '../wrappers/audio-node-disconnect-method';

const addAudioNode = (context: IMinimalBaseAudioContext, audioNode: IAudioNode, audioNoderRender: IAudioNodeRenderer) => {
    const audioGraphOfContext = AUDIO_GRAPH.get(context);

    if (audioGraphOfContext === undefined) {
        throw new Error('Missing the audio graph of the OfflineAudioContext.');
    }

    audioGraphOfContext.nodes.set(audioNode, { inputs: new Set(), outputs: new Set(), renderer: audioNoderRender });
};

const addConnectionToAudioNode = (
    context: IMinimalBaseAudioContext,
    source: IAudioNode,
    destination: IAudioNode,
    output: number,
    input: number
) => {
    const audioGraphOfContext = AUDIO_GRAPH.get(context);

    if (audioGraphOfContext === undefined) {
        throw new Error('Missing the audio graph of the OfflineAudioContext.');
    }

    const entryOfSource = audioGraphOfContext.nodes.get(source);

    if (entryOfSource === undefined) {
        throw new Error('Missing the entry of this AudioNode in the audio graph.');
    }

    entryOfSource.outputs.add([ destination, output, input ]);

    const entryOfDestination = audioGraphOfContext.nodes.get(destination);

    if (entryOfDestination === undefined) {
        throw new Error('Missing the entry of this AudioNode in the audio graph.');
    }

    entryOfDestination.inputs.add([ source, output, input ]);
};

const addConnectionToAudioParam = (context: IMinimalBaseAudioContext, source: IAudioNode, destination: IAudioParam, output: number) => {
    const audioGraphOfContext = AUDIO_GRAPH.get(context);

    if (audioGraphOfContext === undefined) {
        throw new Error('Missing the audio graph of the OfflineAudioContext.');
    }

    const entryOfSource = audioGraphOfContext.nodes.get(source);

    if (entryOfSource === undefined) {
        throw new Error('Missing the entry of this AudioNode in the audio graph.');
    }

    entryOfSource.outputs.add([ destination, output ]);

    const entryOfDestination = audioGraphOfContext.params.get(destination);

    if (entryOfDestination === undefined) {
        throw new Error('Missing the entry of this AudioNode in the audio graph.');
    }

    entryOfDestination.inputs.add([ source, output ]);
};

const removeAnyConnection = (context: IMinimalBaseAudioContext, source: IAudioNode) => {
    const audioGraphOfContext = AUDIO_GRAPH.get(context);

    if (audioGraphOfContext === undefined) {
        throw new Error('Missing the audio graph of the OfflineAudioContext.');
    }

    const entryOfSource = audioGraphOfContext.nodes.get(source);

    if (entryOfSource === undefined) {
        throw new Error('Missing the entry of this AudioNode in the audio graph.');
    }

    for (const [ destination ] of Array.from(entryOfSource.outputs.values())) {
        const entryOfDestination = audioGraphOfContext.nodes.get(<IAudioNode> destination);

        if (entryOfDestination !== undefined) {
            for (const connection of Array.from(entryOfDestination.inputs.values())) {
                if (connection[0] === source) {
                    entryOfDestination.inputs.delete(connection);
                }
            }
        }

    }

    entryOfSource.outputs.clear();
};

const removeConnectionToAudioNode = (context: IMinimalBaseAudioContext, source: IAudioNode, destination: IAudioNode) => {
    const audioGraphOfContext = AUDIO_GRAPH.get(context);

    if (audioGraphOfContext === undefined) {
        throw new Error('Missing the audio graph of the OfflineAudioContext.');
    }

    const entryOfSource = audioGraphOfContext.nodes.get(source);

    if (entryOfSource === undefined) {
        throw new Error('Missing the entry of this AudioNode in the audio graph.');
    }

    for (const connection of Array.from(entryOfSource.outputs.values())) {
        if (connection[0] === destination) {
            entryOfSource.outputs.delete(connection);
        }
    }

    const entryOfDestination = audioGraphOfContext.nodes.get(destination);

    if (entryOfDestination === undefined) {
        throw new Error('Missing the entry of this AudioNode in the audio graph.');
    }

    for (const connection of Array.from(entryOfDestination.inputs.values())) {
        if (connection[0] === source) {
            entryOfDestination.inputs.delete(connection);
        }
    }
};

export const createAudioNodeConstructor: TAudioNodeConstructorFactory = (createInvalidAccessError, isNativeOfflineAudioContext) => {

    return class AudioNode extends EventTarget implements IAudioNode {

        private _context: IMinimalBaseAudioContext;

        private _nativeNode: INativeAudioNodeFaker | TNativeAudioNode;

        constructor (
            context: IMinimalBaseAudioContext,
            nativeNode: INativeAudioNodeFaker | TNativeAudioNode,
            audioNodeRenderer: null | IAudioNodeRenderer
        ) {
            super();

            this._context = context;
            this._nativeNode = nativeNode;

            const nativeContext = getNativeContext(context);

            // Bug #12: Firefox and Safari do not support to disconnect a specific destination.
            // @todo Make sure this is not used with an OfflineAudioContext.
            if (!isNativeOfflineAudioContext(nativeContext) && true !== cacheTestResult(testAudioNodeDisconnectMethodSupport, () => {
                return testAudioNodeDisconnectMethodSupport(<TNativeAudioContext> nativeContext);
            })) {
                wrapAudioNodeDisconnectMethod(nativeNode);
            }

            AUDIO_NODE_STORE.set(this, nativeNode);

            if (audioNodeRenderer !== null) {
                addAudioNode(context, this, audioNodeRenderer);
            }
        }

        public get channelCount (): number {
            throw new Error('This needs to implemented.');
        }

        public set channelCount (_: number) {
            throw new Error('This needs to implemented.');
        }

        public get channelCountMode (): TChannelCountMode {
            throw new Error('This needs to implemented.');
        }

        public set channelCountMode (_: TChannelCountMode) {
            throw new Error('This needs to implemented.');
        }

        public get channelInterpretation () {
            return this._nativeNode.channelInterpretation;
        }

        public set channelInterpretation (value) {
            this._nativeNode.channelInterpretation = value;
        }

        public get context () {
            return this._context;
        }

        public get numberOfInputs () {
            return this._nativeNode.numberOfInputs;
        }

        public get numberOfOutputs () {
            return this._nativeNode.numberOfOutputs;
        }

        public addEventListener (
            type: string,
            listener: any, // @todo EventListenerOrEventListenerObject | null = null,
            options?: boolean | AddEventListenerOptions
        ): void {
            return this._nativeNode.addEventListener(type, listener, options);
        }

        public connect (destinationNode: IAudioNode, output?: number, input?: number): IAudioNode;
        public connect (destinationParam: IAudioParam, output?: number): void;
        public connect (destination: IAudioNode | IAudioParam, output = 0, input = 0): void | IAudioNode {
            const nativeContext = CONTEXT_STORE.get(this._context);

            if (isAudioNode(destination)) {
                // Bug #41: Only Chrome, Firefox and Opera throw the correct exception by now.
                if (this._context !== destination.context) {
                    throw createInvalidAccessError();
                }

                if (nativeContext === undefined) {
                    throw new Error('The native (Offline)AudioContext is missing.');
                }

                if (isNativeOfflineAudioContext(nativeContext)) {
                    addConnectionToAudioNode(this._context, this, destination, output, input);

                    return destination;
                }

                const nativeDestinationNode = AUDIO_NODE_STORE.get(destination);

                if (nativeDestinationNode === undefined) {
                    throw new Error('The associated nativeNode is missing.');
                }

                if ((<INativeAudioNodeFaker> nativeDestinationNode).inputs !== undefined) {
                    const nativeInputDestinationNode = (<TNativeAudioNode[]> (<INativeAudioNodeFaker> nativeDestinationNode).inputs)[input];

                    this._nativeNode.connect(nativeInputDestinationNode, output, input);
                } else {
                    this._nativeNode.connect(nativeDestinationNode, output, input);
                }

                return destination;
            }

            if (nativeContext === undefined) {
                throw new Error('The native (Offline)AudioContext is missing.');
            }

            if (isNativeOfflineAudioContext(nativeContext)) {
                const nativeAudioParam = AUDIO_PARAM_STORE.get(destination);

                if (nativeAudioParam === undefined) {
                    throw new Error('The associated nativeAudioParam is missing.');
                }

                try {
                    // @todo This is only needed to throw possible errors.
                    this._nativeNode.connect(nativeAudioParam, output);
                } catch (err) {
                    // Bug #58: Only Firefox does throw an InvalidStateError yet.
                    if (err.code === 12) {
                        throw createInvalidAccessError();
                    }

                    throw err;
                }

                addConnectionToAudioParam(this._context, this, destination, output);
            } else {
                const nativeAudioParam = AUDIO_PARAM_STORE.get(destination);

                if (nativeAudioParam === undefined) {
                    throw new Error('The associated nativeAudioParam is missing.');
                }

                try {
                    this._nativeNode.connect(nativeAudioParam, output);
                } catch (err) {
                    // Bug #58: Only Firefox does throw an InvalidStateError yet.
                    if (err.code === 12) {
                        throw createInvalidAccessError();
                    }

                    throw err;
                }
            }
        }

        public disconnect (destination?: IAudioNode): void {
            const nativeContext = CONTEXT_STORE.get(this._context);

            if (nativeContext === undefined) {
                throw new Error('The native (Offline)AudioContext is missing.');
            }

            if (isNativeOfflineAudioContext(nativeContext)) {
                if (destination === undefined) {
                    removeAnyConnection(this._context, this);
                } else {
                    removeConnectionToAudioNode(this._context, this, destination);
                }

                return;
            }

            if (destination === undefined) {
                return this._nativeNode.disconnect();
            }

            const nativeDestinationNode = AUDIO_NODE_STORE.get(destination);

            if (nativeDestinationNode === undefined) {
                throw new Error('The associated nativeNode is missing.');
            }

            if ((<INativeAudioNodeFaker> nativeDestinationNode).inputs !== undefined) {
                for (const input of (<TNativeAudioNode[]> (<INativeAudioNodeFaker> nativeDestinationNode).inputs)) {
                    this._nativeNode.disconnect(input);
                }

                return;
            }

            return this._nativeNode.disconnect(nativeDestinationNode);
        }

        public removeEventListener (
            type: string,
            listener: any, // @todo EventListenerOrEventListenerObject | null = null,
            options?: EventListenerOptions | boolean
        ): void {
            return this._nativeNode.removeEventListener(type, listener, options);
        }

    };

};
