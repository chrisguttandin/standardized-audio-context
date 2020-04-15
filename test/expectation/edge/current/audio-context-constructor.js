import { spy } from 'sinon';

describe('audioContextConstructor', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('audioWorklet', () => {

        describe('addModule()', () => {

            describe('with an empty string as name', () => {

                // bug #134

                it('should not throw an error', function () {
                    this.timeout(10000);

                    return audioContext.audioWorklet.addModule('base/test/fixtures/empty-string-processor.js');
                });

            });

            describe('with a duplicate name', () => {

                beforeEach(function () {
                    this.timeout(10000);

                    return audioContext.audioWorklet.addModule('base/test/fixtures/gain-processor.js');
                });

                // bug #135

                it('should not throw an error', function () {
                    this.timeout(10000);

                    return audioContext.audioWorklet.addModule('base/test/fixtures/duplicate-gain-processor.js');
                });

            });

            describe('with a processor without a valid constructor', () => {

                // bug #136

                it('should not throw an error', function () {
                    this.timeout(10000);

                    return audioContext.audioWorklet.addModule('base/test/fixtures/unconstructible-processor.js');
                });

            });

            describe('with a processor without a prototype', () => {

                // Bug #137

                it('should not throw an error', function () {
                    this.timeout(10000);

                    return audioContext.audioWorklet.addModule('base/test/fixtures/prototypeless-processor.js');
                });

            });

            describe('with a processor with an invalid parameterDescriptors property', () => {

                // Bug #139

                it('should not throw an error', function () {
                    this.timeout(10000);

                    return audioContext.audioWorklet.addModule('base/test/fixtures/invalid-parameter-descriptors-property-processor.js');
                });

            });

        });

    });

    describe('state', () => {

        // bug #34

        it('should be set to running right away', () => {
            expect(audioContext.state).to.equal('running');
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

    describe('createDelay()', () => {

        describe('with a delayTime of 128 samples', () => {

            let audioBufferSourceNode;
            let delayNode;
            let gainNode;
            let scriptProcessorNode;

            afterEach(() => {
                audioBufferSourceNode.disconnect(gainNode);
                delayNode.disconnect(gainNode);
                gainNode.disconnect(delayNode);
                gainNode.disconnect(scriptProcessorNode);
                scriptProcessorNode.disconnect(audioContext.destination);
            });

            beforeEach(() => {
                audioBufferSourceNode = audioContext.createBufferSource();
                delayNode = audioContext.createDelay();
                gainNode = audioContext.createGain();
                scriptProcessorNode = audioContext.createScriptProcessor(512);

                const audioBuffer = audioContext.createBuffer(1, 1, audioContext.sampleRate);

                audioBuffer.getChannelData(0)[0] = 2;

                audioBufferSourceNode.buffer = audioBuffer;

                delayNode.delayTime.value = 128 / audioContext.sampleRate;

                gainNode.gain.value = 0.5;

                audioBufferSourceNode
                    .connect(gainNode)
                    .connect(delayNode)
                    .connect(gainNode)
                    .connect(scriptProcessorNode)
                    .connect(audioContext.destination);
            });

            // bug #163

            it('should have a minimum delayTime of 256 samples', (done) => {
                const channelData = new Float32Array(512);

                let offsetOfFirstImpulse = null;

                scriptProcessorNode.onaudioprocess = ({ inputBuffer }) => {
                    inputBuffer.copyFromChannel(channelData, 0);

                    if (offsetOfFirstImpulse !== null) {
                        offsetOfFirstImpulse -= 512;
                    }

                    for (let i = 0; i < 512; i += 1) {
                        if (channelData[i] > 0.99 && channelData[i] < 1.01) {
                            offsetOfFirstImpulse = i;
                        } else if (channelData[i] > 0.49 && channelData[i] < 0.51) {
                            expect(i - offsetOfFirstImpulse).to.equal(256);

                            done();

                            break;
                        }
                    }
                };

                audioBufferSourceNode.start();
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

    describe('createWaveShaper()', () => {

        describe('curve', () => {

            // bug #104

            it('should throw an InvalidAccessError when assigning a curve with less than two samples', (done) => {
                const waveShaperNode = audioContext.createWaveShaper();

                try {
                    waveShaperNode.curve = new Float32Array([ 1 ]);
                } catch (err) {
                    expect(err.code).to.equal(15);
                    expect(err.name).to.equal('InvalidAccessError');

                    done();
                }
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

    });

});
