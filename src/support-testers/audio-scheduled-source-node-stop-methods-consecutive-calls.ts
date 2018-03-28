import { TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';

export class AudioScheduledSourceNodeStopMethodConsecutiveCallsSupportTester {

    public test (audioContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext) {
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
    }

}

export const AUDIO_SCHEDULED_SOURCE_NODE_STOP_METHOD_CONSECUTIVE_CALLS_SUPPORT_TESTER_PROVIDER = {
    deps: [ ],
    provide: AudioScheduledSourceNodeStopMethodConsecutiveCallsSupportTester
};
