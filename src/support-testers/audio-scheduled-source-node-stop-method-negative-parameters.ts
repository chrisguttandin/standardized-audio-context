import { TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';

export class AudioScheduledSourceNodeStopMethodNegativeParametersSupportTester {

    public test (audioContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext) {
        const audioBuffer = audioContext.createBufferSource();

        try {
            audioBuffer.stop(-1);
        } catch (err) {
            return (err instanceof RangeError);
        }

        return false;
    }

}

export const AUDIO_SCHEDULED_SOURCE_NODE_STOP_METHOD_NEGATIVE_PARAMETERS_SUPPORT_TESTER_PROVIDER = {
    deps: [ ],
    provide: AudioScheduledSourceNodeStopMethodNegativeParametersSupportTester
};
