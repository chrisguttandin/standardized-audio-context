import { loadFixtureAsArrayBuffer } from '../../../helper/load-fixture';
import { spy } from 'sinon';

describe('offlineAudioContextConstructor', () => {
    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new OfflineAudioContext({ length: 25600, sampleRate: 44100 });
    });

    describe('destination', () => {
        // bug #52

        it('should allow to change the value of the channelCount property', () => {
            offlineAudioContext.destination.channelCount = 3;
        });

        // bug #53

        it('should allow to change the value of the channelCountMode property', () => {
            offlineAudioContext.destination.channelCountMode = 'explicit';
        });
    });

    describe('createBufferSource()', () => {
        // bug #14

        it('should not resample an oversampled AudioBuffer', (done) => {
            const audioBuffer = offlineAudioContext.createBuffer(1, 8, 88200);
            const audioBufferSourceNode = offlineAudioContext.createBufferSource();
            const eightRandomValues = [];

            for (let i = 0; i < 8; i += 1) {
                eightRandomValues[i] = Math.random() * 2 - 1;

                audioBuffer.getChannelData(0)[i] = eightRandomValues[i];
            }

            audioBufferSourceNode.buffer = audioBuffer;
            audioBufferSourceNode.start(0);
            audioBufferSourceNode.connect(offlineAudioContext.destination);

            offlineAudioContext.oncomplete = (event) => {
                const channelData = event.renderedBuffer.getChannelData(0);

                expect(channelData[0]).to.be.closeTo(eightRandomValues[0], 0.0000001);
                expect(channelData[1]).to.be.closeTo(eightRandomValues[2], 0.0000001);
                expect(channelData[2]).to.be.closeTo(eightRandomValues[4], 0.0000001);
                expect(channelData[3]).to.be.closeTo(eightRandomValues[6], 0.0000001);

                done();
            };
            offlineAudioContext.startRendering();
        });

        // bug #164

        it('should not mute cycles', function (done) {
            this.timeout(10000);

            const audioBuffer = offlineAudioContext.createBuffer(1, 25600, offlineAudioContext.sampleRate);
            const audioBufferSourceNode = offlineAudioContext.createBufferSource();
            const gainNode = offlineAudioContext.createGain();

            for (let i = 0; i < 25600; i += 1) {
                audioBuffer.getChannelData(0)[i] = 1;
            }

            audioBufferSourceNode.buffer = audioBuffer;

            audioBufferSourceNode.connect(gainNode).connect(offlineAudioContext.destination);

            gainNode.connect(gainNode);

            audioBufferSourceNode.start(0);

            offlineAudioContext.oncomplete = ({ renderedBuffer }) => {
                const channelData = renderedBuffer.getChannelData(0);

                for (const sample of channelData) {
                    expect(sample).to.not.equal(0);
                }

                done();
            };
            offlineAudioContext.startRendering();
        });

        describe('onended', () => {
            // bug #175

            it('should not fire an ended event listener', (done) => {
                const audioBuffer = offlineAudioContext.createBuffer(1, 2, 44100);
                const audioBufferSourceNode = offlineAudioContext.createBufferSource();

                audioBufferSourceNode.buffer = audioBuffer;

                const listener = spy();

                audioBufferSourceNode.addEventListener('ended', listener);
                audioBufferSourceNode.start();

                setTimeout(() => {
                    expect(listener).to.have.not.been.called;

                    done();
                }, 500);

                offlineAudioContext.startRendering();
            });
        });

        describe('stop()', () => {
            // bug #44

            it('should throw a DOMException', () => {
                const audioBufferSourceNode = offlineAudioContext.createBufferSource();

                expect(() => audioBufferSourceNode.stop(-1))
                    .to.throw(DOMException)
                    .with.property('name', 'InvalidStateError');
            });
        });
    });

    describe('createDelay()', () => {
        describe('with a delayTime of 128 samples', () => {
            let audioBufferSourceNode;
            let delayNode;
            let gainNode;

            afterEach(() => {
                audioBufferSourceNode.disconnect(gainNode);
                delayNode.disconnect(gainNode);
                gainNode.disconnect(delayNode);
                gainNode.disconnect(offlineAudioContext.destination);
            });

            beforeEach(() => {
                audioBufferSourceNode = offlineAudioContext.createBufferSource();
                delayNode = offlineAudioContext.createDelay();
                gainNode = offlineAudioContext.createGain();

                const audioBuffer = offlineAudioContext.createBuffer(1, 1, offlineAudioContext.sampleRate);

                audioBuffer.getChannelData(0)[0] = 2;

                audioBufferSourceNode.buffer = audioBuffer;

                delayNode.delayTime.value = 128 / offlineAudioContext.sampleRate;

                gainNode.gain.value = 0.5;

                audioBufferSourceNode.connect(gainNode).connect(delayNode).connect(gainNode).connect(offlineAudioContext.destination);
            });

            // bug #163

            it('should have a minimum delayTime of 256 samples', function (done) {
                this.timeout(10000);

                audioBufferSourceNode.start(0);

                offlineAudioContext.oncomplete = ({ renderedBuffer }) => {
                    const channelData = renderedBuffer.getChannelData(0);

                    expect(channelData[0]).to.equal(1);
                    expect(channelData[256]).to.be.above(0.49);
                    expect(channelData[256]).to.be.below(0.51);

                    done();
                };
                offlineAudioContext.startRendering();
            });
        });
    });

    describe('createScriptProcessor()', () => {
        describe('without any output channels', () => {
            // bug #87

            it('should not fire any AudioProcessingEvent', (done) => {
                const listener = spy();
                const oscillatorNode = offlineAudioContext.createOscillator();
                const scriptProcessorNode = offlineAudioContext.createScriptProcessor(256, 1, 0);

                scriptProcessorNode.onaudioprocess = listener;

                oscillatorNode.connect(scriptProcessorNode);
                oscillatorNode.start();

                offlineAudioContext.oncomplete = () => {
                    expect(listener).to.have.not.been.called;

                    done();
                };
                offlineAudioContext.startRendering();
            });
        });
    });

    describe('decodeAudioData()', () => {
        // bug #4

        it('should throw null when asked to decode an unsupported file', function (done) {
            this.timeout(10000);

            // PNG files are not supported by any browser :-)
            loadFixtureAsArrayBuffer('one-pixel-of-transparency.png').then((arrayBuffer) => {
                offlineAudioContext.decodeAudioData(
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
                offlineAudioContext.decodeAudioData(arrayBuffer, () => {
                    offlineAudioContext.decodeAudioData(arrayBuffer, () => done());
                });
            });
        });
    });
});
