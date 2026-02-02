import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { spy } from 'sinon';

describe('offlineAudioContextConstructor', () => {
    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    describe('destination', () => {
        // bug #52

        it('should allow to change the value of the channelCount property', () => {
            offlineAudioContext.destination.channelCount = 2;
        });

        // bug #53

        it('should allow to change the value of the channelCountMode property', () => {
            offlineAudioContext.destination.channelCountMode = 'max';
        });
    });

    describe('createBufferSource()', () => {
        // bug #14

        it('should not resample an oversampled AudioBuffer', async () => {
            const audioBuffer = offlineAudioContext.createBuffer(1, 8, 88200);
            const audioBufferSourceNode = offlineAudioContext.createBufferSource();
            const eightRandomValues = [];

            for (let i = 0; i < 8; i += 1) {
                eightRandomValues[i] = Math.random() * 2 - 1;
            }

            audioBuffer.copyToChannel(new Float32Array(eightRandomValues), 0);

            audioBufferSourceNode.buffer = audioBuffer;
            audioBufferSourceNode.start(0);
            audioBufferSourceNode.connect(offlineAudioContext.destination);

            const renderedBuffer = await offlineAudioContext.startRendering();
            const channelData = new Float32Array(4);

            renderedBuffer.copyFromChannel(channelData, 0);

            expect(channelData[0]).to.be.closeTo(eightRandomValues[0], 0.0000001);
            expect(channelData[1]).to.be.closeTo(eightRandomValues[2], 0.0000001);
            expect(channelData[2]).to.be.closeTo(eightRandomValues[4], 0.0000001);
            expect(channelData[3]).to.be.closeTo(eightRandomValues[6], 0.0000001);
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

    describe('createConstantSourceNode()', () => {
        // bug #164

        it('should not mute cycles', () => {
            const constantSourceNode = offlineAudioContext.createConstantSource();
            const gainNode = offlineAudioContext.createGain();

            constantSourceNode.connect(gainNode).connect(offlineAudioContext.destination);

            gainNode.connect(gainNode);

            constantSourceNode.start(0);

            return offlineAudioContext.startRendering().then((renderedBuffer) => {
                const channelData = new Float32Array(renderedBuffer.length);

                renderedBuffer.copyFromChannel(channelData, 0);

                for (const sample of channelData) {
                    expect(sample).to.not.equal(0);
                }
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

            it('should have a minimum delayTime of 256 samples', () => {
                audioBufferSourceNode.start(0);

                return offlineAudioContext.startRendering().then((renderedBuffer) => {
                    const channelData = new Float32Array(512);

                    renderedBuffer.copyFromChannel(channelData, 0);

                    expect(channelData[0]).to.equal(1);
                    expect(channelData[256]).to.be.above(0.49);
                    expect(channelData[256]).to.be.below(0.51);
                });
            });
        });
    });

    describe('createScriptProcessor()', () => {
        describe('without any output channels', () => {
            // bug #87

            it('should not fire any AudioProcessingEvent', () => {
                const listener = spy();
                const oscillatorNode = offlineAudioContext.createOscillator();
                const scriptProcessorNode = offlineAudioContext.createScriptProcessor(256, 1, 0);

                scriptProcessorNode.onaudioprocess = listener;

                oscillatorNode.connect(scriptProcessorNode);
                oscillatorNode.start();

                return offlineAudioContext.startRendering().then(() => {
                    expect(listener).to.have.not.been.called;
                });
            });
        });
    });

    describe('decodeAudioData()', () => {
        // bug #6

        it('should not call the errorCallback at all', () => {
            const errorCallback = spy();

            offlineAudioContext
                .decodeAudioData(null, () => {}, errorCallback)
                .catch(() => {
                    // Ignore the rejected error.
                });

            return new Promise((resolve) => {
                setTimeout(() => {
                    expect(errorCallback).to.have.not.been.called;

                    resolve();
                }, 1000);
            });
        });
    });
});
