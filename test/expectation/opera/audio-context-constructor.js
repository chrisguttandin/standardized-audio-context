import { spy } from 'sinon';

describe('audioContextConstructor', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    describe('without a constructed AudioContext', () => {

        // bug #150

        it('should not allow to set the sampleRate', () => {
            const sampleRate = 16000;

            audioContext = new AudioContext({ sampleRate });

            expect(audioContext.sampleRate).to.not.equal(sampleRate);
        });

    });

    describe('with a constructed AudioContext', () => {

        beforeEach(() => {
            audioContext = new AudioContext();
        });

        describe('audioWorklet', () => {

            describe('addModule()', () => {

                describe('with an empty string as name', () => {

                    // bug #134

                    it('should throw no error', function () {
                        this.timeout(10000);

                        return audioContext.audioWorklet.addModule('base/test/fixtures/empty-string-processor.js');
                    });

                });

                describe('with a duplicate name', () => {

                    beforeEach(function () {
                        this.timeout(10000);

                        return audioContext.audioWorklet.addModule('base/test/fixtures/gain-processor.js');
                    });

                    // bug #135

                    it('should not throw an error', function () {
                        this.timeout(10000);

                        return audioContext.audioWorklet.addModule('base/test/fixtures/duplicate-gain-processor.js');
                    });

                });

                describe('with a processor without a valid constructor', () => {

                    // bug #136

                    it('should not throw an error', function () {
                        this.timeout(10000);

                        return audioContext.audioWorklet.addModule('base/test/fixtures/unconstructible-processor.js');
                    });

                });

                describe('with a processor without a prototype', () => {

                    // Bug #137

                    it('should not throw an error', function () {
                        this.timeout(10000);

                        return audioContext.audioWorklet.addModule('base/test/fixtures/prototypeless-processor.js');
                    });

                });

                describe('with a processor without a process function', () => {

                    // Bug #138

                    it('should not throw an error', function () {
                        this.timeout(10000);

                        return audioContext.audioWorklet.addModule('base/test/fixtures/processless-processor.js');
                    });

                });

                describe('with a processor with an invalid parameterDescriptors property', () => {

                    // Bug #139

                    it('should not throw an error', function () {
                        this.timeout(10000);

                        return audioContext.audioWorklet.addModule('base/test/fixtures/invalid-parameter-descriptors-property-processor.js');
                    });

                });

            });

        });

        describe('outputLatency', () => {

            // bug #40

            it('should not be implemented', () => {
                expect(audioContext.outputLatency).to.be.undefined;
            });

        });

        describe('state', () => {

            // @todo For some reason this test does currently not pass when running on BrowserStack.
            if (!process.env.TRAVIS) { // eslint-disable-line no-undef

                // bug #34

                it('should be set to running right away', () => {
                    expect(audioContext.state).to.equal('running');
                });

            }

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

        describe('createBufferSource()', () => {

            describe('stop()', () => {

                // bug #44

                it('should throw a DOMException', () => {
                    const audioBufferSourceNode = audioContext.createBufferSource();

                    expect(() => audioBufferSourceNode.stop(-1)).to.throw(DOMException).with.property('name', 'InvalidStateError');
                });

            });

        });

        describe('createMediaStreamTrackSource()', () => {

            // bug #121

            it('should not be implemented', () => {
                expect(audioContext.createMediaStreamTrackSource).to.be.undefined;
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

});
