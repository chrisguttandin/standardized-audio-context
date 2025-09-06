import { AudioBuffer, AudioBufferSourceNode, ConstantSourceNode, DynamicsCompressorNode, GainNode } from '../../../src/module';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
import { createNativeAudioContext } from '../../helper/create-native-audio-context';
import { createNativeOfflineAudioContext } from '../../helper/create-native-offline-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';

const createDynamicsCompressorNodeWithConstructor = (context, options = null) => {
    if (options === null) {
        return new DynamicsCompressorNode(context);
    }

    return new DynamicsCompressorNode(context, options);
};
const createDynamicsCompressorNodeWithFactoryFunction = (context, options = null) => {
    const dynamicsCompressorNode = context.createDynamicsCompressor();

    if (options !== null && options.attack !== undefined) {
        dynamicsCompressorNode.attack.value = options.attack;
    }

    if (options !== null && options.channelCount !== undefined) {
        dynamicsCompressorNode.channelCount = options.channelCount;
    }

    if (options !== null && options.channelCountMode !== undefined) {
        dynamicsCompressorNode.channelCountMode = options.channelCountMode;
    }

    if (options !== null && options.channelInterpretation !== undefined) {
        dynamicsCompressorNode.channelInterpretation = options.channelInterpretation;
    }

    if (options !== null && options.knee !== undefined) {
        dynamicsCompressorNode.knee.value = options.knee;
    }

    if (options !== null && options.ratio !== undefined) {
        dynamicsCompressorNode.ratio.value = options.ratio;
    }

    if (options !== null && options.release !== undefined) {
        dynamicsCompressorNode.release.value = options.release;
    }

    if (options !== null && options.threshold !== undefined) {
        dynamicsCompressorNode.threshold.value = options.threshold;
    }

    return dynamicsCompressorNode;
};
const testCases = {
    'constructor of a MinimalAudioContext': {
        createContext: createMinimalAudioContext,
        createDynamicsCompressorNode: createDynamicsCompressorNodeWithConstructor
    },
    'constructor of a MinimalOfflineAudioContext': {
        createContext: createMinimalOfflineAudioContext,
        createDynamicsCompressorNode: createDynamicsCompressorNodeWithConstructor
    },
    'constructor of an AudioContext': {
        createContext: createAudioContext,
        createDynamicsCompressorNode: createDynamicsCompressorNodeWithConstructor
    },
    'constructor of an OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createDynamicsCompressorNode: createDynamicsCompressorNodeWithConstructor
    },
    'factory function of an AudioContext': {
        createContext: createAudioContext,
        createDynamicsCompressorNode: createDynamicsCompressorNodeWithFactoryFunction
    },
    'factory function of an OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createDynamicsCompressorNode: createDynamicsCompressorNodeWithFactoryFunction
    }
};

