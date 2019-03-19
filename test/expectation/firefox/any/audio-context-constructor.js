import { loadFixture } from '../../../helper/load-fixture';
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

        describe('close()', () => {

            // bug #35

            it('should not throw an error if it was closed before', () => {
                return audioContext
                    .close()
                    .then(() => audioContext.close());
            });

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

            describe('getFrequencyResponse()', () => {

                // bug #68

                it('should throw no error', () => {
                    biquadFilterNode.getFrequencyResponse(new Float32Array(), new Float32Array(1), new Float32Array(1));
                });

            });

        });

        describe('createBuffer()', () => {

            // bug #99

            describe('with zero as the numberOfChannels', () => {

                it('should throw an IndexSizeError', (done) => {
                    try {
                        audioContext.createBuffer(0, 10, 44100);
                    } catch (err) {
                        expect(err.code).to.equal(1);
                        expect(err.name).to.equal('IndexSizeError');

                        done();
                    }
                });

            });

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
                    const audioBufferSourceNode = audioContext.createBufferSource();

                    audioBufferSourceNode.buffer = audioContext.createBuffer(2, 100, 44100);
                    audioBufferSourceNode.buffer = audioContext.createBuffer(2, 100, 44100);
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

        });

        describe('createIIRFilter()', () => {

            let iIRFilterNode;

            beforeEach(() => {
                iIRFilterNode = audioContext.createIIRFilter([ 1 ], [ 1 ]);
            });

            describe('getFrequencyResponse()', () => {

                // bug #23

                it('should not throw an InvalidAccessError', () => {
                    iIRFilterNode.getFrequencyResponse(new Float32Array([ 1 ]), new Float32Array(0), new Float32Array(1));
                });

                // bug #24

                it('should not throw an InvalidAccessError', () => {
                    iIRFilterNode.getFrequencyResponse(new Float32Array([ 1 ]), new Float32Array(1), new Float32Array(0));
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

        describe('createMediaStreamSource()', () => {

            describe('with a mediaStream that has no audio track', () => {

                let videoStream;

                afterEach(() => {
                    for (const videoStreamTrack of videoStream.getTracks()) {
                        videoStreamTrack.stop();
                    }
                });

                beforeEach(() => {
                    const canvasElement = document.createElement('canvas');

                    // @todo https://bugzilla.mozilla.org/show_bug.cgi?id=1388974
                    canvasElement.getContext('2d');

                    videoStream = canvasElement.captureStream();
                });

                // bug #120

                it('should not throw an error', () => {
                    audioContext.createMediaStreamSource(videoStream);
                });

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
                    const mediaStreamDestinationNode = new MediaStreamAudioDestinationNode(audioContext);

                    oscillatorNode = new OscillatorNode(audioContext);

                    oscillatorNode.connect(mediaStreamDestinationNode);
                    oscillatorNode.start();

                    mediaStream = mediaStreamDestinationNode.stream;
                    mediaStreamTracks = mediaStream.getTracks();
                });

                // bug #151

                it('should not use the audio track as input anymore', (done) => {
                    const channelData = new Float32Array(512);
                    const mediaStreamAudioSourceNode = new MediaStreamAudioSourceNode(audioContext, { mediaStream });
                    const scriptProcessorNode = audioContext.createScriptProcessor(512);

                    for (const mediaStreamTrack of mediaStreamTracks) {
                        mediaStream.removeTrack(mediaStreamTrack);
                    }

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

        describe('createOscillator()', () => {

            let oscillatorNode;

            beforeEach(() => {
                oscillatorNode = audioContext.createOscillator();
            });

            describe('start()', () => {

                // bug #44

                it('should throw a DOMException', () => {
                    expect(() => oscillatorNode.start(-1)).to.throw(DOMException).with.property('name', 'NotSupportedError');
                });

            });

            describe('stop()', () => {

                // bug #44

                it('should throw a DOMException', () => {
                    expect(() => oscillatorNode.stop(-1)).to.throw(DOMException).with.property('name', 'NotSupportedError');
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

            // bug #43

            it('should not throw a DataCloneError', function (done) {
                this.timeout(10000);

                loadFixture('1000-frames-of-noise-stereo.wav', (err, arrayBuffer) => {
                    expect(err).to.be.null;

                    audioContext
                        .decodeAudioData(arrayBuffer)
                        .then(() => audioContext.decodeAudioData(arrayBuffer))
                        .catch((err2) => {
                            expect(err2.code).to.not.equal(25);
                            expect(err2.name).to.not.equal('DataCloneError');

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

    });

});
