import {
    AudioBuffer,
    AudioBufferSourceNode,
    AudioWorkletNode,
    ConstantSourceNode,
    GainNode,
    StereoPannerNode,
    addAudioWorkletModule
} from '../../../src/module';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
import { createNativeAudioContext } from '../../helper/create-native-audio-context';
import { createNativeOfflineAudioContext } from '../../helper/create-native-offline-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';
import { roundToSamples } from '../../helper/round-to-samples';

const createStereoPannerNodeWithConstructor = (context, options = null) => {
    if (options === null) {
        return new StereoPannerNode(context);
    }

    return new StereoPannerNode(context, options);
};
const createStereoPannerNodeWithFactoryFunction = (context, options = null) => {
    const stereoPannerNode = context.createStereoPanner();

    if (options !== null && options.channelCount !== undefined) {
        stereoPannerNode.channelCount = options.channelCount;
    }

    if (options !== null && options.channelCountMode !== undefined) {
        stereoPannerNode.channelCountMode = options.channelCountMode;
    }

    if (options !== null && options.channelInterpretation !== undefined) {
        stereoPannerNode.channelInterpretation = options.channelInterpretation;
    }

    if (options !== null && options.pan !== undefined) {
        stereoPannerNode.pan.value = options.pan;
    }

    return stereoPannerNode;
};
const testCases = {
    'constructor of a MinimalAudioContext': {
        createContext: createMinimalAudioContext,
        createStereoPannerNode: createStereoPannerNodeWithConstructor
    },
    'constructor of a MinimalOfflineAudioContext': {
        createContext: createMinimalOfflineAudioContext,
        createStereoPannerNode: createStereoPannerNodeWithConstructor
    },
    'constructor of an AudioContext': {
        createContext: createAudioContext,
        createStereoPannerNode: createStereoPannerNodeWithConstructor
    },
    'constructor of an OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createStereoPannerNode: createStereoPannerNodeWithConstructor
    },
    'factory function of an AudioContext': {
        createContext: createAudioContext,
        createStereoPannerNode: createStereoPannerNodeWithFactoryFunction
    },
    'factory function of an OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createStereoPannerNode: createStereoPannerNodeWithFactoryFunction
    }
};

