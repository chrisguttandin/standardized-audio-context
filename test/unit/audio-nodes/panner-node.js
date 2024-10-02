import {
    AudioBuffer,
    AudioBufferSourceNode,
    AudioWorkletNode,
    ConstantSourceNode,
    GainNode,
    PannerNode,
    addAudioWorkletModule
} from '../../../src/module';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
import { createNativeAudioContext } from '../../helper/create-native-audio-context';
import { createNativeOfflineAudioContext } from '../../helper/create-native-offline-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';

const createPannerNodeWithConstructor = (context, options = null) => {
    if (options === null) {
        return new PannerNode(context);
    }

    return new PannerNode(context, options);
};
const createPannerNodeWithFactoryFunction = (context, options = null) => {
    const pannerNode = context.createPanner();

    if (options !== null && options.channelCount !== undefined) {
        pannerNode.channelCount = options.channelCount;
    }

    if (options !== null && options.channelCountMode !== undefined) {
        pannerNode.channelCountMode = options.channelCountMode;
    }

    if (options !== null && options.channelInterpretation !== undefined) {
        pannerNode.channelInterpretation = options.channelInterpretation;
    }

    if (options !== null && options.coneInnerAngle !== undefined) {
        pannerNode.coneInnerAngle = options.coneInnerAngle;
    }

    if (options !== null && options.coneOuterAngle !== undefined) {
        pannerNode.coneOuterAngle = options.coneOuterAngle;
    }

    if (options !== null && options.coneOuterGain !== undefined) {
        pannerNode.coneOuterGain = options.coneOuterGain;
    }

    if (options !== null && options.distanceModel !== undefined) {
        pannerNode.distanceModel = options.distanceModel;
    }

    if (options !== null && options.maxDistance !== undefined) {
        pannerNode.maxDistance = options.maxDistance;
    }

    if (options !== null && options.orientationX !== undefined) {
        pannerNode.orientationX.value = options.orientationX;
    }

    if (options !== null && options.orientationY !== undefined) {
        pannerNode.orientationY.value = options.orientationY;
    }

    if (options !== null && options.orientationZ !== undefined) {
        pannerNode.orientationZ.value = options.orientationZ;
    }

    if (options !== null && options.panningModel !== undefined) {
        pannerNode.panningModel = options.panningModel;
    }

    if (options !== null && options.positionX !== undefined) {
        pannerNode.positionX.value = options.positionX;
    }

    if (options !== null && options.positionY !== undefined) {
        pannerNode.positionY.value = options.positionY;
    }

    if (options !== null && options.positionZ !== undefined) {
        pannerNode.positionZ.value = options.positionZ;
    }

    if (options !== null && options.refDistance !== undefined) {
        pannerNode.refDistance = options.refDistance;
    }

    if (options !== null && options.rolloffFactor !== undefined) {
        pannerNode.rolloffFactor = options.rolloffFactor;
    }

    return pannerNode;
};
const testCases = {
    'constructor of a MinimalAudioContext': {
        createContext: createMinimalAudioContext,
        createPannerNode: createPannerNodeWithConstructor
    },
    'constructor of a MinimalOfflineAudioContext': {
        createContext: createMinimalOfflineAudioContext,
        createPannerNode: createPannerNodeWithConstructor
    },
    'constructor of an AudioContext': {
        createContext: createAudioContext,
        createPannerNode: createPannerNodeWithConstructor
    },
    'constructor of an OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createPannerNode: createPannerNodeWithConstructor
    },
    'factory function of an AudioContext': {
        createContext: createAudioContext,
        createPannerNode: createPannerNodeWithFactoryFunction
    },
    'factory function of an OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createPannerNode: createPannerNodeWithFactoryFunction
    }
};

