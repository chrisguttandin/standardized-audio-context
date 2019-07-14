describe('audioContextConstructor', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('close()', () => {

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

    describe('createBiquadFilter()', () => {

        let biquadFilterNode;

        beforeEach(() => {
            biquadFilterNode = audioContext.createBiquadFilter();
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

});
