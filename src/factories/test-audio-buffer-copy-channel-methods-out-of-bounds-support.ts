import { TNativeOfflineAudioContextConstructor } from '../types';

// Bug #157: Firefox up to version 81 threw an error when the bufferOffset was out-of-bounds when calling copyToChannel() of an AudioBuffer.
export const createTestAudioBufferCopyChannelMethodsOutOfBoundsSupport =
    (nativeOfflineAudioContextConstructor: null | TNativeOfflineAudioContextConstructor) => () => {
        if (nativeOfflineAudioContextConstructor === null) {
            return false;
        }

        const nativeOfflineAudioContext = new nativeOfflineAudioContextConstructor(1, 1, 44100);
        const nativeAudioBuffer = nativeOfflineAudioContext.createBuffer(1, 1, 44100);
        const source = new Float32Array(2);

        try {
            nativeAudioBuffer.copyToChannel(source, 0, 3);
        } catch {
            return false;
        }

        return true;
    };
