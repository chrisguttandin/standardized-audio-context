import { createIndexSizeError } from '../factories/index-size-error';
import { isNativeAudioNode } from '../guards/native-audio-node';
import { TNativeAudioNode, TNativeAudioParam } from '../types';

const getOutputAudioNodeAtIndex = (outputAudioNodes: TNativeAudioNode[], output: number): TNativeAudioNode => {
    const outputAudioNode = outputAudioNodes[output];

    if (outputAudioNode === undefined) {
        throw createIndexSizeError();
    }

    return outputAudioNode;
};

export const disconnectMultipleOutputs = (
    outputAudioNodes: TNativeAudioNode[],
    outputOrDestinationAudioNodeOrAudioParam: number | undefined | TNativeAudioNode | TNativeAudioParam = undefined,
    output: number | undefined = undefined,
    input = 0
): void => {
    if (outputOrDestinationAudioNodeOrAudioParam === undefined) {
        return outputAudioNodes
            .forEach((outputAudioNode) => outputAudioNode.disconnect());
    }

    if (typeof outputOrDestinationAudioNodeOrAudioParam === 'number') {
        return getOutputAudioNodeAtIndex(outputAudioNodes, outputOrDestinationAudioNodeOrAudioParam)
            .disconnect();
    }

    if (isNativeAudioNode(outputOrDestinationAudioNodeOrAudioParam)) {
        if (output === undefined) {
            return outputAudioNodes
                .forEach((outputAudioNode) => outputAudioNode.disconnect(outputOrDestinationAudioNodeOrAudioParam));
        }

        if (input === undefined) {
            return getOutputAudioNodeAtIndex(outputAudioNodes, output)
                .disconnect(outputOrDestinationAudioNodeOrAudioParam, 0);
        }

        return getOutputAudioNodeAtIndex(outputAudioNodes, output)
            .disconnect(outputOrDestinationAudioNodeOrAudioParam, 0, input);
    }

    if (output === undefined) {
        return outputAudioNodes
            .forEach((outputAudioNode) => outputAudioNode.disconnect(outputOrDestinationAudioNodeOrAudioParam));
    }

    return getOutputAudioNodeAtIndex(outputAudioNodes, output)
        .disconnect(outputOrDestinationAudioNodeOrAudioParam, 0);
};
