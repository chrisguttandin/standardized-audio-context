import { createInvalidStateError } from '../factories/invalid-state-error';
import { IMinimalBaseAudioContext, IMinimalOfflineAudioContext } from '../interfaces';
import { TGetNativeContextFactory, TNativeAudioContext, TNativeOfflineAudioContext } from '../types';

export const createGetNativeContext: TGetNativeContextFactory = (contextStore) => {
    return <T extends IMinimalBaseAudioContext>(
        context: T
    ): T extends IMinimalOfflineAudioContext ? TNativeOfflineAudioContext : TNativeAudioContext => {
        const nativeContext = contextStore.get(context);

        if (nativeContext === undefined) {
            throw createInvalidStateError();
        }

        return <T extends IMinimalOfflineAudioContext ? TNativeOfflineAudioContext : TNativeAudioContext> nativeContext;
    };
};
