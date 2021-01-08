import { spy, stub } from 'sinon';

describe('offlineAudioContextConstructor', () => {
    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new webkitOfflineAudioContext(1, 25600, 44100); // eslint-disable-line new-cap, no-undef
    });

    it('should not provide an unprefixed constructor', () => {
        expect(window.OfflineAudioContext).to.be.undefined;
    });

    describe('constructor()', () => {
        describe('with a sampleRate of 8000 Hz', () => {
            // bug #141

            it('should throw an error', () => {
                expect(() => {
                    new webkitOfflineAudioContext(1, 1, 8000); // eslint-disable-line new-cap, no-undef
                }).to.throw(DOMException);
            });
        });
    });

    describe('destination', () => {
        // bug #132

        it('should have a wrong channelCount property', () => {
            expect(offlineAudioContext.destination.channelCount).to.equal(2);
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

    describe('oncomplete', () => {
        // bug #48

        it('should not fire without any connected node', (done) => {
            offlineAudioContext.oncomplete = spy();

            offlineAudioContext.startRendering();

            // Wait a second to be sure oncomplete was not called.
            setTimeout(() => {
                expect(offlineAudioContext.oncomplete).to.have.not.been.called;

                done();
            }, 1000);
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

                biquadFilterNode.getFrequencyResponse(new Float32Array([200, 400, 800, 1600, 3200]), magResponse, phaseResponse);

                expect(Array.from(magResponse)).to.deep.equal([
                    1.1107852458953857,
                    0.8106917142868042,
                    0.20565471053123474,
                    0.04845593497157097,
                    0.011615658178925514
                ]);
                expect(Array.from(phaseResponse)).to.deep.equal([
                    -0.7254799008369446,
                    -1.8217267990112305,
                    -2.6273605823516846,
                    -2.906902313232422,
                    -3.0283825397491455
                ]);
            });

            // bug #68

            it('should throw no error', () => {
                biquadFilterNode.getFrequencyResponse(new Float32Array(), new Float32Array(1), new Float32Array(1));
            });
        });
    });

    describe('createBufferSource()', () => {
        describe('buffer', () => {
            // bug #95

            it('should not play a buffer with only one sample', (done) => {
                const audioBuffer = offlineAudioContext.createBuffer(1, 1, 44100);
                const audioBufferSourceNode = offlineAudioContext.createBufferSource();

                audioBuffer.getChannelData(0)[0] = 1;

                audioBufferSourceNode.buffer = audioBuffer;

                audioBufferSourceNode.connect(offlineAudioContext.destination);
                audioBufferSourceNode.start();

                offlineAudioContext.oncomplete = (event) => {
                    const channelData = event.renderedBuffer.getChannelData(0);

                    expect(channelData[0]).to.equal(0);

                    audioBufferSourceNode.disconnect(offlineAudioContext.destination);

                    done();
                };
                offlineAudioContext.startRendering();
            });
        });

        describe('playbackRate', () => {
            // bug #147

            it('should not respect a connected signal', (done) => {
                const audioBuffer = offlineAudioContext.createBuffer(1, 3, 44100);
                const audioBufferSourceNode = offlineAudioContext.createBufferSource();
                const playbackRateAudioBuffer = offlineAudioContext.createBuffer(1, 3, 44100);
                const playbackRateAudioBufferSourceNode = offlineAudioContext.createBufferSource();

                audioBuffer.getChannelData(0)[0] = 1;
                audioBuffer.getChannelData(0)[1] = 0;
                audioBuffer.getChannelData(0)[2] = -1;

                playbackRateAudioBuffer.getChannelData(0)[0] = 2;
                playbackRateAudioBuffer.getChannelData(0)[1] = 2;
                playbackRateAudioBuffer.getChannelData(0)[2] = 2;

                audioBufferSourceNode.buffer = audioBuffer;
                playbackRateAudioBufferSourceNode.buffer = playbackRateAudioBuffer;

                audioBufferSourceNode.connect(offlineAudioContext.destination);
                playbackRateAudioBufferSourceNode.connect(audioBufferSourceNode.playbackRate);

                audioBufferSourceNode.start(0);
                playbackRateAudioBufferSourceNode.start(0);

                offlineAudioContext.oncomplete = ({ renderedBuffer }) => {
                    // Bug #5: Safari does not support copyFromChannel().
                    const channelData = renderedBuffer.getChannelData(0);

                    expect(channelData[0]).to.equal(1);
                    expect(channelData[1]).to.equal(0);
                    expect(channelData[2]).to.equal(-1);

                    done();
                };
                offlineAudioContext.startRendering();
            });
        });

        describe('start()', () => {
            // bug #44

            it('should throw a DOMException', () => {
                const audioBufferSourceNode = offlineAudioContext.createBufferSource();

                expect(() => audioBufferSourceNode.start(-1))
                    .to.throw(DOMException)
                    .with.property('name', 'InvalidStateError');
                expect(() => audioBufferSourceNode.start(0, -1))
                    .to.throw(DOMException)
                    .with.property('name', 'InvalidStateError');
                expect(() => audioBufferSourceNode.start(0, 0, -1))
                    .to.throw(DOMException)
                    .with.property('name', 'InvalidStateError');
            });
        });

        describe('stop()', () => {
            // bug #69

            it('should not ignore calls repeated calls to start()', () => {
                const audioBufferSourceNode = offlineAudioContext.createBufferSource();

                audioBufferSourceNode.start();
                audioBufferSourceNode.start();
            });
        });
    });

    describe('createChannelMerger()', () => {
        // bug #15

        it('should have a wrong channelCount', () => {
            const channelMergerNode = offlineAudioContext.createChannelMerger();

            expect(channelMergerNode.channelCount).to.not.equal(1);
        });

        it('should have a wrong channelCountMode', () => {
            const channelMergerNode = offlineAudioContext.createChannelMerger();

            expect(channelMergerNode.channelCountMode).to.not.equal('explicit');
        });

        // bug #16

        it('should allow to set the channelCountMode', () => {
            const channelMergerNode = offlineAudioContext.createChannelMerger();

            channelMergerNode.channelCountMode = 'clamped-max';
        });
    });

    describe('createChannelSplitter()', () => {
        // bug #96

        it('should have a wrong channelCount', () => {
            const channelSplitterNode = offlineAudioContext.createChannelSplitter(6);

            expect(channelSplitterNode.channelCount).to.equal(2);
        });

        // bug #97

        it('should allow to set the channelCount', () => {
            const channelSplitterNode = offlineAudioContext.createChannelSplitter();

            channelSplitterNode.channelCount = 6;
            channelSplitterNode.channelCount = 2;
        });

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

    describe('createGain()', () => {
        // bug #12

        it('should not allow to disconnect a specific destination', (done) => {
            const candidate = offlineAudioContext.createGain();
            const dummy = offlineAudioContext.createGain();
            // Bug #95: Safari does not play/loop one sample buffers.
            const ones = offlineAudioContext.createBuffer(1, 2, 44100);

            ones.getChannelData(0)[0] = 1;
            ones.getChannelData(0)[1] = 1;

            const source = offlineAudioContext.createBufferSource();

            source.buffer = ones;

            source.connect(candidate).connect(offlineAudioContext.destination);

            candidate.connect(dummy);
            candidate.disconnect(dummy);

            source.start();

            offlineAudioContext.oncomplete = (event) => {
                const channelData = event.renderedBuffer.getChannelData(0);

                expect(channelData[0]).to.equal(0);

                source.disconnect(candidate);
                candidate.disconnect(offlineAudioContext.destination);

                done();
            };
            offlineAudioContext.startRendering();
        });
    });

    describe('createScriptProcessor()', () => {
        // bug #8

        it('should not fire onaudioprocess for every buffer', (done) => {
            const scriptProcessorNode = offlineAudioContext.createScriptProcessor(256, 1, 1);

            scriptProcessorNode.connect(offlineAudioContext.destination);
            scriptProcessorNode.onaudioprocess = stub();

            offlineAudioContext.oncomplete = () => {
                expect(scriptProcessorNode.onaudioprocess.callCount).to.be.below(100);

                done();
            };
            offlineAudioContext.startRendering();
        });

        // bug #13

        it('should not have any output', (done) => {
            const scriptProcessorNode = offlineAudioContext.createScriptProcessor(256, 1, 1);

            scriptProcessorNode.connect(offlineAudioContext.destination);
            scriptProcessorNode.onaudioprocess = (event) => {
                // Bug #5: Safari does not support copyFromChannel().
                const channelData = event.outputBuffer.getChannelData(0);

                channelData.fill(1);
            };

            offlineAudioContext.oncomplete = (event) => {
                // Bug #5: Safari does not support copyFromChannel().
                const channelData = event.renderedBuffer.getChannelData(0);

                expect(Array.from(channelData)).to.not.contain(1);

                done();
            };
            offlineAudioContext.startRendering();
        });
    });

    describe('createWaveShaper()', () => {
        // bug #119

        it('should map the values incorrectly', (done) => {
            const audioBuffer = offlineAudioContext.createBuffer(1, 5, offlineAudioContext.sampleRate);
            const audioBufferSourceNode = offlineAudioContext.createBufferSource();
            const waveShaperNode = offlineAudioContext.createWaveShaper();

            audioBufferSourceNode.buffer = audioBuffer;

            waveShaperNode.curve = new Float32Array([1, 0.5, 0]);

            audioBufferSourceNode.connect(waveShaperNode).connect(offlineAudioContext.destination);

            audioBufferSourceNode.start(0);

            offlineAudioContext.oncomplete = ({ renderedBuffer }) => {
                expect(renderedBuffer.getChannelData(0)[0]).to.equal(0.25);

                done();
            };
            offlineAudioContext.startRendering();
        });
    });
});
