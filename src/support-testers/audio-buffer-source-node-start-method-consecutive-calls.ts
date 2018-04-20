import { TNativeContext } from '../types';

export const testAudioBufferSourceNodeStartMethodConsecutiveCallsSupport = (nativeContext: TNativeContext): boolean => {
    const audioBuffer = nativeContext.createBufferSource();

    audioBuffer.start();

    try {
        audioBuffer.start();
    } catch (err) {
        return true;
    }

    return false;
};
