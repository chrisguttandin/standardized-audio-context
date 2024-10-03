import {
    AudioBuffer,
    AudioBufferSourceNode,
    AudioWorkletNode,
    ConstantSourceNode,
    DelayNode,
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

const createDelayNodeWithConstructor = (context, options = null) => {
    if (options === null) {
        return new DelayNode(context);
    }

    return new DelayNode(context, options);
};
const createDelayNodeWithFactoryFunction = (context, options = null) => {
    const delayNode = options === null ? context.createDelay() : context.createDelay(options.maxDelayTime);

    if (options !== null && options.channelCount !== undefined) {
        delayNode.channelCount = options.channelCount;
    }

    if (options !== null && options.channelCountMode !== undefined) {
        delayNode.channelCountMode = options.channelCountMode;
    }

    if (options !== null && options.channelInterpretation !== undefined) {
        delayNode.channelInterpretation = options.channelInterpretation;
    }

    if (options !== null && options.delayTime !== undefined) {
        delayNode.delayTime.value = options.delayTime;
    }

    return delayNode;
};
const testCases = {
    'constructor of a MinimalAudioContext': {
        createContext: createMinimalAudioContext,
        createDelayNode: createDelayNodeWithConstructor
    },
    'constructor of a MinimalOfflineAudioContext': {
        createContext: createMinimalOfflineAudioContext,
        createDelayNode: createDelayNodeWithConstructor
    },
    'constructor of an AudioContext': {
        createContext: createAudioContext,
        createDelayNode: createDelayNodeWithConstructor
    },
    'constructor of an OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createDelayNode: createDelayNodeWithConstructor
    },
    'factory function of an AudioContext': {
        createContext: createAudioContext,
        createDelayNode: createDelayNodeWithFactoryFunction
    },
    'factory function of an OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createDelayNode: createDelayNodeWithFactoryFunction
    }
};

