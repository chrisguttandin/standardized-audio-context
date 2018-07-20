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

            // bug #59

            it('should not be implemented', () => {
                expect(audioContext.audioWorklet).to.be.undefined;
            });

        });

        describe('baseLatency', () => {

            // bug #39

            it('should not be implemented', () => {
                expect(audioContext.baseLatency).to.be.undefined;
            });

        });

        describe('outputLatency', () => {

            // bug #40

            it('should not be implemented', () => {
                expect(audioContext.outputLatency).to.be.undefined;
            });

        });

        describe('close()', () => {

            // bug #35

            it('should not throw an error if it was closed before', () => {
                return audioContext
                    .close()
                    .then(() => audioContext.close());
            });

        });

        describe('createAnalyser()', () => {

            // bug #37

            it('should have a channelCount of 1', () => {
                const analyserNode = audioContext.createAnalyser();

                expect(analyserNode.channelCount).to.equal(1);
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

                describe('maxValue', () => {

                    // bug #78

                    it('should be positive infinity', () => {
                        expect(biquadFilterNode.detune.maxValue).to.equal(Number.POSITIVE_INFINITY);
                    });

                });

                describe('minValue', () => {

                    // bug #78

                    it('should be negative infinity', () => {
                        expect(biquadFilterNode.detune.minValue).to.equal(Number.NEGATIVE_INFINITY);
                    });

                });

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

                    it('should be the negative nyquist frequency', () => {
                        expect(biquadFilterNode.frequency.minValue).to.equal(-(audioContext.sampleRate / 2));
                    });

                });

            });

            describe('gain', () => {

                describe('maxValue', () => {

                    // bug #79

                    it('should be positive infinity', () => {
                        expect(biquadFilterNode.gain.maxValue).to.equal(Number.POSITIVE_INFINITY);
                    });

                });

                describe('minValue', () => {

                    // bug #79

                    it('should be negative infinity', () => {
                        expect(biquadFilterNode.gain.minValue).to.equal(Number.NEGATIVE_INFINITY);
                    });

                });

            });

            describe('Q', () => {

                describe('maxValue', () => {

                    // bug #80

                    it('should be positive infinity', () => {
                        expect(biquadFilterNode.Q.maxValue).to.equal(Number.POSITIVE_INFINITY);
                    });

                });

                describe('minValue', () => {

                    // bug #80

                    it('should be negative infinity', () => {
                        expect(biquadFilterNode.Q.minValue).to.equal(Number.NEGATIVE_INFINITY);
                    });

                });

            });

            describe('getFrequencyResponse()', () => {

                // bug #68

                it('should throw no error', () => {
                    biquadFilterNode.getFrequencyResponse(new Float32Array(), new Float32Array(1), new Float32Array(1));
                });

            });

        });

        describe('createBuffer()', () => {

            // bug #42

            describe('copyFromChannel()/copyToChannel()', () => {

                let audioBuffer;

                beforeEach(() => {
                    audioBuffer = audioContext.createBuffer(2, 100, 44100);
                });

                it('should not allow to copy only a part to the source', () => {
                    const source = new Float32Array(10);

                    expect(() => {
                        audioBuffer.copyToChannel(source, 0, 95);
                    }).to.throw(Error);
                });

                it('should not allow to copy only a part of the destination', () => {
                    const destination = new Float32Array(10);

                    expect(() => {
                        audioBuffer.copyFromChannel(destination, 0, 95);
                    }).to.throw(Error);
                });

            });

        });

        describe('createBufferSource()', () => {

            describe('buffer', () => {

                // bug #72

                it('should allow to assign the buffer multiple times', () => {
                    const bufferSourceNode = audioContext.createBufferSource();

                    bufferSourceNode.buffer = audioContext.createBuffer(2, 100, 44100);
                    bufferSourceNode.buffer = audioContext.createBuffer(2, 100, 44100);
                });

            });

            describe('playbackRate', () => {

                let bufferSourceNode;

                beforeEach(() => {
                    bufferSourceNode = audioContext.createBufferSource();
                });

                describe('maxValue', () => {

                    // bug #73

                    it('should be positive infinity', () => {
                        expect(bufferSourceNode.playbackRate.maxValue).to.equal(Number.POSITIVE_INFINITY);
                    });

                });

                describe('minValue', () => {

                    // bug #73

                    it('should be negative infinity', () => {
                        expect(bufferSourceNode.playbackRate.minValue).to.equal(Number.NEGATIVE_INFINITY);
                    });

                });

                describe('exponentialRampToValueAtTime()', () => {

                    // bug #45

                    it('should throw a DOMException', () => {
                        expect(() => {
                            bufferSourceNode.playbackRate.exponentialRampToValueAtTime(0, 1);
                        }).to.throw(DOMException);
                    });

                });

            });

            describe('stop()', () => {

                // bug #44

                it('should throw a DOMException', () => {
                    const bufferSourceNode = audioContext.createBufferSource();

                    expect(() => bufferSourceNode.stop(-1)).to.throw(DOMException);
                });

            });

        });

        describe('createChannelMerger()', () => {

            // bug #16

            it('should allow to set the channelCount', () => {
                const channelMergerNode = audioContext.createChannelMerger();

                channelMergerNode.channelCountMode = '2';
            });

            it('should allow to set the channelCountMode', () => {
                const channelMergerNode = audioContext.createChannelMerger();

                channelMergerNode.channelCountMode = 'max';
            });

        });

        describe('createConstantSource()', () => {

            let constantSourceNode;

            beforeEach(() => {
                constantSourceNode = audioContext.createConstantSource();
            });

            describe('offset', () => {

                describe('maxValue', () => {

                    // bug #75

                    it('should be positive infinity', () => {
                        expect(constantSourceNode.offset.maxValue).to.equal(Number.POSITIVE_INFINITY);
                    });

                });

                describe('minValue', () => {

                    // bug #75

                    it('should be negative infinity', () => {
                        expect(constantSourceNode.offset.minValue).to.equal(Number.NEGATIVE_INFINITY);
                    });

                });

            });

            describe('start()', () => {

                // bug #44

                it('should throw a DOMException', () => {
                    expect(() => constantSourceNode.start(-1)).to.throw(DOMException);
                });

            });

            describe('stop()', () => {

                // bug #44

                it('should throw a DOMException', () => {
                    expect(() => constantSourceNode.stop(-1)).to.throw(DOMException);
                });

            });

        });

        describe('createGain()', () => {

            describe('gain', () => {

                let gainNode;

                beforeEach(() => {
                    gainNode = audioContext.createGain();
                });

                describe('maxValue', () => {

                    // bug #74

                    it('should be positive infinity', () => {
                        expect(gainNode.gain.maxValue).to.equal(Number.POSITIVE_INFINITY);
                    });

                });

                describe('minValue', () => {

                    // bug #74

                    it('should be negative infinity', () => {
                        expect(gainNode.gain.minValue).to.equal(Number.NEGATIVE_INFINITY);
                    });

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
                        gainNode.gain.setValueCurveAtTime(new Float32Array([ 1, 1 ]), 0, 1);
                        gainNode.gain.cancelScheduledValues(0.2);
                        expect(() => {
                            gainNode.gain.setValueCurveAtTime(new Float32Array([ 1, 1 ]), 0.4, 1);
                        }).to.throw(Error);
                    });

                });

            });

        });

        describe('createMediaElementSource()', () => {

            describe('mediaElement', () => {

                let mediaElementAudioSourceNode;

                beforeEach(() => {
                    mediaElementAudioSourceNode = audioContext.createMediaElementSource(new Audio());
                });

                // bug #63

                it('should not be implemented', () => {
                    expect(mediaElementAudioSourceNode.mediaElement).to.be.undefined;
                });

            });

        });

        describe('createOscillator()', () => {

            describe('detune', () => {

                let oscillatorNode;

                beforeEach(() => {
                    oscillatorNode = audioContext.createOscillator();
                });

                describe('maxValue', () => {

                    // bug #81

                    it('should be positive infinity', () => {
                        expect(oscillatorNode.detune.maxValue).to.equal(Number.POSITIVE_INFINITY);
                    });

                });

                describe('minValue', () => {

                    // bug #81

                    it('should be negative infinity', () => {
                        expect(oscillatorNode.detune.minValue).to.equal(Number.NEGATIVE_INFINITY);
                    });

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

        describe('getOutputTimestamp()', () => {

            // bug #38

            it('should not be implemented', () => {
                expect(audioContext.getOutputTimestamp).to.be.undefined;
            });

        });

    });

});
