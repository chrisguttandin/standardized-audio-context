import { CONTEXT_STORE } from '../globals';
import { IMinimalBaseAudioContext } from '../interfaces';

export const getNativeContext = (context: IMinimalBaseAudioContext) => {
    const nativeContext = CONTEXT_STORE.get(context);

    if (nativeContext === undefined) {
        throw new Error('The native (Offline)AudioContext is missing.');
    }

    return nativeContext;
};
