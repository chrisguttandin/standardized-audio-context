describe('audioContextConstructor', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('close()', () => {

        // bug #50

        it('should not allow to create AudioNodes on a closed context', (done) => {
            audioContext
                .close()
                .then(() => {
                    audioContext.createGain();
                })
                .catch(() => {
                    // Create a closeable AudioContext to align the behaviour with other tests.
                    audioContext = new AudioContext();

                    done();
                });
        });

    });

    describe('createAnalyser()', () => {

        // bug #58

        it('should throw a SyntaxError when calling connect() with an AudioParam of another AudioContext', (done) => {
            const analyserNode = audioContext.createAnalyser();
            const anotherAudioContext = new AudioContext();
            const gainNode = anotherAudioContext.createGain();

            try {
                analyserNode.connect(gainNode.gain);
            } catch (err) {
                expect(err.code).to.equal(12);
                expect(err.name).to.equal('SyntaxError');

                done();
            } finally {
                anotherAudioContext.close();
            }
        });

    });

    describe('createBiquadFilter()', () => {

        let biquadFilterNode;

        beforeEach(() => {
            biquadFilterNode = audioContext.createBiquadFilter();
        });

        describe('frequency', () => {

            describe('maxValue', () => {

                // bug #77

                it('should be the nyquist frequency', () => {
                    expect(biquadFilterNode.frequency.maxValue).to.equal(audioContext.sampleRate / 2);
                });

            });

            describe('minValue', () => {

                // bug #77

                it('should be 0', () => {
                    expect(biquadFilterNode.frequency.minValue).to.equal(0);
                });

            });

        });

    });

    describe('createMediaStreamTrackSource()', () => {

        // bug #121

        it('should not be implemented', () => {
            expect(audioContext.createMediaStreamTrackSource).to.be.undefined;
        });

    });

    describe('createWaveShaper()', () => {

        describe('curve', () => {

            // bug #104

            it('should throw an InvalidAccessError when assigning a curve with less than two samples', (done) => {
                const waveShaperNode = audioContext.createWaveShaper();

                try {
                    waveShaperNode.curve = new Float32Array([ 1 ]);
                } catch (err) {
                    expect(err.code).to.equal(15);
                    expect(err.name).to.equal('InvalidAccessError');

                    done();
                }
            });

        });

    });

    describe('resume()', () => {

        afterEach(() => {
            // Create a closeable AudioContext to align the behaviour with other tests.
            audioContext = new AudioContext();
        });

        beforeEach(() => audioContext.close());

        // bug #55

        it('should throw an InvalidAccessError with a closed AudioContext', (done) => {
            audioContext
                .resume()
                .catch((err) => {
                    expect(err.code).to.equal(15);
                    expect(err.name).to.equal('InvalidAccessError');

                    done();
                });
        });

    });

});
