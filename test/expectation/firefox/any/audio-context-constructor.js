import 'core-js/es7/reflect';
import { UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER, unpatchedAudioContextConstructor } from '../../../../src/providers/unpatched-audio-context-constructor';
import { ReflectiveInjector } from '@angular/core';
import { WINDOW_PROVIDER } from '../../../../src/providers/window';
import { spy } from 'sinon';

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

        describe('close()', () => {

            // bug #35

            it('should not throw an error if it was closed before', () => {
                return audioContext
                    .close()
                    .then(() => audioContext.close());
            });

        });

        describe('createAnalyser()', () => {

            // bug #37

            it('should have a channelCount of 1', () => {
                const analyserNode = audioContext.createAnalyser();

                expect(analyserNode.channelCount).to.equal(1);
            });

        });

        describe('createBuffer()', () => {

            // bug #42

            describe('copyFromChannel()/copyToChannel()', () => {

                let audioBuffer;

                beforeEach(() => {
                    audioBuffer = audioContext.createBuffer(2, 100, 44100);
                });

                it('should not allow to copy only a part to the source', () => {
                    const source = new Float32Array(10);

                    expect(() => {
                        audioBuffer.copyToChannel(source, 0, 95);
                    }).to.throw(Error);
                });

                it('should not allow to copy only a part of the destination', () => {
                    const destination = new Float32Array(10);

                    expect(() => {
                        audioBuffer.copyFromChannel(destination, 0, 95);
                    }).to.throw(Error);
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
                    }).to.throw(DOMException);
                });

            });

            describe('start()', () => {

                // bug #44

                it('should throw a DOMException', () => {
                    const bufferSourceNode = audioContext.createBufferSource();

                    expect(() => bufferSourceNode.start(-1)).to.throw(DOMException);

                    // A negative offset does not throw anything.
                    bufferSourceNode.start(0, -1);

                    expect(() => bufferSourceNode.start(0, 0, -1)).to.throw(DOMException);
                });

            });

            describe('stop()', () => {

                // bug #44

                it('should throw a DOMException', () => {
                    const bufferSourceNode = audioContext.createBufferSource();

                    expect(() => bufferSourceNode.stop(-1)).to.throw(DOMException);
                });

            });

        });

        describe('createChannelMerger()', () => {

            // bug #16

            it('should allow to set the channelCount', () => {
                const channelMergerNode = audioContext.createChannelMerger();

                channelMergerNode.channelCountMode = '2';
            });

            it('should allow to set the channelCountMode', () => {
                const channelMergerNode = audioContext.createChannelMerger();

                channelMergerNode.channelCountMode = 'max';
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

        describe('createGain()', () => {

            // bug #25

            it('should not allow to use setValueCurveAtTime after calling cancelScheduledValues', () => {
                const gainNode = audioContext.createGain();

                gainNode.gain.setValueCurveAtTime(new Float32Array([ 1, 1 ]), 0, 1);
                gainNode.gain.cancelScheduledValues(0.2);
                expect(() => {
                    gainNode.gain.setValueCurveAtTime(new Float32Array([ 1, 1 ]), 0.4, 1);
                }).to.throw(Error);
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

        describe('decodeAudioData()', () => {

            // bug #6

            it('should not call the errorCallback at all', (done) => {
                const errorCallback = spy();

                audioContext.decodeAudioData(null, () => {}, errorCallback);

                setTimeout(() => {
                    expect(errorCallback).to.have.not.been.called;

                    done();
                }, 1000);
            });

        });

        describe('getOutputTimestamp()', () => {

            // bug #38

            it('should not be implemented', () => {
                expect(audioContext.getOutputTimestamp).to.be.undefined;
            });

        });

    });

});
