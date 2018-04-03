import { filterBuffer } from '../helpers/filter-buffer';
import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { IIIRFilterNode, IMinimalOfflineAudioContext } from '../interfaces';
import { AudioNodeRenderer } from '../renderers/audio-node';
import {
    TIIRFilterNodeRendererConstructorFactory,
    TNativeAudioBuffer,
    TNativeAudioBufferSourceNode,
    TNativeAudioNode,
    TNativeIIRFilterNode,
    TTypedArray,
    TUnpatchedOfflineAudioContext
} from '../types';

export const createIIRFilterNodeRendererConstructor: TIIRFilterNodeRendererConstructorFactory = (
    createNativeAudioBufferSourceNode,
    renderNativeOfflineAudioContext,
    unpatchedOfflineAudioContextConstructor
) => {

    return class IIRFilterNodeRenderer extends AudioNodeRenderer {

        private _feedback: number [] | TTypedArray;

        private _feedforward: number [] | TTypedArray;

        private _nativeNode: null | TNativeAudioBufferSourceNode | TNativeIIRFilterNode;

        private _proxy: IIIRFilterNode;

        constructor (proxy: IIIRFilterNode, feedback: number[] | TTypedArray, feedforward: number[] | TTypedArray) {
            super();

            this._feedback = feedback;
            this._feedforward = feedforward;
            this._nativeNode = null;
            this._proxy = proxy;
        }

        public render (offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<TNativeAudioNode> {
            if (unpatchedOfflineAudioContextConstructor === null) {
                throw new Error(); // @todo
            }

            if (this._nativeNode !== null) {
                return Promise.resolve(this._nativeNode);
            }

            try {
                // Throw an error if the native factory method is not supported.
                // @todo Use a simple if clause instead of throwing an error.
                if (offlineAudioContext.createIIRFilter === undefined) {
                    throw new Error();
                }

                this._nativeNode = <TNativeIIRFilterNode> getNativeNode(this._proxy);

                // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
                if (!isOwnedByContext(this._nativeNode, offlineAudioContext)) {
                    this._nativeNode = offlineAudioContext.createIIRFilter(<any> this._feedforward, <any> this._feedback);
                }

                return this
                    ._connectSources(offlineAudioContext, <TNativeAudioNode> this._nativeNode)
                    .then(() => <TNativeAudioNode> this._nativeNode);

            // Bug #9: Safari does not support IIRFilterNodes.
            } catch (err) {
                const partialOfflineAudioContext = new unpatchedOfflineAudioContextConstructor(
                    // Bug #47: The AudioDestinationNode in Edge and Safari gets not initialized correctly.
                    this._proxy.context.destination.channelCount,
                    // Bug #17: Safari does not yet expose the length.
                    (<IMinimalOfflineAudioContext> this._proxy.context).length,
                    offlineAudioContext.sampleRate
                );

                return this
                    ._connectSources(partialOfflineAudioContext, <TNativeAudioNode> partialOfflineAudioContext.destination)
                    .then(() => renderNativeOfflineAudioContext(partialOfflineAudioContext))
                    .then((renderedBuffer) => {
                        const audioBufferSourceNode = createNativeAudioBufferSourceNode(offlineAudioContext);

                        audioBufferSourceNode.buffer = this._filterBuffer(renderedBuffer, offlineAudioContext);
                        audioBufferSourceNode.start(0);

                        this._nativeNode = audioBufferSourceNode;

                        return <TNativeAudioNode> this._nativeNode;
                    });
            }
        }

        private _filterBuffer (renderedBuffer: TNativeAudioBuffer, offlineAudioContext: TUnpatchedOfflineAudioContext) {
            const feedback = this._feedback;
            const feedforward = this._feedforward;

            const feedbackLength = feedback.length;
            const feedforwardLength = feedforward.length;
            const minLength = Math.min(feedbackLength, feedforwardLength);

            if (feedback[0] !== 1) {
                for (let i = 0; i < feedbackLength; i += 1) {
                    feedforward[i] /= feedback[0];
                }

                for (let i = 1; i < feedforwardLength; i += 1) {
                    feedback[i] /= feedback[0];
                }
            }

            const bufferLength = 32;
            const xBuffer = new Float32Array(bufferLength);
            const yBuffer = new Float32Array(bufferLength);

            const filteredBuffer = offlineAudioContext.createBuffer(
                renderedBuffer.numberOfChannels,
                renderedBuffer.length,
                renderedBuffer.sampleRate
            );

            const numberOfChannels = renderedBuffer.numberOfChannels;

            for (let i = 0; i < numberOfChannels; i += 1) {
                const input = renderedBuffer.getChannelData(i);
                const output = filteredBuffer.getChannelData(i);

                // @todo Add a test which checks support for TypedArray.prototype.fill().
                xBuffer.fill(0);
                yBuffer.fill(0);

                filterBuffer(
                    feedback, feedbackLength, feedforward, feedforwardLength, minLength, xBuffer, yBuffer, 0, bufferLength, input, output
                );
            }

            return filteredBuffer;
        }

    };

};
