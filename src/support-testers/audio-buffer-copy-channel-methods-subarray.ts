import { TNativeAudioBuffer } from '../types';

export const testAudioBufferCopyChannelMethodsSubarraySupport = (nativeAudioBuffer: TNativeAudioBuffer): boolean => {
    const source = new Float32Array(2);

    try {
        /*
         * Firefox up to version 67 didn't fully support the copyFromChannel() and copyToChannel() methods. Therefore testing one of those
         * methods is enough to know if the other one it supported as well.
         */
        nativeAudioBuffer.copyToChannel(source, 0, nativeAudioBuffer.length - 1);
    } catch {
        return false;
    }

    // Since Firefox 68 another subtle bug is present which also violates the spec in its current form.
    try {
        nativeAudioBuffer.copyToChannel(source, 0, nativeAudioBuffer.length);
    } catch {
        return true;
    }

    return false;
};
