import { TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';

export class StopStoppedSupportTester {

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

export const STOP_STOPPED_SUPPORT_TESTER_PROVIDER = { deps: [ ], provide: StopStoppedSupportTester };
