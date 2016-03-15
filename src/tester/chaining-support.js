export class ChainingSupportTester {

    test (audioContext) {
        var destination = audioContext.createGain(),
            isSupportingChaining,
            target = audioContext.createGain();

        isSupportingChaining = (target.connect(destination) === destination);

        target.disconnect(destination);

        return isSupportingChaining;
    }

}
