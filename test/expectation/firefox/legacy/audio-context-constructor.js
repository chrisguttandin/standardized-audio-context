describe('audioContextConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('createAnalyser()', () => {
        // bug #37

        it('should have a channelCount of 1', () => {
            const analyserNode = audioContext.createAnalyser();

            expect(analyserNode.channelCount).to.equal(1);
        });
    });
});
