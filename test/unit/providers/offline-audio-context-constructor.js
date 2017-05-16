import 'core-js/es7/reflect';
import { OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER, offlineAudioContextConstructor } from '../../../src/providers/offline-audio-context-constructor';
import { AudioBufferCopyChannelMethodsSupportTester } from '../../../src/testers/audio-buffer-copy-channel-methods-support';
import { AudioBufferCopyChannelMethodsWrapper } from '../../../src/wrappers/audio-buffer-copy-channel-methods';
import { AudioBufferWrapper } from '../../../src/wrappers/audio-buffer';
import { DETACHED_AUDIO_BUFFERS_PROVIDER } from '../../../src/providers/detached-audio-buffers';
import { DataCloneErrorFactory } from '../../../src/factories/data-clone-error';
import { EncodingErrorFactory } from '../../../src/factories/encoding-error';
import { IIRFilterNodeGetFrequencyResponseMethodWrapper } from '../../../src/wrappers/iir-filter-node-get-frequency-response-method';
import { IndexSizeErrorFactory } from '../../../src/factories/index-size-error';
import { InvalidStateErrorFactory } from '../../../src/factories/invalid-state-error';
import { NotSupportedErrorFactory } from '../../../src/factories/not-supported-error';
import { OfflineAudioBufferSourceNodeFakerFactory } from '../../../src/factories/offline-audio-buffer-source-node';
import { OfflineAudioDestinationNodeFakerFactory } from '../../../src/factories/offline-audio-destination-node';
import { OfflineBiquadFilterNodeFakerFactory } from '../../../src/factories/offline-biquad-filter-node';
import { OfflineGainNodeFakerFactory } from '../../../src/factories/offline-gain-node';
import { OfflineIIRFilterNodeFakerFactory } from '../../../src/factories/offline-iir-filter-node';
import { PromiseSupportTester } from '../../../src/testers/promise-support';
import { ReflectiveInjector } from '@angular/core';
import { UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER } from '../../../src/providers/unpatched-offline-audio-context-constructor';
import { WINDOW_PROVIDER } from '../../../src/providers/window';
import { loadFixture } from '../../helper/load-fixture';
import { spy } from 'sinon';

