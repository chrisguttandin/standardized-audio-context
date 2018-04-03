import { isNativeAudioNode } from '../guards/native-audio-node';
import { TDisconnectMultipleOutputsFactory, TIndexSizeErrorFactory, TNativeAudioNode } from '../types';

const getOutputAudioNodeAtIndex = (
    createIndexSizeError: TIndexSizeErrorFactory,
    outputAudioNodes: TNativeAudioNode[],
    output: number
): TNativeAudioNode => {
    const outputAudioNode = outputAudioNodes[output];

    if (outputAudioNode === undefined) {
        throw createIndexSizeError();
    }

    return outputAudioNode;
};

export const createDisconnectMultipleOutputs: TDisconnectMultipleOutputsFactory = (createIndexSizeError) => {
    return (outputAudioNodes, outputOrDestinationAudioNodeOrAudioParam = undefined, output = undefined, input = 0) => {
        if (outputOrDestinationAudioNodeOrAudioParam === undefined) {
            return outputAudioNodes
                .forEach((outputAudioNode) => outputAudioNode.disconnect());
        }

        if (typeof outputOrDestinationAudioNodeOrAudioParam === 'number') {
            return getOutputAudioNodeAtIndex(createIndexSizeError, outputAudioNodes, outputOrDestinationAudioNodeOrAudioParam)
                .disconnect();
        }

        if (isNativeAudioNode(outputOrDestinationAudioNodeOrAudioParam)) {
            if (output === undefined) {
                return outputAudioNodes
                    .forEach((outputAudioNode) => outputAudioNode.disconnect(outputOrDestinationAudioNodeOrAudioParam));
            }

            if (input === undefined) {
                return getOutputAudioNodeAtIndex(createIndexSizeError, outputAudioNodes, output)
                    .disconnect(outputOrDestinationAudioNodeOrAudioParam, 0);
            }

            return getOutputAudioNodeAtIndex(createIndexSizeError, outputAudioNodes, output)
                .disconnect(outputOrDestinationAudioNodeOrAudioParam, 0, input);
        }

        if (output === undefined) {
            return outputAudioNodes
                .forEach((outputAudioNode) => outputAudioNode.disconnect(outputOrDestinationAudioNodeOrAudioParam));
        }

        return getOutputAudioNodeAtIndex(createIndexSizeError, outputAudioNodes, output)
            .disconnect(outputOrDestinationAudioNodeOrAudioParam, 0);
    };
};
