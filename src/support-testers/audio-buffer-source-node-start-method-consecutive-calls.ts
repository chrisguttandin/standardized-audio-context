import { TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';

export const testAudioBufferSourceNodeStartMethodConsecutiveCallsSupport = (
    audioContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext
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