describe('OfflineAudioContext', () => {

    let offlineAudioContext;

    let OfflineAudioContext;

    beforeEach(() => {
        const injector = ReflectiveInjector.resolveAndCreate([
            AudioBufferCopyChannelMethodsSupportTester,
            AudioBufferCopyChannelMethodsWrapper,
            AudioBufferWrapper,
            DETACHED_AUDIO_BUFFERS_PROVIDER,
            DataCloneErrorFactory,
            EncodingErrorFactory,
            IIRFilterNodeGetFrequencyResponseMethodWrapper,
            IndexSizeErrorFactory,
            InvalidStateErrorFactory,
            NotSupportedErrorFactory,
            OfflineAudioBufferSourceNodeFakerFactory,
            OfflineAudioDestinationNodeFakerFactory,
            OfflineBiquadFilterNodeFakerFactory,
            OfflineGainNodeFakerFactory,
            OfflineIIRFilterNodeFakerFactory,
            OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
            PromiseSupportTester,
            UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
            WINDOW_PROVIDER
        ]);

        OfflineAudioContext = injector.get(offlineAudioContextConstructor);

        // Chrome, Firefox and maybe others as well do not call a ScriptProcessorNode if the length
        // is 128 samples or less.
        offlineAudioContext = new OfflineAudioContext(2, 129, 44100);
    });

    describe('destination', () => {

        it('should be an instance of the AudioDestinationNode interface', () => {
            const destination = offlineAudioContext.destination;

            // @todo expect(destination.channelCount).to.equal(2);
            // @todo expect(destination.channelCountMode).to.equal('explicit');
            expect(destination.channelInterpretation).to.equal('speakers');
            expect(destination.maxChannelCount).to.be.a('number');
            // @todo expect(destination.maxChannelCount).to.equal( number of channels );
            expect(destination.numberOfInputs).to.equal(1);
            expect(destination.numberOfOutputs).to.equal(0);
        });

        it('should be readonly', () => {
            expect(() => {
                offlineAudioContext.destination = 'a fake AudioDestinationNode';
            }).to.throw(TypeError);
        });

    });

    describe('length', () => {

        it('should expose its length', () => {
            expect(offlineAudioContext.length).to.equal(129);
        });

        it('should be readonly', () => {
            expect(() => {
                offlineAudioContext.length = 128;
            }).to.throw(TypeError);
        });

    });

    describe('sampleRate', () => {

        it('should be a number', () => {
            expect(offlineAudioContext.sampleRate).to.equal(44100);
        });

        it('should be readonly', () => {
            expect(() => {
                offlineAudioContext.sampleRate = 22050;
            }).to.throw(TypeError);
        });

    });

    describe('createBiquadFilter()', () => {

        it('should return an instance of the BiquadFilterNode interface', () => {
            const biquadFilterNode = offlineAudioContext.createBiquadFilter();

            expect(biquadFilterNode.channelCountMode).to.equal('max');
            expect(biquadFilterNode.channelInterpretation).to.equal('speakers');

            expect(biquadFilterNode.detune.cancelScheduledValues).to.be.a('function');
            expect(biquadFilterNode.detune.defaultValue).to.equal(0);
            expect(biquadFilterNode.detune.exponentialRampToValueAtTime).to.be.a('function');
            expect(biquadFilterNode.detune.linearRampToValueAtTime).to.be.a('function');
            expect(biquadFilterNode.detune.setTargetAtTime).to.be.a('function');
            expect(biquadFilterNode.detune.setValueCurveAtTime).to.be.a('function');
            expect(biquadFilterNode.detune.value).to.equal(0);

            expect(biquadFilterNode.frequency.cancelScheduledValues).to.be.a('function');
            expect(biquadFilterNode.frequency.defaultValue).to.equal(350);
            expect(biquadFilterNode.frequency.exponentialRampToValueAtTime).to.be.a('function');
            expect(biquadFilterNode.frequency.linearRampToValueAtTime).to.be.a('function');
            expect(biquadFilterNode.frequency.setTargetAtTime).to.be.a('function');
            expect(biquadFilterNode.frequency.setValueCurveAtTime).to.be.a('function');
            expect(biquadFilterNode.frequency.value).to.equal(350);

            expect(biquadFilterNode.gain.cancelScheduledValues).to.be.a('function');
            expect(biquadFilterNode.gain.defaultValue).to.equal(0);
            expect(biquadFilterNode.gain.exponentialRampToValueAtTime).to.be.a('function');
            expect(biquadFilterNode.gain.linearRampToValueAtTime).to.be.a('function');
            expect(biquadFilterNode.gain.setTargetAtTime).to.be.a('function');
            expect(biquadFilterNode.gain.setValueCurveAtTime).to.be.a('function');
            expect(biquadFilterNode.gain.value).to.equal(0);

            expect(biquadFilterNode.getFrequencyResponse).to.be.a('function');
            expect(biquadFilterNode.numberOfInputs).to.equal(1);
            expect(biquadFilterNode.numberOfOutputs).to.equal(1);

            expect(biquadFilterNode.Q.cancelScheduledValues).to.be.a('function');
            expect(biquadFilterNode.Q.defaultValue).to.equal(1);
            expect(biquadFilterNode.Q.exponentialRampToValueAtTime).to.be.a('function');
            expect(biquadFilterNode.Q.linearRampToValueAtTime).to.be.a('function');
            expect(biquadFilterNode.Q.setTargetAtTime).to.be.a('function');
            expect(biquadFilterNode.Q.setValueCurveAtTime).to.be.a('function');
            expect(biquadFilterNode.Q.value).to.equal(1);

            expect(biquadFilterNode.type).to.be.a('string');
        });

        it('should be chainable', () => {
            const biquadFilterNode = offlineAudioContext.createBiquadFilter();
            const gainNode = offlineAudioContext.createGain();

            expect(biquadFilterNode.connect(gainNode)).to.equal(gainNode);
        });

        it('should not be connectable to a node of another AudioContext', (done) => {
            const anotherOfflineAudioContext = new OfflineAudioContext(2, 129, 44100);
            const biquadFilterNode = offlineAudioContext.createBiquadFilter();

            try {
                biquadFilterNode.connect(anotherOfflineAudioContext.destination);
            } catch (err) {
                expect(err.code).to.equal(15);
                expect(err.name).to.equal('InvalidAccessError');

                done();
            }
        });

        describe('getFrequencyResponse()', () => {

            // bug #22 This is not yet implemented in Edge and Safari.

            // it('should fill the magResponse and phaseResponse arrays', () => {
            //     const biquadFilterNode = offlineAudioContext.createBiquadFilter();
            //     const magResponse = new Float32Array(5);
            //     const phaseResponse = new Float32Array(5);
            //
            //     biquadFilterNode.getFrequencyResponse(new Float32Array([ 200, 400, 800, 1600, 3200 ]), magResponse, phaseResponse);
            //
            //     expect(Array.from(magResponse)).to.deep.equal([ 1.184295654296875, 0.9401244521141052, 0.2128090262413025, 0.048817940056324005, 0.011635963805019855 ]);
            //     expect(Array.from(phaseResponse)).to.deep.equal([ -0.6473332643508911, -1.862880825996399, -2.692772388458252, -2.9405176639556885, -3.044968605041504 ]);
            // });

        });

    });

    describe('createGain()', () => {

        it('should return an instance of the GainNode interface', () => {
            const gainNode = offlineAudioContext.createGain();

            expect(gainNode.channelCountMode).to.equal('max');
            expect(gainNode.channelInterpretation).to.equal('speakers');

            expect(gainNode.gain.cancelScheduledValues).to.be.a('function');
            expect(gainNode.gain.defaultValue).to.equal(1);
            expect(gainNode.gain.exponentialRampToValueAtTime).to.be.a('function');
            expect(gainNode.gain.linearRampToValueAtTime).to.be.a('function');
            expect(gainNode.gain.setTargetAtTime).to.be.a('function');
            expect(gainNode.gain.setValueCurveAtTime).to.be.a('function');
            expect(gainNode.gain.value).to.equal(1);

            expect(gainNode.numberOfInputs).to.equal(1);
            expect(gainNode.numberOfOutputs).to.equal(1);
        });

        it('should be chainable', () => {
            const gainNodeA = offlineAudioContext.createGain();
            const gainNodeB = offlineAudioContext.createGain();

            expect(gainNodeA.connect(gainNodeB)).to.equal(gainNodeB);
        });

        it('should be disconnectable', (done) => {
            const candidate = offlineAudioContext.createGain();
            const dummy = offlineAudioContext.createGain();

            // Safari does not play buffers which contain just one frame.
            const ones = offlineAudioContext.createBuffer(1, 2, 44100);

            ones.getChannelData(0)[0] = 1;
            ones.getChannelData(0)[1] = 1;

            const source = offlineAudioContext.createBufferSource();

            source.buffer = ones;

            source.connect(candidate);
            candidate.connect(offlineAudioContext.destination);
            candidate.connect(dummy);
            candidate.disconnect(dummy);

            source.start(0);

            offlineAudioContext
                .startRendering()
                .then((renderedBuffer) => {
                    const channelData = renderedBuffer.getChannelData(0);

                    expect(channelData[0]).to.equal(1);

                    done();
                });
        });

        it('should not be connectable to a node of another AudioContext', (done) => {
            const anotherOfflineAudioContext = new OfflineAudioContext(2, 129, 44100);
            const gainNode = offlineAudioContext.createGain();

            try {
                gainNode.connect(anotherOfflineAudioContext.destination);
            } catch (err) {
                expect(err.code).to.equal(15);
                expect(err.name).to.equal('InvalidAccessError');

                done();
            }
        });

    });

    describe('createIIRFilter()', () => {

        it('should return an instance of the IIRFilterNode interface', () => {
            const iIRFilterNode = offlineAudioContext.createIIRFilter([ 1 ], [ 1 ]);

            expect(iIRFilterNode.channelCountMode).to.equal('max');
            expect(iIRFilterNode.channelInterpretation).to.equal('speakers');

            expect(iIRFilterNode.getFrequencyResponse).to.be.a('function');

            expect(iIRFilterNode.numberOfInputs).to.equal(1);
            expect(iIRFilterNode.numberOfOutputs).to.equal(1);
        });

        it('should throw an InvalidStateError', (done) => {
            try {
                offlineAudioContext.createIIRFilter([ 0 ], [ 1 ]);
            } catch (err) {
                expect(err.code).to.equal(11);
                expect(err.name).to.equal('InvalidStateError');

                done();
            }
        });

        it('should throw an NotSupportedError', (done) => {
            try {
                offlineAudioContext.createIIRFilter([], [ 1 ]);
            } catch (err) {
                expect(err.code).to.equal(9);
                expect(err.name).to.equal('NotSupportedError');

                done();
            }
        });

        it('should throw an NotSupportedError', (done) => {
            try {
                offlineAudioContext.createIIRFilter([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21 ], [ 1 ]);
            } catch (err) {
                expect(err.code).to.equal(9);
                expect(err.name).to.equal('NotSupportedError');

                done();
            }
        });

        it('should throw an InvalidStateError', (done) => {
            try {
                offlineAudioContext.createIIRFilter([ 1 ], [ 0, 1 ]);
            } catch (err) {
                expect(err.code).to.equal(11);
                expect(err.name).to.equal('InvalidStateError');

                done();
            }
        });

        it('should throw an NotSupportedError', (done) => {
            try {
                offlineAudioContext.createIIRFilter([ 1 ], []);
            } catch (err) {
                expect(err.code).to.equal(9);
                expect(err.name).to.equal('NotSupportedError');

                done();
            }
        });

        it('should throw an NotSupportedError', (done) => {
            try {
                offlineAudioContext.createIIRFilter([ 1 ], [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21 ]);
            } catch (err) {
                expect(err.code).to.equal(9);
                expect(err.name).to.equal('NotSupportedError');

                done();
            }
        });

        it('should filter the given input', function (done) {
            this.timeout(10000);

            const audioBuffer = offlineAudioContext.createBuffer(2, 3, 44100);
            const audioBufferSourceNode = offlineAudioContext.createBufferSource();
            const iIRFilterNode = offlineAudioContext.createIIRFilter([ 1, -1 ], [ 1, -0.5 ]);

            // @todo Use copyToChannel() once it becomes available.
            // buffer.copyToChannel(new Float32Array([1, 0, 0]), 0);
            // buffer.copyToChannel(new Float32Array([0, 1, 1]), 1);
            audioBuffer.getChannelData(0)[0] = 1;
            audioBuffer.getChannelData(0)[1] = 0;
            audioBuffer.getChannelData(0)[2] = 0;
            audioBuffer.getChannelData(1)[0] = 0;
            audioBuffer.getChannelData(1)[1] = 1;
            audioBuffer.getChannelData(1)[2] = 1;

            audioBufferSourceNode.buffer = audioBuffer;

            audioBufferSourceNode.start(0);

            audioBufferSourceNode
                .connect(iIRFilterNode)
                .connect(offlineAudioContext.destination);

            offlineAudioContext
                .startRendering()
                .then((renderedBuffer) => {
                    const leftChannelData = renderedBuffer.getChannelData(0);
                    const rightChannelData = renderedBuffer.getChannelData(1);

                    expect(leftChannelData[0]).to.equal(1);
                    expect(leftChannelData[1]).to.equal(-0.5);
                    expect(leftChannelData[2]).to.equal(-0.25);

                    expect(rightChannelData[0]).to.be.closeTo(0, 1e-37);
                    expect(rightChannelData[1]).to.equal(1);
                    expect(rightChannelData[2]).to.equal(0.5);

                    done();
                });
        });

        it('should filter another given input', function (done) {
            this.timeout(10000);

            // Recreate an OfflineAudioContext with 3 channels.
            offlineAudioContext = new OfflineAudioContext(3, offlineAudioContext.length, offlineAudioContext.sampleRate);

            const audioBuffer = offlineAudioContext.createBuffer(3, 3, 44100);
            const audioBufferSourceNode = offlineAudioContext.createBufferSource();
            const iIRFilterNode = offlineAudioContext.createIIRFilter([ 0.5, -1 ], [ 1, -1 ]);

            // @todo Use copyToChannel() once it becomes available.
            // buffer.copyToChannel(new Float32Array([1, 1, 1]), 0);
            // buffer.copyToChannel(new Float32Array([1, 0, 0]), 1);
            // buffer.copyToChannel(new Float32Array([0, 1, 1]), 2);
            audioBuffer.getChannelData(0)[0] = 1;
            audioBuffer.getChannelData(0)[1] = 1;
            audioBuffer.getChannelData(0)[2] = 1;

            audioBuffer.getChannelData(1)[0] = 1;
            audioBuffer.getChannelData(1)[1] = 0;
            audioBuffer.getChannelData(1)[2] = 0;

            audioBuffer.getChannelData(2)[0] = 0;
            audioBuffer.getChannelData(2)[1] = 1;
            audioBuffer.getChannelData(2)[2] = 1;

            audioBufferSourceNode.buffer = audioBuffer;

            audioBufferSourceNode.start(0);

            audioBufferSourceNode
                .connect(iIRFilterNode)
                .connect(offlineAudioContext.destination);

            offlineAudioContext
                .startRendering()
                .then((renderedBuffer) => {
                    const firstChannelData = renderedBuffer.getChannelData(0);
                    const secondChannelData = renderedBuffer.getChannelData(1);
                    const thirdChannelData = renderedBuffer.getChannelData(2);

                    expect(firstChannelData[0]).to.equal(0.5);
                    expect(firstChannelData[1]).to.equal(0);
                    expect(firstChannelData[2]).to.equal(-0.5);

                    expect(secondChannelData[0]).to.equal(0.5);
                    expect(secondChannelData[1]).to.equal(-0.5);
                    expect(secondChannelData[2]).to.equal(-0.5);

                    expect(thirdChannelData[0]).to.equal(0);
                    expect(thirdChannelData[1]).to.equal(0.5);
                    expect(thirdChannelData[2]).to.equal(0);

                    done();
                });
        });

        it('should be chainable', () => {
            const gainNode = offlineAudioContext.createGain();
            const iIRFilterNode = offlineAudioContext.createIIRFilter([ 1, -1 ], [ 1, -0.5 ]);

            expect(iIRFilterNode.connect(gainNode)).to.equal(gainNode);
        });

        it('should not be connectable to a node of another AudioContext', (done) => {
            const anotherOfflineAudioContext = new OfflineAudioContext(2, 129, 44100);
            const iIRFilterNode = offlineAudioContext.createIIRFilter([ 1 ], [ 1 ]);

            try {
                iIRFilterNode.connect(anotherOfflineAudioContext.destination);
            } catch (err) {
                expect(err.code).to.equal(15);
                expect(err.name).to.equal('InvalidAccessError');

                done();
            }
        });

        describe('getFrequencyResponse()', () => {

            it('should throw an NotSupportedError', (done) => {
                const iIRFilterNode = offlineAudioContext.createIIRFilter([ 1 ], [ 1 ]);

                try {
                    iIRFilterNode.getFrequencyResponse(new Float32Array([ 1 ]), new Float32Array(0), new Float32Array(1));
                } catch (err) {
                    expect(err.code).to.equal(9);
                    expect(err.name).to.equal('NotSupportedError');

                    done();
                }
            });

            it('should throw an NotSupportedError', (done) => {
                const iIRFilterNode = offlineAudioContext.createIIRFilter([ 1 ], [ 1 ]);

                try {
                    iIRFilterNode.getFrequencyResponse(new Float32Array([ 1 ]), new Float32Array(1), new Float32Array(0));
                } catch (err) {
                    expect(err.code).to.equal(9);
                    expect(err.name).to.equal('NotSupportedError');

                    done();
                }
            });

            it('should fill the magResponse and phaseResponse arrays', () => {
                const iIRFilterNode = offlineAudioContext.createIIRFilter([ 1 ], [ 1 ]);
                const magResponse = new Float32Array(5);
                const phaseResponse = new Float32Array(5);

                iIRFilterNode.getFrequencyResponse(new Float32Array([ 200, 400, 800, 1600, 3200 ]), magResponse, phaseResponse);

                expect(Array.from(magResponse)).to.deep.equal([ 1, 1, 1, 1, 1 ]);
                expect(Array.from(phaseResponse)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
            });

            it('should fill the magResponse and phaseResponse arrays ... for some other values', () => {
                const iIRFilterNode = offlineAudioContext.createIIRFilter([ 1, -1 ], [ 1, -0.5 ]);
                const magResponse = new Float32Array(5);
                const phaseResponse = new Float32Array(5);

                iIRFilterNode.getFrequencyResponse(new Float32Array([ 200, 400, 800, 1600, 3200 ]), magResponse, phaseResponse);

                expect(Array.from(magResponse)).to.deep.equal([ 0.056942202150821686, 0.11359700560569763, 0.2249375581741333, 0.43307945132255554, 0.7616625428199768 ]);
                expect(Array.from(phaseResponse)).to.deep.equal([ 1.5280766487121582, 1.4854952096939087, 1.401282548904419, 1.2399859428405762, 0.9627721309661865 ]);
            });

        });

    });

    describe('decodeAudioData()', () => {

        it('should return a promise', () => {
            expect(offlineAudioContext.decodeAudioData()).to.be.an.instanceOf(Promise);
        });

        describe('without a valid arrayBuffer', () => {

            it('should throw an error', (done) => {
                offlineAudioContext
                    .decodeAudioData(null)
                    .catch((err) => {
                        expect(err).to.be.an.instanceOf(TypeError);

                        done();
                    });
            });

            it('should call the errorCallback with a TypeError', (done) => {
                offlineAudioContext.decodeAudioData(null, () => {}, (err) => {
                    expect(err).to.be.an.instanceOf(TypeError);

                    done();
                });
            });

            // The promise is rejected before but the errorCallback gets called synchronously.
            it('should call the errorCallback before the promise gets rejected', (done) => {
                const errorCallback = spy();

                offlineAudioContext
                    .decodeAudioData(null, () => {}, errorCallback)
                    .catch(() => {
                        expect(errorCallback).to.have.been.calledOnce;

                        done();
                    });
            });

        });

        describe('with an arrayBuffer of an unsupported file', function () {

            let arrayBuffer;

            beforeEach((done) => {
                this.timeout(5000);

                // PNG files are not supported by any browser :-)
                loadFixture('one-pixel-of-transparency.png', (err, rrBffr) => {
                    expect(err).to.be.null;

                    arrayBuffer = rrBffr;

                    done();
                });
            });

            it('should throw an error', (done) => {
                offlineAudioContext
                    .decodeAudioData(arrayBuffer)
                    .catch((err) => {
                        expect(err.code).to.equal(0);
                        expect(err.name).to.equal('EncodingError');

                        done();
                    });
            });

            it('should call the errorCallback with an error', (done) => {
                offlineAudioContext.decodeAudioData(arrayBuffer, () => {}, (err) => {
                    expect(err.code).to.equal(0);
                    expect(err.name).to.equal('EncodingError');

                    done();
                });
            });

            // The promise is rejected before but the errorCallback gets called synchronously.
            it('should call the errorCallback before the promise gets rejected', (done) => {
                const errorCallback = spy();

                offlineAudioContext
                    .decodeAudioData(arrayBuffer, () => {}, errorCallback)
                    .catch(() => {
                        expect(errorCallback).to.have.been.calledOnce;

                        done();
                    });
            });

        });

        describe('with an arrayBuffer of a supported file', function () {

            let arrayBuffer;

            beforeEach((done) => {
                this.timeout(5000);

                loadFixture('1000-frames-of-noise.wav', (err, rrBffr) => {
                    expect(err).to.be.null;

                    arrayBuffer = rrBffr;

                    done();
                });
            });

            it('should resolve to an instance of the AudioBuffer interface', () => {
                return offlineAudioContext
                    .decodeAudioData(arrayBuffer)
                    .then((audioBuffer) => {
                        expect(audioBuffer.duration).to.be.closeTo(1000 / 44100, 0.001);
                        expect(audioBuffer.length).to.equal(1000);
                        expect(audioBuffer.numberOfChannels).to.equal(2);
                        expect(audioBuffer.sampleRate).to.equal(44100);

                        expect(audioBuffer.getChannelData).to.be.a('function');
                        expect(audioBuffer.copyFromChannel).to.be.a('function');
                        expect(audioBuffer.copyToChannel).to.be.a('function');
                    });
            });

            it('should call the successCallback with an instance of the AudioBuffer interface', (done) => {
                offlineAudioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
                    expect(audioBuffer.duration).to.be.closeTo(1000 / 44100, 0.001);
                    expect(audioBuffer.length).to.equal(1000);
                    expect(audioBuffer.numberOfChannels).to.equal(2);
                    expect(audioBuffer.sampleRate).to.equal(44100);

                    expect(audioBuffer.getChannelData).to.be.a('function');
                    expect(audioBuffer.copyFromChannel).to.be.a('function');
                    expect(audioBuffer.copyToChannel).to.be.a('function');

                    done();
                });
            });

            // The promise is resolved before but the successCallback gets called synchronously.
            it('should call the successCallback before the promise gets resolved', () => {
                const successCallback = spy();

                return offlineAudioContext
                    .decodeAudioData(arrayBuffer, successCallback)
                    .then(() => {
                        expect(successCallback).to.have.been.calledOnce;
                    });
            });

            it('should throw a DataCloneError', (done) => {
                offlineAudioContext
                    .decodeAudioData(arrayBuffer)
                    .then(() => offlineAudioContext.decodeAudioData(arrayBuffer))
                    .catch((err) => {
                        expect(err.code).to.equal(25);
                        expect(err.name).to.equal('DataCloneError');

                        done();
                    });
            });

            it('should neuter the arrayBuffer', (done) => {
                offlineAudioContext.decodeAudioData(arrayBuffer);

                setTimeout(() => {
                    expect(() => {
                        // Firefox will throw an error when using a neutered ArrayBuffer.
                        const uint8Array = new Uint8Array(arrayBuffer);

                        // Chrome, Opera and Safari will throw an error when trying to convert a typed array with a neutered ArrayBuffer.
                        Array.from(uint8Array);
                    }).to.throw(Error);

                    done();
                });
            });

        });

    });

    describe('startRendering()', () => {

        it('should return a promise', () => {
            expect(offlineAudioContext.startRendering()).to.be.an.instanceOf(Promise);
        });

        it('should resolve with the renderedBuffer', (done) => {
            const audioBuffer = offlineAudioContext.createBuffer(1, 10, 44100);
            const bufferSourceNode = offlineAudioContext.createBufferSource();
            const channelData = audioBuffer.getChannelData(0);

            // @todo Use copyToChannel() when possible.
            for (let i = 0; i < audioBuffer.length; i += 1) {
                channelData[i] = i;
            }

            bufferSourceNode.buffer = audioBuffer;

            bufferSourceNode.connect(offlineAudioContext.destination);

            bufferSourceNode.start(0, undefined, undefined);

            offlineAudioContext
                .startRendering()
                .then((renderedBuffer) => {
                    // @todo expect(renderedBuffer.length).to.equal(audioBuffer.length);

                    // @todo Use copyFromChannel() when possible.
                    const channelData = renderedBuffer.getChannelData(0);

                    for (let i = 0; i < audioBuffer.length; i += 1) {
                        expect(channelData[i]).to.equal(i);
                    }

                    done();
                });
        });

    });

    // describe('suspend()', () => {
    //
    //     it('should suspend the render process at the render quantum', (done) => {
    //         offlineAudioContext
    //             .suspend(Math.floor(Math.random() * 128) / offlineAudioContext.sampleRate)
    //             .then(() => {
    //                 expect(offlineAudioContext.currentTime).to.equal(0);
    //
    //                 offlineAudioContext.resume();
    //
    //                 done();
    //             });
    //
    //         offlineAudioContext.startRendering();
    //     });
    //
    //     it('should not allow to suspend the render process more than once at the render quantum', (done) => {
    //         offlineAudioContext
    //             .suspend(Math.floor(Math.random() * 128) / offlineAudioContext.sampleRate)
    //             .then(() => offlineAudioContext.resume());
    //
    //         offlineAudioContext
    //             .suspend(Math.floor(Math.random() * 128) / offlineAudioContext.sampleRate)
    //             .catch((err) => {
    //                 expect(err.code).to.equal(11);
    //                 expect(err.name).to.equal('InvalidStateError');
    //
    //                 done();
    //             });
    //
    //         offlineAudioContext.startRendering();
    //     });
    //
    // });

});
