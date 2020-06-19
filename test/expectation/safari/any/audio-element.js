describe('AudioElement', () => {
    let audioElement;

    beforeEach(() => {
        audioElement = new Audio();
    });

    describe('captureStream()', () => {
        // bug #65

        it('should not be implemented', () => {
            expect(audioElement.captureStream).to.be.undefined;
        });
    });
});
