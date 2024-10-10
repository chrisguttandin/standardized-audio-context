import { TNativeOfflineAudioContextConstructor } from '../types';

/*
 * Bug #99: Firefox up to version 74 threw an IndexSizeError instead of a NotSupportedError when creating an AudioBuffer without any
 * channels. It also had two more bugs but since this is easy to test it's used here as a placeholder.
 *
 * Bug #35: Firefox up to version 74 threw no error when calling close() on an already closed AudioContext.
 *
 * Bug #44: Firefox up to version 74 threw a NotSupportedError instead of a RangeError when calling start() and stop() of an
 * AudioScheduledSourceNode with a negative value.
 */
export const createTestAudioBufferFactoryMethodSupport =
    (nativeOfflineAudioContextConstructor: null | TNativeOfflineAudioContextConstructor) => () => {
        if (nativeOfflineAudioContextConstructor === null) {
            return false;
        }

        const offlineAudioContext = new nativeOfflineAudioContextConstructor(1, 1, 44100);

        try {
            offlineAudioContext.createBuffer(0, 10, 44100);
        } catch (err) {
            return err.code === 9;
        }

        return false;
    };
