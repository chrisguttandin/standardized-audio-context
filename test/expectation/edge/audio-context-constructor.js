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
    });

    describe('without a constructed AudioContext', () => {

        // bug #51

        it('should allow to set the latencyHint to an unsupported value', () => {
            audioContext = new AudioContext({ latencyHint: 'negative' });
        });

    });

    describe('with a constructed AudioContext', () => {

        beforeEach(() => {
            audioContext = new AudioContext();
        });

        describe('audioWorklet', () => {

            // bug #59

            it('should not be implemented', () => {
                expect(audioContext.audioWorklet).to.be.undefined;
            });

        });

        describe('baseLatency', () => {

            // bug #39

            it('should not be implemented', () => {
                expect(audioContext.baseLatency).to.be.undefined;
            });

        });

        describe('outputLatency', () => {

            // bug #40

            it('should not be implemented', () => {
                expect(audioContext.outputLatency).to.be.undefined;
            });

        });

        describe('createAnalyser()', () => {

            // bug #41

            it('should throw a SyntaxError when calling connect() with a node of another AudioContext', (done) => {
                const analyserNode = audioContext.createAnalyser();
                const anotherAudioContext = new AudioContext();

                try {
                    analyserNode.connect(anotherAudioContext.destination);
                } catch (err) {
                    expect(err.code).to.equal(12);
                    expect(err.name).to.equal('SyntaxError');

                    done();
                } finally {
                    anotherAudioContext.close();
                }
            });

            // bug #58

            it('should throw a SyntaxError when calling connect() with an AudioParam of another AudioContext', (done) => {
                const analyserNode = audioContext.createAnalyser();
                const anotherAudioContext = new AudioContext();
                const gainNode = anotherAudioContext.createGain();

                try {
                    analyserNode.connect(gainNode.gain);
                } catch (err) {
                    expect(err.code).to.equal(12);
                    expect(err.name).to.equal('SyntaxError');

                    done();
                } finally {
                    anotherAudioContext.close();
                }
            });

        });

        describe('createBiquadFilter()', () => {

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

            describe('playbackRate', () => {

                // bug #45

                it('should throw a DOMException', () => {
                    const bufferSourceNode = audioContext.createBufferSource();

                    expect(() => {
                        bufferSourceNode.playbackRate.exponentialRampToValueAtTime(0, 1);
                    }).to.throw('InvalidAccessError');
                });

            });

            describe('start()', () => {

                // bug #44

                it('should throw a DOMException', () => {
                    const bufferSourceNode = audioContext.createBufferSource();

                    expect(() => bufferSourceNode.start(-1)).to.throw('InvalidAccessError');
                    expect(() => bufferSourceNode.start(0, -1)).to.throw('InvalidStateError');
                    expect(() => bufferSourceNode.start(0, 0, -1)).to.throw('InvalidStateError');
                });

            });

            describe('stop()', () => {

                // bug #44

                it('should throw a DOMException', () => {
                    const bufferSourceNode = audioContext.createBufferSource();

                    expect(() => bufferSourceNode.stop(-1)).to.throw('InvalidStateError');
                });

            });

        });

        describe('createChannelSplitter()', () => {

            // bug #29

            it('should have a channelCountMode of max', () => {
                const channelSplitterNode = audioContext.createChannelSplitter();

                expect(channelSplitterNode.channelCountMode).to.equal('max');
            });

            // bug #30

            it('should allow to set the channelCountMode', () => {
                const channelSplitterNode = audioContext.createChannelSplitter();

                channelSplitterNode.channelCountMode = 'explicit';
            });

            // bug #31

            it('should have a channelInterpretation of speakers', () => {
                const channelSplitterNode = audioContext.createChannelSplitter();

                expect(channelSplitterNode.channelInterpretation).to.equal('speakers');
            });

            // bug #32

            it('should allow to set the channelInterpretation', () => {
                const channelSplitterNode = audioContext.createChannelSplitter();

                channelSplitterNode.channelInterpretation = 'discrete';
            });

        });

        describe('createConstantSource()', () => {

            // bug #62

            it('should not be implemented', () => {
                expect(audioContext.createConstantSource).to.be.undefined;
            });

        });

        describe('createGain()', () => {

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

        describe('createMediaElementSource()', () => {

            describe('mediaElement', () => {

                let mediaElementSourceNode;

                beforeEach(() => {
                    mediaElementSourceNode = audioContext.createMediaElementSource(new Audio());
                });

                // bug #63

                it('should not be implemented', () => {
                    expect(mediaElementSourceNode.mediaElement).to.be.undefined;
                });

            });

        });

        describe('createMediaStreamDestination()', () => {

            // bug #64

            it('should not be implemented', () => {
                expect(audioContext.createMediaStreamDestination).to.be.undefined;
            });

        });

        describe('createOscillator()', () => {

            describe('type', () => {

                let oscillatorNode;

                beforeEach(() => {
                    oscillatorNode = audioContext.createOscillator();
                });

                // bug #57

                it('should not throw an error', () => {
                    oscillatorNode.type = 'custom';

                    expect(oscillatorNode.type).to.equal('sine');
                });

            });

        });

        describe('decodeAudioData()', () => {

            // bug #27

            it('should reject the promise with a DOMException', (done) => {
                audioContext
                    .decodeAudioData(null)
                    .catch((err) => {
                        expect(err).to.be.an.instanceOf(DOMException);

                        done();
                    });
            });

            // bug #43

            it('should not throw a DataCloneError', (done) => {
                loadFixture('1000-frames-of-noise.wav', (err, arrayBuffer) => {
                    expect(err).to.be.null;

                    audioContext
                        .decodeAudioData(arrayBuffer)
                        .then(() => audioContext.decodeAudioData(arrayBuffer))
                        .catch((err) => {
                            expect(err.code).to.not.equal(25);
                            expect(err.name).to.not.equal('DataCloneError');

                            done();
                        });
                });
            });

        });

        describe('getOutputTimestamp()', () => {

            // bug #38

            it('should not be implemented', () => {
                expect(audioContext.getOutputTimestamp).to.be.undefined;
            });

        });

        describe('resume()', () => {

            afterEach(() => {
                // Create a closeable AudioContext to align the behaviour with other tests.
                audioContext = new AudioContext();
            });

            beforeEach(() => audioContext.close());

            // bug #55

            it('should throw an InvalidAccessError with a closed AudioContext', (done) => {
                audioContext
                    .resume()
                    .catch((err) => {
                        expect(err.code).to.equal(15);
                        expect(err.name).to.equal('InvalidAccessError');

                        done();
                    });
            });

        });

    });

});
