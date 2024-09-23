import {
    AudioBuffer,
    AudioBufferSourceNode,
    AudioWorkletNode,
    ConstantSourceNode,
    GainNode,
    addAudioWorkletModule
} from '../../../src/module';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
import { createNativeAudioContext } from '../../helper/create-native-audio-context';
import { createNativeOfflineAudioContext } from '../../helper/create-native-offline-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';
import { roundToSamples } from '../../helper/round-to-samples';
import { spy } from 'sinon';

const createConstantSourceNodeWithConstructor = (context, options = null) => {
    if (options === null) {
        return new ConstantSourceNode(context);
    }

    return new ConstantSourceNode(context, options);
};
const createConstantSourceNodeWithFactoryFunction = (context, options = null) => {
    const constantSourceNode = context.createConstantSource();

    if (options !== null && options.channelCount !== undefined) {
        constantSourceNode.channelCount = options.channelCount;
    }

    if (options !== null && options.channelCountMode !== undefined) {
        constantSourceNode.channelCountMode = options.channelCountMode;
    }

    if (options !== null && options.channelInterpretation !== undefined) {
        constantSourceNode.channelInterpretation = options.channelInterpretation;
    }

    if (options !== null && options.offset !== undefined) {
        constantSourceNode.offset.value = options.offset;
    }

    return constantSourceNode;
};
const testCases = {
    'constructor of a MinimalAudioContext': {
        createConstantSourceNode: createConstantSourceNodeWithConstructor,
        createContext: createMinimalAudioContext
    },
    'constructor of a MinimalOfflineAudioContext': {
        createConstantSourceNode: createConstantSourceNodeWithConstructor,
        createContext: createMinimalOfflineAudioContext
    },
    'constructor of an AudioContext': {
        createConstantSourceNode: createConstantSourceNodeWithConstructor,
        createContext: createAudioContext
    },
    'constructor of an OfflineAudioContext': {
        createConstantSourceNode: createConstantSourceNodeWithConstructor,
        createContext: createOfflineAudioContext
    },
    'factory function of an AudioContext': {
        createConstantSourceNode: createConstantSourceNodeWithFactoryFunction,
        createContext: createAudioContext
    },
    'factory function of an OfflineAudioContext': {
        createConstantSourceNode: createConstantSourceNodeWithFactoryFunction,
        createContext: createOfflineAudioContext
    }
};

