import { TNativeAudioContext, TNativeOfflineAudioContext } from '../types';

export const testAudioScheduledSourceNodeStopMethodNegativeParametersSupport = (
    audioContext: TNativeAudioContext | TNativeOfflineAudioContext
): boolean => {
    const audioBuffer = audioContext.createBufferSource();

    try {
        audioBuffer.stop(-1);
    } catch (err) {
        return (err instanceof RangeError);
    }

    return false;
};
