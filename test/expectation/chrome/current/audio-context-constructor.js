import { spy } from 'sinon';

describe('audioContextConstructor', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('with a constructed AudioContext', () => {

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
