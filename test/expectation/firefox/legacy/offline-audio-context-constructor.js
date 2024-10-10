describe('offlineAudioContextConstructor', () => {
    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    describe('audioWorklet', () => {
        // bug #59

        it('should not be implemented', () => {
            expect(offlineAudioContext.audioWorklet).to.be.undefined;
        });
    });
});
