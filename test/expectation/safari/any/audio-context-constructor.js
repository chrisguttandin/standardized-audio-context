import { loadFixtureAsArrayBuffer } from '../../../helper/load-fixture';

describe('audioContextConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    describe('without a constructed AudioContext', () => {
        // bug #51

        it('should allow to set the latencyHint to an unsupported value', () => {
            audioContext = new webkitAudioContext({ latencyHint: 'negative' }); // eslint-disable-line new-cap, no-undef
        });

        // bug #150

        it('should not allow to set the sampleRate', () => {
            const sampleRate = 16000;

            audioContext = new webkitAudioContext({ sampleRate }); // eslint-disable-line new-cap, no-undef

            expect(audioContext.sampleRate).to.not.equal(sampleRate);
        });
    });

    describe('with a constructed AudioContext', () => {
        beforeEach(() => {
            audioContext = new webkitAudioContext(); // eslint-disable-line new-cap, no-undef
        });

        it('should not provide an unprefixed constructor', () => {
            expect(window.AudioContext).to.be.undefined;
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

        describe('destination', () => {
            describe('channelCount', () => {
                // bug #169

                it('should throw an error', () => {
                    expect(() => {
                        audioContext.destination.channelCount = 1;
                    }).to.throw(DOMException);
                });
            });

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

        describe('outputLatency', () => {
            // bug #40

            it('should not be implemented', () => {
                expect(audioContext.outputLatency).to.be.undefined;
            });
        });

        describe('createAnalyser()', () => {
            // bug #41

            it('should throw a SyntaxError when calling connect() with a node of another AudioContext', (done) => {
                const analyserNode = audioContext.createAnalyser();
                const anotherAudioContext = new webkitAudioContext(); // eslint-disable-line new-cap, no-undef

                try {
                    analyserNode.connect(anotherAudioContext.destination);
                } catch (err) {
                    expect(err.code).to.equal(12);
                    expect(err.name).to.equal('SyntaxError');

                    done();
                } finally {
                    anotherAudioContext.close();
                }
            });

            // bug #58

            it('should throw a SyntaxError when calling connect() with an AudioParam of another AudioContext', (done) => {
                const analyserNode = audioContext.createAnalyser();
                const anotherAudioContext = new webkitAudioContext(); // eslint-disable-line new-cap, no-undef
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

            describe('getFloatTimeDomainData()', () => {
                // bug #36

                it('should not have a getFloatTimeDomainData method', () => {
                    const analyserNode = audioContext.createAnalyser();

                    expect(analyserNode.getFloatTimeDomainData).to.be.undefined;
                });
            });
        });

        describe('createBufferSource()', () => {
            // bug #18

            it('should not allow calls to stop() of an AudioBufferSourceNode scheduled for stopping', () => {
                const audioBuffer = audioContext.createBuffer(1, 100, 44100);
                const audioBufferSourceNode = audioContext.createBufferSource();

                audioBufferSourceNode.buffer = audioBuffer;
                audioBufferSourceNode.connect(audioContext.destination);
                audioBufferSourceNode.start();
                audioBufferSourceNode.stop(audioContext.currentTime + 1);
                expect(() => {
                    audioBufferSourceNode.stop();
                }).to.throw(Error);
            });

            describe('buffer', () => {
                // bug #72

                it('should allow to assign the buffer multiple times', () => {
                    const audioBufferSourceNode = audioContext.createBufferSource();

                    audioBufferSourceNode.buffer = audioContext.createBuffer(2, 100, 44100);
                    audioBufferSourceNode.buffer = audioContext.createBuffer(2, 100, 44100);
                });
            });

            describe('detune', () => {
                let audioBufferSourceNode;

                beforeEach(() => {
                    audioBufferSourceNode = audioContext.createBufferSource();
                });

                // bug #149

                it('should not be implemented', () => {
                    expect(audioBufferSourceNode.detune).to.be.undefined;
                });
            });

            describe('playbackRate', () => {
                let audioBufferSourceNode;

                beforeEach(() => {
                    audioBufferSourceNode = audioContext.createBufferSource();
                });

                describe('name', () => {
                    // bug #153

                    it('should export the name as a property', () => {
                        expect(audioBufferSourceNode.playbackRate.name).to.equal('playbackRate');
                    });
                });
            });

            describe('stop()', () => {
                // bug #44

                it('should throw a DOMException when called with a negavtive value', () => {
                    const audioBufferSourceNode = audioContext.createBufferSource();

                    expect(() => audioBufferSourceNode.stop(-1))
                        .to.throw(DOMException)
                        .with.property('name', 'InvalidStateError');
                });
            });
        });

        describe('createConstantSource()', () => {
            // bug #62

            it('should not be implemented', () => {
                expect(audioContext.createConstantSource).to.be.undefined;
            });
        });

        describe('createConvolver()', () => {
            let convolverNode;

            beforeEach(() => {
                convolverNode = audioContext.createConvolver();
            });

            describe('buffer', () => {
                // bug #115

                it('should not allow to assign the buffer to null', () => {
                    const audioBuffer = audioContext.createBuffer(2, 100, 44100);

                    convolverNode.buffer = audioBuffer;
                    convolverNode.buffer = null;

                    expect(convolverNode.buffer).to.equal(audioBuffer);
                });
            });
        });

        describe('createDynamicsCompressor()', () => {
            let dynamicsCompressorNode;

            beforeEach(() => {
                dynamicsCompressorNode = audioContext.createDynamicsCompressor();
            });

            describe('reduction', () => {
                // bug #111

                it('should return an implementation of the AudioParam interface', () => {
                    expect(dynamicsCompressorNode.reduction.cancelAndHoldAtTime).to.be.undefined;
                    expect(dynamicsCompressorNode.reduction.cancelScheduledValues).to.be.a('function');
                    expect(dynamicsCompressorNode.reduction.defaultValue).to.be.a('number');
                    expect(dynamicsCompressorNode.reduction.exponentialRampToValueAtTime).to.be.a('function');
                    expect(dynamicsCompressorNode.reduction.linearRampToValueAtTime).to.be.a('function');
                    expect(dynamicsCompressorNode.reduction.maxValue).to.be.a('number');
                    expect(dynamicsCompressorNode.reduction.minValue).to.be.a('number');
                    expect(dynamicsCompressorNode.reduction.setTargetAtTime).to.be.a('function');
                    expect(dynamicsCompressorNode.reduction.setValueAtTime).to.be.a('function');
                    expect(dynamicsCompressorNode.reduction.setValueCurveAtTime).to.be.a('function');
                    expect(dynamicsCompressorNode.reduction.value).to.be.a('number');
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
            });
        });

        describe('createIIRFilter()', () => {
            // bug #9

            it('should not be implemented', () => {
                expect(audioContext.createIIRFilter).to.be.undefined;
            });
        });

        describe('createMediaStreamSource()', () => {
            describe('with a mediaStream with two audio tracks', () => {
                let audioBufferSourceNode;
                let gainNodes;
                let mediaStream;
                let mediaStreamAudioDestinationNodes;

                afterEach(() => {
                    audioBufferSourceNode.stop();

                    audioBufferSourceNode.disconnect(gainNodes[0]);
                    audioBufferSourceNode.disconnect(gainNodes[1]);
                    gainNodes[0].disconnect(mediaStreamAudioDestinationNodes[0]);
                    gainNodes[1].disconnect(mediaStreamAudioDestinationNodes[1]);
                });

                beforeEach(() => {
                    audioBufferSourceNode = audioContext.createBufferSource();
                    gainNodes = [audioContext.createGain(), audioContext.createGain()];
                    mediaStreamAudioDestinationNodes = [
                        audioContext.createMediaStreamDestination(),
                        audioContext.createMediaStreamDestination()
                    ];

                    const audioBuffer = audioContext.createBuffer(1, 2, audioContext.sampleRate);

                    audioBuffer.getChannelData(0)[0] = 1;
                    audioBuffer.getChannelData(0)[1] = 1;

                    audioBufferSourceNode.buffer = audioBuffer;
                    audioBufferSourceNode.loop = true;

                    audioBufferSourceNode.connect(gainNodes[0]).connect(mediaStreamAudioDestinationNodes[0]);
                    audioBufferSourceNode.connect(gainNodes[1]).connect(mediaStreamAudioDestinationNodes[1]);

                    audioBufferSourceNode.start();

                    const audioStreamTracks = mediaStreamAudioDestinationNodes.map(({ stream }) => stream.getAudioTracks()[0]);

                    if (audioStreamTracks[0].id > audioStreamTracks[1].id) {
                        mediaStream = mediaStreamAudioDestinationNodes[0].stream;

                        gainNodes[0].gain.value = 0;
                        mediaStream.addTrack(audioStreamTracks[1]);
                    } else {
                        mediaStream = mediaStreamAudioDestinationNodes[1].stream;

                        gainNodes[1].gain.value = 0;
                        mediaStream.addTrack(audioStreamTracks[0]);
                    }
                });

                // bug #159

                it('should pick the first track', (done) => {
                    const channelData = new Float32Array(512);
                    const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(mediaStream);
                    const scriptProcessorNode = audioContext.createScriptProcessor(512);

                    scriptProcessorNode.onaudioprocess = ({ inputBuffer }) => {
                        inputBuffer.copyFromChannel(channelData, 0);

                        for (let i = 0; i < 512; i += 1) {
                            if (channelData[i] !== 0) {
                                mediaStreamAudioSourceNode.disconnect(scriptProcessorNode);

                                done(new Error('The signal is expected to be zero at all time.'));

                                break;
                            }
                        }
                    };

                    mediaStreamAudioSourceNode.connect(scriptProcessorNode);

                    setTimeout(() => {
                        mediaStreamAudioSourceNode.disconnect(scriptProcessorNode);

                        done();
                    }, 1000);
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

            describe('channelCount', () => {
                // bug #125

                it('should not throw an error', () => {
                    pannerNode.channelCount = 4;
                });
            });

            describe('channelCountMode', () => {
                // bug #126

                it('should not throw an error', () => {
                    pannerNode.channelCountMode = 'max';
                });
            });

            describe('coneOuterGain', () => {
                // bug #127

                it('should not throw an error', () => {
                    pannerNode.coneOuterGain = 3;
                });
            });

            describe('maxDistance', () => {
                // bug #128

                it('should not throw an error', () => {
                    pannerNode.maxDistance = -10;
                });
            });

            describe('orientationX', () => {
                // bug #124

                it('should not be implemented', () => {
                    expect(pannerNode.orientationX).to.be.undefined;
                });
            });

            describe('refDistance', () => {
                // bug #129

                it('should not throw an error', () => {
                    pannerNode.refDistance = -10;
                });
            });

            describe('rolloffFactor', () => {
                // bug #130

                it('should not throw an error', () => {
                    pannerNode.rolloffFactor = -10;
                });
            });
        });

        describe('createPeriodicWave()', () => {
            describe('with regular arrays', () => {
                // bug #180

                it('should throw an error', () => {
                    expect(() => {
                        audioContext.createPeriodicWave([1, 1], [1, 1]);
                    }).to.throw(TypeError);
                });
            });

            describe('with a real and an imag argument of only one value', () => {
                // bug #181

                it('should return a PeriodicWave', () => {
                    const periodicWave = audioContext.createPeriodicWave(new Float32Array([1]), new Float32Array([1]));

                    expect(periodicWave).to.be.an.instanceOf(PeriodicWave);
                });
            });
        });

        describe('createStereoPanner()', () => {
            // bug #105

            it('should not be implemented', () => {
                expect(audioContext.createStereoPanner).to.be.undefined;
            });
        });

        describe('decodeAudioData()', () => {
            // bug #1

            it('should require the success callback function as a parameter', async function () {
                this.timeout(10000);

                const arrayBuffer = await loadFixtureAsArrayBuffer('1000-frames-of-noise-stereo.wav');

                expect(() => {
                    audioContext.decodeAudioData(arrayBuffer);
                }).to.throw(TypeError, 'Not enough arguments');
            });

            // bug #4

            it('should throw null when asked to decode an unsupported file', function (done) {
                this.timeout(10000);

                // PNG files are not supported by any browser :-)
                loadFixtureAsArrayBuffer('one-pixel-of-transparency.png').then((arrayBuffer) => {
                    audioContext.decodeAudioData(
                        arrayBuffer,
                        () => {},
                        (err) => {
                            expect(err).to.be.null;

                            done();
                        }
                    );
                });
            });

            // bug #5

            it('should return an AudioBuffer without copyFromChannel() and copyToChannel() methods', function (done) {
                this.timeout(10000);

                loadFixtureAsArrayBuffer('1000-frames-of-noise-stereo.wav').then((arrayBuffer) => {
                    audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
                        expect(audioBuffer.copyFromChannel).to.be.undefined;
                        expect(audioBuffer.copyToChannel).to.be.undefined;

                        done();
                    });
                });
            });

            // bug #21

            it('should not return a promise', async function () {
                this.timeout(10000);

                const arrayBuffer = await loadFixtureAsArrayBuffer('1000-frames-of-noise-stereo.wav');

                expect(audioContext.decodeAudioData(arrayBuffer, () => {})).to.be.undefined;
            });

            // bug #26

            it('should throw a synchronous error', (done) => {
                try {
                    audioContext.decodeAudioData(null, () => {});
                } catch (err) {
                    done();
                }
            });

            // bug #43

            it('should not throw a DataCloneError', function (done) {
                this.timeout(10000);

                loadFixtureAsArrayBuffer('1000-frames-of-noise-stereo.wav').then((arrayBuffer) => {
                    audioContext.decodeAudioData(arrayBuffer, () => {
                        audioContext.decodeAudioData(arrayBuffer, () => done());
                    });
                });
            });

            // bug #133

            it('should not neuter the arrayBuffer', function (done) {
                this.timeout(10000);

                loadFixtureAsArrayBuffer('1000-frames-of-noise-stereo.wav').then((arrayBuffer) => {
                    audioContext.decodeAudioData(arrayBuffer, () => {
                        expect(arrayBuffer.byteLength).to.not.equal(0);

                        done();
                    });
                });
            });
        });

        describe('getOutputTimestamp()', () => {
            // bug #38

            it('should not be implemented', () => {
                expect(audioContext.getOutputTimestamp).to.be.undefined;
            });
        });

        describe('resume()', () => {
            afterEach(() => {
                // Create a closeable AudioContext to align the behaviour with other tests.
                audioContext = new webkitAudioContext(); // eslint-disable-line new-cap, no-undef
            });

            beforeEach(() => audioContext.close());

            // bug #56

            it('should throw undefined with a closed AudioContext', (done) => {
                audioContext.resume().catch((err) => {
                    expect(err).to.be.undefined;

                    done();
                });
            });
        });

        describe('startRendering()', () => {
            // bug #160

            it('should expose a startRendering method', () => {
                expect(audioContext.startRendering).to.be.a('function');
            });
        });

        describe('suspend()', () => {
            afterEach(() => {
                // Create a closeable AudioContext to align the behaviour with other tests.
                audioContext = new webkitAudioContext(); // eslint-disable-line new-cap, no-undef
            });

            beforeEach(() => audioContext.close());

            // bug #56

            it('should throw undefined with a closed AudioContext', (done) => {
                audioContext.suspend().catch((err) => {
                    expect(err).to.be.undefined;

                    done();
                });
            });
        });
    });
});
