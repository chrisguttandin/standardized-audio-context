import { loadFixtureAsArrayBuffer } from '../../helper/load-fixture';
import { spy } from 'sinon';

describe('offlineAudioContextConstructor', () => {

    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    describe('constructor()', () => {

        describe('with a length of zero', () => {

            // bug #143

            it('should throw a SyntaxError', (done) => {
                try {
                    new OfflineAudioContext(1, 0, 44100);
                } catch (err) {
                    expect(err.code).to.equal(12);
                    expect(err.name).to.equal('SyntaxError');

                    done();
                }
            });

        });

        describe('with a sampleRate of zero', () => {

            // bug #145

            it('should throw an IndexSizeError', (done) => {
                try {
                    new OfflineAudioContext(1, 1, 0);
                } catch (err) {
                    expect(err.code).to.equal(1);
                    expect(err.name).to.equal('IndexSizeError');

                    done();
                }
            });

        });

        describe('with OfflineAudioContextOptions', () => {

            // bug #46

            it('should throw a TypeError', () => {
                expect(() => {
                    new OfflineAudioContext({ length: 1, numberOfChannels: 1, sampleRate: 44100 });
                }).to.throw(TypeError);
            });

        });

    });

    describe('audioWorklet', () => {

        // bug #59

        it('should not be implemented', () => {
            expect(offlineAudioContext.audioWorklet).to.be.undefined;
        });

    });

    describe('destination', () => {

        // bug #132

        it('should have a wrong channelCount property', () => {
            expect(offlineAudioContext.destination.channelCount).to.equal(2);
        });

        // bug #52

        it('should allow to change the value of the channelCount property', () => {
            offlineAudioContext.destination.channelCount = 3;
        });

        // bug #53

        it('should allow to change the value of the channelCountMode property', () => {
            offlineAudioContext.destination.channelCountMode = 'explicit';
        });

        // bug #83

        it('should have a channelCountMode of max', () => {
            expect(offlineAudioContext.destination.channelCountMode).to.equal('max');
        });

        // bug #47

        it('should not have a maxChannelCount property', () => {
            expect(offlineAudioContext.destination.maxChannelCount).to.equal(0);
        });

    });

    describe('close()', () => {

        // bug #94

        it('should expose a close method', () => {
            expect(offlineAudioContext.close).to.be.a('function');
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

            // bug #22

            it('should fill the magResponse and phaseResponse arrays with the deprecated algorithm', () => {
                const magResponse = new Float32Array(5);
                const phaseResponse = new Float32Array(5);

                biquadFilterNode.getFrequencyResponse(new Float32Array([ 200, 400, 800, 1600, 3200 ]), magResponse, phaseResponse);

                expect(Array.from(magResponse)).to.deep.equal([ 1.1107852458953857, 0.8106917142868042, 0.20565471053123474, 0.04845593497157097, 0.011615658178925514 ]);
                expect(Array.from(phaseResponse)).to.deep.equal([ -0.7254799008369446, -1.8217267990112305, -2.6273605823516846, -2.906902313232422, -3.0283825397491455 ]);
            });

            // bug #68

            it('should throw no error', () => {
                biquadFilterNode.getFrequencyResponse(new Float32Array(), new Float32Array(1), new Float32Array(1));
            });

        });

    });

    describe('createBufferSource()', () => {

        // bug #14

        it('should not resample an oversampled AudioBuffer', (done) => {
            const audioBuffer = offlineAudioContext.createBuffer(1, 8, 88200);
            const audioBufferSourceNode = offlineAudioContext.createBufferSource();
            const eightRandomValues = [];

            for (let i = 0; i < 8; i += 1) {
                eightRandomValues[i] = (Math.random() * 2) - 1;
            }

            audioBuffer.copyToChannel(new Float32Array(eightRandomValues), 0);

            audioBufferSourceNode.buffer = audioBuffer;
            audioBufferSourceNode.start(0);
            audioBufferSourceNode.connect(offlineAudioContext.destination);

            offlineAudioContext
                .startRendering()
                .then((buffer) => {
                    const channelData = new Float32Array(4);

                    buffer.copyFromChannel(channelData, 0);

                    expect(channelData[0]).to.be.closeTo(eightRandomValues[0], 0.0000001);
                    expect(channelData[1]).to.be.closeTo(eightRandomValues[2], 0.0000001);
                    expect(channelData[2]).to.be.closeTo(eightRandomValues[4], 0.0000001);
                    expect(channelData[3]).to.be.closeTo(eightRandomValues[6], 0.0000001);

                    done();
                });
        });

        describe('start()', () => {

            // bug #44

            it('should throw a DOMException', () => {
                const audioBufferSourceNode = offlineAudioContext.createBufferSource();

                expect(() => audioBufferSourceNode.start(-1)).to.throw('InvalidAccessError');
                expect(() => audioBufferSourceNode.start(0, -1)).to.throw('InvalidStateError');
                expect(() => audioBufferSourceNode.start(0, 0, -1)).to.throw('InvalidStateError');
            });

            // bug #92

            it('should not respect a specified duration', () => {
                const audioBuffer = offlineAudioContext.createBuffer(1, 4, 88200);
                const audioBufferSourceNode = offlineAudioContext.createBufferSource();

                audioBuffer.copyToChannel(new Float32Array([ 1, 1, 1, 1 ]), 0);

                audioBufferSourceNode.buffer = audioBuffer;
                audioBufferSourceNode.start(0, 0, (2 / offlineAudioContext.sampleRate));
                audioBufferSourceNode.connect(offlineAudioContext.destination);

                return offlineAudioContext
                    .startRendering()
                    .then((buffer) => {
                        const channelData = new Float32Array(4);

                        buffer.copyFromChannel(channelData, 0);

                        expect(Array.from(channelData)).to.deep.equal([ 1, 1, 0, 0 ]);
                    });
            });

        });

        describe('stop()', () => {

            // bug #44

            it('should throw a DOMException', () => {
                const audioBufferSourceNode = offlineAudioContext.createBufferSource();

                expect(() => audioBufferSourceNode.stop(-1)).to.throw('InvalidStateError');
            });

        });

    });

    describe('createChannelSplitter()', () => {

        // bug #29

        it('should have a channelCountMode of max', () => {
            const channelSplitterNode = offlineAudioContext.createChannelSplitter();

            expect(channelSplitterNode.channelCountMode).to.equal('max');
        });

        // bug #30

        it('should allow to set the channelCountMode', () => {
            const channelSplitterNode = offlineAudioContext.createChannelSplitter();

            channelSplitterNode.channelCountMode = 'explicit';
            channelSplitterNode.channelCountMode = 'max';
        });

        // bug #31

        it('should have a channelInterpretation of speakers', () => {
            const channelSplitterNode = offlineAudioContext.createChannelSplitter();

            expect(channelSplitterNode.channelInterpretation).to.equal('speakers');
        });

        // bug #32

        it('should allow to set the channelInterpretation', () => {
            const channelSplitterNode = offlineAudioContext.createChannelSplitter();

            channelSplitterNode.channelInterpretation = 'discrete';
            channelSplitterNode.channelInterpretation = 'speakers';
        });

    });

    describe('createConstantSource()', () => {

        // bug #62

        it('should not be implemented', () => {
            expect(offlineAudioContext.createConstantSource).to.be.undefined;
        });

    });

    describe('createGain()', () => {

        describe('gain', () => {

            describe('value', () => {

                // bug #98

                it('should ignore the value setter while an automation is running', function () {
                    this.timeout(10000);

                    const audioBuffer = offlineAudioContext.createBuffer(1, 0.5 * offlineAudioContext.sampleRate, offlineAudioContext.sampleRate);
                    const audioBufferSourceNode = offlineAudioContext.createBufferSource();
                    const gainNode = offlineAudioContext.createGain();
                    const ones = new Float32Array(0.5 * offlineAudioContext.sampleRate);

                    ones.fill(1);

                    audioBuffer.copyToChannel(ones, 0);

                    audioBufferSourceNode.buffer = audioBuffer;

                    gainNode.gain.setValueAtTime(-1, 0);
                    gainNode.gain.linearRampToValueAtTime(1, 0.5);

                    audioBufferSourceNode.connect(gainNode);
                    gainNode.connect(offlineAudioContext.destination);

                    audioBufferSourceNode.start();

                    offlineAudioContext
                        .suspend(128 / offlineAudioContext.sampleRate)
                        .then(() => {
                            gainNode.gain.value = 100;

                            offlineAudioContext.resume();
                        });

                    return offlineAudioContext
                        .startRendering()
                        .then((renderedBuffer) => {
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

                return offlineAudioContext
                    .startRendering()
                    .then(() => {
                        expect(listener).to.have.not.been.called;
                    });
            });

        });

    });

    describe('decodeAudioData()', () => {

        // bug #27

        it('should reject the promise with a DOMException', (done) => {
            offlineAudioContext
                .decodeAudioData(null)
                .catch((err) => {
                    expect(err).to.be.an.instanceOf(DOMException);

                    done();
                });
        });

        // bug #43

        it('should not throw a DataCloneError', function (done) {
            this.timeout(10000);

            loadFixtureAsArrayBuffer('1000-frames-of-noise-stereo.wav')
                .then((arrayBuffer) => {
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

        // bug #101

        it('should refuse to execute decodeAudioData() on a closed context', function (done) {
            this.timeout(10000);

            loadFixtureAsArrayBuffer('1000-frames-of-noise-stereo.wav')
                .then((arrayBuffer) => {
                    offlineAudioContext
                        .startRendering()
                        .then(() => offlineAudioContext.decodeAudioData(arrayBuffer))
                        .catch((err) => {
                            expect(err.code).to.not.equal(25);
                            expect(err.name).to.not.equal('DataCloneError');

                            done();
                        });
                });
        });

    });

    describe('startRendering()', () => {

        // bug #158

        it('should not advance currentTime', () => {
            offlineAudioContext
                .startRendering()
                .then(() => {
                    expect(offlineAudioContext.currentTime).to.equal(0);
                });
        });

    });

});
