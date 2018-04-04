import { TNativeAudioContext, TNativeOfflineAudioContext } from '../types';

export const testAudioScheduledSourceNodeStopMethodConsecutiveCallsSupport = (
    audioContext: TNativeAudioContext | TNativeOfflineAudioContext
): boolean => {
    const audioBuffer = audioContext.createBuffer(1, 1, 44100);
    const audioBufferSourceNode = audioContext.createBufferSource();

    audioBufferSourceNode.buffer = audioBuffer;
    audioBufferSourceNode.start();
    audioBufferSourceNode.stop();

    try {
        audioBufferSourceNode.stop();

        return true;
    } catch (err) {
        return false;
    }
};
