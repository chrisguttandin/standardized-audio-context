export class ChainingSupportTester {

    test (audioContext) { // eslint-disable-line class-methods-use-this
        var destination = audioContext.createGain(),
            isSupportingChaining,
            target = audioContext.createGain();

        isSupportingChaining = (target.connect(destination) === destination);

        target.disconnect(destination);

        return isSupportingChaining;
    }

}
