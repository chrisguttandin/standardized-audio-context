import 'core-js/es7/reflect';
import { UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER, unpatchedAudioContextConstructor } from '../../../src/providers/unpatched-audio-context-constructor';
import { ReflectiveInjector } from '@angular/core';
import { WINDOW_PROVIDER } from '../../../src/providers/window';
import { loadFixture } from '../../helper/load-fixture';

describe('audioContextConstructor', () => {

    let audioContext;
    let AudioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        const injector = ReflectiveInjector.resolveAndCreate([
            UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
            WINDOW_PROVIDER
        ]);

        AudioContext = injector.get(unpatchedAudioContextConstructor);

        audioContext = new AudioContext();
    });

    it('should not provide an unprefixed constructor', () => {
        expect(window.AudioContext).to.be.undefined;
    });

    describe('createAnalyser()', () => {

        // bug #11

        it('should not be chainable', () => {
            const analyserNode = audioContext.createAnalyser();
            const gainNode = audioContext.createGain();

            expect(analyserNode.connect(gainNode)).to.be.undefined;
        });

        // bug #37

        it('should have a channelCount of 2', () => {
            const analyserNode = audioContext.createAnalyser();

            expect(analyserNode.channelCount).to.equal(2);
        });

        describe('getFloatTimeDomainData()', () => {

            // bug #36

            it('should not have a getFloatTimeDomainData method', () => {
                const analyserNode = audioContext.createAnalyser();

                expect(analyserNode.getFloatTimeDomainData).to.be.undefined;
            });

        });

    });

    describe('createBiquadFilter()', () => {

        // bug #11

        it('should not be chainable', () => {
            const biquadFilterNode = audioContext.createBiquadFilter();
            const gainNode = audioContext.createGain();

            expect(biquadFilterNode.connect(gainNode)).to.be.undefined;
        });

        describe('getFrequencyResponse()', () => {

            // bug #22

            it('should fill the magResponse and phaseResponse arrays with the deprecated algorithm', () => {
                const biquadFilterNode = audioContext.createBiquadFilter();
                const magResponse = new Float32Array(5);
                const phaseResponse = new Float32Array(5);

                biquadFilterNode.getFrequencyResponse(new Float32Array([ 200, 400, 800, 1600, 3200 ]), magResponse, phaseResponse);

                expect(Array.from(magResponse)).to.deep.equal([ 1.1107852458953857, 0.8106917142868042, 0.20565471053123474, 0.04845593497157097, 0.011615658178925514 ]);
                expect(Array.from(phaseResponse)).to.deep.equal([ -0.7254799008369446, -1.8217267990112305, -2.6273605823516846, -2.906902313232422, -3.0283825397491455 ]);
            });

        });

    });

    describe('createBufferSource()', () => {

        // bug #11

        it('should not be chainable', () => {
            const audioBufferSourceNode = audioContext.createBufferSource();
            const gainNode = audioContext.createGain();

            expect(audioBufferSourceNode.connect(gainNode)).to.be.undefined;
        });

        // bug #18

        it('should not allow calls to stop() of an AudioBufferSourceNode scheduled for stopping', () => {
            const audioBuffer = audioContext.createBuffer(1, 100, 44100);
            const audioBufferSourceNode = audioContext.createBufferSource();

            audioBufferSourceNode.buffer = audioBuffer;
            audioBufferSourceNode.connect(audioContext.destination);
            audioBufferSourceNode.start();
            audioBufferSourceNode.stop(audioContext.currentTime + 1);
            expect(() => {
                audioBufferSourceNode.stop();
            }).to.throw(Error);
        });

        // bug #19

        it('should not ignore calls to stop() of an already stopped AudioBufferSourceNode', (done) => {
            const audioBuffer = audioContext.createBuffer(1, 100, 44100);
            const audioBufferSourceNode = audioContext.createBufferSource();

            audioBufferSourceNode.onended = () => {
                expect(() => {
                    audioBufferSourceNode.stop();
                }).to.throw(Error);

                done();
            };

            audioBufferSourceNode.buffer = audioBuffer;
            audioBufferSourceNode.connect(audioContext.destination);
            audioBufferSourceNode.start();
            audioBufferSourceNode.stop();
        });

    });

    describe('createChannelMerger()', () => {

        // bug #11

        it('should not be chainable', () => {
            const channelMergerNode = audioContext.createChannelMerger();
            const gainNode = audioContext.createGain();

            expect(channelMergerNode.connect(gainNode)).to.be.undefined;
        });

        // bug #15

        it('should have a wrong channelCount', () => {
            const channelMergerNode = audioContext.createChannelMerger();

            expect(channelMergerNode.channelCount).to.not.equal(1);
        });

        it('should have a wrong channelCountMode', () => {
            const channelMergerNode = audioContext.createChannelMerger();

            expect(channelMergerNode.channelCountMode).to.not.equal('explicit');
        });

        // bug #20

        it('should not handle unconnected channels as silence', (done) => {
            const audioBufferSourceNode = audioContext.createBufferSource();
            const channelMergerNode = audioContext.createChannelMerger();
            const scriptProcessorNode = audioContext.createScriptProcessor(256, 2, 2);

            const sampleRate = audioContext.sampleRate;
            // @todo Safari does not play 1 sample buffers.
            const audioBuffer = audioContext.createBuffer(1, 2, sampleRate);

            // @todo Safari does not support copyToChannel().
            audioBuffer.getChannelData(0)[0] = 1;
            audioBuffer.getChannelData(0)[1] = 1;

            audioBufferSourceNode.buffer = audioBuffer;
            audioBufferSourceNode.loop = true;

            const startTime = audioContext.currentTime;

            scriptProcessorNode.onaudioprocess = (event) => {
                const channelData = event.inputBuffer.getChannelData(1);

                for (let i = 0, length = channelData.length; i < length; i += 1) {
                    if (channelData[i] === 1) {
                        done();

                        return;
                    }
                }

                if (startTime + (1 / sampleRate) < event.playbackTime) {
                    done(new Error('It should process a buffer containing a wrong sample within one second.'));
                }
            };

            audioBufferSourceNode.connect(channelMergerNode, 0, 0);
            channelMergerNode.connect(scriptProcessorNode);
            scriptProcessorNode.connect(audioContext.destination);

            audioBufferSourceNode.start(startTime);
        });

    });

    describe('createChannelSplitter()', () => {

        // bug #11

        it('should not be chainable', () => {
            const channelSplitterNode = audioContext.createChannelSplitter();
            const gainNode = audioContext.createGain();

            expect(channelSplitterNode.connect(gainNode)).to.be.undefined;
        });

        // bug #29

        it('should have a wrong channelCountMode', () => {
            const channelSplitterNode = audioContext.createChannelSplitter();

            expect(channelSplitterNode.channelCountMode).to.equal('max');
        });

        // bug #30

        it('should allow to set the channelCountMode', () => {
            const channelSplitterNode = audioContext.createChannelSplitter();

            channelSplitterNode.channelCountMode = 'explicit';
        });

        // bug #31

        it('should have a wrong channelInterpretation', () => {
            const channelSplitterNode = audioContext.createChannelSplitter();

            expect(channelSplitterNode.channelInterpretation).to.equal('speakers');
        });

        // bug #32

        it('should allow to set the channelInterpretation', () => {
            const channelSplitterNode = audioContext.createChannelSplitter();

            channelSplitterNode.channelInterpretation = 'discrete';
        });

    });

    describe('createGain()', () => {

        // bug #11

        it('should not be chainable', () => {
            const gainNodeA = audioContext.createGain();
            const gainNodeB = audioContext.createGain();

            expect(gainNodeA.connect(gainNodeB)).to.be.undefined;
        });

        // bug #12

        it('should not allow to disconnect a specific destination', (done) => {
            const analyzer = audioContext.createScriptProcessor(256, 1, 1);
            const candidate = audioContext.createGain();
            const dummy = audioContext.createGain();

            // Safari does not play buffers which contain just one frame.
            const ones = audioContext.createBuffer(1, 2, 44100);
            const channelData = ones.getChannelData(0);

            channelData[0] = 1;
            channelData[1] = 1;

            const source = audioContext.createBufferSource();

            source.buffer = ones;
            source.loop = true;

            source.connect(candidate);
            candidate.connect(analyzer);
            analyzer.connect(audioContext.destination);
            candidate.connect(dummy);
            candidate.disconnect(dummy);

            analyzer.onaudioprocess = (event) => {
                const channelData = event.inputBuffer.getChannelData(0);

                if (Array.prototype.some.call(channelData, (sample) => sample === 1)) {
                    done('should never happen');
                }
            };

            source.start();

            setTimeout(() => {
                source.stop();

                analyzer.onaudioprocess = null;

                source.disconnect(candidate);
                candidate.disconnect(analyzer);
                analyzer.disconnect(audioContext.destination);

                done();
            }, 500);
        });

        describe('cancelAndHoldAtTime()', () => {

            let gainNode;

            beforeEach(() => {
                gainNode = audioContext.createGain();
            });

            // bug #28

            it('should not be implemented', () => {
                expect(gainNode.cancelAndHoldAtTime).to.be.undefined;
            });

        });

    });

    describe('createIIRFilter()', () => {

        // bug #9

        it('should not be implemented', () => {
            expect(audioContext.createIIRFilter).to.be.undefined;
        });

    });

    describe('createOscillator()', () => {

        // bug #11

        it('should not be chainable', () => {
            const gainNode = audioContext.createGain();
            const oscillatorNode = audioContext.createOscillator();

            expect(oscillatorNode.connect(gainNode)).to.be.undefined;
        });

    });

    describe('decodeAudioData()', () => {

        // bug #1

        it('should require the success callback function as a parameter', (done) => {
            loadFixture('1000-frames-of-noise.wav', (err, arrayBuffer) => {
                expect(err).to.be.null;

                expect(() => {
                    audioContext.decodeAudioData(arrayBuffer);
                }).to.throw(TypeError, 'Not enough arguments');

                done();
            });
        });

        // bug #4

        it('should throw null when asked to decode an unsupported file', function (done) {
            this.timeout(5000);

            // PNG files are not supported by any browser :-)
            loadFixture('one-pixel-of-transparency.png', (err, arrayBuffer) => {
                expect(err).to.be.null;

                audioContext.decodeAudioData(arrayBuffer, () => {}, (err) => {
                    expect(err).to.be.null;

                    done();
                });
            });
        });

        // bug #5

        it('should return an AudioBuffer without copyFromChannel() and copyToChannel() methods', (done) => {
            loadFixture('1000-frames-of-noise.wav', (err, arrayBuffer) => {
                expect(err).to.be.null;

                audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
                    expect(audioBuffer.copyFromChannel).to.be.undefined;
                    expect(audioBuffer.copyToChannel).to.be.undefined;

                    done();
                });
            });
        });

        // bug #21

        it('should not return a promise', (done) => {
            loadFixture('1000-frames-of-noise.wav', (err, arrayBuffer) => {
                expect(err).to.be.null;

                expect(audioContext.decodeAudioData(arrayBuffer, () => {})).to.be.undefined;

                done();
            });
        });

        // bug #26

        it('should throw a synchronous error', (done) => {
            try {
                audioContext.decodeAudioData(null, () => {});
            } catch (err) {
                done();
            }
        });

    });

    describe('getOutputTimestamp()', () => {

        // bug #38

        it('should not be implemented', () => {
            expect(audioContext.getOutputTimestamp).to.be.undefined;
        });

    });

});
