import { filterBuffer } from '../helpers/filter-buffer';
import { getNativeAudioNode } from '../helpers/get-native-audio-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IIIRFilterNode, IMinimalOfflineAudioContext } from '../interfaces';
import {
    TIIRFilterNodeRendererFactoryFactory,
    TNativeAudioBuffer,
    TNativeAudioBufferSourceNode,
    TNativeIIRFilterNode,
    TNativeOfflineAudioContext,
    TTypedArray
} from '../types';

const filterFullBuffer = (
    renderedBuffer: TNativeAudioBuffer,
    nativeOfflineAudioContext: TNativeOfflineAudioContext,
    feedback: number[] | TTypedArray,
    feedforward: number[] | TTypedArray
) => {
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

    const filteredBuffer = nativeOfflineAudioContext.createBuffer(
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
};

export const createIIRFilterNodeRendererFactory: TIIRFilterNodeRendererFactoryFactory = (
    createNativeAudioBufferSourceNode,
    createNativeAudioNode,
    nativeOfflineAudioContextConstructor,
    renderNativeOfflineAudioContext
) => {
    return <T extends IMinimalOfflineAudioContext>(feedback: number[] | TTypedArray, feedforward: number[] | TTypedArray) => {
        let nativeAudioNodePromise: null | Promise<TNativeAudioBufferSourceNode | TNativeIIRFilterNode> = null;

        const createAudioNode = async (proxy: IIIRFilterNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext) => {
            let nativeAudioNode = getNativeAudioNode<T, TNativeIIRFilterNode>(proxy);

            if (nativeOfflineAudioContextConstructor === null) {
                throw new Error('Missing the native OfflineAudioContext constructor.');
            }

            // Bug #9: Safari does not support IIRFilterNodes.
            if (nativeOfflineAudioContext.createIIRFilter === undefined) {
                const partialOfflineAudioContext = new nativeOfflineAudioContextConstructor(
                    // Bug #47: The AudioDestinationNode in Edge and Safari gets not initialized correctly.
                    proxy.context.destination.channelCount,
                    // Bug #17: Safari does not yet expose the length.
                    proxy.context.length,
                    nativeOfflineAudioContext.sampleRate
                );

                await renderInputsOfAudioNode(proxy, partialOfflineAudioContext, partialOfflineAudioContext.destination);

                const renderedBuffer = await renderNativeOfflineAudioContext(partialOfflineAudioContext);
                const audioBufferSourceNode = createNativeAudioBufferSourceNode(nativeOfflineAudioContext);

                audioBufferSourceNode.buffer = filterFullBuffer(
                    renderedBuffer,
                    nativeOfflineAudioContext,
                    feedback,
                    feedforward
                );
                audioBufferSourceNode.start(0);

                return audioBufferSourceNode;
            }

            // If the initially used nativeAudioNode was not constructed on the same OfflineAudioContext it needs to be created again.
            if (!isOwnedByContext(nativeAudioNode, nativeOfflineAudioContext)) {
                nativeAudioNode = createNativeAudioNode(nativeOfflineAudioContext, (ntvCntxt) => {
                    return ntvCntxt.createIIRFilter(<number[]> feedforward, <number[]> feedback);
                });
            }

            await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeAudioNode);

            return nativeAudioNode;
        };

        return {
            render (
                proxy: IIIRFilterNode<T>,
                nativeOfflineAudioContext: TNativeOfflineAudioContext
            ): Promise<TNativeAudioBufferSourceNode | TNativeIIRFilterNode> {
                if (nativeAudioNodePromise === null) {
                    nativeAudioNodePromise = createAudioNode(proxy, nativeOfflineAudioContext);
                }

                return nativeAudioNodePromise;
            }
        };
    };
};
