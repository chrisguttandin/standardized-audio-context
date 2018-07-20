import { spy } from 'sinon';

describe('offlineAudioContextConstructor', () => {

    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    describe('audioWorklet', () => {

        // bug #59

        it('should not be implemented', () => {
            expect(offlineAudioContext.audioWorklet).to.be.undefined;
        });

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

        describe('getFrequencyResponse()', () => {

            // bug #68

            it('should throw no error', () => {
                biquadFilterNode.getFrequencyResponse(new Float32Array(), new Float32Array(1), new Float32Array(1));
            });

        });

    });

    describe('createBufferSource()', () => {

        describe('buffer', () => {

            // bug #72

            it('should allow to assign the buffer multiple times', () => {
                const bufferSourceNode = offlineAudioContext.createBufferSource();

                bufferSourceNode.buffer = offlineAudioContext.createBuffer(2, 100, 44100);
                bufferSourceNode.buffer = offlineAudioContext.createBuffer(2, 100, 44100);
            });

        });

        describe('stop()', () => {

            // bug #44

            it('should throw a DOMException', () => {
                const bufferSourceNode = offlineAudioContext.createBufferSource();

                expect(() => bufferSourceNode.stop(-1)).to.throw(DOMException);
            });

        });

    });

    describe('createChannelMerger()', () => {

        // bug #16

        it('should allow to set the channelCount', () => {
            const channelMergerNode = offlineAudioContext.createChannelMerger();

            channelMergerNode.channelCountMode = '2';
        });

        it('should allow to set the channelCountMode', () => {
            const channelMergerNode = offlineAudioContext.createChannelMerger();

            channelMergerNode.channelCountMode = 'max';
        });

    });

    describe('createConstantSource()', () => {

        describe('start()', () => {

            // bug #44

            it('should throw a DOMException', () => {
                const constantSourceNode = offlineAudioContext.createConstantSource();

                expect(() => constantSourceNode.start(-1)).to.throw(DOMException);
            });

            // bug #70

            it('should start it with a maximum accurary of 128 samples', () => {
                const constantSourceNode = offlineAudioContext.createConstantSource();

                constantSourceNode.connect(offlineAudioContext.destination);
                constantSourceNode.start(127 / offlineAudioContext.sampleRate);

                return offlineAudioContext
                    .startRendering()
                    .then((buffer) => {
                        const channelData = new Float32Array(5);

                        buffer.copyFromChannel(channelData, 0, 0);

                        expect(Array.from(channelData)).to.deep.equal([ 1, 1, 1, 1, 1 ]);
                    });
            });

        });

        describe('stop()', () => {

            // bug #44

            it('should throw a DOMException', () => {
                const constantSourceNode = offlineAudioContext.createConstantSource();

                expect(() => constantSourceNode.stop(-1)).to.throw(DOMException);
            });

            // bug #70

            it('should stop it with a maximum accurary of 128 samples', () => {
                const constantSourceNode = offlineAudioContext.createConstantSource();

                constantSourceNode.connect(offlineAudioContext.destination);
                constantSourceNode.start();
                constantSourceNode.stop(1 / offlineAudioContext.sampleRate);

                return offlineAudioContext
                    .startRendering()
                    .then((buffer) => {
                        const channelData = new Float32Array(5);

                        buffer.copyFromChannel(channelData, 0, 0);

                        expect(Array.from(channelData)).to.deep.equal([ 1, 1, 1, 1, 1 ]);
                    });
            });

        });

    });

    describe('createGain()', () => {

        // bug #25

        it('should not allow to use setValueCurveAtTime after calling cancelScheduledValues', () => {
            const gainNode = offlineAudioContext.createGain();

            gainNode.gain.setValueCurveAtTime(new Float32Array([ 1, 1 ]), 0, 1);
            gainNode.gain.cancelScheduledValues(0.2);
            expect(() => {
                gainNode.gain.setValueCurveAtTime(new Float32Array([ 1, 1 ]), 0.4, 1);
            }).to.throw(Error);
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

    describe('createScriptProcessor()', () => {

        // bug #13

        it('should not have any output', () => {
            const scriptProcessorNode = offlineAudioContext.createScriptProcessor(256, 1, 1);
            const channelData = new Float32Array(scriptProcessorNode.bufferSize);

            scriptProcessorNode.connect(offlineAudioContext.destination);
            scriptProcessorNode.onaudioprocess = (event) => {
                channelData.fill(1);

                event.outputBuffer.copyToChannel(channelData, 0);
            };

            return offlineAudioContext
                .startRendering()
                .then((buffer) => {
                    const channelData = new Float32Array(scriptProcessorNode.bufferSize * 100);

                    buffer.copyFromChannel(channelData, 0, 256);

                    expect(Array.from(channelData)).to.not.contain(1);
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

    });

});
