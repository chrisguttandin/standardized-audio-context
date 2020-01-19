import { createInvalidStateError } from '../factories/invalid-state-error';
import { IMinimalOfflineAudioContext,  IOfflineAudioContext } from '../interfaces';
import { TContext, TGetNativeContextFactory, TNativeAudioContext, TNativeOfflineAudioContext } from '../types';

export const createGetNativeContext: TGetNativeContextFactory = (contextStore) => {
    return <T extends TContext>(
        context: T
    ): T extends IMinimalOfflineAudioContext | IOfflineAudioContext ? TNativeOfflineAudioContext : TNativeAudioContext => {
        const nativeContext = contextStore.get(context);

        if (nativeContext === undefined) {
            throw createInvalidStateError();
        }

        return <
            T extends IMinimalOfflineAudioContext | IOfflineAudioContext ? TNativeOfflineAudioContext : TNativeAudioContext
        > nativeContext;
    };
};
