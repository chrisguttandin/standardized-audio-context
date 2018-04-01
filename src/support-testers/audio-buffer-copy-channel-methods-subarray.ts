import { TNativeAudioBuffer } from '../types';

export const testAudioBufferCopyChannelMethodsSubarraySupport = (nativeAudioBuffer: TNativeAudioBuffer): boolean => {
    const source = new Float32Array(2);

    try {
        /*
         * Only Firefox does not fully support the copyFromChannel() and copyToChannel() methods. Therefore testing one of those
         * methods is enough to know if the other one it supported as well.
         */
        nativeAudioBuffer.copyToChannel(source, 0, nativeAudioBuffer.length - 1);
    } catch (err) {
        return false;
    }

    return true;
};
