import { createInvalidStateError } from '../factories/invalid-state-error';
import { CONTEXT_STORE } from '../globals';
import { IMinimalAudioContext } from '../interfaces';
import { TNativeAudioContext } from '../types';

export const getNativeAudioContext = (audioContext: IMinimalAudioContext): TNativeAudioContext => {
    const nativeContext = CONTEXT_STORE.get(audioContext);

    if (nativeContext === undefined) {
        throw createInvalidStateError();
    }

    return <TNativeAudioContext> nativeContext;
};
