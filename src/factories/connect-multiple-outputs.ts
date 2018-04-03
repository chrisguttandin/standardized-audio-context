import { isNativeAudioNode } from '../guards/native-audio-node';
import { TConnectMultipleOutputsFactory } from '../types';

export const createConnectMultipleOutputs: TConnectMultipleOutputsFactory = (createIndexSizeError) => {
    return (outputAudioNodes, destinationAudioNodeOrAudioParam, output = 0, input = 0) => {
        const outputAudioNode = outputAudioNodes[output];

        if (outputAudioNode === undefined) {
            throw createIndexSizeError();
        }

        if (isNativeAudioNode(destinationAudioNodeOrAudioParam)) {
            return outputAudioNode.connect(destinationAudioNodeOrAudioParam, 0, input);
        }

        return outputAudioNode.connect(destinationAudioNodeOrAudioParam, 0);
    };
};
