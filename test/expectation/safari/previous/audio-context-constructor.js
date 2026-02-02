import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { loadFixtureAsArrayBuffer } from '../../../helper/load-fixture';
import { resumeAudioContext } from '../../../helper/resume-audio-context';

describe('audioContextConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(async () => {
        audioContext = new AudioContext();

        await resumeAudioContext(audioContext);
    });

    describe('audioWorklet', () => {
        describe('port', () => {
            // bug #202

            it('should not be implemented', () => {
                expect(audioContext.audioWorklet.port).to.be.undefined;
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

    describe('playoutStats', () => {
        // bug #203

        it('should not be implemented', () => {
            expect(audioContext.playoutStats).to.be.undefined;
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

            it('should pick the first track', () => {
                const { promise, reject, resolve } = Promise.withResolvers();
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

                                reject(new Error('The signal is expected to be zero at all time.'));

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

                    resolve();
                }, 1000);

                return promise;
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
        // bug #4

        it('should throw null when asked to decode an unsupported file', () => {
            const { promise, reject, resolve } = Promise.withResolvers();

            // PNG files are not supported by any browser :-)
            loadFixtureAsArrayBuffer('one-pixel-of-transparency.png').then((arrayBuffer) => {
                audioContext
                    .decodeAudioData(
                        arrayBuffer,
                        () => {
                            reject(new Error('This should never be called.'));
                        },
                        (err) => {
                            expect(err).to.be.null;

                            resolve();
                        }
                    )
                    .catch(() => {
                        // Ignore the rejected error.
                    });
            });

            return promise;
        });

        // bug #43

        it('should not throw a DataCloneError', () => {
            const { promise, resolve } = Promise.withResolvers();

            loadFixtureAsArrayBuffer('1000-frames-of-noise-stereo.wav').then((arrayBuffer) => {
                audioContext.decodeAudioData(arrayBuffer, () => {
                    audioContext.decodeAudioData(arrayBuffer, () => resolve());
                });
            });

            return promise;
        });

        // bug #133

        it('should not neuter the arrayBuffer', () => {
            const { promise, resolve } = Promise.withResolvers();

            loadFixtureAsArrayBuffer('1000-frames-of-noise-stereo.wav').then((arrayBuffer) => {
                audioContext.decodeAudioData(arrayBuffer, () => {
                    expect(arrayBuffer.byteLength).to.not.equal(0);

                    resolve();
                });
            });

            return promise;
        });
    });
});
