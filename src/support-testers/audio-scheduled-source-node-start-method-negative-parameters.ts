import { TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';

export class AudioScheduledSourceNodeStartMethodNegativeParametersSupportTester {

    public test (audioContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext) {
        const audioBuffer = audioContext.createBufferSource();

        try {
            audioBuffer.start(-1);
        } catch (err) {
            return (err instanceof RangeError);
        }

        return false;
    }

}

export const AUDIO_SCHEDULED_SOURCE_NODE_START_METHOD_NEGATIVE_PARAMETERS_SUPPORT_TESTER_PROVIDER = {
    deps: [ ],
    provide: AudioScheduledSourceNodeStartMethodNegativeParametersSupportTester
};
