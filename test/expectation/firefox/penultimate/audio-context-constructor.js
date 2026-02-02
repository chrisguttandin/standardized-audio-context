import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { loadFixtureAsArrayBuffer } from '../../../helper/load-fixture';
import { spy } from 'sinon';

describe('audioContextConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    describe('without a constructed AudioContext', () => {
        // bug #51

        it('should allow to set the latencyHint to an unsupported value', () => {
            audioContext = new AudioContext({ latencyHint: 'negative' });
        });
    });

    describe('with a constructed AudioContext', () => {
        beforeEach(() => {
            audioContext = new AudioContext();
        });

        describe('audioWorklet', () => {
            describe('addModule()', () => {
                describe('with an unparsable module', () => {
                    let url;

                    afterEach(() => {
                        URL.revokeObjectURL(url);
                    });

                    beforeEach(async () => {
                        url = URL.createObjectURL(
                            await fetch(new URL('../../../fixtures/unparsable-processor.js', import.meta.url))
                                .then((response) => response.text())
                                .then((text) => text.replace("// some 'unparsable' syntax ()", "some 'unparsable' syntax ()"))
                                .then((text) => new Blob([text], { type: 'application/javascript; charset=utf-8' }))
                        );
                    });

                    // bug #182

                    it('should return a promise which rejects a SyntaxError', () => {
                        return audioContext.audioWorklet.addModule(url).then(
                            () => {
                                throw new Error('This should never be called.');
                            },
                            (err) => {
                                expect(err).to.be.an.instanceOf(SyntaxError);
                            }
                        );
                    });
                });
            });
        });

        describe('destination', () => {
            describe('numberOfOutputs', () => {
                // bug #168

                it('should be zero', () => {
                    expect(audioContext.destination.numberOfOutputs).to.equal(0);
                });
            });
        });

        describe('listener', () => {
            // bug #117

            it('should not be implemented', () => {
                expect(audioContext.listener.forwardX).to.be.undefined;
                expect(audioContext.listener.forwardY).to.be.undefined;
                expect(audioContext.listener.forwardZ).to.be.undefined;
                expect(audioContext.listener.positionX).to.be.undefined;
                expect(audioContext.listener.positionY).to.be.undefined;
                expect(audioContext.listener.positionZ).to.be.undefined;
                expect(audioContext.listener.upX).to.be.undefined;
                expect(audioContext.listener.upY).to.be.undefined;
                expect(audioContext.listener.upZ).to.be.undefined;
            });
        });

        describe('playoutStats', () => {
            // bug #203

            it('should not be implemented', () => {
                expect(audioContext.playoutStats).to.be.undefined;
            });
        });

        describe('createBiquadFilter()', () => {
            let biquadFilterNode;

            beforeEach(() => {
                biquadFilterNode = audioContext.createBiquadFilter();
            });

            describe('detune', () => {
                describe('automationRate', () => {
                    // bug #84

                    it('should not be implemented', () => {
                        expect(biquadFilterNode.detune.automationRate).to.be.undefined;
                    });
                });
            });

            describe('detune', () => {
                describe('maxValue', () => {
                    // bug #78

                    it('should be the largest possible positive float value', () => {
                        expect(biquadFilterNode.detune.maxValue).to.equal(3.4028234663852886e38);
                    });
                });

                describe('minValue', () => {
                    // bug #78

                    it('should be the smallest possible negative float value', () => {
                        expect(biquadFilterNode.detune.minValue).to.equal(-3.4028234663852886e38);
                    });
                });
            });

            describe('frequency', () => {
                describe('minValue', () => {
                    // bug #77

                    it('should be the negative nyquist frequency', () => {
                        expect(biquadFilterNode.frequency.minValue).to.equal(-(audioContext.sampleRate / 2));
                    });
                });
            });

            describe('gain', () => {
                describe('maxValue', () => {
                    // bug #79

                    it('should be the largest possible positive float value', () => {
                        expect(biquadFilterNode.gain.maxValue).to.equal(3.4028234663852886e38);
                    });
                });
            });
        });

        describe('createIIRFilter()', () => {
            let iIRFilterNode;

            beforeEach(() => {
                iIRFilterNode = audioContext.createIIRFilter([1], [1]);
            });

            describe('getFrequencyResponse()', () => {
                // bug #23

                it('should not throw an InvalidAccessError', () => {
                    iIRFilterNode.getFrequencyResponse(new Float32Array([1]), new Float32Array(0), new Float32Array(1));
                });

                // bug #24

                it('should not throw an InvalidAccessError', () => {
                    iIRFilterNode.getFrequencyResponse(new Float32Array([1]), new Float32Array(1), new Float32Array(0));
                });
            });
        });

        describe('createGain()', () => {
            describe('gain', () => {
                let gainNode;

                beforeEach(() => {
                    gainNode = audioContext.createGain();
                });

                describe('cancelAndHoldAtTime()', () => {
                    // bug #28

                    it('should not be implemented', () => {
                        expect(gainNode.gain.cancelAndHoldAtTime).to.be.undefined;
                    });
                });

                describe('setValueCurveAtTime()', () => {
                    // bug #25

                    it('should not allow to use setValueCurveAtTime after calling cancelScheduledValues', () => {
                        gainNode.gain.setValueCurveAtTime([1, 1], 0, 1);
                        gainNode.gain.cancelScheduledValues(0.2);
                        expect(() => {
                            gainNode.gain.setValueCurveAtTime([1, 1], 0.4, 1);
                        }).to.throw(Error);
                    });
                });
            });
        });

        describe('createOscillator()', () => {
            let oscillatorNode;

            beforeEach(() => {
                oscillatorNode = audioContext.createOscillator();
            });

            describe('detune', () => {
                describe('maxValue', () => {
                    // bug #81

                    it('should be the largest possible positive float value', () => {
                        expect(oscillatorNode.detune.maxValue).to.equal(3.4028234663852886e38);
                    });
                });

                describe('minValue', () => {
                    // bug #81

                    it('should be the smallest possible negative float value', () => {
                        expect(oscillatorNode.detune.minValue).to.equal(-3.4028234663852886e38);
                    });
                });
            });
        });

        describe('decodeAudioData()', () => {
            // bug #6

            it('should not call the errorCallback at all', () => {
                const errorCallback = spy();

                audioContext
                    .decodeAudioData(null, () => {}, errorCallback)
                    .catch(() => {
                        // Ignore the rejected error.
                    });

                return new Promise((resolve) => {
                    setTimeout(() => {
                        expect(errorCallback).to.have.not.been.called;

                        resolve();
                    }, 1000);
                });
            });

            // bug #43

            it('should not throw a DataCloneError', () => {
                return loadFixtureAsArrayBuffer('1000-frames-of-noise-stereo.wav').then((arrayBuffer) => {
                    audioContext
                        .decodeAudioData(arrayBuffer)
                        .then(() => audioContext.decodeAudioData(arrayBuffer))
                        .then(
                            () => {
                                throw new Error('This should never be called.');
                            },
                            (err) => {
                                expect(err.code).to.not.equal(25);
                                expect(err.name).to.not.equal('DataCloneError');
                            }
                        );
                });
            });
        });
    });
});
