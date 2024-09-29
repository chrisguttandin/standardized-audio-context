import { loadFixtureAsArrayBuffer } from '../../../helper/load-fixture';

describe('audioContextConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    describe('with a constructed AudioContext', () => {
        beforeEach(() => {
            audioContext = new webkitAudioContext(); // eslint-disable-line new-cap, no-undef
        });

        it('should not provide an unprefixed constructor', () => {
            expect(window.AudioContext).to.be.undefined;
        });

        describe('createBufferSource()', () => {
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

                describe('maxValue', () => {
                    // bug #73

                    it('should be 1024', () => {
                        expect(audioBufferSourceNode.playbackRate.maxValue).to.equal(1024);
                    });
                });

                describe('minValue', () => {
                    // bug #73

                    it('should be -1024', () => {
                        expect(audioBufferSourceNode.playbackRate.minValue).to.equal(-1024);
                    });
                });

                describe('name', () => {
                    // bug #153

                    it('should export the name as a property', () => {
                        expect(audioBufferSourceNode.playbackRate.name).to.equal('playbackRate');
                    });
                });

                describe('exponentialRampToValueAtTime()', () => {
                    // bug #45

                    it('should not throw any exception', () => {
                        audioBufferSourceNode.playbackRate.exponentialRampToValueAtTime(0, 1);
                    });

                    // bug #187

                    it('should not throw any exception', () => {
                        audioBufferSourceNode.playbackRate.exponentialRampToValueAtTime(1, -1);
                    });
                });
            });

            describe('start()', () => {
                // bug #69

                it('should not ignore calls repeated calls to start()', () => {
                    const audioBufferSourceNode = audioContext.createBufferSource();

                    audioBufferSourceNode.start();
                    audioBufferSourceNode.start();
                });

                // bug #154

                it('should throw a DOMException', () => {
                    const audioBufferSourceNode = audioContext.createBufferSource();
                    const audioBuffer = audioContext.createBuffer(1, 44100, 44100);

                    audioBufferSourceNode.buffer = audioBuffer;

                    expect(() => audioBufferSourceNode.start(0, 2))
                        .to.throw(DOMException)
                        .with.property('name', 'InvalidStateError');
                });
            });

            describe('stop()', () => {
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

                // bug #162

                it('should throw a DOMException when called without a value', () => {
                    const audioBufferSourceNode = audioContext.createBufferSource();

                    audioBufferSourceNode.start();

                    expect(() => audioBufferSourceNode.stop())
                        .to.throw(DOMException)
                        .with.property('name', 'InvalidStateError');
                });
            });
        });

        describe('createChannelSplitter()', () => {
            // bug #96

            it('should have a wrong channelCount', () => {
                const channelSplitterNode = audioContext.createChannelSplitter(6);

                expect(channelSplitterNode.channelCount).to.equal(2);
            });

            // bug #97

            it('should allow to set the channelCount', () => {
                const channelSplitterNode = audioContext.createChannelSplitter();

                channelSplitterNode.channelCount = 6;
                channelSplitterNode.channelCount = 2;
            });

            // bug #29

            it('should have a wrong channelCountMode', () => {
                const channelSplitterNode = audioContext.createChannelSplitter();

                expect(channelSplitterNode.channelCountMode).to.equal('max');
            });

            // bug #30

            it('should allow to set the channelCountMode', () => {
                const channelSplitterNode = audioContext.createChannelSplitter();

                channelSplitterNode.channelCountMode = 'explicit';
                channelSplitterNode.channelCountMode = 'max';
            });

            // bug #31

            it('should have a wrong channelInterpretation', () => {
                const channelSplitterNode = audioContext.createChannelSplitter();

                expect(channelSplitterNode.channelInterpretation).to.equal('speakers');
            });

            // bug #32

            it('should allow to set the channelInterpretation', () => {
                const channelSplitterNode = audioContext.createChannelSplitter();

                channelSplitterNode.channelInterpretation = 'discrete';
                channelSplitterNode.channelInterpretation = 'speakers';
            });
        });

        describe('createDynamicsCompressor()', () => {
            let dynamicsCompressorNode;

            beforeEach(() => {
                dynamicsCompressorNode = audioContext.createDynamicsCompressor();
            });

            describe('channelCount', () => {
                // bug #108

                it('should not throw an error', () => {
                    dynamicsCompressorNode.channelCount = 3;
                });
            });

            describe('channelCountMode', () => {
                // bug #109

                it('should not throw an error', () => {
                    dynamicsCompressorNode.channelCountMode = 'max';
                });
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
            // @todo There is currently no way to disable the autoplay policy on BrowserStack or Sauce Labs.
            // eslint-disable-next-line no-undef
            if (!process.env.CI) {
                // bug #12

                it('should not allow to disconnect a specific destination', (done) => {
                    const analyzer = audioContext.createScriptProcessor(256, 1, 1);
                    const candidate = audioContext.createGain();
                    const dummy = audioContext.createGain();
                    // Bug #95: Safari does not play/loop one sample buffers.
                    const ones = audioContext.createBuffer(1, 2, 44100);
                    const channelData = ones.getChannelData(0);

                    channelData[0] = 1;
                    channelData[1] = 1;

                    const source = audioContext.createBufferSource();

                    source.buffer = ones;
                    source.loop = true;

                    source.connect(candidate).connect(analyzer).connect(audioContext.destination);

                    candidate.connect(dummy);
                    candidate.disconnect(dummy);

                    let numberOfInvocations = 0;

                    analyzer.onaudioprocess = (event) => {
                        numberOfInvocations += 1;

                        const chnnlDt = event.inputBuffer.getChannelData(0);

                        if (Array.prototype.some.call(chnnlDt, (sample) => sample === 1)) {
                            done(new Error('This should never be called.'));
                        }
                    };

                    source.start();

                    setTimeout(() => {
                        source.stop();

                        analyzer.onaudioprocess = null;

                        source.disconnect(candidate);
                        candidate.disconnect(analyzer);
                        analyzer.disconnect(audioContext.destination);

                        expect(numberOfInvocations).to.be.above(0);

                        done();
                    }, 500);
                });
            }

            describe('gain', () => {
                let gainNode;

                beforeEach(() => {
                    gainNode = audioContext.createGain();
                });

                describe('maxValue', () => {
                    // bug #74

                    it('should be 1', () => {
                        expect(gainNode.gain.maxValue).to.equal(1);
                    });
                });

                describe('minValue', () => {
                    // bug #74

                    it('should be 0', () => {
                        expect(gainNode.gain.minValue).to.equal(0);
                    });
                });

                describe('setValueCurveAtTime()', () => {
                    // bug #183

                    it('should not accept a plain array', () => {
                        expect(() => {
                            gainNode.gain.setValueCurveAtTime([1, 1], 0, 1);
                        }).to.throw(TypeError);
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

        describe('createMediaStreamDestination()', () => {
            let mediaStreamAudioDestinationNode;

            beforeEach(() => {
                mediaStreamAudioDestinationNode = audioContext.createMediaStreamDestination();
            });

            describe('numberOfOutpus', () => {
                // bug #174

                it('should be 1', () => {
                    expect(mediaStreamAudioDestinationNode.numberOfOutputs).to.equal(1);
                });
            });
        });

        describe('createMediaStreamSource()', () => {
            // @todo There is currently no way to disable the autoplay policy on BrowserStack or Sauce Labs.
            // eslint-disable-next-line no-undef
            if (!process.env.CI) {
                // bug #165

                it('output silence after being disconnected', function (done) {
                    this.timeout(10000);

                    const mediaStreamAudioDestinationNode = audioContext.createMediaStreamDestination();
                    const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(mediaStreamAudioDestinationNode.stream);
                    const oscillatorNode = audioContext.createOscillator();
                    const scriptProcessorNode = audioContext.createScriptProcessor(256, 1, 1);

                    oscillatorNode.connect(mediaStreamAudioDestinationNode);
                    mediaStreamAudioSourceNode.connect(scriptProcessorNode).connect(audioContext.destination);

                    oscillatorNode.start();

                    setTimeout(() => {
                        mediaStreamAudioSourceNode.disconnect(scriptProcessorNode);

                        setTimeout(() => {
                            mediaStreamAudioSourceNode.connect(scriptProcessorNode);

                            let numberOfInvocations = 0;

                            scriptProcessorNode.onaudioprocess = (event) => {
                                numberOfInvocations += 1;

                                const channelData = event.inputBuffer.getChannelData(0);

                                if (Array.prototype.some.call(channelData, (sample) => sample !== 0)) {
                                    done(new Error('This should never be called.'));
                                }
                            };

                            setTimeout(() => {
                                oscillatorNode.stop();

                                scriptProcessorNode.onaudioprocess = null;

                                oscillatorNode.disconnect(mediaStreamAudioDestinationNode);
                                mediaStreamAudioSourceNode.disconnect(scriptProcessorNode);
                                scriptProcessorNode.disconnect(audioContext.destination);

                                expect(numberOfInvocations).to.be.above(0);

                                done();
                            }, 2000);
                        }, 2000);
                    }, 500);
                });

                describe('with an audio track that gets removed from the mediaStream after construction', () => {
                    let mediaStream;
                    let mediaStreamTracks;
                    let oscillatorNode;

                    afterEach(() => {
                        for (const mediaStreamTrack of mediaStreamTracks) {
                            mediaStreamTrack.stop();
                        }

                        oscillatorNode.stop();
                    });

                    beforeEach(() => {
                        const mediaStreamAudioDestinationNode = audioContext.createMediaStreamDestination();

                        oscillatorNode = audioContext.createOscillator();

                        oscillatorNode.connect(mediaStreamAudioDestinationNode);
                        oscillatorNode.start();

                        mediaStream = mediaStreamAudioDestinationNode.stream;
                        mediaStreamTracks = mediaStream.getTracks();
                    });

                    // bug #151

                    it('should not use the audio track as input anymore', (done) => {
                        const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(mediaStream);
                        const scriptProcessorNode = audioContext.createScriptProcessor(512);

                        for (const mediaStreamTrack of mediaStreamTracks) {
                            mediaStream.removeTrack(mediaStreamTrack);
                        }

                        let numberOfInvocations = 0;

                        scriptProcessorNode.onaudioprocess = ({ inputBuffer }) => {
                            numberOfInvocations += 1;

                            const channelData = inputBuffer.getChannelData(0);

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

                            expect(numberOfInvocations).to.be.above(0);

                            done();
                        }, 1000);
                    });
                });

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
                        const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(mediaStream);
                        const scriptProcessorNode = audioContext.createScriptProcessor(512);

                        let numberOfInvocations = 0;

                        scriptProcessorNode.onaudioprocess = ({ inputBuffer }) => {
                            numberOfInvocations += 1;

                            if (numberOfInvocations > 10) {
                                const channelData = inputBuffer.getChannelData(0);

                                for (let i = 0; i < 512; i += 1) {
                                    if (channelData[i] !== 0) {
                                        mediaStreamAudioSourceNode.disconnect(scriptProcessorNode);
                                        scriptProcessorNode.disconnect(audioContext.destination);

                                        done(new Error('The signal is expected to be zero at all time.'));

                                        break;
                                    }
                                }
                            }
                        };

                        mediaStreamAudioSourceNode.connect(scriptProcessorNode).connect(audioContext.destination);

                        setTimeout(() => {
                            mediaStreamAudioSourceNode.disconnect(scriptProcessorNode);
                            scriptProcessorNode.disconnect(audioContext.destination);

                            expect(numberOfInvocations).to.be.above(10);

                            done();
                        }, 1000);
                    });
                });
            }
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

        describe('createStereoPanner()', () => {
            // bug #105

            it('should not be implemented', () => {
                expect(audioContext.createStereoPanner).to.be.undefined;
            });
        });

        describe('createWaveShaper()', () => {
            let waveShaperNode;

            beforeEach(() => {
                waveShaperNode = audioContext.createWaveShaper();
            });

            describe('curve', () => {
                // bug #103

                it('should not allow to assign null', () => {
                    expect(() => {
                        waveShaperNode.curve = null;
                    }).to.throw(TypeError, 'The WaveShaperNode.curve attribute must be an instance of Float32Array');
                });
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
