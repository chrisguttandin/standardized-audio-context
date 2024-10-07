describe('audioContextConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('createBiquadFilter()', () => {
        let biquadFilterNode;

        beforeEach(() => {
            biquadFilterNode = audioContext.createBiquadFilter();
        });

        describe('getFrequencyResponse()', () => {
            // bug #189
            it('should throw an InvalidStateError', (done) => {
                try {
                    biquadFilterNode.getFrequencyResponse(new Float32Array(), new Float32Array(1), new Float32Array(1));
                } catch (err) {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    done();
                }
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

            describe('with two instances using the same mediaStream', () => {
                let audioBufferSourceNode;
                let mediaStream;
                let mediaStreamAudioDestinationNode;

                afterEach(() => {
                    audioBufferSourceNode.stop();

                    audioBufferSourceNode.disconnect(mediaStreamAudioDestinationNode);
                });

                beforeEach(() => {
                    audioBufferSourceNode = audioContext.createBufferSource();
                    mediaStreamAudioDestinationNode = audioContext.createMediaStreamDestination();

                    const audioBuffer = audioContext.createBuffer(1, 2, audioContext.sampleRate);

                    audioBuffer.getChannelData(0)[0] = 1;
                    audioBuffer.getChannelData(0)[1] = 1;

                    audioBufferSourceNode.buffer = audioBuffer;
                    audioBufferSourceNode.loop = true;

                    audioBufferSourceNode.connect(mediaStreamAudioDestinationNode);

                    audioBufferSourceNode.start();

                    mediaStream = mediaStreamAudioDestinationNode.stream;
                });

                // bug #201

                it('should only output sound for the first node', (done) => {
                    const channelData = new Float32Array(512);
                    const channelMergerNode = audioContext.createChannelMerger(2);
                    const mediaStreamAudioSourceNodeA = audioContext.createMediaStreamSource(mediaStream);
                    const mediaStreamAudioSourceNodeB = audioContext.createMediaStreamSource(mediaStream);
                    const scriptProcessorNode = audioContext.createScriptProcessor(512);

                    let numberOfInvocations = 0;

                    scriptProcessorNode.onaudioprocess = ({ inputBuffer }) => {
                        numberOfInvocations += 1;

                        if (numberOfInvocations > 1) {
                            inputBuffer.copyFromChannel(channelData, 0);

                            for (let i = 0; i < 512; i += 1) {
                                if (channelData[i] !== 1) {
                                    channelMergerNode.disconnect(scriptProcessorNode);
                                    mediaStreamAudioSourceNodeA.disconnect(channelMergerNode);
                                    mediaStreamAudioSourceNodeB.disconnect(channelMergerNode);
                                    scriptProcessorNode.disconnect(audioContext.destination);

                                    done(new Error('The signal is expected to be one at all time.'));

                                    break;
                                }
                            }

                            inputBuffer.copyFromChannel(channelData, 1);

                            for (let i = 0; i < 512; i += 1) {
                                if (channelData[i] !== 0) {
                                    channelMergerNode.disconnect(scriptProcessorNode);
                                    mediaStreamAudioSourceNodeA.disconnect(channelMergerNode);
                                    mediaStreamAudioSourceNodeB.disconnect(channelMergerNode);
                                    scriptProcessorNode.disconnect(audioContext.destination);

                                    done(new Error('The signal is expected to be zero at all time.'));

                                    break;
                                }
                            }
                        }
                    };

                    mediaStreamAudioSourceNodeA.connect(channelMergerNode, 0, 0);
                    mediaStreamAudioSourceNodeB.connect(channelMergerNode, 0, 1);
                    channelMergerNode.connect(scriptProcessorNode).connect(audioContext.destination);

                    setTimeout(() => {
                        channelMergerNode.disconnect(scriptProcessorNode);
                        mediaStreamAudioSourceNodeA.disconnect(channelMergerNode);
                        mediaStreamAudioSourceNodeB.disconnect(channelMergerNode);
                        scriptProcessorNode.disconnect(audioContext.destination);

                        expect(numberOfInvocations).to.be.above(1);

                        done();
                    }, 1000);
                });
            });
        }
    });
});
