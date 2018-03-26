import { AudioBuffer } from '../../../src/audio-buffer';
import { AudioBufferSourceNode } from '../../../src/audio-nodes/audio-buffer-source-node';
import { AudioContext } from '../../../src/audio-contexts/audio-context';
import { BiquadFilterNode } from '../../../src/audio-nodes/biquad-filter-node';
import { GainNode } from '../../../src/audio-nodes/gain-node';
import { MinimalAudioContext } from '../../../src/audio-contexts/minimal-audio-context';
import { MinimalOfflineAudioContext } from '../../../src/audio-contexts/minimal-offline-audio-context';
import { OfflineAudioContext } from '../../../src/audio-contexts/offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';

describe('BiquadFilterNode', () => {

    // @todo leche seems to need a unique string as identifier as first argument.
    leche.withData([
        [
            'constructor with AudioContext',
            () => new AudioContext(),
            (context, options = null) => {
                if (options === null) {
                    return new BiquadFilterNode(context);
                }

                return new BiquadFilterNode(context, options);
            }
        ],
        [
            'constructor with MinimalAudioContext',
            () => new MinimalAudioContext(),
            (context, options = null) => {
                if (options === null) {
                    return new BiquadFilterNode(context);
                }

                return new BiquadFilterNode(context, options);
            }
        ],
        [
            'constructor with OfflineAudioContext',
            () => new OfflineAudioContext({ length: 5, sampleRate: 44100 }),
            (context, options = null) => {
                if (options === null) {
                    return new BiquadFilterNode(context);
                }

                return new BiquadFilterNode(context, options);
            }
        ],
        [
            'constructor with MinimalOfflineAudioContext',
            () => new MinimalOfflineAudioContext({ length: 5, sampleRate: 44100 }),
            (context, options = null) => {
                if (options === null) {
                    return new BiquadFilterNode(context);
                }

                return new BiquadFilterNode(context, options);
            }
        ],
        [
            'factory function of AudioContext',
            () => new AudioContext(),
            (context, options = null) => {
                const biquadFilterNode = context.createBiquadFilter();

                if (options !== null && options.channelCount !== undefined) {
                    biquadFilterNode.channelCount = options.channelCount;
                }

                if (options !== null && options.channelCountMode !== undefined) {
                    biquadFilterNode.channelCountMode = options.channelCountMode;
                }

                if (options !== null && options.channelInterpretation !== undefined) {
                    biquadFilterNode.channelInterpretation = options.channelInterpretation;
                }

                if (options !== null && options.detune !== undefined) {
                    biquadFilterNode.detune.value = options.detune;
                }

                if (options !== null && options.frequency !== undefined) {
                    biquadFilterNode.frequency.value = options.frequency;
                }

                if (options !== null && options.gain !== undefined) {
                    biquadFilterNode.gain.value = options.gain;
                }

                if (options !== null && options.type !== undefined) {
                    biquadFilterNode.type = options.type;
                }

                if (options !== null && options.Q !== undefined) {
                    biquadFilterNode.Q.value = options.Q;
                }

                return biquadFilterNode;
            }
        ],
        [
            'factory function of OfflineAudioContext',
            () => new OfflineAudioContext({ length: 5, sampleRate: 44100 }),
            (context, options = null) => {
                const biquadFilterNode = context.createBiquadFilter();

                if (options !== null && options.channelCount !== undefined) {
                    biquadFilterNode.channelCount = options.channelCount;
                }

                if (options !== null && options.channelCountMode !== undefined) {
                    biquadFilterNode.channelCountMode = options.channelCountMode;
                }

                if (options !== null && options.channelInterpretation !== undefined) {
                    biquadFilterNode.channelInterpretation = options.channelInterpretation;
                }

                if (options !== null && options.detune !== undefined) {
                    biquadFilterNode.detune.value = options.detune;
                }

                if (options !== null && options.frequency !== undefined) {
                    biquadFilterNode.frequency.value = options.frequency;
                }

                if (options !== null && options.gain !== undefined) {
                    biquadFilterNode.gain.value = options.gain;
                }

                if (options !== null && options.type !== undefined) {
                    biquadFilterNode.type = options.type;
                }

                if (options !== null && options.Q !== undefined) {
                    biquadFilterNode.Q.value = options.Q;
                }

                return biquadFilterNode;
            }
        ]
    ], (_, createContext, createBiquadFilterNode) => {

        let context;

        afterEach(() => {
            if (context.close !== undefined) {
                return context.close();
            }
        });

        beforeEach(() => {
            context = createContext();
        });

        describe('constructor()', () => {

            describe('without any options', () => {

                let biquadFilterNode;

                beforeEach(() => {
                    biquadFilterNode = createBiquadFilterNode(context);
                });

                it('should return an instance of the EventTarget interface', () => {
                    expect(biquadFilterNode.addEventListener).to.be.a('function');
                    expect(biquadFilterNode.dispatchEvent).to.be.a('function');
                    expect(biquadFilterNode.removeEventListener).to.be.a('function');
                });

                it('should be an instance of the AudioNode interface', () => {
                    expect(biquadFilterNode.channelCount).to.equal(2);
                    expect(biquadFilterNode.channelCountMode).to.equal('max');
                    expect(biquadFilterNode.channelInterpretation).to.equal('speakers');
                    expect(biquadFilterNode.connect).to.be.a('function');
                    expect(biquadFilterNode.context).to.be.an.instanceOf(context.constructor);
                    expect(biquadFilterNode.disconnect).to.be.a('function');
                    expect(biquadFilterNode.numberOfInputs).to.equal(1);
                    expect(biquadFilterNode.numberOfOutputs).to.equal(1);
                });

                it('should return an instance of the BiquadFilterNode interface', () => {
                    expect(biquadFilterNode.detune).not.to.be.undefined;
                    expect(biquadFilterNode.frequency).not.to.be.undefined;
                    expect(biquadFilterNode.gain).not.to.be.undefined;
                    expect(biquadFilterNode.getFrequencyResponse).to.be.a('function');
                    expect(biquadFilterNode.Q).not.to.be.undefined;
                    expect(biquadFilterNode.type).to.be.a('string');
                });

                it('should throw an error if the AudioContext is closed', (done) => {
                    ((context.close === undefined) ? context.startRendering() : context.close())
                        .then(() => createBiquadFilterNode(context))
                        .catch((err) => {
                            expect(err.code).to.equal(11);
                            expect(err.name).to.equal('InvalidStateError');

                            context.close = undefined;

                            done();
                        });
                });

            });

            describe('with valid options', () => {

                it('should return an instance with the given channelCount', () => {
                    const channelCount = 4;
                    const biquadFilterNode = createBiquadFilterNode(context, { channelCount });

                    expect(biquadFilterNode.channelCount).to.equal(channelCount);
                });

                it('should return an instance with the given channelCountMode', () => {
                    const channelCountMode = 'explicit';
                    const biquadFilterNode = createBiquadFilterNode(context, { channelCountMode });

                    expect(biquadFilterNode.channelCountMode).to.equal(channelCountMode);
                });

                it('should return an instance with the given channelInterpretation', () => {
                    const channelInterpretation = 'discrete';
                    const biquadFilterNode = createBiquadFilterNode(context, { channelInterpretation });

                    expect(biquadFilterNode.channelInterpretation).to.equal(channelInterpretation);
                });

                it('should return an instance with the given intial value for detune', () => {
                    const detune = 0.5;
                    const biquadFilterNode = createBiquadFilterNode(context, { detune });

                    expect(biquadFilterNode.detune.value).to.equal(detune);
                });

                it('should return an instance with the given intial value for frequency', () => {
                    const frequency = 1000;
                    const biquadFilterNode = createBiquadFilterNode(context, { frequency });

                    expect(biquadFilterNode.frequency.value).to.equal(frequency);
                });

                it('should return an instance with the given intial value for gain', () => {
                    const gain = 0.5;
                    const biquadFilterNode = createBiquadFilterNode(context, { gain });

                    expect(biquadFilterNode.gain.value).to.equal(gain);
                });

                it('should return an instance with the given type', () => {
                    const type = 'peaking';
                    const biquadFilterNode = createBiquadFilterNode(context, { type });

                    expect(biquadFilterNode.type).to.equal(type);
                });

                it('should return an instance with the given intial value for Q', () => {
                    const Q = 2;
                    const biquadFilterNode = createBiquadFilterNode(context, { Q });

                    expect(biquadFilterNode.Q.value).to.equal(Q);
                });

            });

        });

        describe('channelCount', () => {

            let biquadFilterNode;

            beforeEach(() => {
                biquadFilterNode = createBiquadFilterNode(context);
            });

            it('should be assignable to another value', () => {
                const channelCount = 4;

                biquadFilterNode.channelCount = channelCount;

                expect(biquadFilterNode.channelCount).to.equal(channelCount);
            });

        });

        describe('channelCountMode', () => {

            let biquadFilterNode;

            beforeEach(() => {
                biquadFilterNode = createBiquadFilterNode(context);
            });

            it('should be assignable to another value', () => {
                const channelCountMode = 'explicit';

                biquadFilterNode.channelCountMode = channelCountMode;

                expect(biquadFilterNode.channelCountMode).to.equal(channelCountMode);
            });

        });

        describe('channelInterpretation', () => {

            let biquadFilterNode;

            beforeEach(() => {
                biquadFilterNode = createBiquadFilterNode(context);
            });

            it('should be assignable to another value', () => {
                const channelInterpretation = 'discrete';

                biquadFilterNode.channelInterpretation = channelInterpretation;

                expect(biquadFilterNode.channelInterpretation).to.equal(channelInterpretation);
            });

        });

        describe('detune', () => {

            let biquadFilterNode;

            beforeEach(() => {
                biquadFilterNode = createBiquadFilterNode(context);
            });

            it('should return an instance of the AudioParam interface', () => {
                // @todo cancelAndHoldAtTime
                expect(biquadFilterNode.detune.cancelScheduledValues).to.be.a('function');
                expect(biquadFilterNode.detune.defaultValue).to.equal(0);
                expect(biquadFilterNode.detune.exponentialRampToValueAtTime).to.be.a('function');
                expect(biquadFilterNode.detune.linearRampToValueAtTime).to.be.a('function');
                /*
                 * @todo maxValue
                 * @todo minValue
                 */
                expect(biquadFilterNode.detune.setTargetAtTime).to.be.a('function');
                // @todo setValueAtTime
                expect(biquadFilterNode.detune.setValueCurveAtTime).to.be.a('function');
                expect(biquadFilterNode.detune.value).to.equal(0);
            });

            it('should be readonly', () => {
                expect(() => {
                    biquadFilterNode.detune = 'anything';
                }).to.throw(TypeError);
            });

            // @todo automation

        });

        describe('frequency', () => {

            let biquadFilterNode;

            beforeEach(() => {
                biquadFilterNode = createBiquadFilterNode(context);
            });

            it('should return an instance of the AudioParam interface', () => {
                // @todo cancelAndHoldAtTime
                expect(biquadFilterNode.frequency.cancelScheduledValues).to.be.a('function');
                expect(biquadFilterNode.frequency.defaultValue).to.equal(350);
                expect(biquadFilterNode.frequency.exponentialRampToValueAtTime).to.be.a('function');
                expect(biquadFilterNode.frequency.linearRampToValueAtTime).to.be.a('function');
                /*
                 * @todo maxValue
                 * @todo minValue
                 */
                expect(biquadFilterNode.frequency.setTargetAtTime).to.be.a('function');
                // @todo setValueAtTime
                expect(biquadFilterNode.frequency.setValueCurveAtTime).to.be.a('function');
                expect(biquadFilterNode.frequency.value).to.equal(350);
            });

            it('should be readonly', () => {
                expect(() => {
                    biquadFilterNode.frequency = 'anything';
                }).to.throw(TypeError);
            });

            // @todo automation

        });

        describe('gain', () => {

            let biquadFilterNode;

            beforeEach(() => {
                biquadFilterNode = createBiquadFilterNode(context);
            });

            it('should return an instance of the AudioParam interface', () => {
                // @todo cancelAndHoldAtTime
                expect(biquadFilterNode.gain.cancelScheduledValues).to.be.a('function');
                expect(biquadFilterNode.gain.defaultValue).to.equal(0);
                expect(biquadFilterNode.gain.exponentialRampToValueAtTime).to.be.a('function');
                expect(biquadFilterNode.gain.linearRampToValueAtTime).to.be.a('function');
                /*
                 * @todo maxValue
                 * @todo minValue
                 */
                expect(biquadFilterNode.gain.setTargetAtTime).to.be.a('function');
                // @todo setValueAtTime
                expect(biquadFilterNode.gain.setValueCurveAtTime).to.be.a('function');
                expect(biquadFilterNode.gain.value).to.equal(0);
            });

            it('should be readonly', () => {
                expect(() => {
                    biquadFilterNode.gain = 'anything';
                }).to.throw(TypeError);
            });

            // @todo automation

        });

        describe('type', () => {

            // @todo

        });

        describe('Q', () => {

            let biquadFilterNode;

            beforeEach(() => {
                biquadFilterNode = createBiquadFilterNode(context);
            });

            it('should return an instance of the AudioParam interface', () => {
                // @todo cancelAndHoldAtTime
                expect(biquadFilterNode.Q.cancelScheduledValues).to.be.a('function');
                expect(biquadFilterNode.Q.defaultValue).to.equal(1);
                expect(biquadFilterNode.Q.exponentialRampToValueAtTime).to.be.a('function');
                expect(biquadFilterNode.Q.linearRampToValueAtTime).to.be.a('function');
                /*
                 * @todo maxValue
                 * @todo minValue
                 */
                expect(biquadFilterNode.Q.setTargetAtTime).to.be.a('function');
                // @todo setValueAtTime
                expect(biquadFilterNode.Q.setValueCurveAtTime).to.be.a('function');
                expect(biquadFilterNode.Q.value).to.equal(1);
            });

            it('should be readonly', () => {
                expect(() => {
                    biquadFilterNode.Q = 'anything';
                }).to.throw(TypeError);
            });

            // @todo automation

        });

        describe('connect()', () => {

            let biquadFilterNode;

            beforeEach(() => {
                biquadFilterNode = createBiquadFilterNode(context);
            });

            it('should be chainable', () => {
                const gainNode = new GainNode(context);

                expect(biquadFilterNode.connect(gainNode)).to.equal(gainNode);
            });

            it('should not be connectable to an AudioNode of another AudioContext', (done) => {
                const anotherContext = createContext();

                try {
                    biquadFilterNode.connect(anotherContext.destination);
                } catch (err) {
                    expect(err.code).to.equal(15);
                    expect(err.name).to.equal('InvalidAccessError');

                    done();
                } finally {
                    if (anotherContext.close !== undefined) {
                        anotherContext.close();
                    }
                }
            });

            it('should not be connectable to an AudioParam of another AudioContext', (done) => {
                const anotherContext = createContext();
                const gainNode = new GainNode(anotherContext);

                try {
                    biquadFilterNode.connect(gainNode.gain);
                } catch (err) {
                    expect(err.code).to.equal(15);
                    expect(err.name).to.equal('InvalidAccessError');

                    done();
                } finally {
                    if (anotherContext.close !== undefined) {
                        anotherContext.close();
                    }
                }
            });

            it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                const gainNode = new GainNode(context);

                try {
                    biquadFilterNode.connect(gainNode.gain, -1);
                } catch (err) {
                    expect(err.code).to.equal(1);
                    expect(err.name).to.equal('IndexSizeError');

                    done();
                }
            });

        });

        describe('disconnect()', () => {

            let renderer;
            let values;

            beforeEach(() => {
                values = [ 1, 1, 1, 1, 1 ];

                renderer = createRenderer({
                    context,
                    length: (context.length === undefined) ? 5 : undefined,
                    prepare (destination) {
                        const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                        const audioBufferSourceNode = new AudioBufferSourceNode(context);
                        const biquadFilterNode = createBiquadFilterNode(context, { frequency: context.sampleRate });
                        const firstDummyGainNode = new GainNode(context);
                        const secondDummyGainNode = new GainNode(context);

                        audioBuffer.copyToChannel(new Float32Array(values), 0);

                        audioBufferSourceNode.buffer = audioBuffer;

                        audioBufferSourceNode
                            .connect(biquadFilterNode)
                            .connect(firstDummyGainNode)
                            .connect(destination);

                        biquadFilterNode.connect(secondDummyGainNode);

                        return { audioBufferSourceNode, biquadFilterNode, firstDummyGainNode, secondDummyGainNode };
                    }
                });
            });

            it('should be possible to disconnect a destination', function () {
                this.timeout(5000);

                return renderer({
                    prepare ({ biquadFilterNode, firstDummyGainNode }) {
                        biquadFilterNode.disconnect(firstDummyGainNode);
                    },
                    start (startTime, { audioBufferSourceNode }) {
                        audioBufferSourceNode.start(startTime);
                    }
                })
                    .then((channelData) => {
                        expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                    });
            });

            it('should be possible to disconnect another destination in isolation', function () {
                this.timeout(5000);

                return renderer({
                    prepare ({ biquadFilterNode, secondDummyGainNode }) {
                        biquadFilterNode.disconnect(secondDummyGainNode);
                    },
                    start (startTime, { audioBufferSourceNode }) {
                        audioBufferSourceNode.start(startTime);
                    }
                })
                    .then((channelData) => {
                        expect(Array.from(channelData)).to.deep.equal(values);
                    });
            });

            it('should be possible to disconnect all destinations', function () {
                this.timeout(5000);

                return renderer({
                    prepare ({ biquadFilterNode }) {
                        biquadFilterNode.disconnect();
                    },
                    start (startTime, { audioBufferSourceNode }) {
                        audioBufferSourceNode.start(startTime);
                    }
                })
                    .then((channelData) => {
                        expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                    });
            });

        });

        describe('getFrequencyResponse()', () => {

            describe('with a frequencyHz parameter smaller as the others', () => {

                it('should throw an InvalidAccessError', (done) => {
                    const biquadFilterNode = createBiquadFilterNode(context);

                    try {
                        biquadFilterNode.getFrequencyResponse(new Float32Array(), new Float32Array(1), new Float32Array(1));
                    } catch (err) {
                        expect(err.code).to.equal(15);
                        expect(err.name).to.equal('InvalidAccessError');

                        done();
                    }
                });

            });

            describe('with a magResponse parameter smaller as the others', () => {

                it('should throw an InvalidAccessError', (done) => {
                    const biquadFilterNode = createBiquadFilterNode(context);

                    try {
                        biquadFilterNode.getFrequencyResponse(new Float32Array([ 1 ]), new Float32Array(0), new Float32Array(1));
                    } catch (err) {
                        expect(err.code).to.equal(15);
                        expect(err.name).to.equal('InvalidAccessError');

                        done();
                    }
                });

            });

            describe('with a phaseResponse parameter smaller as the others', () => {

                it('should throw an InvalidAccessError', (done) => {
                    const biquadFilterNode = createBiquadFilterNode(context);

                    try {
                        biquadFilterNode.getFrequencyResponse(new Float32Array([ 1 ]), new Float32Array(1), new Float32Array(0));
                    } catch (err) {
                        expect(err.code).to.equal(15);
                        expect(err.name).to.equal('InvalidAccessError');

                        done();
                    }
                });

            });

            describe('with valid parameters', () => {

                // bug #22 This is not yet implemented in Edge and Safari.

                /*
                 * it('should fill the magResponse and phaseResponse arrays', () => {
                 *     const biquadFilterNode = audioContext.createBiquadFilter();
                 *     const magResponse = new Float32Array(5);
                 *     const phaseResponse = new Float32Array(5);
                 *
                 *     biquadFilterNode.getFrequencyResponse(new Float32Array([ 200, 400, 800, 1600, 3200 ]), magResponse, phaseResponse);
                 *
                 *     expect(Array.from(magResponse)).to.deep.equal([ 1.184295654296875, 0.9401244521141052, 0.2128090262413025, 0.048817940056324005, 0.011635963805019855 ]);
                 *     expect(Array.from(phaseResponse)).to.deep.equal([ -0.6473332643508911, -1.862880825996399, -2.692772388458252, -2.9405176639556885, -3.044968605041504 ]);
                 * });
                 */

            });

        });

    });

});
