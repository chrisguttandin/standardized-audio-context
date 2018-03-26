import { Injector } from '@angular/core';
import { INDEX_SIZE_ERROR_FACTORY_PROVIDER, IndexSizeErrorFactory } from '../factories/index-size-error';
import { isNativeAudioNode } from '../guards/native-audio-node';
import { TNativeAudioNode, TNativeAudioParam } from '../types';

const injector = Injector.create({
    providers: [
        INDEX_SIZE_ERROR_FACTORY_PROVIDER
    ]
});

const indexSizeErrorFactory = injector.get(IndexSizeErrorFactory);

export const connectMultipleOutputs = (
    outputAudioNodes: TNativeAudioNode[],
    destinationAudioNodeOrAudioParam: TNativeAudioNode | TNativeAudioParam,
    output = 0,
    input = 0
): void | TNativeAudioNode => {
    const outputAudioNode = outputAudioNodes[output];

    if (outputAudioNode === undefined) {
        throw indexSizeErrorFactory.create();
    }

    if (isNativeAudioNode(destinationAudioNodeOrAudioParam)) {
        return outputAudioNode.connect(destinationAudioNodeOrAudioParam, 0, input);
    }

    return outputAudioNode.connect(destinationAudioNodeOrAudioParam, 0);
};