if (typeof window !== 'undefined') {
    describe('DynamicsCompressorNode', () => {
        for (const [description, { createDynamicsCompressorNode, createContext }] of Object.entries(testCases)) {
            describe(`with the ${description}`, () => {
                let context;
                let lookAhead;

                afterEach(() => context.close?.());

                beforeEach(() => {
                    context = createContext();
                    lookAhead = Math.floor(0.006 * context.sampleRate);

                    if (description.includes('Offline')) {
                        context = createContext({ length: lookAhead + 5 });
                    }
                });

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
                                let dynamicsCompressorNode;

                                beforeEach(() => {
                                    dynamicsCompressorNode = createDynamicsCompressorNode(context);
                                });

                                it('should return an instance of the DynamicsCompressorNode constructor', () => {
                                    expect(dynamicsCompressorNode).to.be.an.instanceOf(DynamicsCompressorNode);
                                });

                                it('should return an implementation of the EventTarget interface', () => {
                                    expect(dynamicsCompressorNode.addEventListener).to.be.a('function');
                                    expect(dynamicsCompressorNode.dispatchEvent).to.be.a('function');
                                    expect(dynamicsCompressorNode.removeEventListener).to.be.a('function');
                                });

                                it('should return an implementation of the AudioNode interface', () => {
                                    expect(dynamicsCompressorNode.channelCount).to.equal(2);
                                    expect(dynamicsCompressorNode.channelCountMode).to.equal('clamped-max');
                                    expect(dynamicsCompressorNode.channelInterpretation).to.equal('speakers');
                                    expect(dynamicsCompressorNode.connect).to.be.a('function');
                                    expect(dynamicsCompressorNode.context).to.be.an.instanceOf(context.constructor);
                                    expect(dynamicsCompressorNode.disconnect).to.be.a('function');
                                    expect(dynamicsCompressorNode.numberOfInputs).to.equal(1);
                                    expect(dynamicsCompressorNode.numberOfOutputs).to.equal(1);
                                });

                                it('should return an implementation of the DynamicsCompressorNode interface', () => {
                                    expect(dynamicsCompressorNode.attack).not.to.be.undefined;
                                    expect(dynamicsCompressorNode.knee).not.to.be.undefined;
                                    expect(dynamicsCompressorNode.ratio).not.to.be.undefined;
                                    expect(dynamicsCompressorNode.reduction).to.equal(0);
                                    expect(dynamicsCompressorNode.release).not.to.be.undefined;
                                    expect(dynamicsCompressorNode.threshold).not.to.be.undefined;
                                });
                            });

                            describe('with valid options', () => {
                                it('should return an instance with the given initial value for attack', () => {
                                    const attack = 0.5;
                                    const dynamicsCompressorNode = createDynamicsCompressorNode(context, { attack });

                                    if (description.startsWith('constructor')) {
                                        expect(dynamicsCompressorNode.attack.defaultValue).to.equal(attack);
                                    } else {
                                        expect(dynamicsCompressorNode.attack.defaultValue).to.equal(Math.fround(0.003));
                                    }

                                    expect(dynamicsCompressorNode.attack.value).to.equal(attack);
                                });

                                it('should return an instance with the given channelCount', () => {
                                    const channelCount = 1;
                                    const dynamicsCompressorNode = createDynamicsCompressorNode(context, { channelCount });

                                    expect(dynamicsCompressorNode.channelCount).to.equal(channelCount);
                                });

                                it('should return an instance with the given channelCountMode', () => {
                                    const channelCountMode = 'explicit';
                                    const dynamicsCompressorNode = createDynamicsCompressorNode(context, { channelCountMode });

                                    expect(dynamicsCompressorNode.channelCountMode).to.equal(channelCountMode);
                                });

                                it('should return an instance with the given channelInterpretation', () => {
                                    const channelInterpretation = 'discrete';
                                    const dynamicsCompressorNode = createDynamicsCompressorNode(context, { channelInterpretation });

                                    expect(dynamicsCompressorNode.channelInterpretation).to.equal(channelInterpretation);
                                });

                                it('should return an instance with the given initial value for knee', () => {
                                    const knee = 20;
                                    const dynamicsCompressorNode = createDynamicsCompressorNode(context, { knee });

                                    if (description.startsWith('constructor')) {
                                        expect(dynamicsCompressorNode.knee.defaultValue).to.equal(knee);
                                    } else {
                                        expect(dynamicsCompressorNode.knee.defaultValue).to.equal(30);
                                    }

                                    expect(dynamicsCompressorNode.knee.value).to.equal(knee);
                                });

                                it('should return an instance with the given initial value for ratio', () => {
                                    const ratio = 10;
                                    const dynamicsCompressorNode = createDynamicsCompressorNode(context, { ratio });

                                    if (description.startsWith('constructor')) {
                                        expect(dynamicsCompressorNode.ratio.defaultValue).to.equal(ratio);
                                    } else {
                                        expect(dynamicsCompressorNode.ratio.defaultValue).to.equal(12);
                                    }

                                    expect(dynamicsCompressorNode.ratio.value).to.equal(ratio);
                                });

                                it('should return an instance with the given initial value for release', () => {
                                    const release = 0.5;
                                    const dynamicsCompressorNode = createDynamicsCompressorNode(context, { release });

                                    if (description.startsWith('constructor')) {
                                        expect(dynamicsCompressorNode.release.defaultValue).to.equal(release);
                                    } else {
                                        expect(dynamicsCompressorNode.release.defaultValue).to.equal(0.25);
                                    }

                                    expect(dynamicsCompressorNode.release.value).to.equal(release);
                                });

                                it('should return an instance with the given initial value for threshold', () => {
                                    const threshold = -50;
                                    const dynamicsCompressorNode = createDynamicsCompressorNode(context, { threshold });

                                    if (description.startsWith('constructor')) {
                                        expect(dynamicsCompressorNode.threshold.defaultValue).to.equal(threshold);
                                    } else {
                                        expect(dynamicsCompressorNode.threshold.defaultValue).to.equal(-24);
                                    }

                                    expect(dynamicsCompressorNode.threshold.value).to.equal(threshold);
                                });
                            });

                            describe('with invalid options', () => {
                                describe('with a channelCount greater than 2', () => {
                                    it('should throw a NotSupportedError', (done) => {
                                        try {
                                            createDynamicsCompressorNode(context, { channelCount: 4 });
                                        } catch (err) {
                                            expect(err.code).to.equal(9);
                                            expect(err.name).to.equal('NotSupportedError');

                                            done();
                                        }
                                    });
                                });

                                describe("with a channelCountMode of 'max'", () => {
                                    it('should throw a NotSupportedError', (done) => {
                                        try {
                                            createDynamicsCompressorNode(context, { channelCountMode: 'max' });
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

                describe('attack', () => {
                    let dynamicsCompressorNode;

                    beforeEach(() => {
                        dynamicsCompressorNode = createDynamicsCompressorNode(context);
                    });

                    it('should return an implementation of the AudioParam interface', () => {
                        expect(dynamicsCompressorNode.attack.cancelAndHoldAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.attack.cancelScheduledValues).to.be.a('function');
                        expect(dynamicsCompressorNode.attack.defaultValue).to.equal(Math.fround(0.003));
                        expect(dynamicsCompressorNode.attack.exponentialRampToValueAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.attack.linearRampToValueAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.attack.maxValue).to.equal(1);
                        expect(dynamicsCompressorNode.attack.minValue).to.equal(0);
                        expect(dynamicsCompressorNode.attack.setTargetAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.attack.setValueAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.attack.setValueCurveAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.attack.value).to.equal(Math.fround(0.003));
                    });

                    it('should be readonly', () => {
                        expect(() => {
                            dynamicsCompressorNode.attack = 'anything';
                        }).to.throw(TypeError);
                    });

                    describe('cancelAndHoldAtTime()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.attack.cancelAndHoldAtTime(0)).to.equal(dynamicsCompressorNode.attack);
                        });
                    });

                    describe('cancelScheduledValues()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.attack.cancelScheduledValues(0)).to.equal(dynamicsCompressorNode.attack);
                        });
                    });

                    describe('exponentialRampToValueAtTime()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.attack.exponentialRampToValueAtTime(1, 0)).to.equal(
                                dynamicsCompressorNode.attack
                            );
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                dynamicsCompressorNode.attack.exponentialRampToValueAtTime(0, 1);
                            }).to.throw(RangeError);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                dynamicsCompressorNode.attack.exponentialRampToValueAtTime(1, -1);
                            }).to.throw(RangeError);
                        });
                    });

                    describe('linearRampToValueAtTime()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.attack.linearRampToValueAtTime(1, 0)).to.equal(dynamicsCompressorNode.attack);
                        });
                    });

                    describe('setTargetAtTime()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.attack.setTargetAtTime(1, 0, 0.1)).to.equal(dynamicsCompressorNode.attack);
                        });
                    });

                    describe('setValueAtTime()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.attack.setValueAtTime(1, 0)).to.equal(dynamicsCompressorNode.attack);
                        });
                    });

                    describe('setValueCurveAtTime()', () => {
                        for (const [arrayType, values] of [
                            ['regular Array', [1, 0]],
                            ['Float32Array', new Float32Array([1, 0])]
                        ]) {
                            describe(`with a ${arrayType}`, () => {
                                it('should be chainable', () => {
                                    expect(dynamicsCompressorNode.attack.setValueCurveAtTime(values, 0, 1)).to.equal(
                                        dynamicsCompressorNode.attack
                                    );
                                });
                            });
                        }
                    });

                    // @todo automation
                });

                describe('channelCount', () => {
                    let dynamicsCompressorNode;

                    beforeEach(() => {
                        dynamicsCompressorNode = createDynamicsCompressorNode(context);
                    });

                    it('should be assignable to a value smaller than 3', () => {
                        const channelCount = 1;

                        dynamicsCompressorNode.channelCount = channelCount;

                        expect(dynamicsCompressorNode.channelCount).to.equal(channelCount);
                    });

                    it('should not be assignable to a value larger than 2', (done) => {
                        const channelCount = 4;

                        try {
                            dynamicsCompressorNode.channelCount = channelCount;
                        } catch (err) {
                            expect(err.code).to.equal(9);
                            expect(err.name).to.equal('NotSupportedError');

                            done();
                        }
                    });
                });

                describe('channelCountMode', () => {
                    let dynamicsCompressorNode;

                    beforeEach(() => {
                        dynamicsCompressorNode = createDynamicsCompressorNode(context);
                    });

                    it("should be assignable to 'explicit'", () => {
                        const channelCountMode = 'explicit';

                        dynamicsCompressorNode.channelCountMode = channelCountMode;

                        expect(dynamicsCompressorNode.channelCountMode).to.equal(channelCountMode);
                    });

                    it("should not be assignable to 'max'", (done) => {
                        try {
                            dynamicsCompressorNode.channelCountMode = 'max';
                        } catch (err) {
                            expect(err.code).to.equal(9);
                            expect(err.name).to.equal('NotSupportedError');

                            done();
                        }
                    });
                });

                describe('channelInterpretation', () => {
                    let dynamicsCompressorNode;

                    beforeEach(() => {
                        dynamicsCompressorNode = createDynamicsCompressorNode(context);
                    });

                    it('should be assignable to another value', () => {
                        const channelInterpretation = 'discrete';

                        dynamicsCompressorNode.channelInterpretation = channelInterpretation;

                        expect(dynamicsCompressorNode.channelInterpretation).to.equal(channelInterpretation);
                    });
                });

                describe('knee', () => {
                    let dynamicsCompressorNode;

                    beforeEach(() => {
                        dynamicsCompressorNode = createDynamicsCompressorNode(context);
                    });

                    it('should return an implementation of the AudioParam interface', () => {
                        expect(dynamicsCompressorNode.knee.cancelAndHoldAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.knee.cancelScheduledValues).to.be.a('function');
                        expect(dynamicsCompressorNode.knee.defaultValue).to.equal(30);
                        expect(dynamicsCompressorNode.knee.exponentialRampToValueAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.knee.linearRampToValueAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.knee.maxValue).to.equal(40);
                        expect(dynamicsCompressorNode.knee.minValue).to.equal(0);
                        expect(dynamicsCompressorNode.knee.setTargetAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.knee.setValueAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.knee.setValueCurveAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.knee.value).to.equal(30);
                    });

                    it('should be readonly', () => {
                        expect(() => {
                            dynamicsCompressorNode.knee = 'anything';
                        }).to.throw(TypeError);
                    });

                    describe('cancelAndHoldAtTime()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.knee.cancelAndHoldAtTime(0)).to.equal(dynamicsCompressorNode.knee);
                        });
                    });

                    describe('cancelScheduledValues()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.knee.cancelScheduledValues(0)).to.equal(dynamicsCompressorNode.knee);
                        });
                    });

                    describe('exponentialRampToValueAtTime()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.knee.exponentialRampToValueAtTime(1, 0)).to.equal(dynamicsCompressorNode.knee);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                dynamicsCompressorNode.knee.exponentialRampToValueAtTime(0, 1);
                            }).to.throw(RangeError);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                dynamicsCompressorNode.knee.exponentialRampToValueAtTime(1, -1);
                            }).to.throw(RangeError);
                        });
                    });

                    describe('linearRampToValueAtTime()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.knee.linearRampToValueAtTime(1, 0)).to.equal(dynamicsCompressorNode.knee);
                        });
                    });

                    describe('setTargetAtTime()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.knee.setTargetAtTime(1, 0, 0.1)).to.equal(dynamicsCompressorNode.knee);
                        });
                    });

                    describe('setValueAtTime()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.knee.setValueAtTime(1, 0)).to.equal(dynamicsCompressorNode.knee);
                        });
                    });

                    describe('setValueCurveAtTime()', () => {
                        for (const [arrayType, values] of [
                            ['regular Array', [1, 0]],
                            ['Float32Array', new Float32Array([1, 0])]
                        ]) {
                            describe(`with a ${arrayType}`, () => {
                                it('should be chainable', () => {
                                    expect(dynamicsCompressorNode.knee.setValueCurveAtTime(values, 0, 1)).to.equal(
                                        dynamicsCompressorNode.knee
                                    );
                                });
                            });
                        }
                    });

                    // @todo automation
                });

                describe('numberOfInputs', () => {
                    let dynamicsCompressorNode;

                    beforeEach(() => {
                        dynamicsCompressorNode = createDynamicsCompressorNode(context);
                    });

                    it('should be readonly', () => {
                        expect(() => {
                            dynamicsCompressorNode.numberOfInputs = 2;
                        }).to.throw(TypeError);
                    });
                });

                describe('numberOfOutputs', () => {
                    let dynamicsCompressorNode;

                    beforeEach(() => {
                        dynamicsCompressorNode = createDynamicsCompressorNode(context);
                    });

                    it('should be readonly', () => {
                        expect(() => {
                            dynamicsCompressorNode.numberOfOutputs = 2;
                        }).to.throw(TypeError);
                    });
                });

                describe('ratio', () => {
                    let dynamicsCompressorNode;

                    beforeEach(() => {
                        dynamicsCompressorNode = createDynamicsCompressorNode(context);
                    });

                    it('should return an implementation of the AudioParam interface', () => {
                        expect(dynamicsCompressorNode.ratio.cancelAndHoldAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.ratio.cancelScheduledValues).to.be.a('function');
                        expect(dynamicsCompressorNode.ratio.defaultValue).to.equal(12);
                        expect(dynamicsCompressorNode.ratio.exponentialRampToValueAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.ratio.linearRampToValueAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.ratio.maxValue).to.equal(20);
                        expect(dynamicsCompressorNode.ratio.minValue).to.equal(1);
                        expect(dynamicsCompressorNode.ratio.setTargetAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.ratio.setValueAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.ratio.setValueCurveAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.ratio.value).to.equal(12);
                    });

                    it('should be readonly', () => {
                        expect(() => {
                            dynamicsCompressorNode.ratio = 'anything';
                        }).to.throw(TypeError);
                    });

                    describe('cancelAndHoldAtTime()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.ratio.cancelAndHoldAtTime(0)).to.equal(dynamicsCompressorNode.ratio);
                        });
                    });

                    describe('cancelScheduledValues()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.ratio.cancelScheduledValues(0)).to.equal(dynamicsCompressorNode.ratio);
                        });
                    });

                    describe('exponentialRampToValueAtTime()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.ratio.exponentialRampToValueAtTime(1, 0)).to.equal(dynamicsCompressorNode.ratio);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                dynamicsCompressorNode.ratio.exponentialRampToValueAtTime(0, 1);
                            }).to.throw(RangeError);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                dynamicsCompressorNode.ratio.exponentialRampToValueAtTime(1, -1);
                            }).to.throw(RangeError);
                        });
                    });

                    describe('linearRampToValueAtTime()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.ratio.linearRampToValueAtTime(1, 0)).to.equal(dynamicsCompressorNode.ratio);
                        });
                    });

                    describe('setTargetAtTime()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.ratio.setTargetAtTime(1, 0, 0.1)).to.equal(dynamicsCompressorNode.ratio);
                        });
                    });

                    describe('setValueAtTime()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.ratio.setValueAtTime(1, 0)).to.equal(dynamicsCompressorNode.ratio);
                        });
                    });

                    describe('setValueCurveAtTime()', () => {
                        for (const [arrayType, values] of [
                            ['regular Array', [1, 0]],
                            ['Float32Array', new Float32Array([1, 0])]
                        ]) {
                            describe(`with a ${arrayType}`, () => {
                                it('should be chainable', () => {
                                    expect(dynamicsCompressorNode.ratio.setValueCurveAtTime(values, 0, 1)).to.equal(
                                        dynamicsCompressorNode.ratio
                                    );
                                });
                            });
                        }
                    });

                    // @todo automation
                });

                // @todo reduction

                describe('release', () => {
                    let dynamicsCompressorNode;

                    beforeEach(() => {
                        dynamicsCompressorNode = createDynamicsCompressorNode(context);
                    });

                    it('should return an implementation of the AudioParam interface', () => {
                        expect(dynamicsCompressorNode.release.cancelAndHoldAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.release.cancelScheduledValues).to.be.a('function');
                        expect(dynamicsCompressorNode.release.defaultValue).to.equal(0.25);
                        expect(dynamicsCompressorNode.release.exponentialRampToValueAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.release.linearRampToValueAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.release.maxValue).to.equal(1);
                        expect(dynamicsCompressorNode.release.minValue).to.equal(0);
                        expect(dynamicsCompressorNode.release.setTargetAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.release.setValueAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.release.setValueCurveAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.release.value).to.equal(0.25);
                    });

                    it('should be readonly', () => {
                        expect(() => {
                            dynamicsCompressorNode.release = 'anything';
                        }).to.throw(TypeError);
                    });

                    describe('cancelAndHoldAtTime()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.release.cancelAndHoldAtTime(0)).to.equal(dynamicsCompressorNode.release);
                        });
                    });

                    describe('cancelScheduledValues()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.release.cancelScheduledValues(0)).to.equal(dynamicsCompressorNode.release);
                        });
                    });

                    describe('exponentialRampToValueAtTime()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.release.exponentialRampToValueAtTime(1, 0)).to.equal(
                                dynamicsCompressorNode.release
                            );
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                dynamicsCompressorNode.release.exponentialRampToValueAtTime(0, 1);
                            }).to.throw(RangeError);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                dynamicsCompressorNode.release.exponentialRampToValueAtTime(1, -1);
                            }).to.throw(RangeError);
                        });
                    });

                    describe('linearRampToValueAtTime()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.release.linearRampToValueAtTime(1, 0)).to.equal(dynamicsCompressorNode.release);
                        });
                    });

                    describe('setTargetAtTime()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.release.setTargetAtTime(1, 0, 0.1)).to.equal(dynamicsCompressorNode.release);
                        });
                    });

                    describe('setValueAtTime()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.release.setValueAtTime(1, 0)).to.equal(dynamicsCompressorNode.release);
                        });
                    });

                    describe('setValueCurveAtTime()', () => {
                        for (const [arrayType, values] of [
                            ['regular Array', [1, 0]],
                            ['Float32Array', new Float32Array([1, 0])]
                        ]) {
                            describe(`with a ${arrayType}`, () => {
                                it('should be chainable', () => {
                                    expect(dynamicsCompressorNode.release.setValueCurveAtTime(values, 0, 1)).to.equal(
                                        dynamicsCompressorNode.release
                                    );
                                });
                            });
                        }
                    });

                    // @todo automation
                });

                describe('threshold', () => {
                    let dynamicsCompressorNode;

                    beforeEach(() => {
                        dynamicsCompressorNode = createDynamicsCompressorNode(context);
                    });

                    it('should return an implementation of the AudioParam interface', () => {
                        expect(dynamicsCompressorNode.threshold.cancelAndHoldAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.threshold.cancelScheduledValues).to.be.a('function');
                        expect(dynamicsCompressorNode.threshold.defaultValue).to.equal(-24);
                        expect(dynamicsCompressorNode.threshold.exponentialRampToValueAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.threshold.linearRampToValueAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.threshold.maxValue).to.equal(0);
                        expect(dynamicsCompressorNode.threshold.minValue).to.equal(-100);
                        expect(dynamicsCompressorNode.threshold.setTargetAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.threshold.setValueAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.threshold.setValueCurveAtTime).to.be.a('function');
                        expect(dynamicsCompressorNode.threshold.value).to.equal(-24);
                    });

                    it('should be readonly', () => {
                        expect(() => {
                            dynamicsCompressorNode.threshold = 'anything';
                        }).to.throw(TypeError);
                    });

                    describe('cancelAndHoldAtTime()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.threshold.cancelAndHoldAtTime(0)).to.equal(dynamicsCompressorNode.threshold);
                        });
                    });

                    describe('cancelScheduledValues()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.threshold.cancelScheduledValues(0)).to.equal(dynamicsCompressorNode.threshold);
                        });
                    });

                    describe('exponentialRampToValueAtTime()', () => {
                        it('should be chainable', () => {
                            // @todo expect(dynamicsCompressorNode.threshold.exponentialRampToValueAtTime(-1, 0)).to.equal(dynamicsCompressorNode.threshold);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                dynamicsCompressorNode.threshold.exponentialRampToValueAtTime(0, 1);
                            }).to.throw(RangeError);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                dynamicsCompressorNode.threshold.exponentialRampToValueAtTime(1, -1);
                            }).to.throw(RangeError);
                        });
                    });

                    describe('linearRampToValueAtTime()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.threshold.linearRampToValueAtTime(-1, 0)).to.equal(
                                dynamicsCompressorNode.threshold
                            );
                        });
                    });

                    describe('setTargetAtTime()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.threshold.setTargetAtTime(-1, 0, 0.1)).to.equal(dynamicsCompressorNode.threshold);
                        });
                    });

                    describe('setValueAtTime()', () => {
                        it('should be chainable', () => {
                            expect(dynamicsCompressorNode.threshold.setValueAtTime(-1, 0)).to.equal(dynamicsCompressorNode.threshold);
                        });
                    });

                    describe('setValueCurveAtTime()', () => {
                        for (const [arrayType, values] of [
                            ['regular Array', [-1, 0]],
                            ['Float32Array', new Float32Array([-1, 0])]
                        ]) {
                            describe(`with a ${arrayType}`, () => {
                                it('should be chainable', () => {
                                    expect(dynamicsCompressorNode.threshold.setValueCurveAtTime(values, 0, 1)).to.equal(
                                        dynamicsCompressorNode.threshold
                                    );
                                });
                            });
                        }
                    });

                    // @todo automation
                });

                describe('connect()', () => {
                    for (const type of ['AudioNode', 'AudioParam']) {
                        describe(`with an ${type}`, () => {
                            let audioNodeOrAudioParam;
                            let dynamicsCompressorNode;

                            beforeEach(() => {
                                const gainNode = new GainNode(context);

                                audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                                dynamicsCompressorNode = createDynamicsCompressorNode(context);
                            });

                            if (type === 'AudioNode') {
                                it('should be chainable', () => {
                                    expect(dynamicsCompressorNode.connect(audioNodeOrAudioParam)).to.equal(audioNodeOrAudioParam);
                                });
                            } else {
                                it('should not be chainable', () => {
                                    expect(dynamicsCompressorNode.connect(audioNodeOrAudioParam)).to.be.undefined;
                                });
                            }

                            it('should accept duplicate connections', () => {
                                dynamicsCompressorNode.connect(audioNodeOrAudioParam);
                                dynamicsCompressorNode.connect(audioNodeOrAudioParam);
                            });

                            it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                                try {
                                    dynamicsCompressorNode.connect(audioNodeOrAudioParam, -1);
                                } catch (err) {
                                    expect(err.code).to.equal(1);
                                    expect(err.name).to.equal('IndexSizeError');

                                    done();
                                }
                            });

                            if (type === 'AudioNode') {
                                it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                                    try {
                                        dynamicsCompressorNode.connect(audioNodeOrAudioParam, 0, -1);
                                    } catch (err) {
                                        expect(err.code).to.equal(1);
                                        expect(err.name).to.equal('IndexSizeError');

                                        done();
                                    }
                                });

                                it('should not throw an error if the connection creates a cycle by connecting to the source', () => {
                                    audioNodeOrAudioParam.connect(dynamicsCompressorNode).connect(audioNodeOrAudioParam);
                                });

                                it('should not throw an error if the connection creates a cycle by connecting to an AudioParam of the source', () => {
                                    audioNodeOrAudioParam.connect(dynamicsCompressorNode).connect(audioNodeOrAudioParam.gain);
                                });
                            }
                        });

                        describe(`with an ${type} of another context`, () => {
                            let anotherContext;
                            let audioNodeOrAudioParam;
                            let dynamicsCompressorNode;

                            afterEach(() => anotherContext.close?.());

                            beforeEach(function () {
                                this.timeout(10000);

                                anotherContext = createContext();

                                const gainNode = new GainNode(anotherContext);

                                audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                                dynamicsCompressorNode = createDynamicsCompressorNode(context);
                            });

                            it('should throw an InvalidAccessError', (done) => {
                                try {
                                    dynamicsCompressorNode.connect(audioNodeOrAudioParam);
                                } catch (err) {
                                    expect(err.code).to.equal(15);
                                    expect(err.name).to.equal('InvalidAccessError');

                                    done();
                                }
                            });
                        });

                        describe(`with an ${type} of a native context`, () => {
                            let dynamicsCompressorNode;
                            let nativeAudioNodeOrAudioParam;
                            let nativeContext;

                            afterEach(() => nativeContext.close?.());

                            beforeEach(() => {
                                dynamicsCompressorNode = createDynamicsCompressorNode(context);
                                nativeContext = description.includes('Offline')
                                    ? createNativeOfflineAudioContext()
                                    : createNativeAudioContext();

                                const nativeGainNode = nativeContext.createGain();

                                nativeAudioNodeOrAudioParam = type === 'AudioNode' ? nativeGainNode : nativeGainNode.gain;
                            });

                            it('should throw an InvalidAccessError', (done) => {
                                try {
                                    dynamicsCompressorNode.connect(nativeAudioNodeOrAudioParam);
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
                                length: context.length === undefined ? lookAhead + 5 : undefined,
                                setup(destination) {
                                    const constantSourceNode = new ConstantSourceNode(context);
                                    const dynamicsCompressorNode = createDynamicsCompressorNode(context);
                                    const gainNode = new GainNode(context);

                                    constantSourceNode.connect(dynamicsCompressorNode).connect(destination);

                                    dynamicsCompressorNode.connect(gainNode).connect(dynamicsCompressorNode);

                                    return { constantSourceNode, dynamicsCompressorNode, gainNode };
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
                                expect(Array.from(channelData).slice(lookAhead)).to.deep.equal([0, 0, 0, 0, 0]);
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
                                length: context.length === undefined ? lookAhead + 5 : undefined,
                                setup(destination) {
                                    // Bug #112: Firefox pauses the DynamicsCompressorNode without waiting for the tail time.
                                    const audioBuffer = new AudioBuffer({ length: lookAhead + 5, sampleRate: context.sampleRate });
                                    const audioBufferSourceNode = new AudioBufferSourceNode(context);
                                    const dynamicsCompressorNode = createDynamicsCompressorNode(context);
                                    const firstDummyGainNode = new GainNode(context);
                                    const secondDummyGainNode = new GainNode(context);

                                    audioBuffer.copyToChannel(new Float32Array(values), 0);

                                    audioBufferSourceNode.buffer = audioBuffer;

                                    audioBufferSourceNode.connect(dynamicsCompressorNode).connect(firstDummyGainNode).connect(destination);

                                    dynamicsCompressorNode.connect(secondDummyGainNode);

                                    return { audioBufferSourceNode, dynamicsCompressorNode, firstDummyGainNode, secondDummyGainNode };
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
                                prepare({ dynamicsCompressorNode }) {
                                    dynamicsCompressorNode.disconnect();
                                },
                                start(startTime, { audioBufferSourceNode }) {
                                    audioBufferSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                for (let i = 0; i < lookAhead + 5; i += 1) {
                                    expect(channelData[i]).to.equal(0);
                                }
                            });
                        });
                    });

                    describe('with an output', () => {
                        describe('with a value which is out-of-bound', () => {
                            let dynamicsCompressorNode;

                            beforeEach(() => {
                                dynamicsCompressorNode = createDynamicsCompressorNode(context);
                            });

                            it('should throw an IndexSizeError', (done) => {
                                try {
                                    dynamicsCompressorNode.disconnect(-1);
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
                                    prepare({ dynamicsCompressorNode }) {
                                        dynamicsCompressorNode.disconnect(0);
                                    },
                                    start(startTime, { audioBufferSourceNode }) {
                                        audioBufferSourceNode.start(startTime);
                                    }
                                }).then((channelData) => {
                                    for (let i = 0; i < lookAhead + 5; i += 1) {
                                        expect(channelData[i]).to.equal(0);
                                    }
                                });
                            });
                        });
                    });

                    describe('with a destination', () => {
                        describe('without a connection to the given destination', () => {
                            let dynamicsCompressorNode;

                            beforeEach(() => {
                                dynamicsCompressorNode = createDynamicsCompressorNode(context);
                            });

                            it('should throw an InvalidAccessError', (done) => {
                                try {
                                    dynamicsCompressorNode.disconnect(new GainNode(context));
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
                                    prepare({ dynamicsCompressorNode, firstDummyGainNode }) {
                                        dynamicsCompressorNode.disconnect(firstDummyGainNode);
                                    },
                                    start(startTime, { audioBufferSourceNode }) {
                                        audioBufferSourceNode.start(startTime);
                                    }
                                }).then((channelData) => {
                                    for (let i = 0; i < lookAhead + 5; i += 1) {
                                        expect(channelData[i]).to.equal(0);
                                    }
                                });
                            });

                            it('should disconnect another destination in isolation', function () {
                                this.timeout(10000);

                                return renderer({
                                    prepare({ dynamicsCompressorNode, secondDummyGainNode }) {
                                        dynamicsCompressorNode.disconnect(secondDummyGainNode);
                                    },
                                    start(startTime, { audioBufferSourceNode }) {
                                        audioBufferSourceNode.start(startTime);
                                    }
                                }).then((channelData) => {
                                    for (let i = 0; i < lookAhead; i += 1) {
                                        expect(channelData[i]).to.equal(0);
                                    }

                                    expect(channelData[lookAhead]).to.be.closeTo(0.307, 0.003);
                                    expect(channelData[lookAhead + 1]).to.be.closeTo(0.307, 0.003);
                                    expect(channelData[lookAhead + 2]).to.be.closeTo(0.307, 0.003);
                                    expect(channelData[lookAhead + 3]).to.be.closeTo(0.307, 0.003);
                                    expect(channelData[lookAhead + 4]).to.be.closeTo(0.307, 0.003);
                                });
                            });
                        });
                    });

                    describe('with a destination and an output', () => {
                        let dynamicsCompressorNode;

                        beforeEach(() => {
                            dynamicsCompressorNode = createDynamicsCompressorNode(context);
                        });

                        it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                            try {
                                dynamicsCompressorNode.disconnect(new GainNode(context), -1);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                        it('should throw an InvalidAccessError if there is no similar connection', (done) => {
                            try {
                                dynamicsCompressorNode.disconnect(new GainNode(context), 0);
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });
                    });

                    describe('with a destination, an output and an input', () => {
                        let dynamicsCompressorNode;

                        beforeEach(() => {
                            dynamicsCompressorNode = createDynamicsCompressorNode(context);
                        });

                        it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                            try {
                                dynamicsCompressorNode.disconnect(new GainNode(context), -1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                        it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                            try {
                                dynamicsCompressorNode.disconnect(new GainNode(context), 0, -1);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                        it('should throw an InvalidAccessError if there is no similar connection', (done) => {
                            try {
                                dynamicsCompressorNode.disconnect(new GainNode(context), 0, 0);
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
}
