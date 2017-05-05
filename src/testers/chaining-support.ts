import { TUnpatchedAudioContext } from '../types';

export class ChainingSupportTester {

    public test (audioContext: TUnpatchedAudioContext) {
        const destination = audioContext.createGain();

        const target = audioContext.createGain();

        const isSupportingChaining = (target.connect(destination) === destination);

        target.disconnect(destination);

        return isSupportingChaining;
    }

}
