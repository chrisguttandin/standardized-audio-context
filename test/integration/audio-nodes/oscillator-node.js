import { AudioWorkletNode, GainNode, OscillatorNode, PeriodicWave, addAudioWorkletModule } from '../../../src/module';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
import { createNativeAudioContext } from '../../helper/create-native-audio-context';
import { createNativeOfflineAudioContext } from '../../helper/create-native-offline-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';
import { roundToSamples } from '../../helper/round-to-samples';
import { spy } from 'sinon';

const createOscillatorNodeWithConstructor = (context, options = null) => {
    if (options === null) {
        return new OscillatorNode(context);
    }

    return new OscillatorNode(context, options);
};
const createOscillatorNodeWithFactoryFunction = (context, options = null) => {
    const oscillatorNode = context.createOscillator();

    if (options !== null && options.channelCount !== undefined) {
        oscillatorNode.channelCount = options.channelCount;
    }

    if (options !== null && options.channelCountMode !== undefined) {
        oscillatorNode.channelCountMode = options.channelCountMode;
    }

    if (options !== null && options.channelInterpretation !== undefined) {
        oscillatorNode.channelInterpretation = options.channelInterpretation;
    }

    if (options !== null && options.detune !== undefined) {
        oscillatorNode.detune.value = options.detune;
    }

    if (options !== null && options.frequency !== undefined) {
        oscillatorNode.frequency.value = options.frequency;
    }

    if (options !== null && options.periodicWave !== undefined) {
        oscillatorNode.setPeriodicWave(options.periodicWave);
    }

    if (options !== null && options.type !== undefined) {
        oscillatorNode.type = options.type;
    }

    return oscillatorNode;
};
const testCases = {
    'constructor of a MinimalAudioContext': {
        createContext: createMinimalAudioContext,
        createOscillatorNode: createOscillatorNodeWithConstructor
    },
    'constructor of a MinimalOfflineAudioContext': {
        createContext: createMinimalOfflineAudioContext,
        createOscillatorNode: createOscillatorNodeWithConstructor
    },
    'constructor of an AudioContext': {
        createContext: createAudioContext,
        createOscillatorNode: createOscillatorNodeWithConstructor
    },
    'constructor of an OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createOscillatorNode: createOscillatorNodeWithConstructor
    },
    'factory function of an AudioContext': {
        createContext: createAudioContext,
        createOscillatorNode: createOscillatorNodeWithFactoryFunction
    },
    'factory function of an OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createOscillatorNode: createOscillatorNodeWithFactoryFunction
    }
};

