export class AnalyserNodeGetFloatTimeDomainDataSupportTester {

    public test (audioContext) {
        const analyserNode = audioContext.createAnalyser();

        return typeof analyserNode.getFloatTimeDomainData === 'function';
    }

}
