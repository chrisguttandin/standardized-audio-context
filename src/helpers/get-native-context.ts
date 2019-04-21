import { createInvalidStateError } from '../factories/invalid-state-error';
import { CONTEXT_STORE } from '../globals';
import { IMinimalBaseAudioContext, IMinimalOfflineAudioContext } from '../interfaces';
import { TNativeAudioContext, TNativeOfflineAudioContext } from '../types';

export const getNativeContext = <T extends IMinimalBaseAudioContext>(
    context: T
): T extends IMinimalOfflineAudioContext ? TNativeOfflineAudioContext : TNativeAudioContext => {
    const nativeContext = CONTEXT_STORE.get(context);

    if (nativeContext === undefined) {
        throw createInvalidStateError();
    }

    return <T extends IMinimalOfflineAudioContext ? TNativeOfflineAudioContext : TNativeAudioContext> nativeContext;
};
