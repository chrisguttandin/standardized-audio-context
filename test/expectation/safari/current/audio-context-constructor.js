import { expect } from 'chai';

describe('audioContextConstructor', () => {
    describe('without a constructed AudioContext', () => {
        // bug #192

        it('should throw a SyntaxError', (done) => {
            try {
                new AudioContext({ sampleRate: 0 });
            } catch (err) {
                expect(err.code).to.equal(12);
                expect(err.name).to.equal('SyntaxError');

                done();
            }
        });
    });

    describe('with a constructed AudioContext', () => {
        let audioContext;

        afterEach(() => audioContext.close());

        beforeEach(() => {
            audioContext = new AudioContext();
        });

        describe('audioWorklet', () => {
            describe('addModule()', () => {
                describe('with a module which contains an import statement', () => {
                    // bug #176

                    it('should throw an error', function (done) {
                        this.timeout(10000);

                        audioContext.audioWorklet
                            .addModule('base/test/fixtures/gibberish-processor.js')
                            .then(() => new AudioWorkletNode(audioContext, 'gibberish-processor'))
                            .catch((err) => {
                                expect(err.code).to.equal(11);
                                expect(err.name).to.equal('InvalidStateError');

                                done();
                            });
                    });
                });

                describe('with an unparsable module', () => {
                    // bug #190

                    it('should not throw an error', function () {
                        this.timeout(10000);

                        return audioContext.audioWorklet.addModule('base/test/fixtures/unparsable-processor.xs');
                    });
                });
            });
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
});