describe('StereoPannerNode', { skip: typeof window === 'undefined' }, () => {
    describe.for(Object.entries(testCases))('with the %s', ([description, { createContext, createStereoPannerNode }]) => {
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
                    let stereoPannerNode;

                    beforeEach(() => {
                        stereoPannerNode = createStereoPannerNode(context);
                    });

                    it('should return an instance of the StereoPannerNode constructor', () => {
                        expect(stereoPannerNode).to.be.an.instanceOf(StereoPannerNode);
                    });

                    it('should return an implementation of the EventTarget interface', () => {
                        expect(stereoPannerNode.addEventListener).to.be.a('function');
                        expect(stereoPannerNode.dispatchEvent).to.be.a('function');
                        expect(stereoPannerNode.removeEventListener).to.be.a('function');
                    });

                    it('should return an implementation of the AudioNode interface', () => {
                        expect(stereoPannerNode.channelCount).to.equal(2);
                        expect(stereoPannerNode.channelCountMode).to.equal('clamped-max');
                        expect(stereoPannerNode.channelInterpretation).to.equal('speakers');
                        expect(stereoPannerNode.connect).to.be.a('function');
                        expect(stereoPannerNode.context).to.be.an.instanceOf(context.constructor);
                        expect(stereoPannerNode.disconnect).to.be.a('function');
                        expect(stereoPannerNode.numberOfInputs).to.equal(1);
                        expect(stereoPannerNode.numberOfOutputs).to.equal(1);
                    });

                    it('should return an implementation of the StereoPannerNode interface', () => {
                        expect(stereoPannerNode.pan).not.to.be.undefined;
                    });
                });

                describe('with valid options', () => {
                    it('should return an instance with the given channelCount', () => {
                        const channelCount = 1;
                        const stereoPannerNode = createStereoPannerNode(context, { channelCount });

                        expect(stereoPannerNode.channelCount).to.equal(channelCount);
                    });

                    it('should return an instance with the given channelCountMode', () => {
                        const channelCountMode = 'explicit';
                        const stereoPannerNode = createStereoPannerNode(context, { channelCountMode });

                        expect(stereoPannerNode.channelCountMode).to.equal(channelCountMode);
                    });

                    it('should return an instance with the given channelInterpretation', () => {
                        const channelInterpretation = 'discrete';
                        const stereoPannerNode = createStereoPannerNode(context, { channelInterpretation });

                        expect(stereoPannerNode.channelInterpretation).to.equal(channelInterpretation);
                    });

                    it('should return an instance with the given initial value for pan', () => {
                        const pan = 0.5;
                        const stereoPannerNode = createStereoPannerNode(context, { pan });

                        if (description.startsWith('constructor')) {
                            expect(stereoPannerNode.pan.defaultValue).to.equal(pan);
                        } else {
                            expect(stereoPannerNode.pan.defaultValue).to.equal(0);
                        }

                        expect(stereoPannerNode.pan.value).to.equal(pan);
                    });
                });

                describe('with invalid options', () => {
                    describe('with a channelCount greater than 2', () => {
                        it('should throw a NotSupportedError', () => {
                            expect(() => createStereoPannerNode(context, { channelCount: 4 }))
                                .to.throw(DOMException)
                                .to.include({ code: 9, name: 'NotSupportedError' });
                        });
                    });

                    describe("with a channelCountMode of 'max'", () => {
                        it('should throw a NotSupportedError', () => {
                            expect(() => createStereoPannerNode(context, { channelCountMode: 'max' }))
                                .to.throw(DOMException)
                                .to.include({ code: 9, name: 'NotSupportedError' });
                        });
                    });
                });
            });
        });

        describe('channelCount', () => {
            let stereoPannerNode;

            beforeEach(() => {
                stereoPannerNode = createStereoPannerNode(context);
            });

            it('should be assignable to a value smaller than 3', () => {
                const channelCount = 1;

                stereoPannerNode.channelCount = channelCount;

                expect(stereoPannerNode.channelCount).to.equal(channelCount);
            });

            it('should not be assignable to a value larger than 2', () => {
                const channelCount = 4;

                expect(() => {
                    stereoPannerNode.channelCount = channelCount;
                })
                    .to.throw(DOMException)
                    .to.include({ code: 9, name: 'NotSupportedError' });
            });
        });

        describe('channelCountMode', () => {
            let stereoPannerNode;

            beforeEach(() => {
                stereoPannerNode = createStereoPannerNode(context);
            });

            it("should be assignable to 'explicit'", () => {
                const channelCountMode = 'explicit';

                stereoPannerNode.channelCountMode = channelCountMode;

                expect(stereoPannerNode.channelCountMode).to.equal(channelCountMode);
            });

            it("should not be assignable to 'max'", () => {
                expect(() => {
                    stereoPannerNode.channelCountMode = 'max';
                })
                    .to.throw(DOMException)
                    .to.include({ code: 9, name: 'NotSupportedError' });
            });
        });

        describe('channelInterpretation', () => {
            let stereoPannerNode;

            beforeEach(() => {
                stereoPannerNode = createStereoPannerNode(context);
            });

            it('should be assignable to another value', () => {
                const channelInterpretation = 'discrete';

                stereoPannerNode.channelInterpretation = channelInterpretation;

                expect(stereoPannerNode.channelInterpretation).to.equal(channelInterpretation);
            });
        });

        describe('numberOfInputs', () => {
            let stereoPannerNode;

            beforeEach(() => {
                stereoPannerNode = createStereoPannerNode(context);
            });

            it('should be readonly', () => {
                expect(() => {
                    stereoPannerNode.numberOfInputs = 2;
                }).to.throw(TypeError);
            });
        });

        describe('numberOfOutputs', () => {
            let stereoPannerNode;

            beforeEach(() => {
                stereoPannerNode = createStereoPannerNode(context);
            });

            it('should be readonly', () => {
                expect(() => {
                    stereoPannerNode.numberOfOutputs = 2;
                }).to.throw(TypeError);
            });
        });

        describe('pan', () => {
            it('should return an implementation of the AudioParam interface', () => {
                const stereoPannerNode = createStereoPannerNode(context);

                expect(stereoPannerNode.pan.cancelAndHoldAtTime).to.be.a('function');
                expect(stereoPannerNode.pan.cancelScheduledValues).to.be.a('function');
                expect(stereoPannerNode.pan.defaultValue).to.equal(0);
                expect(stereoPannerNode.pan.exponentialRampToValueAtTime).to.be.a('function');
                expect(stereoPannerNode.pan.linearRampToValueAtTime).to.be.a('function');
                expect(stereoPannerNode.pan.maxValue).to.equal(1);
                expect(stereoPannerNode.pan.minValue).to.equal(-1);
                expect(stereoPannerNode.pan.setTargetAtTime).to.be.a('function');
                expect(stereoPannerNode.pan.setValueAtTime).to.be.a('function');
                expect(stereoPannerNode.pan.setValueCurveAtTime).to.be.a('function');
                expect(stereoPannerNode.pan.value).to.equal(0);
            });

            it('should be readonly', () => {
                const stereoPannerNode = createStereoPannerNode(context);

                expect(() => {
                    stereoPannerNode.pan = 'anything';
                }).to.throw(TypeError);
            });

            describe('cancelAndHoldAtTime()', () => {
                let stereoPannerNode;

                beforeEach(() => {
                    stereoPannerNode = createStereoPannerNode(context);
                });

                it('should be chainable', () => {
                    expect(stereoPannerNode.pan.cancelAndHoldAtTime(0)).to.equal(stereoPannerNode.pan);
                });
            });

            describe('cancelScheduledValues()', () => {
                let stereoPannerNode;

                beforeEach(() => {
                    stereoPannerNode = createStereoPannerNode(context);
                });

                it('should be chainable', () => {
                    expect(stereoPannerNode.pan.cancelScheduledValues(0)).to.equal(stereoPannerNode.pan);
                });
            });

            describe('exponentialRampToValueAtTime()', () => {
                let stereoPannerNode;

                beforeEach(() => {
                    stereoPannerNode = createStereoPannerNode(context);
                });

                it('should be chainable', () => {
                    // @todo Firefox can't schedule an exponential ramp when the value is 0.
                    stereoPannerNode.pan.value = 1;

                    expect(stereoPannerNode.pan.exponentialRampToValueAtTime(1, 0)).to.equal(stereoPannerNode.pan);
                });

                it('should throw a RangeError', () => {
                    expect(() => {
                        stereoPannerNode.pan.exponentialRampToValueAtTime(0, 1);
                    }).to.throw(RangeError);
                });

                it('should throw a RangeError', () => {
                    expect(() => {
                        stereoPannerNode.pan.exponentialRampToValueAtTime(1, -1);
                    }).to.throw(RangeError);
                });
            });

            describe('linearRampToValueAtTime()', () => {
                let stereoPannerNode;

                beforeEach(() => {
                    stereoPannerNode = createStereoPannerNode(context);
                });

                it('should be chainable', () => {
                    expect(stereoPannerNode.pan.linearRampToValueAtTime(1, 0)).to.equal(stereoPannerNode.pan);
                });
            });

            describe('setTargetAtTime()', () => {
                let stereoPannerNode;

                beforeEach(() => {
                    stereoPannerNode = createStereoPannerNode(context);
                });

                it('should be chainable', () => {
                    expect(stereoPannerNode.pan.setTargetAtTime(1, 0, 0.1)).to.equal(stereoPannerNode.pan);
                });
            });

            describe('setValueAtTime()', () => {
                let stereoPannerNode;

                beforeEach(() => {
                    stereoPannerNode = createStereoPannerNode(context);
                });

                it('should be chainable', () => {
                    expect(stereoPannerNode.pan.setValueAtTime(1, 0)).to.equal(stereoPannerNode.pan);
                });
            });

            describe('setValueCurveAtTime()', () => {
                let stereoPannerNode;

                beforeEach(() => {
                    stereoPannerNode = createStereoPannerNode(context);
                });

                describe.for([
                    ['regular Array', [1, 0]],
                    ['Float32Array', new Float32Array([1, 0])]
                ])('with a %s', ([, values]) => {
                    it('should be chainable', () => {
                        expect(stereoPannerNode.pan.setValueCurveAtTime(values, 0, 1)).to.equal(stereoPannerNode.pan);
                    });
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
                        describe.for(['mono', 'stereo'])('with a channel layout of "%s"', (channelLayout) => {
                            let renderer;
                            let values;

                            beforeEach(async () => {
                                values = [1, 0.5, 0, -0.5, -1];

                                if (withAnAppendedAudioWorklet) {
                                    await addAudioWorkletModule(context, 'test/fixtures/gain-processor.js');
                                }

                                renderer = createRenderer({
                                    context,
                                    length: context.length === undefined ? 5 : undefined,
                                    setup(destination) {
                                        const audioBuffer = new AudioBuffer({
                                            length: 5,
                                            numberOfChannels: channelLayout === 'mono' ? 1 : 2,
                                            sampleRate: context.sampleRate
                                        });
                                        const audioBufferSourceNode = new AudioBufferSourceNode(context);
                                        const audioWorkletNode = withAnAppendedAudioWorklet
                                            ? new AudioWorkletNode(context, 'gain-processor', { channelCount: 2 })
                                            : null;
                                        const masterGainNode = new GainNode(context, {
                                            gain: withADirectConnection && withAnAppendedAudioWorklet ? 0.5 : 1
                                        });
                                        const stereoPannerNode = createStereoPannerNode(context, {
                                            channelCount: channelLayout === 'mono' ? 1 : 2
                                        });

                                        audioBuffer.copyToChannel(new Float32Array(values), 0);

                                        if (channelLayout === 'stereo') {
                                            audioBuffer.copyToChannel(new Float32Array(values.map((value) => value / 2).reverse()), 1);
                                        }

                                        audioBufferSourceNode.buffer = audioBuffer;

                                        audioBufferSourceNode.connect(stereoPannerNode);

                                        if (withADirectConnection) {
                                            stereoPannerNode.connect(masterGainNode);
                                        }

                                        if (withAnAppendedAudioWorklet) {
                                            stereoPannerNode.connect(audioWorkletNode).connect(masterGainNode);
                                        }

                                        masterGainNode.connect(destination);

                                        return { audioBufferSourceNode, stereoPannerNode };
                                    }
                                });
                            });

                            describe('without any automation', () => {
                                it(`should ${channelLayout === 'mono' ? 'modify' : 'not modify'} the signal`, () => {
                                    return renderer({
                                        start(startTime, { audioBufferSourceNode }) {
                                            audioBufferSourceNode.start(startTime);
                                        }
                                    }).then((channelData) => {
                                        if (channelLayout === 'mono') {
                                            expect(channelData[0]).to.equal(0.7071067690849304);
                                            expect(channelData[1]).to.equal(0.3535533845424652);
                                            expect(channelData[2]).to.be.closeTo(0, 0.00000000001);
                                            expect(channelData[3]).to.equal(-0.3535533845424652);
                                            expect(channelData[4]).to.equal(-0.7071067690849304);
                                        } else {
                                            expect(channelData[0]).to.equal(0.25);
                                            expect(channelData[1]).to.equal(0.125);
                                            expect(channelData[2]).to.be.closeTo(0, 0.000000000001);
                                            expect(channelData[3]).to.equal(-0.125);
                                            expect(channelData[4]).to.equal(-0.25);
                                        }
                                    });
                                });
                            });

                            describe('with a modified value', () => {
                                it('should modify the signal', () => {
                                    return renderer({
                                        prepare({ stereoPannerNode }) {
                                            stereoPannerNode.pan.value = 0.5;
                                        },
                                        start(startTime, { audioBufferSourceNode }) {
                                            audioBufferSourceNode.start(startTime);
                                        }
                                    }).then((channelData) => {
                                        if (channelLayout === 'mono') {
                                            expect(channelData[0]).to.equal(0.6532814502716064);
                                            expect(channelData[1]).to.equal(0.3266407251358032);
                                            expect(channelData[2]).to.be.closeTo(0, 0.000000000001);
                                            expect(channelData[3]).to.equal(-0.3266407251358032);
                                            expect(channelData[4]).to.equal(-0.6532814502716064);
                                        } else {
                                            expect(channelData[0]).to.equal(0.4571067690849304);
                                            expect(channelData[1]).to.equal(0.2285533845424652);
                                            expect(channelData[2]).to.be.closeTo(0, 0.000000000001);
                                            expect(channelData[3]).to.equal(-0.2285533845424652);
                                            expect(channelData[4]).to.equal(-0.4571067690849304);
                                        }
                                    });
                                });
                            });

                            describe('with a call to cancelAndHoldAtTime()', ({ skip }) => {
                                // @todo
                                skip();
                            });

                            describe('with a call to cancelScheduledValues()', () => {
                                it('should modify the signal', () => {
                                    return renderer({
                                        start(startTime, { audioBufferSourceNode, stereoPannerNode }) {
                                            stereoPannerNode.pan.setValueAtTime(0.5, startTime);
                                            stereoPannerNode.pan.setValueAtTime(0, roundToSamples(startTime, context.sampleRate, 2));
                                            stereoPannerNode.pan.linearRampToValueAtTime(
                                                1,
                                                roundToSamples(startTime, context.sampleRate, 5)
                                            );
                                            stereoPannerNode.pan.cancelScheduledValues(roundToSamples(startTime, context.sampleRate, 3));

                                            audioBufferSourceNode.start(startTime);
                                        }
                                    }).then((channelData) => {
                                        if (channelLayout === 'mono') {
                                            expect(channelData[0]).to.equal(0.6532814502716064);
                                            expect(channelData[1]).to.equal(0.3266407251358032);
                                            expect(channelData[2]).to.be.closeTo(0, 0.00000000001);
                                            expect(channelData[3]).to.equal(-0.3535533845424652);
                                            expect(channelData[4]).to.equal(-0.7071067690849304);
                                        } else {
                                            expect(channelData[0]).to.equal(0.4571067690849304);
                                            expect(channelData[1]).to.equal(0.2285533845424652);
                                            expect(channelData[2]).to.be.closeTo(0, 0.000000000001);
                                            expect(channelData[3]).to.equal(-0.125);
                                            expect(channelData[4]).to.equal(-0.25);
                                        }
                                    });
                                });
                            });

                            describe('with a call to setValueAtTime()', () => {
                                it('should modify the signal', () => {
                                    return renderer({
                                        start(startTime, { audioBufferSourceNode, stereoPannerNode }) {
                                            stereoPannerNode.pan.setValueAtTime(0.5, roundToSamples(startTime, context.sampleRate, 2));

                                            audioBufferSourceNode.start(startTime);
                                        }
                                    }).then((channelData) => {
                                        if (channelLayout === 'mono') {
                                            expect(channelData[0]).to.equal(0.7071067690849304);
                                            expect(channelData[1]).to.equal(0.3535533845424652);
                                            expect(channelData[2]).to.be.closeTo(0, 0.000000000001);
                                            expect(channelData[3]).to.equal(-0.3266407251358032);
                                            expect(channelData[4]).to.equal(-0.6532814502716064);
                                        } else {
                                            expect(channelData[0]).to.equal(0.25);
                                            expect(channelData[1]).to.equal(0.125);
                                            expect(channelData[2]).to.be.closeTo(0, 0.000000000001);
                                            expect(channelData[3]).to.equal(-0.2285533845424652);
                                            expect(channelData[4]).to.equal(-0.4571067690849304);
                                        }
                                    });
                                });
                            });

                            describe('with a call to setValueCurveAtTime()', () => {
                                it('should modify the signal', () => {
                                    return renderer({
                                        start(startTime, { audioBufferSourceNode, stereoPannerNode }) {
                                            stereoPannerNode.pan.setValueCurveAtTime(
                                                new Float32Array([0, 0.25, 0.5, 0.75, 1]),
                                                roundToSamples(startTime, context.sampleRate),
                                                6 / context.sampleRate
                                            );

                                            audioBufferSourceNode.start(startTime);
                                        }
                                    }).then((channelData) => {
                                        if (channelLayout === 'mono') {
                                            expect(channelData[0]).to.equal(0.7071067690849304);
                                            expect(channelData[1]).to.equal(0.35052868723869324);
                                            expect(channelData[2]).to.be.closeTo(0, 0.000000000001);
                                            expect(channelData[3]).to.equal(-0.3266407251358032);
                                            expect(channelData[4]).to.equal(-0.6123723983764648);
                                        } else {
                                            expect(channelData[0]).to.equal(0.25);
                                            expect(channelData[1]).to.equal(0.18118621408939362);
                                            expect(channelData[2]).to.be.closeTo(0, 0.000000000001);
                                            expect(channelData[3]).to.equal(-0.2285533845424652);
                                            expect(channelData[4]).to.be.closeTo(-0.4330127, 0.0000001);
                                        }
                                    });
                                });
                            });

                            describe('with another AudioNode connected to the AudioParam', () => {
                                it('should modify the signal', () => {
                                    return renderer({
                                        prepare({ stereoPannerNode }) {
                                            const audioBuffer = new AudioBuffer({
                                                length: 5,
                                                sampleRate: context.sampleRate
                                            });
                                            const audioBufferSourceNodeForAudioParam = new AudioBufferSourceNode(context);

                                            audioBuffer.copyToChannel(new Float32Array([0.5, 0.5, 0.5, 0.5, 0.5]), 0);

                                            audioBufferSourceNodeForAudioParam.buffer = audioBuffer;

                                            stereoPannerNode.pan.value = 0;

                                            audioBufferSourceNodeForAudioParam.connect(stereoPannerNode.pan);

                                            return { audioBufferSourceNodeForAudioParam };
                                        },
                                        start(startTime, { audioBufferSourceNode, audioBufferSourceNodeForAudioParam }) {
                                            audioBufferSourceNode.start(startTime);
                                            audioBufferSourceNodeForAudioParam.start(startTime);
                                        }
                                    }).then((channelData) => {
                                        if (channelLayout === 'mono') {
                                            expect(channelData[0]).to.equal(0.6532814502716064);
                                            expect(channelData[1]).to.equal(0.3266407251358032);
                                            expect(channelData[2]).to.be.closeTo(0, 0.000000000001);
                                            expect(channelData[3]).to.equal(-0.3266407251358032);
                                            expect(channelData[4]).to.equal(-0.6532814502716064);
                                        } else {
                                            expect(channelData[0]).to.equal(0.4571067690849304);
                                            expect(channelData[1]).to.equal(0.2285533845424652);
                                            expect(channelData[2]).to.be.closeTo(0, 0.000000000001);
                                            expect(channelData[3]).to.equal(-0.2285533845424652);
                                            expect(channelData[4]).to.equal(-0.4571067690849304);
                                        }
                                    });
                                });
                            });

                            // @todo Test other automations as well.
                        });
                    });
                }
            });
        });

        describe('connect()', () => {
            describe.for(['AudioNode', 'AudioParam'])('with an %s', (type) => {
                let audioNodeOrAudioParam;
                let stereoPannerNode;

                beforeEach(() => {
                    const gainNode = new GainNode(context);

                    audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                    stereoPannerNode = createStereoPannerNode(context);
                });

                if (type === 'AudioNode') {
                    it('should be chainable', () => {
                        expect(stereoPannerNode.connect(audioNodeOrAudioParam)).to.equal(audioNodeOrAudioParam);
                    });
                } else {
                    it('should not be chainable', () => {
                        expect(stereoPannerNode.connect(audioNodeOrAudioParam)).to.be.undefined;
                    });
                }

                it('should accept duplicate connections', () => {
                    stereoPannerNode.connect(audioNodeOrAudioParam);
                    stereoPannerNode.connect(audioNodeOrAudioParam);
                });

                it('should throw an IndexSizeError if the output is out-of-bound', () => {
                    expect(() => stereoPannerNode.connect(audioNodeOrAudioParam, -1))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                if (type === 'AudioNode') {
                    it('should throw an IndexSizeError if the input is out-of-bound', () => {
                        expect(() => stereoPannerNode.connect(audioNodeOrAudioParam, 0, -1))
                            .to.throw(DOMException)
                            .to.include({ code: 1, name: 'IndexSizeError' });
                    });

                    it('should not throw an error if the connection creates a cycle by connecting to the source', () => {
                        audioNodeOrAudioParam.connect(stereoPannerNode).connect(audioNodeOrAudioParam);
                    });

                    it('should not throw an error if the connection creates a cycle by connecting to an AudioParam of the source', () => {
                        audioNodeOrAudioParam.connect(stereoPannerNode).connect(audioNodeOrAudioParam.gain);
                    });
                }
            });

            describe.for(['AudioNode', 'AudioParam'])('with an %s of another context', (type) => {
                let anotherContext;
                let audioNodeOrAudioParam;
                let stereoPannerNode;

                afterEach(() => anotherContext.close?.());

                beforeEach(() => {
                    anotherContext = createContext();

                    const gainNode = new GainNode(anotherContext);

                    audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                    stereoPannerNode = createStereoPannerNode(context);
                });

                it('should throw an InvalidAccessError', () => {
                    expect(() => stereoPannerNode.connect(audioNodeOrAudioParam))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });

            describe.for(['AudioNode', 'AudioParam'])('with an %s of a native context', (type) => {
                let nativeAudioNodeOrAudioParam;
                let nativeContext;
                let stereoPannerNode;

                afterEach(() => nativeContext.close?.());

                beforeEach(() => {
                    nativeContext = description.includes('Offline') ? createNativeOfflineAudioContext() : createNativeAudioContext();

                    const nativeGainNode = nativeContext.createGain();

                    nativeAudioNodeOrAudioParam = type === 'AudioNode' ? nativeGainNode : nativeGainNode.gain;
                    stereoPannerNode = createStereoPannerNode(context);
                });

                it('should throw an InvalidAccessError', () => {
                    expect(() => stereoPannerNode.connect(nativeAudioNodeOrAudioParam))
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
                            const constantSourceNode = new ConstantSourceNode(context);
                            const gainNode = new GainNode(context);
                            const stereoPannerNode = createStereoPannerNode(context);

                            constantSourceNode.connect(stereoPannerNode).connect(destination);

                            stereoPannerNode.connect(gainNode).connect(stereoPannerNode);

                            return { constantSourceNode, gainNode, stereoPannerNode };
                        }
                    });
                });

                it('should render silence', () => {
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
                        setup(destination) {
                            const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                            const audioBufferSourceNode = new AudioBufferSourceNode(context);
                            const firstDummyGainNode = new GainNode(context);
                            const secondDummyGainNode = new GainNode(context);
                            const stereoPannerNode = createStereoPannerNode(context);

                            audioBuffer.copyToChannel(new Float32Array(values), 0);

                            audioBufferSourceNode.buffer = audioBuffer;

                            audioBufferSourceNode.connect(stereoPannerNode).connect(firstDummyGainNode).connect(destination);

                            stereoPannerNode.connect(secondDummyGainNode);

                            return { audioBufferSourceNode, firstDummyGainNode, secondDummyGainNode, stereoPannerNode };
                        }
                    });
            });

            describe('without any parameters', () => {
                let renderer;
                let values;

                beforeEach(() => {
                    values = [1, 1, 1, 1, 1];

                    renderer = createPredefinedRenderer(values);
                });

                it('should disconnect all destinations', () => {
                    return renderer({
                        prepare({ stereoPannerNode }) {
                            stereoPannerNode.disconnect();
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
                    let stereoPannerNode;

                    beforeEach(() => {
                        stereoPannerNode = createStereoPannerNode(context);
                    });

                    it('should throw an IndexSizeError', () => {
                        expect(() => stereoPannerNode.disconnect(-1))
                            .to.throw(DOMException)
                            .to.include({ code: 1, name: 'IndexSizeError' });
                    });
                });

                describe('with a connection from the given output', () => {
                    let renderer;
                    let values;

                    beforeEach(() => {
                        values = [1, 1, 1, 1, 1];

                        renderer = createPredefinedRenderer(values);
                    });

                    it('should disconnect all destinations from the given output', () => {
                        return renderer({
                            prepare({ stereoPannerNode }) {
                                stereoPannerNode.disconnect(0);
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
                    let stereoPannerNode;

                    beforeEach(() => {
                        stereoPannerNode = createStereoPannerNode(context);
                    });

                    it('should throw an InvalidAccessError', () => {
                        expect(() => stereoPannerNode.disconnect(new GainNode(context)))
                            .to.throw(DOMException)
                            .to.include({ code: 15, name: 'InvalidAccessError' });
                    });
                });

                describe('with a connection to the given destination', () => {
                    let renderer;
                    let values;

                    beforeEach(() => {
                        values = [1, 1, 1, 1, 1];

                        renderer = createPredefinedRenderer(values);
                    });

                    it('should disconnect the destination', () => {
                        return renderer({
                            prepare({ firstDummyGainNode, stereoPannerNode }) {
                                stereoPannerNode.disconnect(firstDummyGainNode);
                            },
                            start(startTime, { audioBufferSourceNode }) {
                                audioBufferSourceNode.start(startTime);
                            }
                        }).then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                        });
                    });

                    it('should disconnect another destination in isolation', () => {
                        return renderer({
                            prepare({ secondDummyGainNode, stereoPannerNode }) {
                                stereoPannerNode.disconnect(secondDummyGainNode);
                            },
                            start(startTime, { audioBufferSourceNode }) {
                                audioBufferSourceNode.start(startTime);
                            }
                        }).then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([
                                0.7071067690849304, 0.7071067690849304, 0.7071067690849304, 0.7071067690849304, 0.7071067690849304
                            ]);
                        });
                    });
                });
            });

            describe('with a destination and an output', () => {
                let stereoPannerNode;

                beforeEach(() => {
                    stereoPannerNode = createStereoPannerNode(context);
                });

                it('should throw an IndexSizeError if the output is out-of-bound', () => {
                    expect(() => stereoPannerNode.disconnect(new GainNode(context), -1))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                it('should throw an InvalidAccessError if there is no similar connection', () => {
                    expect(() => stereoPannerNode.disconnect(new GainNode(context), 0))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });

            describe('with a destination, an output and an input', () => {
                let stereoPannerNode;

                beforeEach(() => {
                    stereoPannerNode = createStereoPannerNode(context);
                });

                it('should throw an IndexSizeError if the output is out-of-bound', () => {
                    expect(() => stereoPannerNode.disconnect(new GainNode(context), -1, 0))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                it('should throw an IndexSizeError if the input is out-of-bound', () => {
                    expect(() => stereoPannerNode.disconnect(new GainNode(context), 0, -1))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                it('should throw an InvalidAccessError if there is no similar connection', () => {
                    expect(() => stereoPannerNode.disconnect(new GainNode(context), 0, 0))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });
        });
    });
});
