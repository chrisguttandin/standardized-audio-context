describe('audioContextConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new webkitAudioContext(); // eslint-disable-line new-cap, no-undef
    });

    describe('state', () => {
        // bug #188

        // This test will only work when changing the browser settings to allow popups.
        it("should set the state of the context to 'interrupted'", (done) => {
            const oscillator = audioContext.createOscillator();
            const currentTime = audioContext.currentTime;

            oscillator.start(currentTime);
            oscillator.stop(currentTime + 0.1);

            window.open('about:blank', '_blank');

            setTimeout(() => {
                expect(audioContext.state).to.equal('interrupted');

                done();
            }, 500);
        });
    });
});
