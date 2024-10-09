import { TNativeAudioContextConstructor } from '../types';

/*
 * Bug #55: Chrome up to version 98 threw an InvalidAccessError instead of an InvalidStateError when calling resume() on a closed
 * AudioContext.
 */
export const createTestAudioContextResumeSupport = (nativeAudioContextConstructor: null | TNativeAudioContextConstructor) => {
    return async () => {
        if (nativeAudioContextConstructor === null) {
            return false;
        }

        const audioContext = new nativeAudioContextConstructor();

        try {
            await audioContext.close();
        } catch {
            return false;
        }

        try {
            await audioContext.resume();
        } catch (err) {
            return err.code === 11;
        }

        return false;
    };
};
