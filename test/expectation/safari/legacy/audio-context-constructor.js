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
        });

        describe('getOutputTimestamp()', () => {
            // bug #38

            it('should not be implemented', () => {
                expect(audioContext.getOutputTimestamp).to.be.undefined;
            });
        });
    });
});
