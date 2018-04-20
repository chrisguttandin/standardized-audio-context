import { CONTEXT_STORE } from '../globals';
import { TContext } from '../types';

export const getNativeContext = (context: TContext) => {
    const nativeContext = CONTEXT_STORE.get(context);

    if (nativeContext === undefined) {
        throw new Error('The native (Offline)AudioContext is missing.');
    }

    return nativeContext;
};
