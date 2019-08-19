import { TNativeAudioBuffer } from '../types';

export const testAudioBufferCopyChannelMethodsSubarraySupport = (nativeAudioBuffer: TNativeAudioBuffer): boolean => {
    const source = new Float32Array(2);

    try {
        /*
         * Firefox up to version 67 didn't fully support the copyFromChannel() and copyToChannel() methods. Therefore testing one of those
         * methods is enough to know if the other one it supported as well.
         */
        nativeAudioBuffer.copyFromChannel(source, 0, nativeAudioBuffer.length - 1);
    } catch {
        return false;
    }

    return true;
};
