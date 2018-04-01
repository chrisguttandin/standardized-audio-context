import { TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';

export const testAudioScheduledSourceNodeStartMethodNegativeParametersSupport = (
    audioContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext
): boolean => {
    const audioBuffer = audioContext.createBufferSource();

    try {
        audioBuffer.start(-1);
    } catch (err) {
        return (err instanceof RangeError);
    }

    return false;
};
