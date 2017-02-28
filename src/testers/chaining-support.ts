export class ChainingSupportTester {

    public test (audioContext) {
        const destination = audioContext.createGain();

        const target = audioContext.createGain();

        const isSupportingChaining = (target.connect(destination) === destination);

        target.disconnect(destination);

        return isSupportingChaining;
    }

}
