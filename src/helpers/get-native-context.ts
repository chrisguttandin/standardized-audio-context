import { createInvalidStateError } from '../factories/invalid-state-error';
import { CONTEXT_STORE } from '../globals';
import { TContext, TNativeContext } from '../types';

export const getNativeContext = (context: TContext): TNativeContext => {
    const nativeContext = CONTEXT_STORE.get(context);

    if (nativeContext === undefined) {
        throw createInvalidStateError();
    }

    return nativeContext;
};
