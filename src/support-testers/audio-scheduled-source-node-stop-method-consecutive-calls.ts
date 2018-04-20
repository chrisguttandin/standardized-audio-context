import { TNativeContext } from '../types';

export const testAudioScheduledSourceNodeStopMethodConsecutiveCallsSupport = (nativeContext: TNativeContext): boolean => {
    const audioBuffer = nativeContext.createBuffer(1, 1, 44100);
    const audioBufferSourceNode = nativeContext.createBufferSource();

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
