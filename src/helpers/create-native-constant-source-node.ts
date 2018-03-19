import { Injector } from '@angular/core';
import { INVALID_STATE_ERROR_FACTORY_PROVIDER, InvalidStateErrorFactory } from '../factories/invalid-state-error';
import { CONSTANT_SOURCE_NODE_FAKER_PROVIDER, ConstantSourceNodeFaker } from '../fakers/constant-source-node';
import { INativeConstantSourceNode } from '../interfaces';
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
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext
): INativeConstantSourceNode => {
    // Bug #62: Edge & Safari do not support ConstantSourceNodes.
    // @todo TypeScript doesn't know yet about createConstantSource().
    if ((<any> nativeContext).createConstantSource === undefined) {
        try {
            return constantSourceNodeFaker.fake(nativeContext);
        } catch (err) {
            // @todo Edge does throw a NotSupportedError if the context is closed.
            if (err.code === 9) {
                throw invalidStateErrorFactory.create();
            }

            throw err;
        }
    }

    return <INativeConstantSourceNode> (<any> nativeContext).createConstantSource();
};
