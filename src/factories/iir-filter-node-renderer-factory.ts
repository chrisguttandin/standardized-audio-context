import { filterBuffer } from '../helpers/filter-buffer';
import { getNativeNode } from '../helpers/get-native-node';
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
    offlineAudioContext: TNativeOfflineAudioContext,
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
};

export const createIIRFilterNodeRendererFactory: TIIRFilterNodeRendererFactoryFactory = (
    createNativeAudioBufferSourceNode,
    nativeOfflineAudioContextConstructor,
    renderNativeOfflineAudioContext
) => {
    return (feedback: number[] | TTypedArray, feedforward: number[] | TTypedArray) => {
        let nativeNode: null | TNativeAudioBufferSourceNode | TNativeIIRFilterNode = null;

        return {
            render: async (
                proxy: IIIRFilterNode,
                offlineAudioContext: TNativeOfflineAudioContext
            ): Promise<TNativeAudioBufferSourceNode | TNativeIIRFilterNode> => {
                if (nativeNode !== null) {
                    return nativeNode;
                }

                if (nativeOfflineAudioContextConstructor === null) {
                    throw new Error(); // @todo
                }

                nativeNode = <TNativeIIRFilterNode> getNativeNode(proxy);

                try {
                    // Throw an error if the native factory method is not supported.
                    // @todo Use a simple if clause instead of throwing an error.
                    if (offlineAudioContext.createIIRFilter === undefined) {
                        throw new Error();
                    }

                    nativeNode = <TNativeIIRFilterNode> getNativeNode(proxy);

                    // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
                    if (!isOwnedByContext(nativeNode, offlineAudioContext)) {
                        nativeNode = offlineAudioContext.createIIRFilter(<number[]> feedforward, <number[]> feedback);
                    }

                    return renderInputsOfAudioNode(proxy, offlineAudioContext, nativeNode)
                        .then(() => <TNativeIIRFilterNode> nativeNode);

                // Bug #9: Safari does not support IIRFilterNodes.
                } catch (err) {
                   const partialOfflineAudioContext = new nativeOfflineAudioContextConstructor(
                       // Bug #47: The AudioDestinationNode in Edge and Safari gets not initialized correctly.
                       proxy.context.destination.channelCount,
                       // Bug #17: Safari does not yet expose the length.
                       (<IMinimalOfflineAudioContext> proxy.context).length,
                       offlineAudioContext.sampleRate
                   );

                   return renderInputsOfAudioNode(proxy, partialOfflineAudioContext, partialOfflineAudioContext.destination)
                       .then(() => renderNativeOfflineAudioContext(partialOfflineAudioContext))
                       .then((renderedBuffer) => {
                           const audioBufferSourceNode = createNativeAudioBufferSourceNode(offlineAudioContext);

                           audioBufferSourceNode.buffer = filterFullBuffer(renderedBuffer, offlineAudioContext, feedback, feedforward);
                           audioBufferSourceNode.start(0);

                           nativeNode = audioBufferSourceNode;

                           return nativeNode;
                       });
               }
            }
        };
    };
};
