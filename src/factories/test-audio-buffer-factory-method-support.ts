import { TNativeOfflineAudioContextConstructor } from '../types';

/*
 * Bug #99: Firefox up to version 74 threw an IndexSizeError instead of a NotSupportedError when creating an AudioBuffer without any
 * channels.
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
