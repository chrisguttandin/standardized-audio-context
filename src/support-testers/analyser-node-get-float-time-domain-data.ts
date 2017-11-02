import { TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';

export class AnalyserNodeGetFloatTimeDomainDataSupportTester {

    public test (audioContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext) {
        const analyserNode = audioContext.createAnalyser();

        return typeof analyserNode.getFloatTimeDomainData === 'function';
    }

}

export const ANALYSER_NODE_GET_FLOAT_TIME_DOMAIN_DATA_SUPPORT_TESTER_PROVIDER = {
    deps: [ ],
    provide: AnalyserNodeGetFloatTimeDomainDataSupportTester
};
