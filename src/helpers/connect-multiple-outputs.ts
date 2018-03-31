import { createIndexSizeError } from '../factories/index-size-error';
import { isNativeAudioNode } from '../guards/native-audio-node';
import { TNativeAudioNode, TNativeAudioParam } from '../types';

export const connectMultipleOutputs = (
    outputAudioNodes: TNativeAudioNode[],
    destinationAudioNodeOrAudioParam: TNativeAudioNode | TNativeAudioParam,
    output = 0,
    input = 0
): void | TNativeAudioNode => {
    const outputAudioNode = outputAudioNodes[output];

    if (outputAudioNode === undefined) {
        throw createIndexSizeError();
    }

    if (isNativeAudioNode(destinationAudioNodeOrAudioParam)) {
        return outputAudioNode.connect(destinationAudioNodeOrAudioParam, 0, input);
    }

    return outputAudioNode.connect(destinationAudioNodeOrAudioParam, 0);
};