describe('PannerNode', () => {
    for (const [description, { createPannerNode, createContext }] of Object.entries(testCases)) {
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
                            let pannerNode;

                            beforeEach(() => {
                                pannerNode = createPannerNode(context);
                            });

                            it('should return an instance of the PannerNode constructor', () => {
                                expect(pannerNode).to.be.an.instanceOf(PannerNode);
                            });

                            it('should return an implementation of the EventTarget interface', () => {
                                expect(pannerNode.addEventListener).to.be.a('function');
                                expect(pannerNode.dispatchEvent).to.be.a('function');
                                expect(pannerNode.removeEventListener).to.be.a('function');
                            });

                            it('should return an implementation of the AudioNode interface', () => {
                                expect(pannerNode.channelCount).to.equal(2);
                                expect(pannerNode.channelCountMode).to.equal('clamped-max');
                                expect(pannerNode.channelInterpretation).to.equal('speakers');
                                expect(pannerNode.connect).to.be.a('function');
                                expect(pannerNode.context).to.be.an.instanceOf(context.constructor);
                                expect(pannerNode.disconnect).to.be.a('function');
                                expect(pannerNode.numberOfInputs).to.equal(1);
                                expect(pannerNode.numberOfOutputs).to.equal(1);
                            });

                            it('should return an implementation of the PannerNode interface', () => {
                                expect(pannerNode.coneInnerAngle).to.equal(360);
                                expect(pannerNode.coneOuterAngle).to.equal(360);
                                expect(pannerNode.coneOuterGain).to.equal(0);
                                expect(pannerNode.distanceModel).to.equal('inverse');
                                expect(pannerNode.maxDistance).to.equal(10000);
                                expect(pannerNode.orientationX).not.to.be.undefined;
                                expect(pannerNode.orientationY).not.to.be.undefined;
                                expect(pannerNode.orientationZ).not.to.be.undefined;
                                expect(pannerNode.panningModel).to.equal('equalpower');
                                expect(pannerNode.positionX).not.to.be.undefined;
                                expect(pannerNode.positionY).not.to.be.undefined;
                                expect(pannerNode.positionZ).not.to.be.undefined;
                                expect(pannerNode.refDistance).to.equal(1);
                                expect(pannerNode.rolloffFactor).to.equal(1);
                            });
                        });

                        describe('with valid options', () => {
                            it('should return an instance with the given channelCount', () => {
                                const channelCount = 1;
                                const pannerNode = createPannerNode(context, { channelCount });

                                expect(pannerNode.channelCount).to.equal(channelCount);
                            });

                            it('should return an instance with the given channelCountMode', () => {
                                const channelCountMode = 'explicit';
                                const pannerNode = createPannerNode(context, { channelCountMode });

                                expect(pannerNode.channelCountMode).to.equal(channelCountMode);
                            });

                            it('should return an instance with the given channelInterpretation', () => {
                                const channelInterpretation = 'discrete';
                                const pannerNode = createPannerNode(context, { channelInterpretation });

                                expect(pannerNode.channelInterpretation).to.equal(channelInterpretation);
                            });

                            it('should return an instance with the given coneInnerAngle', () => {
                                const coneInnerAngle = 180;
                                const pannerNode = createPannerNode(context, { coneInnerAngle });

                                expect(pannerNode.coneInnerAngle).to.equal(coneInnerAngle);
                            });

                            it('should return an instance with the given coneOuterAngle', () => {
                                const coneOuterAngle = 180;
                                const pannerNode = createPannerNode(context, { coneOuterAngle });

                                expect(pannerNode.coneOuterAngle).to.equal(coneOuterAngle);
                            });

                            it('should return an instance with the given coneOuterGain', () => {
                                const coneOuterGain = 0.2;
                                const pannerNode = createPannerNode(context, { coneOuterGain });

                                expect(pannerNode.coneOuterGain).to.equal(coneOuterGain);
                            });

                            it('should return an instance with the given maxDistance', () => {
                                const maxDistance = 100;
                                const pannerNode = createPannerNode(context, { maxDistance });

                                expect(pannerNode.maxDistance).to.equal(maxDistance);
                            });

                            it('should return an instance with the given distanceModel', () => {
                                const distanceModel = 'exponential';
                                const pannerNode = createPannerNode(context, { distanceModel });

                                expect(pannerNode.distanceModel).to.equal(distanceModel);
                            });

                            it('should return an instance with the given initial value for orientationX', () => {
                                const orientationX = 0.5;
                                const pannerNode = createPannerNode(context, { orientationX });

                                if (description.startsWith('constructor')) {
                                    expect(pannerNode.orientationX.defaultValue).to.equal(orientationX);
                                } else {
                                    expect(pannerNode.orientationX.defaultValue).to.equal(1);
                                }

                                expect(pannerNode.orientationX.value).to.equal(orientationX);
                            });

                            it('should return an instance with the given initial value for orientationY', () => {
                                const orientationY = 0.5;
                                const pannerNode = createPannerNode(context, { orientationY });

                                if (description.startsWith('constructor')) {
                                    expect(pannerNode.orientationY.defaultValue).to.equal(orientationY);
                                } else {
                                    expect(pannerNode.orientationY.defaultValue).to.equal(0);
                                }

                                expect(pannerNode.orientationY.value).to.equal(orientationY);
                            });

                            it('should return an instance with the given initial value for orientationZ', () => {
                                const orientationZ = 0.5;
                                const pannerNode = createPannerNode(context, { orientationZ });

                                if (description.startsWith('constructor')) {
                                    expect(pannerNode.orientationZ.defaultValue).to.equal(orientationZ);
                                } else {
                                    expect(pannerNode.orientationZ.defaultValue).to.equal(0);
                                }

                                expect(pannerNode.orientationZ.value).to.equal(orientationZ);
                            });

                            it('should return an instance with the given panningModel', () => {
                                const panningModel = 'HRTF';
                                const pannerNode = createPannerNode(context, { panningModel });

                                expect(pannerNode.panningModel).to.equal(panningModel);
                            });

                            it('should return an instance with the given initial value for positionX', () => {
                                const positionX = 0.5;
                                const pannerNode = createPannerNode(context, { positionX });

                                if (description.startsWith('constructor')) {
                                    expect(pannerNode.positionX.defaultValue).to.equal(positionX);
                                } else {
                                    expect(pannerNode.positionX.defaultValue).to.equal(0);
                                }

                                expect(pannerNode.positionX.value).to.equal(positionX);
                            });

                            it('should return an instance with the given initial value for positionY', () => {
                                const positionY = 0.5;
                                const pannerNode = createPannerNode(context, { positionY });

                                if (description.startsWith('constructor')) {
                                    expect(pannerNode.positionY.defaultValue).to.equal(positionY);
                                } else {
                                    expect(pannerNode.positionY.defaultValue).to.equal(0);
                                }

                                expect(pannerNode.positionY.value).to.equal(positionY);
                            });

                            it('should return an instance with the given initial value for positionZ', () => {
                                const positionZ = 0.5;
                                const pannerNode = createPannerNode(context, { positionZ });

                                if (description.startsWith('constructor')) {
                                    expect(pannerNode.positionZ.defaultValue).to.equal(positionZ);
                                } else {
                                    expect(pannerNode.positionZ.defaultValue).to.equal(0);
                                }

                                expect(pannerNode.positionZ.value).to.equal(positionZ);
                            });

                            it('should return an instance with the given refDistance', () => {
                                const refDistance = 10;
                                const pannerNode = createPannerNode(context, { refDistance });

                                expect(pannerNode.refDistance).to.equal(refDistance);
                            });

                            it('should return an instance with the given rolloffFactor', () => {
                                const rolloffFactor = 5;
                                const pannerNode = createPannerNode(context, { rolloffFactor });

                                expect(pannerNode.rolloffFactor).to.equal(rolloffFactor);
                            });
                        });

                        describe('with invalid options', () => {
                            describe('with a channelCount greater than 2', () => {
                                it('should throw a NotSupportedError', (done) => {
                                    try {
                                        createPannerNode(context, { channelCount: 4 });
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
                                        createPannerNode(context, { channelCountMode: 'max' });
                                    } catch (err) {
                                        expect(err.code).to.equal(9);
                                        expect(err.name).to.equal('NotSupportedError');

                                        done();
                                    }
                                });
                            });

                            describe('with a coneOuterGain outside of the range from 0 to 1', () => {
                                it('should throw a InvalidStateError', (done) => {
                                    try {
                                        createPannerNode(context, { coneOuterGain: -1 });
                                    } catch (err) {
                                        expect(err.code).to.equal(11);
                                        expect(err.name).to.equal('InvalidStateError');

                                        done();
                                    }
                                });
                            });

                            describe('with a maxDistance with a negative value', () => {
                                it('should throw a RangeError', () => {
                                    expect(() => {
                                        createPannerNode(context, { maxDistance: -1 });
                                    }).to.throw(RangeError);
                                });
                            });

                            describe('with a refDistance with a negative value', () => {
                                it('should throw a RangeError', () => {
                                    expect(() => {
                                        createPannerNode(context, { refDistance: -10 });
                                    }).to.throw(RangeError);
                                });
                            });

                            describe('with a rolloffFactor with a negative value', () => {
                                it('should throw a RangeError', () => {
                                    expect(() => {
                                        createPannerNode(context, { rolloffFactor: -5 });
                                    }).to.throw(RangeError);
                                });
                            });
                        });
                    });
                }
            });

            describe('channelCount', () => {
                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it('should be assignable to a value smaller than 3', () => {
                    const channelCount = 1;

                    pannerNode.channelCount = channelCount;

                    expect(pannerNode.channelCount).to.equal(channelCount);
                });

                it('should not be assignable to a value larger than 2', (done) => {
                    const channelCount = 4;

                    try {
                        pannerNode.channelCount = channelCount;
                    } catch (err) {
                        expect(err.code).to.equal(9);
                        expect(err.name).to.equal('NotSupportedError');

                        done();
                    }
                });
            });

            describe('channelCountMode', () => {
                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it("should be assignable to 'explicit'", () => {
                    const channelCountMode = 'explicit';

                    pannerNode.channelCountMode = channelCountMode;

                    expect(pannerNode.channelCountMode).to.equal(channelCountMode);
                });

                it("should not be assignable to 'max'", (done) => {
                    try {
                        pannerNode.channelCountMode = 'max';
                    } catch (err) {
                        expect(err.code).to.equal(9);
                        expect(err.name).to.equal('NotSupportedError');

                        done();
                    }
                });
            });

            describe('channelInterpretation', () => {
                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it('should be assignable to another value', () => {
                    const channelInterpretation = 'discrete';

                    pannerNode.channelInterpretation = channelInterpretation;

                    expect(pannerNode.channelInterpretation).to.equal(channelInterpretation);
                });
            });

            describe('coneInnerAngle', () => {
                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it('should be assignable to another value', () => {
                    const coneInnerAngle = 180;

                    pannerNode.coneInnerAngle = coneInnerAngle;

                    expect(pannerNode.coneInnerAngle).to.equal(coneInnerAngle);
                });
            });

            describe('coneOuterAngle', () => {
                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it('should be assignable to another value', () => {
                    const coneOuterAngle = 180;

                    pannerNode.coneOuterAngle = coneOuterAngle;

                    expect(pannerNode.coneOuterAngle).to.equal(coneOuterAngle);
                });
            });

            describe('coneOuterGain', () => {
                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it('should be assignable to a value in the range from 0 to 1', () => {
                    const coneOuterGain = 0.5;

                    pannerNode.coneOuterGain = coneOuterGain;

                    expect(pannerNode.coneOuterGain).to.equal(coneOuterGain);
                });

                it('should not be assignable to a value outside of the range from 0 to 1', (done) => {
                    try {
                        pannerNode.coneOuterGain = 2;
                    } catch (err) {
                        expect(err.code).to.equal(11);
                        expect(err.name).to.equal('InvalidStateError');

                        done();
                    }
                });
            });

            describe('distanceModel', () => {
                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it('should be assignable to another distanceModel', () => {
                    const distanceModel = (pannerNode.distanceModel = 'linear'); // eslint-disable-line no-multi-assign

                    expect(distanceModel).to.equal('linear');
                    expect(pannerNode.distanceModel).to.equal('linear');
                });

                it('should not be assignable to something else', () => {
                    const string = 'none of the accepted distanceModels';
                    const distanceModel = (pannerNode.distanceModel = string); // eslint-disable-line no-multi-assign

                    expect(distanceModel).to.equal(string);
                    expect(pannerNode.distanceModel).to.equal('inverse');
                });
            });

            describe('maxDistance', () => {
                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it('should be assignable to a positive value', () => {
                    const maxDistance = 1000;

                    pannerNode.maxDistance = maxDistance;

                    expect(pannerNode.maxDistance).to.equal(maxDistance);
                });

                it('should not be assignable to a negative value', () => {
                    expect(() => {
                        createPannerNode(context, { maxDistance: -1 });
                    }).to.throw(RangeError);
                });
            });

            describe('numberOfInputs', () => {
                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it('should be readonly', () => {
                    expect(() => {
                        pannerNode.numberOfInputs = 2;
                    }).to.throw(TypeError);
                });
            });

            describe('numberOfOutputs', () => {
                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it('should be readonly', () => {
                    expect(() => {
                        pannerNode.numberOfOutputs = 2;
                    }).to.throw(TypeError);
                });
            });

            describe('orientationX', () => {
                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it('should return an implementation of the AudioParam interface', () => {
                    expect(pannerNode.orientationX.cancelAndHoldAtTime).to.be.a('function');
                    expect(pannerNode.orientationX.cancelScheduledValues).to.be.a('function');
                    expect(pannerNode.orientationX.defaultValue).to.equal(1);
                    expect(pannerNode.orientationX.exponentialRampToValueAtTime).to.be.a('function');
                    expect(pannerNode.orientationX.linearRampToValueAtTime).to.be.a('function');
                    expect(pannerNode.orientationX.maxValue).to.equal(3.4028234663852886e38);
                    expect(pannerNode.orientationX.minValue).to.equal(-3.4028234663852886e38);
                    expect(pannerNode.orientationX.setTargetAtTime).to.be.a('function');
                    expect(pannerNode.orientationX.setValueAtTime).to.be.a('function');
                    expect(pannerNode.orientationX.setValueCurveAtTime).to.be.a('function');
                    expect(pannerNode.orientationX.value).to.equal(1);
                });

                it('should be readonly', () => {
                    expect(() => {
                        pannerNode.orientationX = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelAndHoldAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.orientationX.cancelAndHoldAtTime(0)).to.equal(pannerNode.orientationX);
                    });
                });

                describe('cancelScheduledValues()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.orientationX.cancelScheduledValues(0)).to.equal(pannerNode.orientationX);
                    });
                });

                describe('exponentialRampToValueAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.orientationX.exponentialRampToValueAtTime(1, 0)).to.equal(pannerNode.orientationX);
                    });

                    it('should throw a RangeError', () => {
                        expect(() => {
                            pannerNode.orientationX.exponentialRampToValueAtTime(0, 1);
                        }).to.throw(RangeError);
                    });

                    it('should throw a RangeError', () => {
                        expect(() => {
                            pannerNode.orientationX.exponentialRampToValueAtTime(1, -1);
                        }).to.throw(RangeError);
                    });
                });

                describe('linearRampToValueAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.orientationX.linearRampToValueAtTime(1, 0)).to.equal(pannerNode.orientationX);
                    });
                });

                describe('setTargetAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.orientationX.setTargetAtTime(1, 0, 0.1)).to.equal(pannerNode.orientationX);
                    });
                });

                describe('setValueAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.orientationX.setValueAtTime(1, 0)).to.equal(pannerNode.orientationX);
                    });
                });

                describe('setValueCurveAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.orientationX.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1)).to.equal(
                            pannerNode.orientationX
                        );
                    });
                });

                // @todo automation
            });

            describe('orientationY', () => {
                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it('should return an implementation of the AudioParam interface', () => {
                    expect(pannerNode.orientationY.cancelAndHoldAtTime).to.be.a('function');
                    expect(pannerNode.orientationY.cancelScheduledValues).to.be.a('function');
                    expect(pannerNode.orientationY.defaultValue).to.equal(0);
                    expect(pannerNode.orientationY.exponentialRampToValueAtTime).to.be.a('function');
                    expect(pannerNode.orientationY.linearRampToValueAtTime).to.be.a('function');
                    expect(pannerNode.orientationY.maxValue).to.equal(3.4028234663852886e38);
                    expect(pannerNode.orientationY.minValue).to.equal(-3.4028234663852886e38);
                    expect(pannerNode.orientationY.setTargetAtTime).to.be.a('function');
                    expect(pannerNode.orientationY.setValueAtTime).to.be.a('function');
                    expect(pannerNode.orientationY.setValueCurveAtTime).to.be.a('function');
                    expect(pannerNode.orientationY.value).to.equal(0);
                });

                it('should be readonly', () => {
                    expect(() => {
                        pannerNode.orientationY = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelAndHoldAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.orientationY.cancelAndHoldAtTime(0)).to.equal(pannerNode.orientationY);
                    });
                });

                describe('cancelScheduledValues()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.orientationY.cancelScheduledValues(0)).to.equal(pannerNode.orientationY);
                    });
                });

                describe('exponentialRampToValueAtTime()', () => {
                    it('should be chainable', () => {
                        // @todo Firefox can't schedule an exponential ramp when the value is 0.
                        pannerNode.orientationY.value = 1;

                        expect(pannerNode.orientationY.exponentialRampToValueAtTime(1, 0)).to.equal(pannerNode.orientationY);
                    });

                    it('should throw a RangeError', () => {
                        expect(() => {
                            pannerNode.orientationY.exponentialRampToValueAtTime(0, 1);
                        }).to.throw(RangeError);
                    });

                    it('should throw a RangeError', () => {
                        expect(() => {
                            pannerNode.orientationY.exponentialRampToValueAtTime(1, -1);
                        }).to.throw(RangeError);
                    });
                });

                describe('linearRampToValueAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.orientationY.linearRampToValueAtTime(1, 0)).to.equal(pannerNode.orientationY);
                    });
                });

                describe('setTargetAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.orientationY.setTargetAtTime(1, 0, 0.1)).to.equal(pannerNode.orientationY);
                    });
                });

                describe('setValueAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.orientationY.setValueAtTime(1, 0)).to.equal(pannerNode.orientationY);
                    });
                });

                describe('setValueCurveAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.orientationY.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1)).to.equal(
                            pannerNode.orientationY
                        );
                    });
                });

                // @todo automation
            });

            describe('orientationZ', () => {
                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it('should return an implementation of the AudioParam interface', () => {
                    expect(pannerNode.orientationZ.cancelAndHoldAtTime).to.be.a('function');
                    expect(pannerNode.orientationZ.cancelScheduledValues).to.be.a('function');
                    expect(pannerNode.orientationZ.defaultValue).to.equal(0);
                    expect(pannerNode.orientationZ.exponentialRampToValueAtTime).to.be.a('function');
                    expect(pannerNode.orientationZ.linearRampToValueAtTime).to.be.a('function');
                    expect(pannerNode.orientationZ.maxValue).to.equal(3.4028234663852886e38);
                    expect(pannerNode.orientationZ.minValue).to.equal(-3.4028234663852886e38);
                    expect(pannerNode.orientationZ.setTargetAtTime).to.be.a('function');
                    expect(pannerNode.orientationZ.setValueAtTime).to.be.a('function');
                    expect(pannerNode.orientationZ.setValueCurveAtTime).to.be.a('function');
                    expect(pannerNode.orientationZ.value).to.equal(0);
                });

                it('should be readonly', () => {
                    expect(() => {
                        pannerNode.orientationZ = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelAndHoldAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.orientationZ.cancelAndHoldAtTime(0)).to.equal(pannerNode.orientationZ);
                    });
                });

                describe('cancelScheduledValues()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.orientationZ.cancelScheduledValues(0)).to.equal(pannerNode.orientationZ);
                    });
                });

                describe('exponentialRampToValueAtTime()', () => {
                    it('should be chainable', () => {
                        // @todo Firefox can't schedule an exponential ramp when the value is 0.
                        pannerNode.orientationZ.value = 1;

                        expect(pannerNode.orientationZ.exponentialRampToValueAtTime(1, 0)).to.equal(pannerNode.orientationZ);
                    });

                    it('should throw a RangeError', () => {
                        expect(() => {
                            pannerNode.orientationZ.exponentialRampToValueAtTime(0, 1);
                        }).to.throw(RangeError);
                    });

                    it('should throw a RangeError', () => {
                        expect(() => {
                            pannerNode.orientationZ.exponentialRampToValueAtTime(1, -1);
                        }).to.throw(RangeError);
                    });
                });

                describe('linearRampToValueAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.orientationZ.linearRampToValueAtTime(1, 0)).to.equal(pannerNode.orientationZ);
                    });
                });

                describe('setTargetAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.orientationZ.setTargetAtTime(1, 0, 0.1)).to.equal(pannerNode.orientationZ);
                    });
                });

                describe('setValueAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.orientationZ.setValueAtTime(1, 0)).to.equal(pannerNode.orientationZ);
                    });
                });

                describe('setValueCurveAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.orientationZ.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1)).to.equal(
                            pannerNode.orientationZ
                        );
                    });
                });

                // @todo automation
            });

            describe('panningModel', () => {
                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it('should be assignable to another panningModel', () => {
                    const panningModel = (pannerNode.panningModel = 'HRTF'); // eslint-disable-line no-multi-assign

                    expect(panningModel).to.equal('HRTF');
                    expect(pannerNode.panningModel).to.equal('HRTF');
                });

                it('should not be assignable to something else', () => {
                    const string = 'none of the accepted panningModels';
                    const panningModel = (pannerNode.panningModel = string); // eslint-disable-line no-multi-assign

                    expect(panningModel).to.equal(string);
                    expect(pannerNode.panningModel).to.equal('equalpower');
                });
            });

            describe('positionX', () => {
                it('should return an implementation of the AudioParam interface', () => {
                    const pannerNode = createPannerNode(context);

                    expect(pannerNode.positionX.cancelAndHoldAtTime).to.be.a('function');
                    expect(pannerNode.positionX.cancelScheduledValues).to.be.a('function');
                    expect(pannerNode.positionX.defaultValue).to.equal(0);
                    expect(pannerNode.positionX.exponentialRampToValueAtTime).to.be.a('function');
                    expect(pannerNode.positionX.linearRampToValueAtTime).to.be.a('function');
                    expect(pannerNode.positionX.maxValue).to.equal(3.4028234663852886e38);
                    expect(pannerNode.positionX.minValue).to.equal(-3.4028234663852886e38);
                    expect(pannerNode.positionX.setTargetAtTime).to.be.a('function');
                    expect(pannerNode.positionX.setValueAtTime).to.be.a('function');
                    expect(pannerNode.positionX.setValueCurveAtTime).to.be.a('function');
                    expect(pannerNode.positionX.value).to.equal(0);
                });

                it('should be readonly', () => {
                    const pannerNode = createPannerNode(context);

                    expect(() => {
                        pannerNode.positionX = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelAndHoldAtTime()', () => {
                    let pannerNode;

                    beforeEach(() => {
                        pannerNode = createPannerNode(context);
                    });

                    it('should be chainable', () => {
                        expect(pannerNode.positionX.cancelAndHoldAtTime(0)).to.equal(pannerNode.positionX);
                    });
                });

                describe('cancelScheduledValues()', () => {
                    let pannerNode;

                    beforeEach(() => {
                        pannerNode = createPannerNode(context);
                    });

                    it('should be chainable', () => {
                        expect(pannerNode.positionX.cancelScheduledValues(0)).to.equal(pannerNode.positionX);
                    });
                });

                describe('exponentialRampToValueAtTime()', () => {
                    let pannerNode;

                    beforeEach(() => {
                        pannerNode = createPannerNode(context);
                    });

                    it('should be chainable', () => {
                        // @todo Firefox can't schedule an exponential ramp when the value is 0.
                        pannerNode.positionX.value = 1;

                        expect(pannerNode.positionX.exponentialRampToValueAtTime(1, 0)).to.equal(pannerNode.positionX);
                    });

                    it('should throw a RangeError', () => {
                        expect(() => {
                            pannerNode.positionX.exponentialRampToValueAtTime(0, 1);
                        }).to.throw(RangeError);
                    });

                    it('should throw a RangeError', () => {
                        expect(() => {
                            pannerNode.positionX.exponentialRampToValueAtTime(1, -1);
                        }).to.throw(RangeError);
                    });
                });

                describe('linearRampToValueAtTime()', () => {
                    let pannerNode;

                    beforeEach(() => {
                        pannerNode = createPannerNode(context);
                    });

                    it('should be chainable', () => {
                        expect(pannerNode.positionX.linearRampToValueAtTime(1, 0)).to.equal(pannerNode.positionX);
                    });
                });

                describe('setTargetAtTime()', () => {
                    let pannerNode;

                    beforeEach(() => {
                        pannerNode = createPannerNode(context);
                    });

                    it('should be chainable', () => {
                        expect(pannerNode.positionX.setTargetAtTime(1, 0, 0.1)).to.equal(pannerNode.positionX);
                    });
                });

                describe('setValueAtTime()', () => {
                    let pannerNode;

                    beforeEach(() => {
                        pannerNode = createPannerNode(context);
                    });

                    it('should be chainable', () => {
                        expect(pannerNode.positionX.setValueAtTime(1, 0)).to.equal(pannerNode.positionX);
                    });
                });

                describe('setValueCurveAtTime()', () => {
                    let pannerNode;

                    beforeEach(() => {
                        pannerNode = createPannerNode(context);
                    });

                    it('should be chainable', () => {
                        expect(pannerNode.positionX.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1)).to.equal(pannerNode.positionX);
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
                                        const masterGainNode = new GainNode(context, {
                                            gain: withADirectConnection && withAnAppendedAudioWorklet ? 0.5 : 1
                                        });
                                        const pannerNode = createPannerNode(context);

                                        audioBuffer.copyToChannel(new Float32Array(values), 0);

                                        audioBufferSourceNode.buffer = audioBuffer;

                                        audioBufferSourceNode.connect(pannerNode);

                                        if (withADirectConnection) {
                                            pannerNode.connect(masterGainNode);
                                        }

                                        if (withAnAppendedAudioWorklet) {
                                            pannerNode.connect(audioWorkletNode).connect(masterGainNode);
                                        }

                                        masterGainNode.connect(destination);

                                        return { audioBufferSourceNode, pannerNode };
                                    }
                                });
                            });

                            describe('without any automation', () => {
                                it('should modify the signal', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        start(startTime, { audioBufferSourceNode }) {
                                            audioBufferSourceNode.start(startTime);
                                        }
                                    }).then((channelData) => {
                                        expect(channelData[0]).to.equal(0.7071067690849304);
                                        expect(channelData[1]).to.equal(0.3535533845424652);
                                        expect(channelData[2]).to.be.closeTo(0, 0.000000000001);
                                        expect(channelData[3]).to.equal(-0.3535533845424652);
                                        expect(channelData[4]).to.equal(-0.7071067690849304);
                                    });
                                });
                            });

                            describe('with a modified value', () => {
                                it('should modify the signal', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        prepare({ pannerNode }) {
                                            pannerNode.positionX.value = 10;
                                        },
                                        start(startTime, { audioBufferSourceNode }) {
                                            audioBufferSourceNode.start(startTime);
                                        }
                                    }).then((channelData) => {
                                        expect(channelData[0]).to.equal(0.05000000074505806);
                                        expect(channelData[1]).to.equal(0.02500000037252903);
                                        expect(channelData[2]).to.be.closeTo(0, 0.0000000000001);
                                        expect(channelData[3]).to.equal(-0.02500000037252903);
                                        expect(channelData[4]).to.equal(-0.05000000074505806);
                                    });
                                });
                            });

                            describe('with a call to cancelAndHoldAtTime()', () => {
                                // @todo
                            });

                            describe('with a call to cancelScheduledValues()', () => {
                                // @todo
                            });

                            describe('with a call to setValueAtTime()', () => {
                                // @todo
                            });

                            describe('with a call to setValueCurveAtTime()', () => {
                                // @todo
                            });

                            describe('with another AudioNode connected to the AudioParam', () => {
                                // @todo
                            });

                            // @todo Test other automations as well.
                        });
                    }
                });
            });

            describe('positionY', () => {
                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it('should return an implementation of the AudioParam interface', () => {
                    expect(pannerNode.positionY.cancelAndHoldAtTime).to.be.a('function');
                    expect(pannerNode.positionY.cancelScheduledValues).to.be.a('function');
                    expect(pannerNode.positionY.defaultValue).to.equal(0);
                    expect(pannerNode.positionY.exponentialRampToValueAtTime).to.be.a('function');
                    expect(pannerNode.positionY.linearRampToValueAtTime).to.be.a('function');
                    expect(pannerNode.positionY.maxValue).to.equal(3.4028234663852886e38);
                    expect(pannerNode.positionY.minValue).to.equal(-3.4028234663852886e38);
                    expect(pannerNode.positionY.setTargetAtTime).to.be.a('function');
                    expect(pannerNode.positionY.setValueAtTime).to.be.a('function');
                    expect(pannerNode.positionY.setValueCurveAtTime).to.be.a('function');
                    expect(pannerNode.positionY.value).to.equal(0);
                });

                it('should be readonly', () => {
                    expect(() => {
                        pannerNode.positionY = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelAndHoldAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.positionY.cancelAndHoldAtTime(0)).to.equal(pannerNode.positionY);
                    });
                });

                describe('cancelScheduledValues()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.positionY.cancelScheduledValues(0)).to.equal(pannerNode.positionY);
                    });
                });

                describe('exponentialRampToValueAtTime()', () => {
                    it('should be chainable', () => {
                        // @todo Firefox can't schedule an exponential ramp when the value is 0.
                        pannerNode.positionY.value = 1;

                        expect(pannerNode.positionY.exponentialRampToValueAtTime(1, 0)).to.equal(pannerNode.positionY);
                    });

                    it('should throw a RangeError', () => {
                        expect(() => {
                            pannerNode.positionY.exponentialRampToValueAtTime(0, 1);
                        }).to.throw(RangeError);
                    });

                    it('should throw a RangeError', () => {
                        expect(() => {
                            pannerNode.positionY.exponentialRampToValueAtTime(1, -1);
                        }).to.throw(RangeError);
                    });
                });

                describe('linearRampToValueAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.positionY.linearRampToValueAtTime(1, 0)).to.equal(pannerNode.positionY);
                    });
                });

                describe('setTargetAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.positionY.setTargetAtTime(1, 0, 0.1)).to.equal(pannerNode.positionY);
                    });
                });

                describe('setValueAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.positionY.setValueAtTime(1, 0)).to.equal(pannerNode.positionY);
                    });
                });

                describe('setValueCurveAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.positionY.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1)).to.equal(pannerNode.positionY);
                    });
                });

                // @todo automation
            });

            describe('positionZ', () => {
                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it('should return an implementation of the AudioParam interface', () => {
                    expect(pannerNode.positionZ.cancelAndHoldAtTime).to.be.a('function');
                    expect(pannerNode.positionZ.cancelScheduledValues).to.be.a('function');
                    expect(pannerNode.positionZ.defaultValue).to.equal(0);
                    expect(pannerNode.positionZ.exponentialRampToValueAtTime).to.be.a('function');
                    expect(pannerNode.positionZ.linearRampToValueAtTime).to.be.a('function');
                    expect(pannerNode.positionZ.maxValue).to.equal(3.4028234663852886e38);
                    expect(pannerNode.positionZ.minValue).to.equal(-3.4028234663852886e38);
                    expect(pannerNode.positionZ.setTargetAtTime).to.be.a('function');
                    expect(pannerNode.positionZ.setValueAtTime).to.be.a('function');
                    expect(pannerNode.positionZ.setValueCurveAtTime).to.be.a('function');
                    expect(pannerNode.positionZ.value).to.equal(0);
                });

                it('should be readonly', () => {
                    expect(() => {
                        pannerNode.positionZ = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelAndHoldAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.positionZ.cancelAndHoldAtTime(0)).to.equal(pannerNode.positionZ);
                    });
                });

                describe('cancelScheduledValues()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.positionZ.cancelScheduledValues(0)).to.equal(pannerNode.positionZ);
                    });
                });

                describe('exponentialRampToValueAtTime()', () => {
                    it('should be chainable', () => {
                        // @todo Firefox can't schedule an exponential ramp when the value is 0.
                        pannerNode.positionZ.value = 1;

                        expect(pannerNode.positionZ.exponentialRampToValueAtTime(1, 0)).to.equal(pannerNode.positionZ);
                    });

                    it('should throw a RangeError', () => {
                        expect(() => {
                            pannerNode.positionZ.exponentialRampToValueAtTime(0, 1);
                        }).to.throw(RangeError);
                    });

                    it('should throw a RangeError', () => {
                        expect(() => {
                            pannerNode.positionZ.exponentialRampToValueAtTime(1, -1);
                        }).to.throw(RangeError);
                    });
                });

                describe('linearRampToValueAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.positionZ.linearRampToValueAtTime(1, 0)).to.equal(pannerNode.positionZ);
                    });
                });

                describe('setTargetAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.positionZ.setTargetAtTime(1, 0, 0.1)).to.equal(pannerNode.positionZ);
                    });
                });

                describe('setValueAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.positionZ.setValueAtTime(1, 0)).to.equal(pannerNode.positionZ);
                    });
                });

                describe('setValueCurveAtTime()', () => {
                    it('should be chainable', () => {
                        expect(pannerNode.positionZ.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1)).to.equal(pannerNode.positionZ);
                    });
                });

                // @todo automation
            });

            describe('refDistance', () => {
                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it('should be assignable to a positive value', () => {
                    const refDistance = 100;

                    pannerNode.refDistance = refDistance;

                    expect(pannerNode.refDistance).to.equal(refDistance);
                });

                it('should not be assignable to a negative value', () => {
                    expect(() => {
                        createPannerNode(context, { refDistance: -1 });
                    }).to.throw(RangeError);
                });
            });

            describe('rolloffFactor', () => {
                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it('should be assignable to a positive value', () => {
                    const rolloffFactor = 10;

                    pannerNode.rolloffFactor = rolloffFactor;

                    expect(pannerNode.rolloffFactor).to.equal(rolloffFactor);
                });

                it('should not be assignable to a negative value', () => {
                    expect(() => {
                        createPannerNode(context, { rolloffFactor: -1 });
                    }).to.throw(RangeError);
                });
            });

            describe('connect()', () => {
                for (const type of ['AudioNode', 'AudioParam']) {
                    describe(`with an ${type}`, () => {
                        let audioNodeOrAudioParam;
                        let pannerNode;

                        beforeEach(() => {
                            const gainNode = new GainNode(context);

                            audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                            pannerNode = createPannerNode(context);
                        });

                        if (type === 'AudioNode') {
                            it('should be chainable', () => {
                                expect(pannerNode.connect(audioNodeOrAudioParam)).to.equal(audioNodeOrAudioParam);
                            });
                        } else {
                            it('should not be chainable', () => {
                                expect(pannerNode.connect(audioNodeOrAudioParam)).to.be.undefined;
                            });
                        }

                        it('should accept duplicate connections', () => {
                            pannerNode.connect(audioNodeOrAudioParam);
                            pannerNode.connect(audioNodeOrAudioParam);
                        });

                        it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                            try {
                                pannerNode.connect(audioNodeOrAudioParam, -1);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                        if (type === 'AudioNode') {
                            it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                                try {
                                    pannerNode.connect(audioNodeOrAudioParam, 0, -1);
                                } catch (err) {
                                    expect(err.code).to.equal(1);
                                    expect(err.name).to.equal('IndexSizeError');

                                    done();
                                }
                            });

                            it('should not throw an error if the connection creates a cycle by connecting to the source', () => {
                                audioNodeOrAudioParam.connect(pannerNode).connect(audioNodeOrAudioParam);
                            });

                            it('should not throw an error if the connection creates a cycle by connecting to an AudioParam of the source', () => {
                                audioNodeOrAudioParam.connect(pannerNode).connect(audioNodeOrAudioParam.gain);
                            });
                        }
                    });

                    describe(`with an ${type} of another context`, () => {
                        let anotherContext;
                        let audioNodeOrAudioParam;
                        let pannerNode;

                        afterEach(() => anotherContext.close?.());

                        beforeEach(() => {
                            anotherContext = createContext();

                            const gainNode = new GainNode(anotherContext);

                            audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                            pannerNode = createPannerNode(context);
                        });

                        it('should throw an InvalidAccessError', (done) => {
                            try {
                                pannerNode.connect(audioNodeOrAudioParam);
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });
                    });

                    describe(`with an ${type} of a native context`, () => {
                        let nativeAudioNodeOrAudioParam;
                        let nativeContext;
                        let pannerNode;

                        afterEach(() => nativeContext.close?.());

                        beforeEach(() => {
                            nativeContext = description.includes('Offline')
                                ? createNativeOfflineAudioContext()
                                : createNativeAudioContext();

                            const nativeGainNode = nativeContext.createGain();

                            nativeAudioNodeOrAudioParam = type === 'AudioNode' ? nativeGainNode : nativeGainNode.gain;
                            pannerNode = createPannerNode(context);
                        });

                        it('should throw an InvalidAccessError', (done) => {
                            try {
                                pannerNode.connect(nativeAudioNodeOrAudioParam);
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
                                const gainNode = new GainNode(context);
                                const pannerNode = createPannerNode(context);

                                constantSourceNode.connect(pannerNode).connect(destination);

                                pannerNode.connect(gainNode).connect(pannerNode);

                                return { constantSourceNode, gainNode, pannerNode };
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
                                const firstDummyGainNode = new GainNode(context);
                                const pannerNode = createPannerNode(context);
                                const secondDummyGainNode = new GainNode(context);

                                audioBuffer.copyToChannel(new Float32Array(values), 0);

                                audioBufferSourceNode.buffer = audioBuffer;

                                audioBufferSourceNode.connect(pannerNode).connect(firstDummyGainNode).connect(destination);

                                pannerNode.connect(secondDummyGainNode);

                                return { audioBufferSourceNode, firstDummyGainNode, pannerNode, secondDummyGainNode };
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
                            prepare({ pannerNode }) {
                                pannerNode.disconnect();
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
                        let pannerNode;

                        beforeEach(() => {
                            pannerNode = createPannerNode(context);
                        });

                        it('should throw an IndexSizeError', (done) => {
                            try {
                                pannerNode.disconnect(-1);
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
                                prepare({ pannerNode }) {
                                    pannerNode.disconnect(0);
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
                        let pannerNode;

                        beforeEach(() => {
                            pannerNode = createPannerNode(context);
                        });

                        it('should throw an InvalidAccessError', (done) => {
                            try {
                                pannerNode.disconnect(new GainNode(context));
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
                                prepare({ firstDummyGainNode, pannerNode }) {
                                    pannerNode.disconnect(firstDummyGainNode);
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
                                prepare({ pannerNode, secondDummyGainNode }) {
                                    pannerNode.disconnect(secondDummyGainNode);
                                },
                                start(startTime, { audioBufferSourceNode }) {
                                    audioBufferSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(channelData[0]).to.be.closeTo(0.7071067690849304, 0.0001);
                                expect(channelData[1]).to.be.closeTo(0.7071067690849304, 0.0001);
                                expect(channelData[2]).to.be.closeTo(0.7071067690849304, 0.0001);
                                expect(channelData[3]).to.be.closeTo(0.7071067690849304, 0.0001);
                                expect(channelData[4]).to.be.closeTo(0.7071067690849304, 0.0001);
                            });
                        });
                    });
                });

                describe('with a destination and an output', () => {
                    let pannerNode;

                    beforeEach(() => {
                        pannerNode = createPannerNode(context);
                    });

                    it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                        try {
                            pannerNode.disconnect(new GainNode(context), -1);
                        } catch (err) {
                            expect(err.code).to.equal(1);
                            expect(err.name).to.equal('IndexSizeError');

                            done();
                        }
                    });

                    it('should throw an InvalidAccessError if there is no similar connection', (done) => {
                        try {
                            pannerNode.disconnect(new GainNode(context), 0);
                        } catch (err) {
                            expect(err.code).to.equal(15);
                            expect(err.name).to.equal('InvalidAccessError');

                            done();
                        }
                    });
                });

                describe('with a destination, an output and an input', () => {
                    let pannerNode;

                    beforeEach(() => {
                        pannerNode = createPannerNode(context);
                    });

                    it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                        try {
                            pannerNode.disconnect(new GainNode(context), -1, 0);
                        } catch (err) {
                            expect(err.code).to.equal(1);
                            expect(err.name).to.equal('IndexSizeError');

                            done();
                        }
                    });

                    it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                        try {
                            pannerNode.disconnect(new GainNode(context), 0, -1);
                        } catch (err) {
                            expect(err.code).to.equal(1);
                            expect(err.name).to.equal('IndexSizeError');

                            done();
                        }
                    });

                    it('should throw an InvalidAccessError if there is no similar connection', (done) => {
                        try {
                            pannerNode.disconnect(new GainNode(context), 0, 0);
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
