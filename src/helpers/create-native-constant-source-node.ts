import { Injector } from '@angular/core';
import { INVALID_STATE_ERROR_FACTORY_PROVIDER, InvalidStateErrorFactory } from '../factories/invalid-state-error';
import { CONSTANT_SOURCE_NODE_FAKER_PROVIDER, ConstantSourceNodeFaker } from '../fakers/constant-source-node';
import { IConstantSourceOptions, INativeConstantSourceNode } from '../interfaces';
import { TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';

const injector = Injector.create({
    providers: [
        CONSTANT_SOURCE_NODE_FAKER_PROVIDER,
        INVALID_STATE_ERROR_FACTORY_PROVIDER
    ]
});

const constantSourceNodeFaker = injector.get(ConstantSourceNodeFaker);
const invalidStateErrorFactory = injector.get(InvalidStateErrorFactory);

export const createNativeConstantSourceNode = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    options: Partial<IConstantSourceOptions> = { }
): INativeConstantSourceNode => {
    // Bug #62: Edge & Safari do not support ConstantSourceNodes.
    // @todo TypeScript doesn't know yet about createConstantSource().
    if ((<any> nativeContext).createConstantSource === undefined) {
        try {
            return constantSourceNodeFaker.fake(nativeContext, options);
        } catch (err) {
            // @todo Edge does throw a NotSupportedError if the context is closed.
            if (err.code === 9) {
                throw invalidStateErrorFactory.create();
            }

            throw err;
        }
    }

    const nativeNode = <INativeConstantSourceNode> (<any> nativeContext).createConstantSource();

    if (options.channelCount !== undefined) {
        nativeNode.channelCount = options.channelCount;
    // Bug #67: Firefox initializes the ConstantSourceNode with a channelCount of 1 instead of 2.
    } else if (nativeNode.channelCount === 1) {
        nativeNode.channelCount = 2;
    }

    if (options.channelCountMode !== undefined) {
        nativeNode.channelCountMode = options.channelCountMode;
    }

    if (options.channelInterpretation !== undefined) {
        nativeNode.channelInterpretation = options.channelInterpretation;
    }

    if (options.offset !== undefined) {
        nativeNode.offset.value = options.offset;
    }

    return nativeNode;
};
