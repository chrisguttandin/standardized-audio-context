import { TNativeAudioContext, TNativeOfflineAudioContext } from '../types';

export const testAudioScheduledSourceNodeStartMethodNegativeParametersSupport = (
    audioContext: TNativeAudioContext | TNativeOfflineAudioContext
): boolean => {
    const audioBuffer = audioContext.createBufferSource();

    try {
        audioBuffer.start(-1);
    } catch (err) {
        return (err instanceof RangeError);
    }

    return false;
};
