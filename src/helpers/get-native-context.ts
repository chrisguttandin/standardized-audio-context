import { createInvalidStateError } from '../factories/invalid-state-error';
import { CONTEXT_STORE } from '../globals';
import { IMinimalBaseAudioContext } from '../interfaces';
import { TNativeContext } from '../types';

export const getNativeContext = <T extends IMinimalBaseAudioContext>(context: T): TNativeContext => {
    const nativeContext = CONTEXT_STORE.get(context);

    if (nativeContext === undefined) {
        throw createInvalidStateError();
    }

    return nativeContext;
};