describe('ConstantSourceNode', () => {
    for (const [description, { createConstantSourceNode, createContext }] of Object.entries(testCases)) {
        describe(`with the ${description}`, () => {
            let context;

            afterEach(() => {
                if (context.close !== undefined) {
                    return context.close();
                }
            });

            beforeEach(() => (context = createContext()));

            describe('constructor()', () => {
                for (const audioContextState of ['closed', 'running']) {
                    describe(`with an audioContextState of "${audioContextState}"`, () => {
                        afterEach(() => {
                            if (audioContextState === 'closed') {
                                context.close = undefined;
                            }
                        });

                        beforeEach(() => {
                            if (audioContextState === 'closed') {
                                if (typeof context.startRendering === 'function') {
                                    return context.startRendering();
                                }

                                return context.close();
                            }
                        });

                        describe('without any options', () => {
                            let constantSourceNode;

                            beforeEach(() => {
                                constantSourceNode = createConstantSourceNode(context);
                            });

                            it('should return an instance of the ConstantSourceNode constructor', () => {
                                expect(constantSourceNode).to.be.an.instanceOf(ConstantSourceNode);
                            });

                            it('should return an implementation of the EventTarget interface', () => {
                                expect(constantSourceNode.addEventListener).to.be.a('function');
                                expect(constantSourceNode.dispatchEvent).to.be.a('function');
                                expect(constantSourceNode.removeEventListener).to.be.a('function');
                            });

                            it('should return an implementation of the AudioNode interface', () => {
                                expect(constantSourceNode.channelCount).to.equal(2);
                                expect(constantSourceNode.channelCountMode).to.equal('max');
                                expect(constantSourceNode.channelInterpretation).to.equal('speakers');
                                expect(constantSourceNode.connect).to.be.a('function');
                                expect(constantSourceNode.context).to.be.an.instanceOf(context.constructor);
                                expect(constantSourceNode.disconnect).to.be.a('function');
                                expect(constantSourceNode.numberOfInputs).to.equal(0);
                                expect(constantSourceNode.numberOfOutputs).to.equal(1);
                            });

                            it('should return an implementation of the AudioScheduledSourceNode interface', () => {
                                expect(constantSourceNode.onended).to.be.null;
                                expect(constantSourceNode.start).to.be.a('function');
                                expect(constantSourceNode.stop).to.be.a('function');
                            });

                            it('should return an implementation of the ConstantSourceNode interface', () => {
                                expect(constantSourceNode.offset).not.to.be.undefined;
                            });
                        });

                        describe('with valid options', () => {
                            it('should return an instance with the given channelCount', () => {
                                const channelCount = 4;
                                const constantSourceNode = createConstantSourceNode(context, { channelCount });

                                expect(constantSourceNode.channelCount).to.equal(channelCount);
                            });

                            it('should return an instance with the given channelCountMode', () => {
                                const channelCountMode = 'explicit';
                                const constantSourceNode = createConstantSourceNode(context, { channelCountMode });

                                expect(constantSourceNode.channelCountMode).to.equal(channelCountMode);
                            });

                            it('should return an instance with the given channelInterpretation', () => {
                                const channelInterpretation = 'discrete';
                                const constantSourceNode = createConstantSourceNode(context, { channelInterpretation });

                                expect(constantSourceNode.channelInterpretation).to.equal(channelInterpretation);
                            });

                            it('should return an instance with the given initial value for offset', () => {
                                const offset = 0.5;
                                const constantSourceNode = createConstantSourceNode(context, { offset });

                                if (description.startsWith('constructor')) {
                                    expect(constantSourceNode.offset.defaultValue).to.equal(offset);
                                } else {
                                    expect(constantSourceNode.offset.defaultValue).to.equal(1);
                                }

                                expect(constantSourceNode.offset.value).to.equal(offset);
                            });
                        });
                    });
                }
            });

            describe('channelCount', () => {
                let constantSourceNode;

                beforeEach(() => {
                    constantSourceNode = createConstantSourceNode(context);
                });

                it('should be assignable to another value', () => {
                    const channelCount = 4;

                    constantSourceNode.channelCount = channelCount;

                    expect(constantSourceNode.channelCount).to.equal(channelCount);
                });
            });

            describe('channelCountMode', () => {
                let constantSourceNode;

                beforeEach(() => {
                    constantSourceNode = createConstantSourceNode(context);
                });

                it('should be assignable to another value', () => {
                    const channelCountMode = 'explicit';

                    constantSourceNode.channelCountMode = channelCountMode;

                    expect(constantSourceNode.channelCountMode).to.equal(channelCountMode);
                });
            });

            describe('channelInterpretation', () => {
                let constantSourceNode;

                beforeEach(() => {
                    constantSourceNode = createConstantSourceNode(context);
                });

                it('should be assignable to another value', () => {
                    const channelInterpretation = 'discrete';

                    constantSourceNode.channelInterpretation = channelInterpretation;

                    expect(constantSourceNode.channelInterpretation).to.equal(channelInterpretation);
                });
            });

            describe('numberOfInputs', () => {
                let constantSourceNode;

                beforeEach(() => {
                    constantSourceNode = createConstantSourceNode(context);
                });

                it('should be readonly', () => {
                    expect(() => {
                        constantSourceNode.numberOfInputs = 2;
                    }).to.throw(TypeError);
                });
            });

            describe('numberOfOutputs', () => {
                let constantSourceNode;

                beforeEach(() => {
                    constantSourceNode = createConstantSourceNode(context);
                });

                it('should be readonly', () => {
                    expect(() => {
                        constantSourceNode.numberOfOutputs = 2;
                    }).to.throw(TypeError);
                });
            });

            describe('offset', () => {
                it('should return an implementation of the AudioParam interface', () => {
                    const constantSourceNode = createConstantSourceNode(context);

                    expect(constantSourceNode.offset.cancelAndHoldAtTime).to.be.a('function');
                    expect(constantSourceNode.offset.cancelScheduledValues).to.be.a('function');
                    expect(constantSourceNode.offset.defaultValue).to.equal(1);
                    expect(constantSourceNode.offset.exponentialRampToValueAtTime).to.be.a('function');
                    expect(constantSourceNode.offset.linearRampToValueAtTime).to.be.a('function');
                    expect(constantSourceNode.offset.maxValue).to.equal(3.4028234663852886e38);
                    expect(constantSourceNode.offset.minValue).to.equal(-3.4028234663852886e38);
                    expect(constantSourceNode.offset.setTargetAtTime).to.be.a('function');
                    expect(constantSourceNode.offset.setValueAtTime).to.be.a('function');
                    expect(constantSourceNode.offset.setValueCurveAtTime).to.be.a('function');
                    expect(constantSourceNode.offset.value).to.equal(1);
                });

                it('should be readonly', () => {
                    const constantSourceNode = createConstantSourceNode(context);

                    expect(() => {
                        constantSourceNode.offset = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelAndHoldAtTime()', () => {
                    let constantSourceNode;

                    beforeEach(() => {
                        constantSourceNode = createConstantSourceNode(context);
                    });

                    it('should be chainable', () => {
                        expect(constantSourceNode.offset.cancelAndHoldAtTime(0)).to.equal(constantSourceNode.offset);
                    });
                });

                describe('cancelScheduledValues()', () => {
                    let constantSourceNode;

                    beforeEach(() => {
                        constantSourceNode = createConstantSourceNode(context);
                    });

                    it('should be chainable', () => {
                        expect(constantSourceNode.offset.cancelScheduledValues(0)).to.equal(constantSourceNode.offset);
                    });
                });

                describe('exponentialRampToValueAtTime()', () => {
                    let constantSourceNode;

                    beforeEach(() => {
                        constantSourceNode = createConstantSourceNode(context);
                    });

                    it('should be chainable', () => {
                        expect(constantSourceNode.offset.exponentialRampToValueAtTime(1, 0)).to.equal(constantSourceNode.offset);
                    });

                    it('should throw a RangeError', () => {
                        expect(() => {
                            constantSourceNode.offset.exponentialRampToValueAtTime(0, 1);
                        }).to.throw(RangeError);
                    });

                    it('should throw a RangeError', () => {
                        expect(() => {
                            constantSourceNode.offset.exponentialRampToValueAtTime(1, -1);
                        }).to.throw(RangeError);
                    });
                });

                describe('linearRampToValueAtTime()', () => {
                    let constantSourceNode;

                    beforeEach(() => {
                        constantSourceNode = createConstantSourceNode(context);
                    });

                    it('should be chainable', () => {
                        expect(constantSourceNode.offset.linearRampToValueAtTime(1, 0)).to.equal(constantSourceNode.offset);
                    });
                });

                describe('setTargetAtTime()', () => {
                    let constantSourceNode;

                    beforeEach(() => {
                        constantSourceNode = createConstantSourceNode(context);
                    });

                    it('should be chainable', () => {
                        expect(constantSourceNode.offset.setTargetAtTime(1, 0, 0.1)).to.equal(constantSourceNode.offset);
                    });
                });

                describe('setValueAtTime()', () => {
                    let constantSourceNode;

                    beforeEach(() => {
                        constantSourceNode = createConstantSourceNode(context);
                    });

                    it('should be chainable', () => {
                        expect(constantSourceNode.offset.setValueAtTime(1, 0)).to.equal(constantSourceNode.offset);
                    });
                });

                describe('setValueCurveAtTime()', () => {
                    let constantSourceNode;

                    beforeEach(() => {
                        constantSourceNode = createConstantSourceNode(context);
                    });

                    it('should be chainable', () => {
                        expect(constantSourceNode.offset.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1)).to.equal(
                            constantSourceNode.offset
                        );
                    });
                });

                describe('automation', () => {
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

                            beforeEach(async function () {
                                this.timeout(10000);

                                if (withAnAppendedAudioWorklet) {
                                    await addAudioWorkletModule(context, 'base/test/fixtures/gain-processor.js');
                                }

                                renderer = createRenderer({
                                    context,
                                    length: context.length === undefined ? 5 : undefined,
                                    prepare(destination) {
                                        const audioWorkletNode = withAnAppendedAudioWorklet
                                            ? new AudioWorkletNode(context, 'gain-processor')
                                            : null;
                                        const constantSourceNode = createConstantSourceNode(context);
                                        const masterGainNode = new GainNode(context, {
                                            gain: withADirectConnection && withAnAppendedAudioWorklet ? 0.5 : 1
                                        });

                                        if (withADirectConnection) {
                                            constantSourceNode.connect(masterGainNode);
                                        }

                                        if (withAnAppendedAudioWorklet) {
                                            constantSourceNode.connect(audioWorkletNode).connect(masterGainNode);
                                        }

                                        masterGainNode.connect(destination);

                                        return { constantSourceNode };
                                    }
                                });
                            });

                            describe('without any automation', () => {
                                it('should not modify the signal', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        start(startTime, { constantSourceNode }) {
                                            constantSourceNode.start(startTime);
                                        }
                                    }).then((channelData) => {
                                        expect(Array.from(channelData)).to.deep.equal([1, 1, 1, 1, 1]);
                                    });
                                });
                            });

                            describe('with a modified value', () => {
                                it('should modify the signal', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        prepare({ constantSourceNode }) {
                                            constantSourceNode.offset.value = 0.5;
                                        },
                                        start(startTime, { constantSourceNode }) {
                                            constantSourceNode.start(startTime);
                                        }
                                    }).then((channelData) => {
                                        expect(Array.from(channelData)).to.deep.equal([0.5, 0.5, 0.5, 0.5, 0.5]);
                                    });
                                });
                            });

                            describe('with a call to cancelAndHoldAtTime()', () => {
                                it('should modify the signal', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        start(startTime, { constantSourceNode }) {
                                            constantSourceNode.offset.setValueAtTime(1, startTime);
                                            constantSourceNode.offset.linearRampToValueAtTime(
                                                0,
                                                roundToSamples(startTime, context.sampleRate, 5)
                                            );
                                            constantSourceNode.offset.cancelAndHoldAtTime(roundToSamples(startTime, context.sampleRate, 3));

                                            constantSourceNode.start(startTime);
                                        }
                                    }).then((channelData) => {
                                        expect(channelData[0]).to.equal(1);
                                        expect(channelData[1]).to.be.closeTo(0.8, 0.01);
                                        expect(channelData[2]).to.be.closeTo(0.6, 0.01);
                                        expect(channelData[3]).to.be.closeTo(0.4, 0.01);
                                        expect(channelData[4]).to.be.closeTo(0.4, 0.01);
                                    });
                                });
                            });

                            describe('with a call to cancelScheduledValues()', () => {
                                it('should modify the signal', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        start(startTime, { constantSourceNode }) {
                                            constantSourceNode.offset.setValueAtTime(0.5, startTime);
                                            constantSourceNode.offset.setValueAtTime(1, roundToSamples(startTime, context.sampleRate, 2));
                                            constantSourceNode.offset.linearRampToValueAtTime(
                                                0,
                                                roundToSamples(startTime, context.sampleRate, 5)
                                            );
                                            constantSourceNode.offset.cancelScheduledValues(
                                                roundToSamples(startTime, context.sampleRate, 3)
                                            );

                                            constantSourceNode.start(startTime);
                                        }
                                    }).then((channelData) => {
                                        expect(Array.from(channelData)).to.deep.equal([0.5, 0.5, 1, 1, 1]);
                                    });
                                });
                            });

                            describe('with a call to exponentialRampToValueAtTime()', () => {
                                it('should modify the signal', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        start(startTime, { constantSourceNode }) {
                                            constantSourceNode.offset.exponentialRampToValueAtTime(
                                                0.5,
                                                roundToSamples(startTime, context.sampleRate, 5)
                                            );

                                            constantSourceNode.start(startTime);
                                        },
                                        verifyChannelData: false
                                    }).then((channelData) => {
                                        expect(channelData[0]).to.be.at.most(1);
                                        expect(channelData[1]).to.be.below(1);
                                        expect(channelData[2]).to.be.below(1);
                                        expect(channelData[3]).to.be.below(1);
                                        expect(channelData[4]).to.be.below(1);
                                    });
                                });
                            });

                            describe('with a call to linearRampToValueAtTime()', () => {
                                it('should modify the signal', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        start(startTime, { constantSourceNode }) {
                                            constantSourceNode.offset.linearRampToValueAtTime(
                                                0.5,
                                                roundToSamples(startTime, context.sampleRate, 5)
                                            );

                                            constantSourceNode.start(startTime);
                                        },
                                        verifyChannelData: false
                                    }).then((channelData) => {
                                        expect(channelData[0]).to.be.at.most(1);
                                        expect(channelData[1]).to.be.below(1);
                                        expect(channelData[2]).to.be.below(1);
                                        expect(channelData[3]).to.be.below(1);
                                        expect(channelData[4]).to.be.below(1);
                                    });
                                });
                            });

                            describe('with a call to setValueAtTime()', () => {
                                it('should modify the signal', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        start(startTime, { constantSourceNode }) {
                                            constantSourceNode.offset.setValueAtTime(0.5, roundToSamples(startTime, context.sampleRate, 2));

                                            constantSourceNode.start(startTime);
                                        }
                                    }).then((channelData) => {
                                        expect(Array.from(channelData)).to.deep.equal([1, 1, 0.5, 0.5, 0.5]);
                                    });
                                });
                            });

                            describe('with a call to setValueCurveAtTime()', () => {
                                it('should modify the signal', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        start(startTime, { constantSourceNode }) {
                                            constantSourceNode.offset.setValueCurveAtTime(
                                                new Float32Array([0, 0.25, 0.5, 0.75, 1]),
                                                roundToSamples(startTime, context.sampleRate),
                                                6 / context.sampleRate
                                            );

                                            constantSourceNode.start(startTime);
                                        }
                                    }).then((channelData) => {
                                        expect(Array.from(channelData)).to.deep.equal([
                                            0, 0.1666666716337204, 0.3333333432674408, 0.5, 0.6666666865348816
                                        ]);
                                    });
                                });
                            });

                            describe('with another AudioNode connected to the AudioParam', () => {
                                it('should modify the signal', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        prepare({ constantSourceNode }) {
                                            const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                                            const audioBufferSourceNodeForAudioParam = new AudioBufferSourceNode(context);

                                            audioBuffer.copyToChannel(new Float32Array([0.5, 0.25, 0, -0.25, -0.5]), 0);

                                            audioBufferSourceNodeForAudioParam.buffer = audioBuffer;

                                            constantSourceNode.offset.value = 0;

                                            audioBufferSourceNodeForAudioParam.connect(constantSourceNode.offset);

                                            return { audioBufferSourceNodeForAudioParam };
                                        },
                                        start(startTime, { audioBufferSourceNodeForAudioParam, constantSourceNode }) {
                                            audioBufferSourceNodeForAudioParam.start(startTime);
                                            constantSourceNode.start(startTime);
                                        }
                                    }).then((channelData) => {
                                        expect(channelData[0]).to.equal(0.5);
                                        expect(channelData[1]).to.equal(0.25);
                                        expect(channelData[2]).to.be.closeTo(0, 0.000000000001);
                                        expect(channelData[3]).to.equal(-0.25);
                                        expect(channelData[4]).to.equal(-0.5);
                                    });
                                });
                            });

                            // @todo Test other automations as well.
                        });
                    }
                });
            });

            describe('onended', () => {
                let constantSourceNode;

                beforeEach(() => {
                    constantSourceNode = createConstantSourceNode(context, { offset: 0 });
                });

                it('should be null', () => {
                    expect(constantSourceNode.onended).to.be.null;
                });

                it('should be assignable to a function', () => {
                    const fn = () => {}; // eslint-disable-line unicorn/consistent-function-scoping
                    const onended = (constantSourceNode.onended = fn); // eslint-disable-line no-multi-assign

                    expect(onended).to.equal(fn);
                    expect(constantSourceNode.onended).to.equal(fn);
                });

                it('should be assignable to null', () => {
                    const onended = (constantSourceNode.onended = null); // eslint-disable-line no-multi-assign

                    expect(onended).to.be.null;
                    expect(constantSourceNode.onended).to.be.null;
                });

                it('should not be assignable to something else', () => {
                    const string = 'no function or null value';

                    constantSourceNode.onended = () => {};

                    const onended = (constantSourceNode.onended = string); // eslint-disable-line no-multi-assign

                    expect(onended).to.equal(string);
                    expect(constantSourceNode.onended).to.be.null;
                });

                it('should register an independent event listener', () => {
                    const onended = spy();

                    constantSourceNode.onended = onended;
                    constantSourceNode.addEventListener('ended', onended);

                    constantSourceNode.dispatchEvent(new Event('ended'));

                    expect(onended).to.have.been.calledTwice;
                });

                for (const withAConnection of [true, false]) {
                    describe(`${withAConnection ? 'with' : 'without'} a connection`, () => {
                        it('should fire an assigned ended event listener', (done) => {
                            constantSourceNode.onended = function (event) {
                                expect(event).to.be.an.instanceOf(Event);
                                expect(event.currentTarget).to.equal(constantSourceNode);
                                expect(event.target).to.equal(constantSourceNode);
                                expect(event.type).to.equal('ended');

                                expect(this).to.equal(constantSourceNode);

                                done();
                            };

                            if (withAConnection) {
                                constantSourceNode.connect(context.destination);
                            }

                            constantSourceNode.start();
                            constantSourceNode.stop();

                            if (context.startRendering !== undefined) {
                                context.startRendering();
                            }
                        });
                    });
                }
            });

            describe('addEventListener()', () => {
                let constantSourceNode;

                beforeEach(() => {
                    constantSourceNode = createConstantSourceNode(context, { offset: 0 });
                });

                it('should fire a registered ended event listener', (done) => {
                    constantSourceNode.addEventListener('ended', function (event) {
                        expect(event).to.be.an.instanceOf(Event);
                        expect(event.currentTarget).to.equal(constantSourceNode);
                        expect(event.target).to.equal(constantSourceNode);
                        expect(event.type).to.equal('ended');

                        expect(this).to.equal(constantSourceNode);

                        done();
                    });

                    constantSourceNode.connect(context.destination);

                    constantSourceNode.start();
                    constantSourceNode.stop();

                    if (context.startRendering !== undefined) {
                        context.startRendering();
                    }
                });
            });

            describe('connect()', () => {
                for (const type of ['AudioNode', 'AudioParam']) {
                    describe(`with an ${type}`, () => {
                        let audioNodeOrAudioParam;
                        let constantSourceNode;

                        beforeEach(() => {
                            const gainNode = new GainNode(context);

                            audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                            constantSourceNode = createConstantSourceNode(context);
                        });

                        if (type === 'AudioNode') {
                            it('should be chainable', () => {
                                expect(constantSourceNode.connect(audioNodeOrAudioParam)).to.equal(audioNodeOrAudioParam);
                            });
                        } else {
                            it('should not be chainable', () => {
                                expect(constantSourceNode.connect(audioNodeOrAudioParam)).to.be.undefined;
                            });
                        }

                        it('should accept duplicate connections', () => {
                            constantSourceNode.connect(audioNodeOrAudioParam);
                            constantSourceNode.connect(audioNodeOrAudioParam);
                        });

                        it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                            try {
                                constantSourceNode.connect(audioNodeOrAudioParam, -1);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                        if (type === 'AudioNode') {
                            it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                                try {
                                    constantSourceNode.connect(audioNodeOrAudioParam, 0, -1);
                                } catch (err) {
                                    expect(err.code).to.equal(1);
                                    expect(err.name).to.equal('IndexSizeError');

                                    done();
                                }
                            });

                            it('should not throw an error if the connection creates a cycle by connecting to an AudioParam of the source', () => {
                                constantSourceNode.connect(audioNodeOrAudioParam).connect(constantSourceNode.offset);
                            });
                        }
                    });

                    describe(`with an ${type} of another context`, () => {
                        let anotherContext;
                        let audioNodeOrAudioParam;
                        let constantSourceNode;

                        afterEach(() => {
                            if (anotherContext.close !== undefined) {
                                return anotherContext.close();
                            }
                        });

                        beforeEach(() => {
                            anotherContext = createContext();

                            const gainNode = new GainNode(anotherContext);

                            audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                            constantSourceNode = createConstantSourceNode(context);
                        });

                        it('should throw an InvalidAccessError', (done) => {
                            try {
                                constantSourceNode.connect(audioNodeOrAudioParam);
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });
                    });

                    describe(`with an ${type} of a native context`, () => {
                        let constantSourceNode;
                        let nativeAudioNodeOrAudioParam;
                        let nativeContext;

                        afterEach(() => {
                            /*
                             * Bug #94: Safari also exposes a close() method on an OfflineAudioContext which is why the extra check for the
                             * startRendering() method is necessary.
                             * Bug #160: Safari also exposes a startRendering() method on an AudioContext.
                             */
                            if (
                                nativeContext.close !== undefined &&
                                (nativeContext.startRendering === undefined || !nativeContext.constructor.name.includes('Offline'))
                            ) {
                                return nativeContext.close();
                            }
                        });

                        beforeEach(() => {
                            constantSourceNode = createConstantSourceNode(context);
                            nativeContext = description.includes('Offline')
                                ? createNativeOfflineAudioContext()
                                : createNativeAudioContext();

                            const nativeGainNode = nativeContext.createGain();

                            nativeAudioNodeOrAudioParam = type === 'AudioNode' ? nativeGainNode : nativeGainNode.gain;
                        });

                        it('should throw an InvalidAccessError', (done) => {
                            try {
                                constantSourceNode.connect(nativeAudioNodeOrAudioParam);
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });
                    });
                }

                describe('with a cycle', () => {
                    let renderer;

                    beforeEach(() => {
                        renderer = createRenderer({
                            context,
                            length: context.length === undefined ? 5 : undefined,
                            prepare(destination) {
                                const anotherGainNode = new GainNode(context);
                                const constantSourceNode = createConstantSourceNode(context);
                                const gainNode = new GainNode(context);

                                constantSourceNode.connect(gainNode).connect(destination);

                                gainNode.connect(anotherGainNode).connect(gainNode);

                                return { anotherGainNode, constantSourceNode, gainNode };
                            }
                        });
                    });

                    it('should render silence', function () {
                        this.timeout(10000);

                        return renderer({
                            start(startTime, { constantSourceNode }) {
                                constantSourceNode.start(startTime);
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
                            prepare(destination) {
                                const constantSourceNode = createConstantSourceNode(context);
                                const firstDummyGainNode = new GainNode(context);
                                const secondDummyGainNode = new GainNode(context);

                                constantSourceNode.connect(firstDummyGainNode).connect(destination);

                                constantSourceNode.connect(secondDummyGainNode);

                                return { constantSourceNode, firstDummyGainNode, secondDummyGainNode };
                            }
                        });
                });

                describe('without any parameters', () => {
                    let renderer;

                    beforeEach(function () {
                        this.timeout(10000);

                        renderer = createPredefinedRenderer();
                    });

                    it('should disconnect all destinations', function () {
                        this.timeout(10000);

                        return renderer({
                            prepare({ constantSourceNode }) {
                                constantSourceNode.disconnect();
                            },
                            start(startTime, { constantSourceNode }) {
                                constantSourceNode.start(startTime);
                            }
                        }).then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                        });
                    });
                });

                describe('with an output', () => {
                    describe('with a value which is out-of-bound', () => {
                        let constantSourceNode;

                        beforeEach(() => {
                            constantSourceNode = createConstantSourceNode(context);
                        });

                        it('should throw an IndexSizeError', (done) => {
                            try {
                                constantSourceNode.disconnect(-1);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });
                    });

                    describe('with a connection from the given output', () => {
                        let renderer;

                        beforeEach(function () {
                            this.timeout(10000);

                            renderer = createPredefinedRenderer();
                        });

                        it('should disconnect all destinations from the given output', function () {
                            this.timeout(10000);

                            return renderer({
                                prepare({ constantSourceNode }) {
                                    constantSourceNode.disconnect(0);
                                },
                                start(startTime, { constantSourceNode }) {
                                    constantSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                            });
                        });
                    });
                });

                describe('with a destination', () => {
                    describe('without a connection to the given destination', () => {
                        let constantSourceNode;

                        beforeEach(() => {
                            constantSourceNode = createConstantSourceNode(context);
                        });

                        it('should throw an InvalidAccessError', (done) => {
                            try {
                                constantSourceNode.disconnect(new GainNode(context));
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });
                    });

                    describe('with a connection to the given destination', () => {
                        let renderer;

                        beforeEach(function () {
                            this.timeout(10000);

                            renderer = createPredefinedRenderer();
                        });

                        it('should disconnect the destination', function () {
                            this.timeout(10000);

                            return renderer({
                                prepare({ constantSourceNode, firstDummyGainNode }) {
                                    constantSourceNode.disconnect(firstDummyGainNode);
                                },
                                start(startTime, { constantSourceNode }) {
                                    constantSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                            });
                        });

                        it('should disconnect another destination in isolation', function () {
                            this.timeout(10000);

                            return renderer({
                                prepare({ constantSourceNode, secondDummyGainNode }) {
                                    constantSourceNode.disconnect(secondDummyGainNode);
                                },
                                start(startTime, { constantSourceNode }) {
                                    constantSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([1, 1, 1, 1, 1]);
                            });
                        });
                    });
                });

                describe('with a destination and an output', () => {
                    let constantSourceNode;

                    beforeEach(() => {
                        constantSourceNode = createConstantSourceNode(context);
                    });

                    it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                        try {
                            constantSourceNode.disconnect(new GainNode(context), -1);
                        } catch (err) {
                            expect(err.code).to.equal(1);
                            expect(err.name).to.equal('IndexSizeError');

                            done();
                        }
                    });

                    it('should throw an InvalidAccessError if there is no similar connection', (done) => {
                        try {
                            constantSourceNode.disconnect(new GainNode(context), 0);
                        } catch (err) {
                            expect(err.code).to.equal(15);
                            expect(err.name).to.equal('InvalidAccessError');

                            done();
                        }
                    });
                });

                describe('with a destination, an output and an input', () => {
                    let constantSourceNode;

                    beforeEach(() => {
                        constantSourceNode = createConstantSourceNode(context);
                    });

                    it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                        try {
                            constantSourceNode.disconnect(new GainNode(context), -1, 0);
                        } catch (err) {
                            expect(err.code).to.equal(1);
                            expect(err.name).to.equal('IndexSizeError');

                            done();
                        }
                    });

                    it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                        try {
                            constantSourceNode.disconnect(new GainNode(context), 0, -1);
                        } catch (err) {
                            expect(err.code).to.equal(1);
                            expect(err.name).to.equal('IndexSizeError');

                            done();
                        }
                    });

                    it('should throw an InvalidAccessError if there is no similar connection', (done) => {
                        try {
                            constantSourceNode.disconnect(new GainNode(context), 0, 0);
                        } catch (err) {
                            expect(err.code).to.equal(15);
                            expect(err.name).to.equal('InvalidAccessError');

                            done();
                        }
                    });
                });
            });

            describe('removeEventListener()', () => {
                let constantSourceNode;

                beforeEach(() => {
                    constantSourceNode = createConstantSourceNode(context, { offset: 0 });
                });

                it('should not fire a removed ended event listener', (done) => {
                    const listener = spy();

                    constantSourceNode.addEventListener('ended', listener);
                    constantSourceNode.removeEventListener('ended', listener);

                    constantSourceNode.connect(context.destination);

                    constantSourceNode.start();
                    constantSourceNode.stop();

                    setTimeout(() => {
                        expect(listener).to.have.not.been.called;

                        done();
                    }, 500);

                    if (context.startRendering !== undefined) {
                        context.startRendering();
                    }
                });
            });

            describe('start()', () => {
                let constantSourceNode;

                beforeEach(() => {
                    constantSourceNode = createConstantSourceNode(context);
                });

                describe('with a previous call to start()', () => {
                    beforeEach(() => {
                        constantSourceNode.start();
                    });

                    it('should throw an InvalidStateError', (done) => {
                        try {
                            constantSourceNode.start();
                        } catch (err) {
                            expect(err.code).to.equal(11);
                            expect(err.name).to.equal('InvalidStateError');

                            done();
                        }
                    });
                });

                describe('with a previous call to stop()', () => {
                    beforeEach(() => {
                        constantSourceNode.start();
                        constantSourceNode.stop();
                    });

                    it('should throw an InvalidStateError', (done) => {
                        try {
                            constantSourceNode.start();
                        } catch (err) {
                            expect(err.code).to.equal(11);
                            expect(err.name).to.equal('InvalidStateError');

                            done();
                        }
                    });
                });

                describe('with a negative value as first parameter', () => {
                    it('should throw a RangeError', () => {
                        expect(() => {
                            constantSourceNode.start(-1);
                        }).to.throw(RangeError);
                    });
                });
            });

            describe('stop()', () => {
                describe('without a previous call to start()', () => {
                    let constantSourceNode;

                    beforeEach(() => {
                        constantSourceNode = createConstantSourceNode(context);
                    });

                    it('should throw an InvalidStateError', (done) => {
                        try {
                            constantSourceNode.stop();
                        } catch (err) {
                            expect(err.code).to.equal(11);
                            expect(err.name).to.equal('InvalidStateError');

                            done();
                        }
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

                            beforeEach(async function () {
                                this.timeout(10000);

                                if (withAnAppendedAudioWorklet) {
                                    await addAudioWorkletModule(context, 'base/test/fixtures/gain-processor.js');
                                }

                                renderer = createRenderer({
                                    context,
                                    length: context.length === undefined ? 5 : undefined,
                                    prepare(destination) {
                                        const audioWorkletNode = withAnAppendedAudioWorklet
                                            ? new AudioWorkletNode(context, 'gain-processor')
                                            : null;
                                        const constantSourceNode = createConstantSourceNode(context);
                                        const masterGainNode = new GainNode(context, {
                                            gain: withADirectConnection && withAnAppendedAudioWorklet ? 0.5 : 1
                                        });

                                        if (withADirectConnection) {
                                            constantSourceNode.connect(masterGainNode);
                                        }

                                        if (withAnAppendedAudioWorklet) {
                                            constantSourceNode.connect(audioWorkletNode).connect(masterGainNode);
                                        }

                                        masterGainNode.connect(destination);

                                        return { constantSourceNode };
                                    }
                                });
                            });

                            it('should apply the values from the last invocation', function () {
                                this.timeout(10000);

                                return renderer({
                                    start(startTime, { constantSourceNode }) {
                                        constantSourceNode.start(startTime);
                                        constantSourceNode.stop(roundToSamples(startTime, context.sampleRate, 5));
                                        constantSourceNode.stop(roundToSamples(startTime, context.sampleRate, 3));
                                    }
                                }).then((channelData) => {
                                    expect(Array.from(channelData)).to.deep.equal([1, 1, 1, 0, 0]);
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

                            beforeEach(async function () {
                                this.timeout(10000);

                                if (withAnAppendedAudioWorklet) {
                                    await addAudioWorkletModule(context, 'base/test/fixtures/gain-processor.js');
                                }

                                renderer = createRenderer({
                                    context,
                                    length: context.length === undefined ? 5 : undefined,
                                    prepare(destination) {
                                        const audioWorkletNode = withAnAppendedAudioWorklet
                                            ? new AudioWorkletNode(context, 'gain-processor')
                                            : null;
                                        const constantSourceNode = createConstantSourceNode(context);
                                        const masterGainNode = new GainNode(context, {
                                            gain: withADirectConnection && withAnAppendedAudioWorklet ? 0.5 : 1
                                        });

                                        if (withADirectConnection) {
                                            constantSourceNode.connect(masterGainNode);
                                        }

                                        if (withAnAppendedAudioWorklet) {
                                            constantSourceNode.connect(audioWorkletNode).connect(masterGainNode);
                                        }

                                        masterGainNode.connect(destination);

                                        return { constantSourceNode };
                                    }
                                });
                            });

                            it('should not play anything', function () {
                                this.timeout(10000);

                                return renderer({
                                    start(startTime, { constantSourceNode }) {
                                        constantSourceNode.start(roundToSamples(startTime, context.sampleRate, 3));
                                        constantSourceNode.stop(roundToSamples(startTime, context.sampleRate, 1));
                                    }
                                }).then((channelData) => {
                                    expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                                });
                            });
                        });
                    }
                });

                describe('with an emitted ended event', () => {
                    let constantSourceNode;

                    beforeEach((done) => {
                        constantSourceNode = createConstantSourceNode(context);

                        constantSourceNode.onended = () => done();

                        constantSourceNode.connect(context.destination);

                        constantSourceNode.start();
                        constantSourceNode.stop();

                        if (context.startRendering !== undefined) {
                            context.startRendering();
                        }
                    });

                    it('should ignore calls to stop()', () => {
                        constantSourceNode.stop();
                    });
                });

                describe('with a negative value as first parameter', () => {
                    let constantSourceNode;

                    beforeEach(() => {
                        constantSourceNode = createConstantSourceNode(context);

                        constantSourceNode.start();
                    });

                    it('should throw a RangeError', () => {
                        expect(() => {
                            constantSourceNode.stop(-1);
                        }).to.throw(RangeError);
                    });
                });
            });
        });
    }
});
