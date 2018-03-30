import 'core-js/es7/reflect';
import { UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER, unpatchedOfflineAudioContextConstructor } from '../../../../src/providers/unpatched-offline-audio-context-constructor';
import { ReflectiveInjector } from '@angular/core';
import { WINDOW_PROVIDER } from '../../../../src/providers/window';
import { spy } from 'sinon';

describe('offlineAudioContextConstructor', () => {

    let offlineAudioContext;
    let OfflineAudioContext;

    beforeEach(() => {
        const injector = ReflectiveInjector.resolveAndCreate([
            UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
            WINDOW_PROVIDER
        ]);

        OfflineAudioContext = injector.get(unpatchedOfflineAudioContextConstructor);

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

    describe('createBufferSource()', () => {

        describe('buffer', () => {

            // bug #72

            it('should allow to assign the buffer multiple times', () => {
                const bufferSourceNode = offlineAudioContext.createBufferSource();

                bufferSourceNode.buffer = offlineAudioContext.createBuffer(2, 100, 44100);
                bufferSourceNode.buffer = offlineAudioContext.createBuffer(2, 100, 44100);
            });

        });

        describe('start()', () => {

            // bug #44

            it('should throw a DOMException', () => {
                const bufferSourceNode = offlineAudioContext.createBufferSource();

                expect(() => bufferSourceNode.start(-1)).to.throw(DOMException);

                // A negative offset does not throw anything.
                bufferSourceNode.start(0, -1);

                expect(() => bufferSourceNode.start(0, 0, -1)).to.throw(DOMException);
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
        });

    });

    describe('createConstantSource()', () => {

        describe('channelCount', () => {

            // bug #67

            it('should have a channelCount of 1', () => {
                const constantSourceNode = offlineAudioContext.createConstantSource();

                expect(constantSourceNode.channelCount).to.equal(1);
            });

        });

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
