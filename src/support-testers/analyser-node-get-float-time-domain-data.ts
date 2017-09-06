import { TUnpatchedAudioContext } from '../types';

export class AnalyserNodeGetFloatTimeDomainDataSupportTester {

    public test (audioContext: TUnpatchedAudioContext) {
        const analyserNode = audioContext.createAnalyser();

        return typeof analyserNode.getFloatTimeDomainData === 'function';
    }

}
