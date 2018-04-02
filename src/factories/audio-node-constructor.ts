import { EventTarget } from '../event-target';
import { createInvalidAccessError } from '../factories/invalid-access-error';
import {
    AUDIO_NODE_RENDERER_DESTINATIONS_STORE,
    AUDIO_NODE_RENDERER_STORE,
    AUDIO_NODE_STORE,
    AUDIO_PARAM_RENDERER_STORE,
    AUDIO_PARAM_STORE,
    CONTEXT_STORE
} from '../globals';
import { isAudioNode } from '../guards/audio-node';
import { cacheTestResult } from '../helpers/cache-test-result';
import { getNativeContext } from '../helpers/get-native-context';
import { IAudioNode, IAudioParam, IMinimalBaseAudioContext, INativeAudioNodeFaker } from '../interfaces';
import { testAudioNodeDisconnectMethodSupport } from '../support-testers/audio-node-disconnect-method';
import { TAudioNodeConstructorFactory, TChannelCountMode, TNativeAudioNode, TUnpatchedAudioContext } from '../types';
import { wrapAudioNodeDisconnectMethod } from '../wrappers/audio-node-disconnect-method';

export const createAudioNodeConstructor: TAudioNodeConstructorFactory = (isNativeOfflineAudioContext) => {

    return class AudioNode extends EventTarget implements IAudioNode {

        private _context: IMinimalBaseAudioContext;

        private _nativeNode: INativeAudioNodeFaker | TNativeAudioNode;

        constructor (context: IMinimalBaseAudioContext, nativeNode: INativeAudioNodeFaker | TNativeAudioNode) {
            super();

            this._context = context;
            this._nativeNode = nativeNode;

            const nativeContext = getNativeContext(context);

            // Bug #12: Firefox and Safari do not support to disconnect a specific destination.
            // @todo Make sure this is not used with an OfflineAudioContext.
            if (!isNativeOfflineAudioContext(nativeContext) && true !== cacheTestResult(testAudioNodeDisconnectMethodSupport, () => {
                return testAudioNodeDisconnectMethodSupport(<TUnpatchedAudioContext> nativeContext);
            })) {
                wrapAudioNodeDisconnectMethod(nativeNode);
            }

            AUDIO_NODE_STORE.set(this, nativeNode);
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
                    const renderer = AUDIO_NODE_RENDERER_STORE.get(destination);

                    if (renderer === undefined) {
                        throw createInvalidAccessError();
                    }

                    const source = AUDIO_NODE_RENDERER_STORE.get(this);

                    if (source === undefined) {
                        throw new Error('The associated renderer is missing.');
                    }

                    renderer.wire(source, output, input);

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
                const renderer = AUDIO_PARAM_RENDERER_STORE.get(destination);

                if (renderer === undefined) {
                    throw createInvalidAccessError();
                }

                const source = AUDIO_NODE_RENDERER_STORE.get(this);

                if (source === undefined) {
                    throw new Error('The associated renderer is missing.');
                }

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

                renderer.wire(source, output);
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
                const source = AUDIO_NODE_RENDERER_STORE.get(this);

                if (source === undefined) {
                    throw new Error('The associated renderer is missing.');
                }

                if (destination === undefined) {
                    const renderers = AUDIO_NODE_RENDERER_DESTINATIONS_STORE.get(source);

                    if (renderers === undefined) {
                        return;
                    }

                    return renderers.forEach((rndrr) => rndrr.unwire(source));
                }

                const renderer = AUDIO_NODE_RENDERER_STORE.get(destination);

                if (renderer === undefined) {
                    throw new Error('The associated renderer is missing.');
                }

                return renderer.unwire(source);
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
