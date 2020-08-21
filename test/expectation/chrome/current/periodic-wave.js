describe('PeriodicWave', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('with an imag property of only one value', () => {
        // bug #181

        it('should return a PeriodicWave', () => {
            const periodicWave = new PeriodicWave(audioContext, { imag: [1] });

            expect(periodicWave).to.be.an.instanceOf(PeriodicWave);
        });
    });

    describe('with a real property of only one value', () => {
        // bug #181

        it('should return a PeriodicWave', () => {
            const periodicWave = new PeriodicWave(audioContext, { real: [1] });

            expect(periodicWave).to.be.an.instanceOf(PeriodicWave);
        });
    });
});
