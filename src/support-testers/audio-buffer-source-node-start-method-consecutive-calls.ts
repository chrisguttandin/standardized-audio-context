import { TNativeAudioContext, TNativeOfflineAudioContext } from '../types';

export const testAudioBufferSourceNodeStartMethodConsecutiveCallsSupport = (
    audioContext: TNativeAudioContext | TNativeOfflineAudioContext
): boolean => {
    const audioBuffer = audioContext.createBufferSource();

    audioBuffer.start();

    try {
        audioBuffer.start();
    } catch (err) {
        return true;
    }

    return false;
};
