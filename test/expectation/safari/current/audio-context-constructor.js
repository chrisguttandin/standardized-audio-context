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

    describe('createBiquadFilter()', () => {
        let biquadFilterNode;

        beforeEach(() => {
            biquadFilterNode = audioContext.createBiquadFilter();
        });

        describe('getFrequencyResponse()', () => {
            it('should throw an InvalidStateError', (done) => {
                // bug #189

                try {
                    biquadFilterNode.getFrequencyResponse(new Float32Array(), new Float32Array(1), new Float32Array(1));
                } catch (err) {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    done();
                }
            });
        });
    });
});
