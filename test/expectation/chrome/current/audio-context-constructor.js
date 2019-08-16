import { spy } from 'sinon';

describe('audioContextConstructor', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('with a constructed AudioContext', () => {

        describe('outputLatency', () => {

            // bug #40

            it('should not be implemented', () => {
                expect(audioContext.outputLatency).to.be.undefined;
            });

        });

        describe('state', () => {

            // bug #34

            it('should be set to running right away', () => {
                expect(audioContext.state).to.equal('running');
            });

        });

        describe('createBuffer()', () => {

            // bug #157

            describe('copyFromChannel()/copyToChannel()', () => {

                let audioBuffer;

                beforeEach(() => {
                    audioBuffer = audioContext.createBuffer(2, 100, 44100);
                });

                it('should not allow to copy values with a bufferOffset equal to the length of the AudioBuffer', () => {
                    const source = new Float32Array(10);

                    expect(() => audioBuffer.copyToChannel(source, 0, 100)).to.throw(Error);
                });

            });

        });

        describe('createBufferSource()', () => {

            describe('stop()', () => {

                // bug #44

                it('should throw a DOMException', () => {
                    const audioBufferSourceNode = audioContext.createBufferSource();

                    expect(() => audioBufferSourceNode.stop(-1)).to.throw(DOMException).with.property('name', 'InvalidStateError');
                });

            });

        });

        describe('createMediaStreamSource()', () => {

            let constantSourceNode;
            let gainNodes;
            let mediaStream;
            let mediaStreamAudioDestinationNodes;

            afterEach(() => {
                constantSourceNode.stop();

                constantSourceNode.disconnect(gainNodes[0]);
                constantSourceNode.disconnect(gainNodes[1]);
                gainNodes[0].disconnect(mediaStreamAudioDestinationNodes[0]);
                gainNodes[1].disconnect(mediaStreamAudioDestinationNodes[1]);
            });

            beforeEach(() => {
                constantSourceNode = audioContext.createConstantSource();
                gainNodes = [
                    audioContext.createGain(),
                    audioContext.createGain()
                ];
                mediaStreamAudioDestinationNodes = [
                    audioContext.createMediaStreamDestination(),
                    audioContext.createMediaStreamDestination()
                ];

                constantSourceNode
                    .connect(gainNodes[0])
                    .connect(mediaStreamAudioDestinationNodes[0]);
                constantSourceNode
                    .connect(gainNodes[1])
                    .connect(mediaStreamAudioDestinationNodes[1]);

                constantSourceNode.start();

                const audioStreamTracks = mediaStreamAudioDestinationNodes
                    .map(({ stream }) => stream.getAudioTracks()[0]);

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
                            scriptProcessorNode.disconnect(audioContext.destination);

                            done(new Error('The signal is expected to be zero at all time.'));

                            break;
                        }
                    }
                };

                mediaStreamAudioSourceNode
                    .connect(scriptProcessorNode)
                    .connect(audioContext.destination);

                setTimeout(() => {
                    mediaStreamAudioSourceNode.disconnect(scriptProcessorNode);
                    scriptProcessorNode.disconnect(audioContext.destination);

                    done();
                }, 1000);
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

    });

});
