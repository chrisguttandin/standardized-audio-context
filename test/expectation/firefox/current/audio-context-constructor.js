import { loadFixture } from '../../../helper/load-fixture';

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

        describe('detune', () => {

            describe('maxValue', () => {

                // bug #78

                it('should be positive infinity', () => {
                    expect(biquadFilterNode.detune.maxValue).to.equal(Number.POSITIVE_INFINITY);
                });

            });

            describe('minValue', () => {

                // bug #78

                it('should be negative infinity', () => {
                    expect(biquadFilterNode.detune.minValue).to.equal(Number.NEGATIVE_INFINITY);
                });

            });

        });

        describe('gain', () => {

            describe('maxValue', () => {

                // bug #79

                it('should be positive infinity', () => {
                    expect(biquadFilterNode.gain.maxValue).to.equal(Number.POSITIVE_INFINITY);
                });

            });

            describe('minValue', () => {

                // bug #79

                it('should be negative infinity', () => {
                    expect(biquadFilterNode.gain.minValue).to.equal(Number.NEGATIVE_INFINITY);
                });

            });

        });

        describe('Q', () => {

            describe('maxValue', () => {

                // bug #80

                it('should be positive infinity', () => {
                    expect(biquadFilterNode.Q.maxValue).to.equal(Number.POSITIVE_INFINITY);
                });

            });

            describe('minValue', () => {

                // bug #80

                it('should be negative infinity', () => {
                    expect(biquadFilterNode.Q.minValue).to.equal(Number.NEGATIVE_INFINITY);
                });

            });

        });

    });

    describe('createBufferSource()', () => {

        let audioBufferSourceNode;

        beforeEach(() => {
            audioBufferSourceNode = audioContext.createBufferSource();
        });

        describe('playbackRate', () => {

            describe('maxValue', () => {

                // bug #73

                it('should be positive infinity', () => {
                    expect(audioBufferSourceNode.playbackRate.maxValue).to.equal(Number.POSITIVE_INFINITY);
                });

            });

            describe('minValue', () => {

                // bug #73

                it('should be negative infinity', () => {
                    expect(audioBufferSourceNode.playbackRate.minValue).to.equal(Number.NEGATIVE_INFINITY);
                });

            });

        });

        describe('start()', () => {

            // bug #44

            it('should throw a DOMException', () => {
                expect(() => audioBufferSourceNode.start(-1)).to.throw(DOMException);

                expect(() => audioBufferSourceNode.start(0, -1)).to.throw(DOMException);

                expect(() => audioBufferSourceNode.start(0, 0, -1)).to.throw(DOMException);
            });

        });

    });

    describe('createChannelSplitter()', () => {

        // bug #90

        it('should have a channelCount of 2', () => {
            const channelSplitterNode = audioContext.createChannelSplitter(4);

            expect(channelSplitterNode.channelCount).to.equal(2);
        });

        // bug #29

        it('should have a channelCountMode of max', () => {
            const channelSplitterNode = audioContext.createChannelSplitter();

            expect(channelSplitterNode.channelCountMode).to.equal('max');
        });

        // bug #31

        it('should have a channelInterpretation of speakers', () => {
            const channelSplitterNode = audioContext.createChannelSplitter();

            expect(channelSplitterNode.channelInterpretation).to.equal('speakers');
        });

    });

    describe('createConstantSource()', () => {

        let constantSourceNode;

        beforeEach(() => {
            constantSourceNode = audioContext.createConstantSource();
        });

        describe('offset', () => {

            describe('maxValue', () => {

                // bug #75

                it('should be positive infinity', () => {
                    expect(constantSourceNode.offset.maxValue).to.equal(Number.POSITIVE_INFINITY);
                });

            });

            describe('minValue', () => {

                // bug #75

                it('should be negative infinity', () => {
                    expect(constantSourceNode.offset.minValue).to.equal(Number.NEGATIVE_INFINITY);
                });

            });

        });

    });

    describe('createGain()', () => {

        describe('gain', () => {

            let gainNode;

            beforeEach(() => {
                gainNode = audioContext.createGain();
            });

            describe('maxValue', () => {

                // bug #74

                it('should be positive infinity', () => {
                    expect(gainNode.gain.maxValue).to.equal(Number.POSITIVE_INFINITY);
                });

            });

            describe('minValue', () => {

                // bug #74

                it('should be negative infinity', () => {
                    expect(gainNode.gain.minValue).to.equal(Number.NEGATIVE_INFINITY);
                });

            });

        });

    });

    describe('createOscillator()', () => {

        describe('detune', () => {

            let oscillatorNode;

            beforeEach(() => {
                oscillatorNode = audioContext.createOscillator();
            });

            describe('maxValue', () => {

                // bug #81

                it('should be positive infinity', () => {
                    expect(oscillatorNode.detune.maxValue).to.equal(Number.POSITIVE_INFINITY);
                });

            });

            describe('minValue', () => {

                // bug #81

                it('should be negative infinity', () => {
                    expect(oscillatorNode.detune.minValue).to.equal(Number.NEGATIVE_INFINITY);
                });

            });

        });

    });

    describe('decodeAudioData()', () => {

        // bug #43

        it('should not throw a DataCloneError', (done) => {
            loadFixture('1000-frames-of-noise.wav', (err, arrayBuffer) => {
                expect(err).to.be.null;

                audioContext
                    .decodeAudioData(arrayBuffer)
                    .then(() => audioContext.decodeAudioData(arrayBuffer))
                    .catch((err2) => {
                        expect(err2.code).to.not.equal(25);
                        expect(err2.name).to.not.equal('DataCloneError');

                        done();
                    });
            });
        });

    });

});
