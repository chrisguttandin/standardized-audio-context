import { spy } from 'sinon';

describe('audioContextConstructor', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('outputLatency', () => {

        // bug #40

        it('should not be implemented', () => {
            expect(audioContext.outputLatency).to.be.undefined;
        });

    });

    describe('state', () => {

        // bug #34

        it('should be set to running right away', () => {
            expect(audioContext.state).to.equal('running');
        });

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

        // bug #37

        it('should have a channelCount of 1', () => {
            const analyserNode = audioContext.createAnalyser();

            expect(analyserNode.channelCount).to.equal(1);
        });

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

    describe('createBufferSource()', () => {

        describe('stop()', () => {

            // bug #44

            it('should throw a DOMException', () => {
                const audioBufferSourceNode = audioContext.createBufferSource();

                expect(() => audioBufferSourceNode.stop(-1)).to.throw(DOMException);
            });

        });

    });

    describe('createConvolver()', () => {

        let convolverNode;

        beforeEach(() => {
            convolverNode = audioContext.createConvolver();
        });

        describe('buffer', () => {

            // bug #116

            it('should not allow to reassign the buffer to another buffer', () => {
                convolverNode.buffer = audioContext.createBuffer(2, 100, 44100);

                expect(() => {
                    convolverNode.buffer = audioContext.createBuffer(2, 100, 44100);
                }).to.throw(DOMException);
            });

        });

    });

    describe('createMediaStreamTrackSource()', () => {

        // bug #121

        it('should not be implemented', () => {
            expect(audioContext.createMediaStreamTrackSource).to.be.undefined;
        });

    });

    describe('createPanner()', () => {

        let pannerNode;

        beforeEach(() => {
            pannerNode = audioContext.createPanner();
        });

        describe('coneOuterGain', () => {

            // bug #127

            it('should not throw an error', () => {
                pannerNode.coneOuterGain = 3;
            });

        });

        describe('rolloffFactor', () => {

            // bug #130

            it('should not throw an error', () => {
                pannerNode.rolloffFactor = -10;
            });

        });

    });

    describe('decodeAudioData()', () => {

        // bug #6

        it('should not call the errorCallback at all', (done) => {
            const errorCallback = spy();

            audioContext.decodeAudioData(null, () => {}, errorCallback);

            setTimeout(() => {
                expect(errorCallback).to.have.not.been.called;

                done();
            }, 1000);
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
