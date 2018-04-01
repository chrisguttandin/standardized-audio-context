import { TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';

export const testAudioScheduledSourceNodeStopMethodNegativeParametersSupport = (
    audioContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext
): boolean => {
    const audioBuffer = audioContext.createBufferSource();

    try {
        audioBuffer.stop(-1);
    } catch (err) {
        return (err instanceof RangeError);
    }

    return false;
};
