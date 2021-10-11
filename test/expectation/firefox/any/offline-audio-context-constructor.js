import { loadFixtureAsArrayBuffer } from '../../../helper/load-fixture';
import { spy } from 'sinon';

describe('offlineAudioContextConstructor', () => {
    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    describe('destination', () => {
        // bug #54

        it('should throw an IndexSizeError', (done) => {
            try {
                offlineAudioContext.destination.channelCount = 2;
            } catch (err) {
                expect(err.code).to.equal(1);
                expect(err.name).to.equal('IndexSizeError');

                done();
            }
        });

        // bug #53

        it('should allow to change the value of the channelCountMode property', () => {
            offlineAudioContext.destination.channelCountMode = 'max';
        });
    });

    describe('createBiquadFilter()', () => {
        let biquadFilterNode;

        beforeEach(() => {
            biquadFilterNode = offlineAudioContext.createBiquadFilter();
        });

        describe('detune', () => {
            describe('automationRate', () => {
                // bug #84

                it('should not be implemented', () => {
                    expect(biquadFilterNode.detune.automationRate).to.be.undefined;
                });
            });
        });
    });

    describe('createDynamicsCompressor()', () => {
        // bug #112

        it('should not have a tail-time', () => {
            const audioBuffer = new AudioBuffer({ length: 3, sampleRate: 44100 });

            audioBuffer.copyToChannel(new Float32Array([1, 1, 1]), 0);

            const audioBufferSourceNode = new AudioBufferSourceNode(offlineAudioContext, { buffer: audioBuffer });
            const dynamicsCompressorNode = new DynamicsCompressorNode(offlineAudioContext);

            audioBufferSourceNode.connect(dynamicsCompressorNode).connect(offlineAudioContext.destination);

            audioBufferSourceNode.start(0);

            return offlineAudioContext.startRendering().then((renderedBuffer) => {
                const channelData = new Float32Array(384);

                renderedBuffer.copyFromChannel(channelData, 0);

                for (const sample of channelData) {
                    expect(sample).to.equal(0);
                }
            });
        });
    });

    describe('createGain()', () => {
        // bug #25

        it('should not allow to use setValueCurveAtTime after calling cancelScheduledValues', () => {
            const gainNode = offlineAudioContext.createGain();

            gainNode.gain.setValueCurveAtTime([1, 1], 0, 1);
            gainNode.gain.cancelScheduledValues(0.2);
            expect(() => {
                gainNode.gain.setValueCurveAtTime([1, 1], 0.4, 1);
            }).to.throw(Error);
        });

        describe('gain', () => {
            describe('value', () => {
                // bug #98

                it('should ignore the value setter while an automation is running', function () {
                    this.timeout(10000);

                    const constantSourceNode = offlineAudioContext.createConstantSource();
                    const gainNode = offlineAudioContext.createGain();

                    gainNode.gain.setValueAtTime(-1, 0);
                    gainNode.gain.linearRampToValueAtTime(1, 0.5);

                    gainNode.gain.value = 100;

                    constantSourceNode.connect(gainNode).connect(offlineAudioContext.destination);

                    constantSourceNode.start();

                    return offlineAudioContext.startRendering().then((renderedBuffer) => {
                        const channelData = new Float32Array(0.5 * offlineAudioContext.sampleRate);

                        renderedBuffer.copyFromChannel(channelData, 0);

                        for (const sample of channelData) {
                            expect(sample).to.be.at.least(-1);
                            expect(sample).to.be.at.most(1);
                        }
                    });
                });
            });
        });

        describe('cancelAndHoldAtTime()', () => {
            let gainNode;

            beforeEach(() => {
                gainNode = offlineAudioContext.createGain();
            });

            // bug #28

            it('should not be implemented', () => {
                expect(gainNode.gain.cancelAndHoldAtTime).to.be.undefined;
            });
        });
    });

    describe('createIIRFilter()', () => {
        let iIRFilterNode;

        beforeEach(() => {
            iIRFilterNode = offlineAudioContext.createIIRFilter([1], [1]);
        });

        describe('getFrequencyResponse()', () => {
            // bug #23

            it('should not throw a NotSupportedError', () => {
                iIRFilterNode.getFrequencyResponse(new Float32Array([1]), new Float32Array(0), new Float32Array(1));
            });

            // bug #24

            it('should not throw a NotSupportedError', () => {
                iIRFilterNode.getFrequencyResponse(new Float32Array([1]), new Float32Array(1), new Float32Array(0));
            });
        });
    });

    describe('createScriptProcessor()', () => {
        // bug #13

        it('should not have any output', () => {
            const scriptProcessorNode = offlineAudioContext.createScriptProcessor(256, 1, 1);
            const channelData = new Float32Array(scriptProcessorNode.bufferSize);

            let numberOfInvocations = 0;

            scriptProcessorNode.connect(offlineAudioContext.destination);
            scriptProcessorNode.onaudioprocess = (event) => {
                numberOfInvocations += 1;

                channelData.fill(1);

                event.outputBuffer.copyToChannel(channelData, 0);
            };

            return offlineAudioContext.startRendering().then((buffer) => {
                const chnnlDt = new Float32Array(scriptProcessorNode.bufferSize * 100);

                buffer.copyFromChannel(chnnlDt, 0, 256);

                expect(Array.from(chnnlDt)).to.not.contain(1);

                expect(numberOfInvocations).to.be.above(0);
            });
        });
    });

    describe('decodeAudioData()', () => {
        // bug #6

        it('should not call the errorCallback at all', (done) => {
            const errorCallback = spy();

            offlineAudioContext.decodeAudioData(null, () => {}, errorCallback);

            setTimeout(() => {
                expect(errorCallback).to.have.not.been.called;

                done();
            }, 1000);
        });

        // bug #43

        it('should not throw a DataCloneError', function (done) {
            this.timeout(10000);

            loadFixtureAsArrayBuffer('1000-frames-of-noise-stereo.wav').then((arrayBuffer) => {
                offlineAudioContext
                    .decodeAudioData(arrayBuffer)
                    .then(() => offlineAudioContext.decodeAudioData(arrayBuffer))
                    .catch((err) => {
                        expect(err.code).to.not.equal(25);
                        expect(err.name).to.not.equal('DataCloneError');

                        done();
                    });
            });
        });
    });

    describe('suspend()', () => {
        it('should not be implemented', () => {
            expect(offlineAudioContext.suspend).to.be.undefined;
        });
    });
});