describe('OscillatorNode', { skip: typeof window === 'undefined' }, () => {
    describe.for(Object.entries(testCases))('with the %s', ([description, { createContext, createOscillatorNode }]) => {
        let context;

        afterEach(() => context.close?.());

        beforeEach(() => (context = createContext()));

        describe('constructor()', () => {
            describe.for(['closed', 'running'])('with an audioContextState of "%s"', (audioContextState) => {
                afterEach(() => {
                    if (audioContextState === 'closed') {
                        context.close = undefined;
                    }
                });

                beforeEach(() => {
                    if (audioContextState === 'closed') {
                        return context.close?.() ?? context.startRendering?.();
                    }
                });

                describe('without any options', () => {
                    let oscillatorNode;

                    beforeEach(() => {
                        oscillatorNode = createOscillatorNode(context);
                    });

                    it('should return an instance of the OscillatorNode constructor', () => {
                        expect(oscillatorNode).to.be.an.instanceOf(OscillatorNode);
                    });

                    it('should return an implementation of the EventTarget interface', () => {
                        expect(oscillatorNode.addEventListener).to.be.a('function');
                        expect(oscillatorNode.dispatchEvent).to.be.a('function');
                        expect(oscillatorNode.removeEventListener).to.be.a('function');
                    });

                    it('should return an implementation of the AudioNode interface', () => {
                        expect(oscillatorNode.channelCount).to.equal(2);
                        expect(oscillatorNode.channelCountMode).to.equal('max');
                        expect(oscillatorNode.channelInterpretation).to.equal('speakers');
                        expect(oscillatorNode.connect).to.be.a('function');
                        expect(oscillatorNode.context).to.be.an.instanceOf(context.constructor);
                        expect(oscillatorNode.disconnect).to.be.a('function');
                        expect(oscillatorNode.numberOfInputs).to.equal(0);
                        expect(oscillatorNode.numberOfOutputs).to.equal(1);
                    });

                    it('should return an implementation of the AudioScheduledSourceNode interface', () => {
                        expect(oscillatorNode.onended).to.be.null;
                        expect(oscillatorNode.start).to.be.a('function');
                        expect(oscillatorNode.stop).to.be.a('function');
                    });

                    it('should return an implementation of the OscillatorNode interface', () => {
                        expect(oscillatorNode.detune).not.to.be.undefined;
                        expect(oscillatorNode.frequency).not.to.be.undefined;
                        expect(oscillatorNode.setPeriodicWave).to.be.a('function');
                        expect(oscillatorNode.type).to.equal('sine');
                    });
                });

                describe('with valid options', () => {
                    it('should return an instance with the given channelCount', () => {
                        const channelCount = 4;
                        const oscillatorNode = createOscillatorNode(context, { channelCount });

                        expect(oscillatorNode.channelCount).to.equal(channelCount);
                    });

                    it('should return an instance with the given channelCountMode', () => {
                        const channelCountMode = 'explicit';
                        const oscillatorNode = createOscillatorNode(context, { channelCountMode });

                        expect(oscillatorNode.channelCountMode).to.equal(channelCountMode);
                    });

                    it('should return an instance with the given channelInterpretation', () => {
                        const channelInterpretation = 'discrete';
                        const oscillatorNode = createOscillatorNode(context, { channelInterpretation });

                        expect(oscillatorNode.channelInterpretation).to.equal(channelInterpretation);
                    });

                    it('should return an instance with the given initial value for detune', () => {
                        const detune = 0.5;
                        const oscillatorNode = createOscillatorNode(context, { detune });

                        if (description.startsWith('constructor')) {
                            expect(oscillatorNode.detune.defaultValue).to.equal(detune);
                        } else {
                            expect(oscillatorNode.detune.defaultValue).to.equal(0);
                        }

                        expect(oscillatorNode.detune.value).to.equal(detune);
                    });

                    it('should return an instance with the given initial value for frequency', () => {
                        const frequency = 500;
                        const oscillatorNode = createOscillatorNode(context, { frequency });

                        if (description.startsWith('constructor')) {
                            expect(oscillatorNode.frequency.defaultValue).to.equal(frequency);
                        } else {
                            expect(oscillatorNode.frequency.defaultValue).to.equal(440);
                        }

                        expect(oscillatorNode.frequency.value).to.equal(frequency);
                    });

                    it('should return an instance with the given periodicWave', () => {
                        const periodicWave = new PeriodicWave(context, { imag: [1, 1], real: [1, 1] });
                        const oscillatorNode = createOscillatorNode(context, { periodicWave });

                        expect(oscillatorNode.type).to.equal('custom');
                    });

                    it('should return an instance with the given type', () => {
                        const type = 'triangle';
                        const oscillatorNode = createOscillatorNode(context, { type });

                        expect(oscillatorNode.type).to.equal(type);
                    });
                });

                describe('with invalid options', ({ skip }) => {
                    // @todo
                    skip();
                });
            });
        });

        describe('channelCount', () => {
            let oscillatorNode;

            beforeEach(() => {
                oscillatorNode = createOscillatorNode(context);
            });

            it('should be assignable to another value', () => {
                const channelCount = 4;

                oscillatorNode.channelCount = channelCount;

                expect(oscillatorNode.channelCount).to.equal(channelCount);
            });
        });

        describe('channelCountMode', () => {
            let oscillatorNode;

            beforeEach(() => {
                oscillatorNode = createOscillatorNode(context);
            });

            it('should be assignable to another value', () => {
                const channelCountMode = 'explicit';

                oscillatorNode.channelCountMode = channelCountMode;

                expect(oscillatorNode.channelCountMode).to.equal(channelCountMode);
            });
        });

        describe('channelInterpretation', () => {
            let oscillatorNode;

            beforeEach(() => {
                oscillatorNode = createOscillatorNode(context);
            });

            it('should be assignable to another value', () => {
                const channelInterpretation = 'discrete';

                oscillatorNode.channelInterpretation = channelInterpretation;

                expect(oscillatorNode.channelInterpretation).to.equal(channelInterpretation);
            });
        });

        describe('detune', () => {
            let oscillatorNode;

            beforeEach(() => {
                oscillatorNode = createOscillatorNode(context);
            });

            it('should return an implementation of the AudioParam interface', () => {
                expect(oscillatorNode.detune.cancelAndHoldAtTime).to.be.a('function');
                expect(oscillatorNode.detune.cancelScheduledValues).to.be.a('function');
                expect(oscillatorNode.detune.defaultValue).to.equal(0);
                expect(oscillatorNode.detune.exponentialRampToValueAtTime).to.be.a('function');
                expect(oscillatorNode.detune.linearRampToValueAtTime).to.be.a('function');
                expect(oscillatorNode.detune.maxValue).to.equal(153600);
                expect(oscillatorNode.detune.minValue).to.equal(-153600);
                expect(oscillatorNode.detune.setTargetAtTime).to.be.a('function');
                expect(oscillatorNode.detune.setValueAtTime).to.be.a('function');
                expect(oscillatorNode.detune.setValueCurveAtTime).to.be.a('function');
                expect(oscillatorNode.detune.value).to.equal(0);
            });

            it('should be readonly', () => {
                expect(() => {
                    oscillatorNode.detune = 'anything';
                }).to.throw(TypeError);
            });

            describe('cancelAndHoldAtTime()', () => {
                it('should be chainable', () => {
                    expect(oscillatorNode.detune.cancelAndHoldAtTime(0)).to.equal(oscillatorNode.detune);
                });
            });

            describe('cancelScheduledValues()', () => {
                it('should be chainable', () => {
                    expect(oscillatorNode.detune.cancelScheduledValues(0)).to.equal(oscillatorNode.detune);
                });
            });

            describe('exponentialRampToValueAtTime()', () => {
                it('should be chainable', () => {
                    // @todo Firefox can't schedule an exponential ramp when the value is 0.
                    oscillatorNode.detune.value = 1;

                    expect(oscillatorNode.detune.exponentialRampToValueAtTime(1, 0)).to.equal(oscillatorNode.detune);
                });

                it('should throw a RangeError', () => {
                    expect(() => {
                        oscillatorNode.detune.exponentialRampToValueAtTime(0, 1);
                    }).to.throw(RangeError);
                });

                it('should throw a RangeError', () => {
                    expect(() => {
                        oscillatorNode.detune.exponentialRampToValueAtTime(1, -1);
                    }).to.throw(RangeError);
                });
            });

            describe('linearRampToValueAtTime()', () => {
                it('should be chainable', () => {
                    expect(oscillatorNode.detune.linearRampToValueAtTime(1, 0)).to.equal(oscillatorNode.detune);
                });
            });

            describe('setTargetAtTime()', () => {
                it('should be chainable', () => {
                    expect(oscillatorNode.detune.setTargetAtTime(1, 0, 0.1)).to.equal(oscillatorNode.detune);
                });
            });

            describe('setValueAtTime()', () => {
                it('should be chainable', () => {
                    expect(oscillatorNode.detune.setValueAtTime(1, 0)).to.equal(oscillatorNode.detune);
                });
            });

            describe('setValueCurveAtTime()', () => {
                describe.for([
                    ['regular Array', [1, 0]],
                    ['Float32Array', new Float32Array([1, 0])]
                ])('with a %s', ([, values]) => {
                    it('should be chainable', () => {
                        expect(oscillatorNode.detune.setValueCurveAtTime(values, 0, 1)).to.equal(oscillatorNode.detune);
                    });
                });
            });

            // @todo automation
        });

        describe('frequency', () => {
            let oscillatorNode;

            beforeEach(() => {
                oscillatorNode = createOscillatorNode(context);
            });

            it('should return an implementation of the AudioParam interface', () => {
                expect(oscillatorNode.frequency.cancelAndHoldAtTime).to.be.a('function');
                expect(oscillatorNode.frequency.cancelScheduledValues).to.be.a('function');
                expect(oscillatorNode.frequency.defaultValue).to.equal(440);
                expect(oscillatorNode.frequency.exponentialRampToValueAtTime).to.be.a('function');
                expect(oscillatorNode.frequency.linearRampToValueAtTime).to.be.a('function');
                expect(oscillatorNode.frequency.maxValue).to.equal(context.sampleRate / 2);
                expect(oscillatorNode.frequency.minValue).to.equal(-(context.sampleRate / 2));
                expect(oscillatorNode.frequency.setTargetAtTime).to.be.a('function');
                expect(oscillatorNode.frequency.setValueAtTime).to.be.a('function');
                expect(oscillatorNode.frequency.setValueCurveAtTime).to.be.a('function');
                expect(oscillatorNode.frequency.value).to.equal(440);
            });

            it('should be readonly', () => {
                expect(() => {
                    oscillatorNode.frequency = 'anything';
                }).to.throw(TypeError);
            });

            describe('cancelAndHoldAtTime()', () => {
                it('should be chainable', () => {
                    expect(oscillatorNode.frequency.cancelAndHoldAtTime(0)).to.equal(oscillatorNode.frequency);
                });
            });

            describe('cancelScheduledValues()', () => {
                it('should be chainable', () => {
                    expect(oscillatorNode.frequency.cancelScheduledValues(0)).to.equal(oscillatorNode.frequency);
                });
            });

            describe('exponentialRampToValueAtTime()', () => {
                it('should be chainable', () => {
                    expect(oscillatorNode.frequency.exponentialRampToValueAtTime(1, 0)).to.equal(oscillatorNode.frequency);
                });

                it('should throw a RangeError', () => {
                    expect(() => {
                        oscillatorNode.frequency.exponentialRampToValueAtTime(0, 1);
                    }).to.throw(RangeError);
                });

                it('should throw a RangeError', () => {
                    expect(() => {
                        oscillatorNode.frequency.exponentialRampToValueAtTime(1, -1);
                    }).to.throw(RangeError);
                });
            });

            describe('linearRampToValueAtTime()', () => {
                it('should be chainable', () => {
                    expect(oscillatorNode.frequency.linearRampToValueAtTime(1, 0)).to.equal(oscillatorNode.frequency);
                });
            });

            describe('setTargetAtTime()', () => {
                it('should be chainable', () => {
                    expect(oscillatorNode.frequency.setTargetAtTime(1, 0, 0.1)).to.equal(oscillatorNode.frequency);
                });
            });

            describe('setValueAtTime()', () => {
                it('should be chainable', () => {
                    expect(oscillatorNode.frequency.setValueAtTime(1, 0)).to.equal(oscillatorNode.frequency);
                });
            });

            describe('setValueCurveAtTime()', () => {
                describe.for([
                    ['regular Array', [1, 0]],
                    ['Float32Array', new Float32Array([1, 0])]
                ])('with a %s', ([, values]) => {
                    it('should be chainable', () => {
                        expect(oscillatorNode.frequency.setValueCurveAtTime(values, 0, 1)).to.equal(oscillatorNode.frequency);
                    });
                });
            });

            // @todo automation
        });

        describe('numberOfInputs', () => {
            let oscillatorNode;

            beforeEach(() => {
                oscillatorNode = createOscillatorNode(context);
            });

            it('should be readonly', () => {
                expect(() => {
                    oscillatorNode.numberOfInputs = 2;
                }).to.throw(TypeError);
            });
        });

        describe('numberOfOutputs', () => {
            let oscillatorNode;

            beforeEach(() => {
                oscillatorNode = createOscillatorNode(context);
            });

            it('should be readonly', () => {
                expect(() => {
                    oscillatorNode.numberOfOutputs = 2;
                }).to.throw(TypeError);
            });
        });

        describe('onended', () => {
            let oscillatorNode;

            beforeEach(() => {
                oscillatorNode = createOscillatorNode(context);
            });

            it('should be null', () => {
                expect(oscillatorNode.onended).to.be.null;
            });

            it('should be assignable to a function', () => {
                const fn = () => {}; // eslint-disable-line unicorn/consistent-function-scoping
                const onended = (oscillatorNode.onended = fn); // eslint-disable-line no-multi-assign

                expect(onended).to.equal(fn);
                expect(oscillatorNode.onended).to.equal(fn);
            });

            it('should be assignable to null', () => {
                const onended = (oscillatorNode.onended = null); // eslint-disable-line no-multi-assign

                expect(onended).to.be.null;
                expect(oscillatorNode.onended).to.be.null;
            });

            it('should not be assignable to something else', () => {
                const string = 'no function or null value';

                oscillatorNode.onended = () => {};

                const onended = (oscillatorNode.onended = string); // eslint-disable-line no-multi-assign

                expect(onended).to.equal(string);
                expect(oscillatorNode.onended).to.be.null;
            });

            it('should register an independent event listener', () => {
                const onended = spy();

                oscillatorNode.onended = onended;
                oscillatorNode.addEventListener('ended', onended);

                oscillatorNode.dispatchEvent(new Event('ended'));

                expect(onended).to.have.been.calledTwice;
            });

            for (const withAConnection of [true, false]) {
                describe(`${withAConnection ? 'with' : 'without'} a connection`, () => {
                    it('should fire an assigned ended event listener', () => {
                        const { promise, resolve } = Promise.withResolvers();

                        oscillatorNode.onended = function (event) {
                            expect(event).to.be.an.instanceOf(Event);
                            expect(event.currentTarget).to.equal(oscillatorNode);
                            expect(event.target).to.equal(oscillatorNode);
                            expect(event.type).to.equal('ended');

                            expect(this).to.equal(oscillatorNode);

                            resolve();
                        };

                        if (withAConnection) {
                            oscillatorNode.connect(context.destination);
                        }

                        oscillatorNode.start();
                        oscillatorNode.stop();

                        context.startRendering?.();

                        return promise;
                    });
                });
            }
        });

        describe('type', () => {
            let oscillatorNode;

            beforeEach(() => {
                oscillatorNode = createOscillatorNode(context);
            });

            it("should be assignable to another type but 'custom'", () => {
                const type = (oscillatorNode.type = 'square'); // eslint-disable-line no-multi-assign

                expect(type).to.equal('square');
                expect(oscillatorNode.type).to.equal('square');
            });

            it("should not be assignable to the type 'custom'", () => {
                expect(() => {
                    oscillatorNode.type = 'custom';
                })
                    .to.throw(DOMException)
                    .to.include({ code: 11, name: 'InvalidStateError' });
            });

            it('should not be assignable to something else', () => {
                const string = 'none of the accepted types';
                const type = (oscillatorNode.type = string); // eslint-disable-line no-multi-assign

                expect(type).to.equal(string);
                expect(oscillatorNode.type).to.equal('sine');
            });
        });

        describe('addEventListener()', () => {
            let oscillatorNode;

            beforeEach(() => {
                oscillatorNode = createOscillatorNode(context);
            });

            it('should fire a registered ended event listener', () => {
                const { promise, resolve } = Promise.withResolvers();

                oscillatorNode.addEventListener('ended', function (event) {
                    expect(event).to.be.an.instanceOf(Event);
                    expect(event.currentTarget).to.equal(oscillatorNode);
                    expect(event.target).to.equal(oscillatorNode);
                    expect(event.type).to.equal('ended');

                    expect(this).to.equal(oscillatorNode);

                    resolve();
                });

                oscillatorNode.connect(context.destination);

                oscillatorNode.start();
                oscillatorNode.stop();

                context.startRendering?.();

                return promise;
            });
        });

        describe('connect()', () => {
            describe.for(['AudioNode', 'AudioParam'])('with an %s', (type) => {
                let audioNodeOrAudioParam;
                let oscillatorNode;

                beforeEach(() => {
                    const gainNode = new GainNode(context);

                    audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                    oscillatorNode = createOscillatorNode(context);
                });

                if (type === 'AudioNode') {
                    it('should be chainable', () => {
                        expect(oscillatorNode.connect(audioNodeOrAudioParam)).to.equal(audioNodeOrAudioParam);
                    });
                } else {
                    it('should not be chainable', () => {
                        expect(oscillatorNode.connect(audioNodeOrAudioParam)).to.be.undefined;
                    });
                }

                it('should accept duplicate connections', () => {
                    oscillatorNode.connect(audioNodeOrAudioParam);
                    oscillatorNode.connect(audioNodeOrAudioParam);
                });

                it('should throw an IndexSizeError if the output is out-of-bound', () => {
                    expect(() => oscillatorNode.connect(audioNodeOrAudioParam, -1))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                if (type === 'AudioNode') {
                    it('should throw an IndexSizeError if the input is out-of-bound', () => {
                        expect(() => oscillatorNode.connect(audioNodeOrAudioParam, 0, -1))
                            .to.throw(DOMException)
                            .to.include({ code: 1, name: 'IndexSizeError' });
                    });

                    it('should not throw an error if the connection creates a cycle by connecting to an AudioParam of the source', () => {
                        oscillatorNode.connect(audioNodeOrAudioParam).connect(oscillatorNode.frequency);
                    });
                }
            });

            describe.for(['AudioNode', 'AudioParam'])('with an %s of another context', (type) => {
                let anotherContext;
                let audioNodeOrAudioParam;
                let oscillatorNode;

                afterEach(() => anotherContext.close?.());

                beforeEach(() => {
                    anotherContext = createContext();

                    const gainNode = new GainNode(anotherContext);

                    audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                    oscillatorNode = createOscillatorNode(context);
                });

                it('should throw an InvalidAccessError', () => {
                    expect(() => oscillatorNode.connect(audioNodeOrAudioParam))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });

            describe.for(['AudioNode', 'AudioParam'])('with an %s of a native context', (type) => {
                let nativeAudioNodeOrAudioParam;
                let nativeContext;
                let oscillatorNode;

                afterEach(() => nativeContext.close?.());

                beforeEach(() => {
                    nativeContext = description.includes('Offline') ? createNativeOfflineAudioContext() : createNativeAudioContext();

                    const nativeGainNode = nativeContext.createGain();

                    nativeAudioNodeOrAudioParam = type === 'AudioNode' ? nativeGainNode : nativeGainNode.gain;
                    oscillatorNode = createOscillatorNode(context);
                });

                it('should throw an InvalidAccessError', () => {
                    expect(() => oscillatorNode.connect(nativeAudioNodeOrAudioParam))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });

            describe('with a cycle', () => {
                let renderer;

                beforeEach(() => {
                    renderer = createRenderer({
                        context,
                        length: context.length === undefined ? 5 : undefined,
                        setup(destination) {
                            const anotherGainNode = new GainNode(context);
                            const gainNode = new GainNode(context);
                            const oscillatorNode = createOscillatorNode(context);

                            oscillatorNode.connect(gainNode).connect(destination);

                            gainNode.connect(anotherGainNode).connect(gainNode);

                            return { anotherGainNode, gainNode, oscillatorNode };
                        }
                    });
                });

                it('should render silence', () => {
                    return renderer({
                        start(startTime, { oscillatorNode }) {
                            oscillatorNode.start(startTime);
                        }
                    }).then((channelData) => {
                        expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                    });
                });
            });
        });

        describe('disconnect()', () => {
            let createPredefinedRenderer;

            beforeEach(() => {
                createPredefinedRenderer = () =>
                    createRenderer({
                        context,
                        length: context.length === undefined ? 5 : undefined,
                        setup(destination) {
                            const firstDummyGainNode = new GainNode(context);
                            const oscillatorNode = createOscillatorNode(context, { frequency: context.sampleRate / 4 });
                            const secondDummyGainNode = new GainNode(context);

                            oscillatorNode.connect(firstDummyGainNode).connect(destination);

                            oscillatorNode.connect(secondDummyGainNode);

                            return { firstDummyGainNode, oscillatorNode, secondDummyGainNode };
                        }
                    });
            });

            describe('without any parameters', () => {
                let renderer;

                beforeEach(() => {
                    renderer = createPredefinedRenderer();
                });

                it('should disconnect all destinations', () => {
                    return renderer({
                        prepare({ oscillatorNode }) {
                            oscillatorNode.disconnect();
                        },
                        start(startTime, { oscillatorNode }) {
                            oscillatorNode.start(startTime);
                        }
                    }).then((channelData) => {
                        expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                    });
                });
            });

            describe('with an output', () => {
                describe('with a value which is out-of-bound', () => {
                    let oscillatorNode;

                    beforeEach(() => {
                        oscillatorNode = createOscillatorNode(context);
                    });

                    it('should throw an IndexSizeError', () => {
                        expect(() => oscillatorNode.disconnect(-1))
                            .to.throw(DOMException)
                            .to.include({ code: 1, name: 'IndexSizeError' });
                    });
                });

                describe('with a connection from the given output', () => {
                    let renderer;

                    beforeEach(() => {
                        renderer = createPredefinedRenderer();
                    });

                    it('should disconnect all destinations from the given output', () => {
                        return renderer({
                            prepare({ oscillatorNode }) {
                                oscillatorNode.disconnect(0);
                            },
                            start(startTime, { oscillatorNode }) {
                                oscillatorNode.start(startTime);
                            }
                        }).then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                        });
                    });
                });
            });

            describe('with a destination', () => {
                describe('without a connection to the given destination', () => {
                    let oscillatorNode;

                    beforeEach(() => {
                        oscillatorNode = createOscillatorNode(context);
                    });

                    it('should throw an InvalidAccessError', () => {
                        expect(() => oscillatorNode.disconnect(new GainNode(context)))
                            .to.throw(DOMException)
                            .to.include({ code: 15, name: 'InvalidAccessError' });
                    });
                });

                describe('with a connection to the given destination', () => {
                    let renderer;

                    beforeEach(() => {
                        renderer = createPredefinedRenderer();
                    });

                    it('should disconnect the destination', () => {
                        return renderer({
                            prepare({ firstDummyGainNode, oscillatorNode }) {
                                oscillatorNode.disconnect(firstDummyGainNode);
                            },
                            start(startTime, { oscillatorNode }) {
                                oscillatorNode.start(startTime);
                            }
                        }).then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                        });
                    });

                    it('should disconnect another destination in isolation', () => {
                        return renderer({
                            prepare({ oscillatorNode, secondDummyGainNode }) {
                                oscillatorNode.disconnect(secondDummyGainNode);
                            },
                            start(startTime, { oscillatorNode }) {
                                oscillatorNode.start(startTime);
                            }
                        }).then((channelData) => {
                            if (channelData[1] === 1) {
                                expect(channelData[0]).to.be.closeTo(0, 0.00000000001);
                                expect(channelData[1]).to.equal(1);
                                expect(channelData[2]).to.be.closeTo(0, 0.0000001);
                                expect(channelData[3]).to.equal(-1);
                                expect(channelData[4]).to.be.closeTo(0, 0.000001);
                            } else {
                                expect(channelData[0]).to.equal(0);
                                expect(channelData[1]).to.equal(0);
                                expect(channelData[2]).to.equal(1);
                                expect(channelData[3]).to.be.closeTo(0, 0.00000000001);
                                expect(channelData[4]).to.equal(-1);
                            }
                        });
                    });
                });
            });

            describe('with a destination and an output', () => {
                let oscillatorNode;

                beforeEach(() => {
                    oscillatorNode = createOscillatorNode(context);
                });

                it('should throw an IndexSizeError if the output is out-of-bound', () => {
                    expect(() => oscillatorNode.disconnect(new GainNode(context), -1))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                it('should throw an InvalidAccessError if there is no similar connection', () => {
                    expect(() => oscillatorNode.disconnect(new GainNode(context), 0))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });

            describe('with a destination, an output and an input', () => {
                let oscillatorNode;

                beforeEach(() => {
                    oscillatorNode = createOscillatorNode(context);
                });

                it('should throw an IndexSizeError if the output is out-of-bound', () => {
                    expect(() => oscillatorNode.disconnect(new GainNode(context), -1, 0))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                it('should throw an IndexSizeError if the input is out-of-bound', () => {
                    expect(() => oscillatorNode.disconnect(new GainNode(context), 0, -1))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                it('should throw an InvalidAccessError if there is no similar connection', () => {
                    expect(() => oscillatorNode.disconnect(new GainNode(context), 0, 0))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });
        });

        describe('removeEventListener()', () => {
            let oscillatorNode;

            beforeEach(() => {
                oscillatorNode = createOscillatorNode(context);
            });

            it('should not fire a removed ended event listener', () => {
                const listener = spy();

                oscillatorNode.addEventListener('ended', listener);
                oscillatorNode.removeEventListener('ended', listener);

                oscillatorNode.connect(context.destination);

                oscillatorNode.start();
                oscillatorNode.stop();

                context.startRendering?.();

                return new Promise((resolve) => {
                    setTimeout(() => {
                        expect(listener).to.have.not.been.called;

                        resolve();
                    }, 500);
                });
            });
        });

        describe('setPeriodicWave()', ({ skip }) => {
            // @todo
            skip();
        });

        describe('start()', () => {
            let oscillatorNode;

            beforeEach(() => {
                oscillatorNode = createOscillatorNode(context);
            });

            describe('with a previous call to start()', () => {
                beforeEach(() => {
                    oscillatorNode.start();
                });

                it('should throw an InvalidStateError', () => {
                    expect(() => oscillatorNode.start())
                        .to.throw(DOMException)
                        .to.include({ code: 11, name: 'InvalidStateError' });
                });
            });

            describe('with a previous call to stop()', () => {
                beforeEach(() => {
                    oscillatorNode.start();
                    oscillatorNode.stop();
                });

                it('should throw an InvalidStateError', () => {
                    expect(() => oscillatorNode.start())
                        .to.throw(DOMException)
                        .to.include({ code: 11, name: 'InvalidStateError' });
                });
            });

            describe('with a negative value as first parameter', () => {
                it('should throw a RangeError', () => {
                    expect(() => {
                        oscillatorNode.start(-1);
                    }).to.throw(RangeError);
                });
            });
        });

        describe('stop()', () => {
            describe('without a previous call to start()', () => {
                let oscillatorNode;

                beforeEach(() => {
                    oscillatorNode = createOscillatorNode(context);
                });

                it('should throw an InvalidStateError', () => {
                    expect(() => oscillatorNode.stop())
                        .to.throw(DOMException)
                        .to.include({ code: 11, name: 'InvalidStateError' });
                });
            });

            describe('with a previous call to stop()', () => {
                for (const [withADirectConnection, withAnAppendedAudioWorklet] of description.includes('Offline')
                    ? [
                          [true, true],
                          [true, false],
                          [false, true]
                      ]
                    : [[true, false]]) {
                    describe(`${withADirectConnection ? 'with' : 'without'} a direct connection and ${
                        withAnAppendedAudioWorklet ? 'with' : 'without'
                    } an appended AudioWorklet`, () => {
                        let renderer;

                        beforeEach(async () => {
                            if (withAnAppendedAudioWorklet) {
                                await addAudioWorkletModule(context, 'test/fixtures/gain-processor.js');
                            }

                            renderer = createRenderer({
                                context,
                                length: context.length === undefined ? 5 : undefined,
                                setup(destination) {
                                    const audioWorkletNode = withAnAppendedAudioWorklet
                                        ? new AudioWorkletNode(context, 'gain-processor', { channelCount: 1 })
                                        : null;
                                    const masterGainNode = new GainNode(context, {
                                        gain: withADirectConnection && withAnAppendedAudioWorklet ? 0.5 : 1
                                    });
                                    const oscillatorNode = createOscillatorNode(context, { frequency: context.sampleRate / 4 });

                                    if (withADirectConnection) {
                                        oscillatorNode.connect(masterGainNode);
                                    }

                                    if (withAnAppendedAudioWorklet) {
                                        oscillatorNode.connect(audioWorkletNode).connect(masterGainNode);
                                    }

                                    masterGainNode.connect(destination);

                                    return { oscillatorNode };
                                }
                            });
                        });

                        it('should apply the values from the last invocation', () => {
                            return renderer({
                                start(startTime, { oscillatorNode }) {
                                    oscillatorNode.start(startTime);
                                    oscillatorNode.stop(roundToSamples(startTime, context.sampleRate, 5));
                                    oscillatorNode.stop(roundToSamples(startTime, context.sampleRate, 3));
                                }
                            }).then((channelData) => {
                                if (channelData[1] === 1) {
                                    expect(channelData[0]).to.be.closeTo(0, 0.00000000001);
                                    expect(channelData[1]).to.equal(1);
                                    expect(channelData[2]).to.be.closeTo(0, 0.0000001);
                                    expect(channelData[3]).to.equal(0);
                                    expect(channelData[4]).to.equal(0);
                                } else {
                                    expect(channelData[0]).to.equal(0);
                                    expect(channelData[1]).to.equal(0);
                                    expect(channelData[2]).to.equal(1);
                                    expect(channelData[3]).to.be.closeTo(0, 0.000000000001);
                                    expect(channelData[4]).to.equal(0);
                                }
                            });
                        });
                    });
                }
            });

            describe('with a stop time reached prior to the start time', () => {
                for (const [withADirectConnection, withAnAppendedAudioWorklet] of description.includes('Offline')
                    ? [
                          [true, true],
                          [true, false],
                          [false, true]
                      ]
                    : [[true, false]]) {
                    describe(`${withADirectConnection ? 'with' : 'without'} a direct connection and ${
                        withAnAppendedAudioWorklet ? 'with' : 'without'
                    } an appended AudioWorklet`, () => {
                        let renderer;

                        beforeEach(async () => {
                            if (withAnAppendedAudioWorklet) {
                                await addAudioWorkletModule(context, 'test/fixtures/gain-processor.js');
                            }

                            renderer = createRenderer({
                                context,
                                length: context.length === undefined ? 5 : undefined,
                                setup(destination) {
                                    const audioWorkletNode = withAnAppendedAudioWorklet
                                        ? new AudioWorkletNode(context, 'gain-processor', { channelCount: 1 })
                                        : null;
                                    const masterGainNode = new GainNode(context, {
                                        gain: withADirectConnection && withAnAppendedAudioWorklet ? 0.5 : 1
                                    });
                                    const oscillatorNode = createOscillatorNode(context);

                                    if (withADirectConnection) {
                                        oscillatorNode.connect(masterGainNode);
                                    }

                                    if (withAnAppendedAudioWorklet) {
                                        oscillatorNode.connect(audioWorkletNode).connect(masterGainNode);
                                    }

                                    masterGainNode.connect(destination);

                                    return { oscillatorNode };
                                }
                            });
                        });

                        it('should not play anything', () => {
                            return renderer({
                                start(startTime, { oscillatorNode }) {
                                    oscillatorNode.start(roundToSamples(startTime, context.sampleRate, 3));
                                    oscillatorNode.stop(roundToSamples(startTime, context.sampleRate, 1));
                                }
                            }).then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                            });
                        });
                    });
                }
            });

            describe('with an emitted ended event', () => {
                let oscillatorNode;

                beforeEach(() => {
                    const { promise, resolve } = Promise.withResolvers();

                    oscillatorNode = createOscillatorNode(context);

                    oscillatorNode.onended = () => resolve();

                    oscillatorNode.connect(context.destination);

                    oscillatorNode.start();
                    oscillatorNode.stop();

                    context.startRendering?.();

                    return promise;
                });

                it('should ignore calls to stop()', () => {
                    oscillatorNode.stop();
                });
            });

            describe('with a negative value as first parameter', () => {
                let oscillatorNode;

                beforeEach(() => {
                    oscillatorNode = createOscillatorNode(context);

                    oscillatorNode.start();
                });

                it('should throw a RangeError', () => {
                    expect(() => {
                        oscillatorNode.stop(-1);
                    }).to.throw(RangeError);
                });
            });
        });
    });
});
