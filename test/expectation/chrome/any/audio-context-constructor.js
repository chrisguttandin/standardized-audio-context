describe('audioContextConstructor', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('audioWorklet', () => {

        describe('addModule()', () => {

            describe('with an empty string as name', () => {

                // bug #134

                it('should not throw an error', function () {
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

            describe('with a processor with an invalid parameterDescriptors property', () => {

                // Bug #139

                it('should not throw an error', function () {
                    this.timeout(10000);

                    return audioContext.audioWorklet.addModule('base/test/fixtures/invalid-parameter-descriptors-property-processor.js');
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

        describe('detune', () => {

            describe('maxValue', () => {

                // bug #78

                it('should be the largest possible positive float value', () => {
                    expect(biquadFilterNode.detune.maxValue).to.equal(3.4028234663852886e+38);
                });

            });

            describe('minValue', () => {

                // bug #78

                it('should be the smallest possible negative float value', () => {
                    expect(biquadFilterNode.detune.minValue).to.equal(-3.4028234663852886e+38);
                });

            });

        });

        describe('gain', () => {

            describe('maxValue', () => {

                // bug #79

                it('should be the largest possible positive float value', () => {
                    expect(biquadFilterNode.gain.maxValue).to.equal(3.4028234663852886e+38);
                });

            });

            describe('minValue', () => {

                // bug #79

                it('should be the smallest possible negative float value', () => {
                    expect(biquadFilterNode.gain.minValue).to.equal(-3.4028234663852886e+38);
                });

            });

        });

    });

    describe('createConvolver()', () => {

        let convolverNode;

        beforeEach(() => {
            convolverNode = audioContext.createConvolver();
        });

        describe('channelCount', () => {

            // bug #166

            it('should throw an error', () => {
                expect(() => {
                    convolverNode.channelCount = 1;
                }).to.throw(DOMException);
            });

        });

        describe('channelCountMode', () => {

            // bug #167

            it('should throw an error', () => {
                expect(() => {
                    convolverNode.channelCountMode = 'explicit';
                }).to.throw(DOMException);
            });

        });

    });

    describe('createDelay()', () => {

        describe('with a delayTime of 128 samples', () => {

            let audioBufferSourceNode;
            let delayNode;
            let gainNode;
            let scriptProcessorNode;

            afterEach(() => {
                audioBufferSourceNode.disconnect(gainNode);
                delayNode.disconnect(gainNode);
                gainNode.disconnect(delayNode);
                gainNode.disconnect(scriptProcessorNode);
                scriptProcessorNode.disconnect(audioContext.destination);
            });

            beforeEach(() => {
                audioBufferSourceNode = audioContext.createBufferSource();
                delayNode = audioContext.createDelay();
                gainNode = audioContext.createGain();
                scriptProcessorNode = audioContext.createScriptProcessor(512);

                const audioBuffer = audioContext.createBuffer(1, 1, audioContext.sampleRate);

                audioBuffer.getChannelData(0)[0] = 2;

                audioBufferSourceNode.buffer = audioBuffer;

                delayNode.delayTime.value = 128 / audioContext.sampleRate;

                gainNode.gain.value = 0.5;

                audioBufferSourceNode
                    .connect(gainNode)
                    .connect(delayNode)
                    .connect(gainNode)
                    .connect(scriptProcessorNode)
                    .connect(audioContext.destination);
            });

            // bug #163

            it('should have a minimum delayTime of 256 samples', (done) => {
                const channelData = new Float32Array(512);

                let offsetOfFirstImpulse = null;

                scriptProcessorNode.onaudioprocess = ({ inputBuffer }) => {
                    inputBuffer.copyFromChannel(channelData, 0);

                    if (offsetOfFirstImpulse !== null) {
                        offsetOfFirstImpulse -= 512;
                    }

                    for (let i = 0; i < 512; i += 1) {
                        if (channelData[i] > 0.99 && channelData[i] < 1.01) {
                            offsetOfFirstImpulse = i;
                        } else if (channelData[i] > 0.49 && channelData[i] < 0.51) {
                            expect(i - offsetOfFirstImpulse).to.equal(256);

                            done();

                            break;
                        }
                    }
                };

                audioBufferSourceNode.start();
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
