import { TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';

export class AudioScheduledSourceNodeStartMethodConsecutiveCallsSupportTester {

    public test (audioContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext) {
        const audioBuffer = audioContext.createBufferSource();

        audioBuffer.start();

        try {
            audioBuffer.start();
        } catch (err) {
            return true;
        }

        return false;
    }

}

export const AUDIO_SCHEDULED_SOURCE_NODE_START_METHOD_CONSECUTIVE_CALLS_SUPPORT_TESTER_PROVIDER = {
    deps: [ ],
    provide: AudioScheduledSourceNodeStartMethodConsecutiveCallsSupportTester
};
