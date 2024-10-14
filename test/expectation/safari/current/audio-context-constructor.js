import { loadFixtureAsArrayBuffer } from '../../../helper/load-fixture';

describe('audioContextConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('destination', () => {
        describe('numberOfOutputs', () => {
            // bug #168

            it('should be zero', () => {
                expect(audioContext.destination.numberOfOutputs).to.equal(0);
            });
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
            return audioContext.close().then(() => audioContext.close());
        });
    });

    describe('createBufferSource()', () => {
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

    describe('createConvolver()', () => {
        let convolverNode;

        beforeEach(() => {
            convolverNode = audioContext.createConvolver();
        });

        describe('buffer', () => {
            // bug #115

            it('should not allow to assign the buffer to null', () => {
                const audioBuffer = audioContext.createBuffer(2, 100, audioContext.sampleRate);

                convolverNode.buffer = audioBuffer;
                convolverNode.buffer = null;

                expect(convolverNode.buffer).to.equal(audioBuffer);
            });
        });
    });

    describe('createMediaStreamSource()', () => {
        // @todo There is currently no way to disable the autoplay policy on BrowserStack or Sauce Labs.
        // eslint-disable-next-line no-undef
        if (!process.env.CI) {
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

                        while (mediaStream.getAudioTracks()[0] !== audioStreamTracks[0]) {
                            mediaStream = new MediaStream([audioStreamTracks[0], audioStreamTracks[1]]);
                        }
                    } else {
                        mediaStream = mediaStreamAudioDestinationNodes[1].stream;

                        gainNodes[1].gain.value = 0;
                        mediaStream.addTrack(audioStreamTracks[0]);

                        while (mediaStream.getAudioTracks()[0] !== audioStreamTracks[1]) {
                            mediaStream = new MediaStream([audioStreamTracks[1], audioStreamTracks[0]]);
                        }
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

    describe('createMediaStreamTrackSource()', () => {
        // bug #121

        it('should not be implemented', () => {
            expect(audioContext.createMediaStreamTrackSource).to.be.undefined;
        });
    });

    describe('decodeAudioData()', () => {
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
        // bug #198

        it('should expose a wrong contextTime', function (done) {
            this.timeout(0);

            setTimeout(() => {
                expect(audioContext.currentTime).to.above(9);
                expect(audioContext.getOutputTimestamp().contextTime).to.below(1);
                expect(audioContext.getOutputTimestamp().contextTime * audioContext.sampleRate).to.above(9);

                done();
            }, 10000);
        });
    });
});
