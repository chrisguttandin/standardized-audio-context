import { OfflineAudioContext } from '../../../src/audio-contexts/offline-audio-context';

describe('GainNode', () => {

    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new OfflineAudioContext({ length: 5, sampleRate: 44100 });
    });

    describe('gain', () => {

        let gainNode;

        beforeEach(() => {
            gainNode = offlineAudioContext.createGain();
        });

        it('should return an instance of the AudioParam interface', () => {
            // @todo cancelAndHoldAtTime
            expect(gainNode.gain.cancelScheduledValues).to.be.a('function');
            expect(gainNode.gain.defaultValue).to.equal(1);
            expect(gainNode.gain.exponentialRampToValueAtTime).to.be.a('function');
            expect(gainNode.gain.linearRampToValueAtTime).to.be.a('function');
            /*
             * @todo maxValue
             * @todo minValue
             */
            expect(gainNode.gain.setTargetAtTime).to.be.a('function');
            // @todo setValueAtTime
            expect(gainNode.gain.setValueCurveAtTime).to.be.a('function');
            expect(gainNode.gain.value).to.equal(1);
        });

        describe('automation', () => {

            let values;

            beforeEach(() => {
                values = [ 1, 0.5, 0, -0.5, -1 ];

                const audioBufferSourceNode = offlineAudioContext.createBufferSource();
                const audioBuffer = offlineAudioContext.createBuffer(1, 5, 44100);

                audioBuffer.copyToChannel(new Float32Array(values), 0);

                audioBufferSourceNode.buffer = audioBuffer;

                audioBufferSourceNode.start(0);

                audioBufferSourceNode
                    .connect(gainNode)
                    .connect(offlineAudioContext.destination);
            });

            describe('without any automation', () => {

                it('should not modify the signal', () => {
                    return offlineAudioContext
                        .startRendering()
                        .then((renderedBuffer) => {
                            const channelData = new Float32Array(5);

                            renderedBuffer.copyFromChannel(channelData, 0, 0);

                            expect(Array.from(channelData)).to.deep.equal(values);
                        });
                });

            });

            describe('with a modified value', () => {

                it('should modify the signal', () => {
                    gainNode.gain.value = 0.5;

                    return offlineAudioContext
                        .startRendering()
                        .then((renderedBuffer) => {
                            const channelData = new Float32Array(5);

                            renderedBuffer.copyFromChannel(channelData, 0, 0);

                            expect(Array.from(channelData)).to.deep.equal([ 0.5, 0.25, 0, -0.25, -0.5 ]);
                        });
                });

            });

            describe('with a call to setValueAtTime()', () => {

                it('should modify the signal', () => {
                    gainNode.gain.setValueAtTime(0, 2 / 44100);

                    return offlineAudioContext
                        .startRendering()
                        .then((renderedBuffer) => {
                            const channelData = new Float32Array(5);

                            renderedBuffer.copyFromChannel(channelData, 0, 0);

                            expect(Array.from(channelData)).to.deep.equal([ 1, 0.5, 0, -0, -0 ]);
                        });
                });

            });

            describe('with a call to setValueCurveAtTime()', () => {

                it('should modify the signal', () => {
                    gainNode.gain.setValueCurveAtTime(new Float32Array([ 0, 0.25, 0.5, 0.75, 1 ]), 0, 5 / 44100);

                    return offlineAudioContext
                        .startRendering()
                        .then((renderedBuffer) => {
                            const channelData = new Float32Array(5);

                            renderedBuffer.copyFromChannel(channelData, 0, 0);

                            // @todo The implementation of Safari is different. Therefore this test only checks if the values have changed.
                            expect(Array.from(channelData)).to.not.deep.equal(values);
                        });
                });

            });

            // @todo Test other automations as well.

        });

    });

});