describe('DelayNode', () => {
    for (const [description, { createDelayNode, createContext }] of Object.entries(testCases)) {
        describe(`with the ${description}`, () => {
            let context;

            afterEach(() => context.close?.());

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
                                return context.close?.() ?? context.startRendering?.();
                            }
                        });

                        describe('without any options', () => {
                            let delayNode;

                            beforeEach(() => {
                                delayNode = createDelayNode(context);
                            });

                            it('should return an instance of the DelayNode constructor', () => {
                                expect(delayNode).to.be.an.instanceOf(DelayNode);
                            });

                            it('should return an implementation of the EventTarget interface', () => {
                                expect(delayNode.addEventListener).to.be.a('function');
                                expect(delayNode.dispatchEvent).to.be.a('function');
                                expect(delayNode.removeEventListener).to.be.a('function');
                            });

                            it('should return an implementation of the AudioNode interface', () => {
                                expect(delayNode.channelCount).to.equal(2);
                                expect(delayNode.channelCountMode).to.equal('max');
                                expect(delayNode.channelInterpretation).to.equal('speakers');
                                expect(delayNode.connect).to.be.a('function');
                                expect(delayNode.context).to.be.an.instanceOf(context.constructor);
                                expect(delayNode.disconnect).to.be.a('function');
                                expect(delayNode.numberOfInputs).to.equal(1);
                                expect(delayNode.numberOfOutputs).to.equal(1);
                            });

                            it('should return an implementation of the DelayNode interface', () => {
                                expect(delayNode.delayTime).not.to.be.undefined;
                            });
                        });

                        describe('with valid options', () => {
                            it('should return an instance with the given initial value for delayTime', () => {
                                const delayTime = 0.5;
                                const delayNode = createDelayNode(context, { delayTime });

                                if (description.startsWith('constructor')) {
                                    expect(delayNode.delayTime.defaultValue).to.equal(delayTime);
                                } else {
                                    expect(delayNode.delayTime.defaultValue).to.equal(0);
                                }

                                expect(delayNode.delayTime.value).to.equal(delayTime);
                            });

                            it('should return an instance with the given maxDelayTime', () => {
                                const maxDelayTime = 4;
                                const delayNode = createDelayNode(context, { maxDelayTime });

                                expect(delayNode.delayTime.maxValue).to.equal(maxDelayTime);
                            });
                        });

                        describe('with invalid options', () => {
                            describe('with a maxDelayTime below zero', () => {
                                it('should throw a NotSupportedError', (done) => {
                                    try {
                                        createDelayNode(context, { maxDelayTime: -1 });
                                    } catch (err) {
                                        expect(err.code).to.equal(9);
                                        expect(err.name).to.equal('NotSupportedError');

                                        done();
                                    }
                                });
                            });

                            describe('with a maxDelayTime of more than three minutes', () => {
                                it('should throw a NotSupportedError', (done) => {
                                    try {
                                        createDelayNode(context, { maxDelayTime: 181 });
                                    } catch (err) {
                                        expect(err.code).to.equal(9);
                                        expect(err.name).to.equal('NotSupportedError');

                                        done();
                                    }
                                });
                            });
                        });
                    });
                }
            });

            describe('channelCount', () => {
                let delayNode;

                beforeEach(() => {
                    delayNode = createDelayNode(context);
                });

                it('should be assignable to another value', () => {
                    const channelCount = 4;

                    delayNode.channelCount = channelCount;

                    expect(delayNode.channelCount).to.equal(channelCount);
                });
            });

            describe('channelCountMode', () => {
                let delayNode;

                beforeEach(() => {
                    delayNode = createDelayNode(context);
                });

                it('should be assignable to another value', () => {
                    const channelCountMode = 'explicit';

                    delayNode.channelCountMode = channelCountMode;

                    expect(delayNode.channelCountMode).to.equal(channelCountMode);
                });
            });

            describe('channelInterpretation', () => {
                let delayNode;

                beforeEach(() => {
                    delayNode = createDelayNode(context);
                });

                it('should be assignable to another value', () => {
                    const channelInterpretation = 'discrete';

                    delayNode.channelInterpretation = channelInterpretation;

                    expect(delayNode.channelInterpretation).to.equal(channelInterpretation);
                });
            });

            describe('delayTime', () => {
                it('should return an implementation of the AudioParam interface', () => {
                    const delayNode = createDelayNode(context);

                    expect(delayNode.delayTime.cancelAndHoldAtTime).to.be.a('function');
                    expect(delayNode.delayTime.cancelScheduledValues).to.be.a('function');
                    expect(delayNode.delayTime.defaultValue).to.equal(0);
                    expect(delayNode.delayTime.exponentialRampToValueAtTime).to.be.a('function');
                    expect(delayNode.delayTime.linearRampToValueAtTime).to.be.a('function');
                    expect(delayNode.delayTime.maxValue).to.equal(1);
                    expect(delayNode.delayTime.minValue).to.equal(0);
                    expect(delayNode.delayTime.setTargetAtTime).to.be.a('function');
                    expect(delayNode.delayTime.setValueAtTime).to.be.a('function');
                    expect(delayNode.delayTime.setValueCurveAtTime).to.be.a('function');
                    expect(delayNode.delayTime.value).to.equal(0);
                });

                it('should be readonly', () => {
                    const delayNode = createDelayNode(context);

                    expect(() => {
                        delayNode.delayTime = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelAndHoldAtTime()', () => {
                    let delayNode;

                    beforeEach(() => {
                        delayNode = createDelayNode(context);
                    });

                    it('should be chainable', () => {
                        expect(delayNode.delayTime.cancelAndHoldAtTime(0)).to.equal(delayNode.delayTime);
                    });
                });

                describe('cancelScheduledValues()', () => {
                    let delayNode;

                    beforeEach(() => {
                        delayNode = createDelayNode(context);
                    });

                    it('should be chainable', () => {
                        expect(delayNode.delayTime.cancelScheduledValues(0)).to.equal(delayNode.delayTime);
                    });
                });

                describe('exponentialRampToValueAtTime()', () => {
                    let delayNode;

                    beforeEach(() => {
                        delayNode = createDelayNode(context);
                    });

                    it('should be chainable', () => {
                        // @todo Firefox can't schedule an exponential ramp when the value is 0.
                        delayNode.delayTime.value = 1;

                        expect(delayNode.delayTime.exponentialRampToValueAtTime(1, 0)).to.equal(delayNode.delayTime);
                    });

                    it('should throw a RangeError', () => {
                        expect(() => {
                            delayNode.delayTime.exponentialRampToValueAtTime(0, 1);
                        }).to.throw(RangeError);
                    });

                    it('should throw a RangeError', () => {
                        expect(() => {
                            delayNode.delayTime.exponentialRampToValueAtTime(1, -1);
                        }).to.throw(RangeError);
                    });
                });

                describe('linearRampToValueAtTime()', () => {
                    let delayNode;

                    beforeEach(() => {
                        delayNode = createDelayNode(context);
                    });

                    it('should be chainable', () => {
                        expect(delayNode.delayTime.linearRampToValueAtTime(1, 0)).to.equal(delayNode.delayTime);
                    });
                });

                describe('setTargetAtTime()', () => {
                    let delayNode;

                    beforeEach(() => {
                        delayNode = createDelayNode(context);
                    });

                    it('should be chainable', () => {
                        expect(delayNode.delayTime.setTargetAtTime(1, 0, 0.1)).to.equal(delayNode.delayTime);
                    });
                });

                describe('setValueAtTime()', () => {
                    let delayNode;

                    beforeEach(() => {
                        delayNode = createDelayNode(context);
                    });

                    it('should be chainable', () => {
                        expect(delayNode.delayTime.setValueAtTime(1, 0)).to.equal(delayNode.delayTime);
                    });
                });

                describe('setValueCurveAtTime()', () => {
                    let delayNode;

                    beforeEach(() => {
                        delayNode = createDelayNode(context);
                    });

                    for (const [arrayType, values] of [
                        ['regular Array', [1, 0]],
                        ['Float32Array', new Float32Array([1, 0])]
                    ]) {
                        describe(`with a ${arrayType}`, () => {
                            it('should be chainable', () => {
                                expect(delayNode.delayTime.setValueCurveAtTime(values, 0, 1)).to.equal(delayNode.delayTime);
                            });
                        });
                    }
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
                            let values;

                            beforeEach(async function () {
                                this.timeout(10000);

                                values = [1, 0.5, 0, -0.5, -1];

                                if (withAnAppendedAudioWorklet) {
                                    await addAudioWorkletModule(context, 'base/test/fixtures/gain-processor.js');
                                }

                                renderer = createRenderer({
                                    context,
                                    length: context.length === undefined ? 5 : undefined,
                                    prepare(destination) {
                                        const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                                        const audioBufferSourceNode = new AudioBufferSourceNode(context);
                                        const audioWorkletNode = withAnAppendedAudioWorklet
                                            ? new AudioWorkletNode(context, 'gain-processor')
                                            : null;
                                        const delayNode = createDelayNode(context);
                                        const masterGainNode = new GainNode(context, {
                                            gain: withADirectConnection && withAnAppendedAudioWorklet ? 0.5 : 1
                                        });

                                        audioBuffer.copyToChannel(new Float32Array(values), 0);

                                        audioBufferSourceNode.buffer = audioBuffer;

                                        audioBufferSourceNode.connect(delayNode);

                                        if (withADirectConnection) {
                                            delayNode.connect(masterGainNode);
                                        }

                                        if (withAnAppendedAudioWorklet) {
                                            delayNode.connect(audioWorkletNode).connect(masterGainNode);
                                        }

                                        masterGainNode.connect(destination);

                                        return { audioBufferSourceNode, delayNode };
                                    }
                                });
                            });

                            describe('without any automation', () => {
                                it('should not modify the signal', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        start(startTime, { audioBufferSourceNode }) {
                                            audioBufferSourceNode.start(startTime);
                                        }
                                    }).then((channelData) => {
                                        expect(channelData[0]).to.equal(1);
                                        expect(channelData[1]).to.equal(0.5);
                                        expect(channelData[2]).to.be.closeTo(0, 0.000000000001);
                                        expect(channelData[3]).to.equal(-0.5);
                                        expect(channelData[4]).to.equal(-1);
                                    });
                                });
                            });

                            // Bug #185: Chrome adds an extra sample to the delay.
                            if (!/Chrome/.test(navigator.userAgent)) {
                                describe('with a modified value', () => {
                                    it('should modify the signal', function () {
                                        this.timeout(10000);

                                        return renderer({
                                            prepare({ delayNode }) {
                                                delayNode.delayTime.value = 3 / context.sampleRate;
                                            },
                                            start(startTime, { audioBufferSourceNode }) {
                                                audioBufferSourceNode.start(startTime);
                                            }
                                        }).then((channelData) => {
                                            expect(channelData[0]).to.equal(0);
                                            expect(channelData[1]).to.equal(0);
                                            expect(channelData[2]).to.equal(0);
                                            expect(channelData[3]).to.be.closeTo(1, 0.000001);
                                            expect(channelData[4]).to.be.closeTo(0.5, 0.000001);
                                        });
                                    });
                                });
                            }

                            describe('with a call to cancelAndHoldAtTime()', () => {
                                // @todo
                            });

                            describe('with a call to cancelScheduledValues()', () => {
                                it('should modify the signal', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        start(startTime, { audioBufferSourceNode, delayNode }) {
                                            delayNode.delayTime.setValueAtTime(3 / context.sampleRate, startTime);
                                            delayNode.delayTime.setValueAtTime(0, roundToSamples(startTime, context.sampleRate, 2));
                                            delayNode.delayTime.linearRampToValueAtTime(
                                                1,
                                                roundToSamples(startTime, context.sampleRate, 5)
                                            );
                                            delayNode.delayTime.cancelScheduledValues(roundToSamples(startTime, context.sampleRate, 3));

                                            audioBufferSourceNode.start(startTime);
                                        }
                                    }).then((channelData) => {
                                        expect(channelData[0]).to.equal(0);
                                        expect(channelData[1]).to.equal(0);
                                        expect(channelData[2]).to.be.closeTo(0, 0.00000000001);
                                        expect(channelData[3]).to.equal(-0.5);
                                        expect(channelData[4]).to.equal(-1);
                                    });
                                });
                            });

                            describe('with a call to setValueAtTime()', () => {
                                // Bug #185: Chrome adds an extra sample to the delay.
                                if (!/Chrome/.test(navigator.userAgent)) {
                                    it('should modify the signal', function () {
                                        this.timeout(10000);

                                        return renderer({
                                            start(startTime, { audioBufferSourceNode, delayNode }) {
                                                delayNode.delayTime.setValueAtTime(
                                                    3 / context.sampleRate,
                                                    roundToSamples(startTime, context.sampleRate, 2)
                                                );

                                                audioBufferSourceNode.start(startTime);
                                            }
                                        }).then((channelData) => {
                                            expect(channelData[0]).to.equal(1);
                                            expect(channelData[1]).to.equal(0.5);
                                            expect(channelData[2]).to.equal(0);
                                            expect(channelData[3]).to.be.closeTo(1, 0.000001);
                                            expect(channelData[4]).to.be.closeTo(0.5, 0.000001);
                                        });
                                    });
                                }
                            });

                            describe('with a call to setValueCurveAtTime()', () => {
                                // Bug #185: Chrome adds an extra sample to the delay.
                                if (!/Chrome/.test(navigator.userAgent)) {
                                    it('should modify the signal', function () {
                                        this.timeout(10000);

                                        return renderer({
                                            start(startTime, { audioBufferSourceNode, delayNode }) {
                                                delayNode.delayTime.setValueCurveAtTime(
                                                    new Float32Array([0, 0.25, 0.5, 0.75, 1]),
                                                    roundToSamples(startTime, context.sampleRate),
                                                    6 / context.sampleRate
                                                );

                                                audioBufferSourceNode.start(startTime);
                                            }
                                        }).then((channelData) => {
                                            expect(Array.from(channelData)).to.deep.equal([1, 0, 0, 0, 0]);
                                        });
                                    });
                                }
                            });

                            describe('with another AudioNode connected to the AudioParam', () => {
                                // Bug #185: Chrome adds an extra sample to the delay.
                                if (!/Chrome/.test(navigator.userAgent)) {
                                    it('should modify the signal', function () {
                                        this.timeout(10000);

                                        return renderer({
                                            prepare({ delayNode }) {
                                                const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                                                const audioBufferSourceNodeForAudioParam = new AudioBufferSourceNode(context);
                                                const value = 3 / context.sampleRate;

                                                audioBuffer.copyToChannel(new Float32Array([value, value, value, value, value]), 0);

                                                audioBufferSourceNodeForAudioParam.buffer = audioBuffer;

                                                delayNode.delayTime.value = 0;

                                                audioBufferSourceNodeForAudioParam.connect(delayNode.delayTime);

                                                return { audioBufferSourceNodeForAudioParam };
                                            },
                                            start(startTime, { audioBufferSourceNode, audioBufferSourceNodeForAudioParam }) {
                                                audioBufferSourceNode.start(startTime);
                                                audioBufferSourceNodeForAudioParam.start(startTime);
                                            }
                                        }).then((channelData) => {
                                            expect(channelData[0]).to.equal(0);
                                            expect(channelData[1]).to.equal(0);
                                            expect(channelData[2]).to.equal(0);
                                            expect(channelData[3]).to.be.closeTo(1, 0.000001);
                                            expect(channelData[4]).to.be.closeTo(0.5, 0.00001);
                                        });
                                    });
                                }
                            });

                            // @todo Test other automations as well.
                        });
                    }
                });
            });

            describe('numberOfInputs', () => {
                let delayNode;

                beforeEach(() => {
                    delayNode = createDelayNode(context);
                });

                it('should be readonly', () => {
                    expect(() => {
                        delayNode.numberOfInputs = 2;
                    }).to.throw(TypeError);
                });
            });

            describe('numberOfOutputs', () => {
                let delayNode;

                beforeEach(() => {
                    delayNode = createDelayNode(context);
                });

                it('should be readonly', () => {
                    expect(() => {
                        delayNode.numberOfOutputs = 2;
                    }).to.throw(TypeError);
                });
            });

            describe('connect()', () => {
                for (const type of ['AudioNode', 'AudioParam']) {
                    describe(`with an ${type}`, () => {
                        let audioNodeOrAudioParam;
                        let delayNode;

                        beforeEach(() => {
                            const gainNode = new GainNode(context);

                            audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                            delayNode = createDelayNode(context);
                        });

                        if (type === 'AudioNode') {
                            it('should be chainable', () => {
                                expect(delayNode.connect(audioNodeOrAudioParam)).to.equal(audioNodeOrAudioParam);
                            });
                        } else {
                            it('should not be chainable', () => {
                                expect(delayNode.connect(audioNodeOrAudioParam)).to.be.undefined;
                            });
                        }

                        it('should accept duplicate connections', () => {
                            delayNode.connect(audioNodeOrAudioParam);
                            delayNode.connect(audioNodeOrAudioParam);
                        });

                        it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                            try {
                                delayNode.connect(audioNodeOrAudioParam, -1);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                        if (type === 'AudioNode') {
                            it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                                try {
                                    delayNode.connect(audioNodeOrAudioParam, 0, -1);
                                } catch (err) {
                                    expect(err.code).to.equal(1);
                                    expect(err.name).to.equal('IndexSizeError');

                                    done();
                                }
                            });

                            it('should not throw an error if the connection creates a cycle by connecting to the source', () => {
                                audioNodeOrAudioParam.connect(delayNode).connect(audioNodeOrAudioParam);
                            });

                            it('should not throw an error if the connection creates a cycle by connecting to an AudioParam of the source', () => {
                                audioNodeOrAudioParam.connect(delayNode).connect(audioNodeOrAudioParam.gain);
                            });
                        }
                    });

                    describe(`with an ${type} of another context`, () => {
                        let anotherContext;
                        let audioNodeOrAudioParam;
                        let delayNode;

                        afterEach(() => anotherContext.close?.());

                        beforeEach(() => {
                            anotherContext = createContext();

                            const gainNode = new GainNode(anotherContext);

                            audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                            delayNode = createDelayNode(context);
                        });

                        it('should throw an InvalidAccessError', (done) => {
                            try {
                                delayNode.connect(audioNodeOrAudioParam);
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });
                    });

                    describe(`with an ${type} of a native context`, () => {
                        let delayNode;
                        let nativeAudioNodeOrAudioParam;
                        let nativeContext;

                        afterEach(() => nativeContext.close?.());

                        beforeEach(() => {
                            delayNode = createDelayNode(context);
                            nativeContext = description.includes('Offline')
                                ? createNativeOfflineAudioContext()
                                : createNativeAudioContext();

                            const nativeGainNode = nativeContext.createGain();

                            nativeAudioNodeOrAudioParam = type === 'AudioNode' ? nativeGainNode : nativeGainNode.gain;
                        });

                        it('should throw an InvalidAccessError', (done) => {
                            try {
                                delayNode.connect(nativeAudioNodeOrAudioParam);
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
                                const constantSourceNode = new ConstantSourceNode(context);
                                const delayNode = createDelayNode(context);
                                const gainNode = new GainNode(context);

                                /*
                                 * Bug #164: Only Firefox detects cycles and therefore is the only browser which clamps the delayTime to
                                 * the minimum amount.
                                 */
                                delayNode.delayTime.value = 128 / context.sampleRate;

                                constantSourceNode.connect(delayNode).connect(destination);

                                delayNode.connect(gainNode).connect(delayNode);

                                return { constantSourceNode, delayNode, gainNode };
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
                    createPredefinedRenderer = (values) =>
                        createRenderer({
                            context,
                            length: context.length === undefined ? 5 : undefined,
                            prepare(destination) {
                                const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                                const audioBufferSourceNode = new AudioBufferSourceNode(context);
                                const delayNode = createDelayNode(context);
                                const firstDummyGainNode = new GainNode(context);
                                const secondDummyGainNode = new GainNode(context);

                                audioBuffer.copyToChannel(new Float32Array(values), 0);

                                audioBufferSourceNode.buffer = audioBuffer;

                                audioBufferSourceNode.connect(delayNode).connect(firstDummyGainNode).connect(destination);

                                delayNode.connect(secondDummyGainNode);

                                return { audioBufferSourceNode, delayNode, firstDummyGainNode, secondDummyGainNode };
                            }
                        });
                });

                describe('without any parameters', () => {
                    let renderer;
                    let values;

                    beforeEach(function () {
                        this.timeout(10000);

                        values = [1, 1, 1, 1, 1];

                        renderer = createPredefinedRenderer(values);
                    });

                    it('should disconnect all destinations', function () {
                        this.timeout(10000);

                        return renderer({
                            prepare({ delayNode }) {
                                delayNode.disconnect();
                            },
                            start(startTime, { audioBufferSourceNode }) {
                                audioBufferSourceNode.start(startTime);
                            }
                        }).then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                        });
                    });
                });

                describe('with an output', () => {
                    describe('with a value which is out-of-bound', () => {
                        let delayNode;

                        beforeEach(() => {
                            delayNode = createDelayNode(context);
                        });

                        it('should throw an IndexSizeError', (done) => {
                            try {
                                delayNode.disconnect(-1);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });
                    });

                    describe('with a connection from the given output', () => {
                        let renderer;
                        let values;

                        beforeEach(function () {
                            this.timeout(10000);

                            values = [1, 1, 1, 1, 1];

                            renderer = createPredefinedRenderer(values);
                        });

                        it('should disconnect all destinations from the given output', function () {
                            this.timeout(10000);

                            return renderer({
                                prepare({ delayNode }) {
                                    delayNode.disconnect(0);
                                },
                                start(startTime, { audioBufferSourceNode }) {
                                    audioBufferSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                            });
                        });
                    });
                });

                describe('with a destination', () => {
                    describe('without a connection to the given destination', () => {
                        let delayNode;

                        beforeEach(() => {
                            delayNode = createDelayNode(context);
                        });

                        it('should throw an InvalidAccessError', (done) => {
                            try {
                                delayNode.disconnect(new GainNode(context));
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });
                    });

                    describe('with a connection to the given destination', () => {
                        let renderer;
                        let values;

                        beforeEach(function () {
                            this.timeout(10000);

                            values = [1, 1, 1, 1, 1];

                            renderer = createPredefinedRenderer(values);
                        });

                        it('should disconnect the destination', function () {
                            this.timeout(10000);

                            return renderer({
                                prepare({ delayNode, firstDummyGainNode }) {
                                    delayNode.disconnect(firstDummyGainNode);
                                },
                                start(startTime, { audioBufferSourceNode }) {
                                    audioBufferSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                            });
                        });

                        it('should disconnect another destination in isolation', function () {
                            this.timeout(10000);

                            return renderer({
                                prepare({ delayNode, secondDummyGainNode }) {
                                    delayNode.disconnect(secondDummyGainNode);
                                },
                                start(startTime, { audioBufferSourceNode }) {
                                    audioBufferSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal(values);
                            });
                        });
                    });
                });

                describe('with a destination and an output', () => {
                    let delayNode;

                    beforeEach(() => {
                        delayNode = createDelayNode(context);
                    });

                    it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                        try {
                            delayNode.disconnect(new GainNode(context), -1);
                        } catch (err) {
                            expect(err.code).to.equal(1);
                            expect(err.name).to.equal('IndexSizeError');

                            done();
                        }
                    });

                    it('should throw an InvalidAccessError if there is no similar connection', (done) => {
                        try {
                            delayNode.disconnect(new GainNode(context), 0);
                        } catch (err) {
                            expect(err.code).to.equal(15);
                            expect(err.name).to.equal('InvalidAccessError');

                            done();
                        }
                    });
                });

                describe('with a destination, an output and an input', () => {
                    let delayNode;

                    beforeEach(() => {
                        delayNode = createDelayNode(context);
                    });

                    it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                        try {
                            delayNode.disconnect(new GainNode(context), -1, 0);
                        } catch (err) {
                            expect(err.code).to.equal(1);
                            expect(err.name).to.equal('IndexSizeError');

                            done();
                        }
                    });

                    it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                        try {
                            delayNode.disconnect(new GainNode(context), 0, -1);
                        } catch (err) {
                            expect(err.code).to.equal(1);
                            expect(err.name).to.equal('IndexSizeError');

                            done();
                        }
                    });

                    it('should throw an InvalidAccessError if there is no similar connection', (done) => {
                        try {
                            delayNode.disconnect(new GainNode(context), 0, 0);
                        } catch (err) {
                            expect(err.code).to.equal(15);
                            expect(err.name).to.equal('InvalidAccessError');

                            done();
                        }
                    });
                });
            });
        });
    }
});
