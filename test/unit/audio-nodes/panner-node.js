import '../../helper/play-silence';
import { AudioBuffer, AudioBufferSourceNode, GainNode, PannerNode } from '../../../src/module';
import { BACKUP_NATIVE_CONTEXT_STORE } from '../../../src/globals';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
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

    for (const [ description, { createPannerNode, createContext } ] of Object.entries(testCases)) {

        describe(`with the ${ description }`, () => {

            let context;

            afterEach(() => {
                if (context.close !== undefined) {
                    return context.close();
                }
            });

            beforeEach(() => context = createContext());

            describe('constructor()', () => {

                for (const audioContextState of [ 'closed', 'running' ]) {

                    describe(`with an audioContextState of "${ audioContextState }"`, () => {

                        afterEach(() => {
                            if (audioContextState === 'closed') {
                                const backupNativeContext = BACKUP_NATIVE_CONTEXT_STORE.get(context._nativeContext);

                                // Bug #94: Edge also exposes a close() method on an OfflineAudioContext which is why this check is necessary.
                                if (backupNativeContext !== undefined && backupNativeContext.startRendering === undefined) {
                                    context = backupNativeContext;
                                } else {
                                    context.close = undefined;
                                }
                            }
                        });

                        beforeEach(() => {
                            if (audioContextState === 'closed') {
                                if (context.close === undefined) {
                                    return context.startRendering();
                                }

                                return context.close();
                            }
                        });

                        describe('without any options', () => {

                            let pannerNode;

                            beforeEach(() => {
                                pannerNode = createPannerNode(context);
                            });

                            it('should return an instance of the EventTarget interface', () => {
                                expect(pannerNode.addEventListener).to.be.a('function');
                                expect(pannerNode.dispatchEvent).to.be.a('function');
                                expect(pannerNode.removeEventListener).to.be.a('function');
                            });

                            it('should return an instance of the AudioNode interface', () => {
                                expect(pannerNode.channelCount).to.equal(2);
                                expect(pannerNode.channelCountMode).to.equal('clamped-max');
                                expect(pannerNode.channelInterpretation).to.equal('speakers');
                                expect(pannerNode.connect).to.be.a('function');
                                expect(pannerNode.context).to.be.an.instanceOf(context.constructor);
                                expect(pannerNode.disconnect).to.be.a('function');
                                expect(pannerNode.numberOfInputs).to.equal(1);
                                expect(pannerNode.numberOfOutputs).to.equal(1);
                            });

                            it('should return an instance of the PannerNode interface', () => {
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

                                expect(pannerNode.orientationX.value).to.equal(orientationX);
                            });

                            it('should return an instance with the given initial value for orientationY', () => {
                                const orientationY = 0.5;
                                const pannerNode = createPannerNode(context, { orientationY });

                                expect(pannerNode.orientationY.value).to.equal(orientationY);
                            });

                            it('should return an instance with the given initial value for orientationZ', () => {
                                const orientationZ = 0.5;
                                const pannerNode = createPannerNode(context, { orientationZ });

                                expect(pannerNode.orientationZ.value).to.equal(orientationZ);
                            });

                            // Bug #123: Edge does not support HRTF as panningModel.
                            if (!/Edge/.test(navigator.userAgent)) {

                                it('should return an instance with the given panningModel', () => {
                                    const panningModel = 'HRTF';
                                    const pannerNode = createPannerNode(context, { panningModel });

                                    expect(pannerNode.panningModel).to.equal(panningModel);
                                });

                            }

                            it('should return an instance with the given initial value for positionX', () => {
                                const positionX = 0.5;
                                const pannerNode = createPannerNode(context, { positionX });

                                expect(pannerNode.positionX.value).to.equal(positionX);
                            });

                            it('should return an instance with the given initial value for positionY', () => {
                                const positionY = 0.5;
                                const pannerNode = createPannerNode(context, { positionY });

                                expect(pannerNode.positionY.value).to.equal(positionY);
                            });

                            it('should return an instance with the given initial value for positionZ', () => {
                                const positionZ = 0.5;
                                const pannerNode = createPannerNode(context, { positionZ });

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

                            // Bug #123: Edge does not support HRTF as panningModel.
                            if (/Edge/.test(navigator.userAgent)) {

                                describe("with a panningModel of 'HRTF'", () => {

                                    it('should throw a NotSupportedError', (done) => {
                                        try {
                                            createPannerNode(context, { panningModel: 'HRTF' });
                                        } catch (err) {
                                            expect(err.code).to.equal(9);
                                            expect(err.name).to.equal('NotSupportedError');

                                            done();
                                        }
                                    });

                                });

                            }

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
                    const distanceModel = pannerNode.distanceModel = 'linear'; // eslint-disable-line no-multi-assign

                    expect(distanceModel).to.equal('linear');
                    expect(pannerNode.distanceModel).to.equal('linear');
                });

                it('should not be assignable to something else', () => {
                    const string = 'none of the accepted distanceModels';
                    const distanceModel = pannerNode.distanceModel = string; // eslint-disable-line no-multi-assign

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

            describe('orientationX', () => {

                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it('should return an instance of the AudioParam interface', () => {
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

                describe('cancelScheduledValues()', () => {

                    it('should be chainable', () => {
                        expect(pannerNode.orientationX.cancelScheduledValues(0)).to.equal(pannerNode.orientationX);
                    });

                });

                describe('exponentialRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(pannerNode.orientationX.exponentialRampToValueAtTime(1, 0)).to.equal(pannerNode.orientationX);
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
                        expect(pannerNode.orientationX.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(pannerNode.orientationX);
                    });

                });

                // @todo automation

            });

            describe('orientationY', () => {

                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it('should return an instance of the AudioParam interface', () => {
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
                        expect(pannerNode.orientationY.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(pannerNode.orientationY);
                    });

                });

                // @todo automation

            });

            describe('orientationZ', () => {

                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it('should return an instance of the AudioParam interface', () => {
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
                        expect(pannerNode.orientationZ.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(pannerNode.orientationZ);
                    });

                });

                // @todo automation

            });

            describe('panningModel', () => {

                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                // Bug #123: Edge does not support HRTF as panningModel.
                if (/Edge/.test(navigator.userAgent)) {

                    it('should not be assignable to another panningModel', (done) => {
                        try {
                            pannerNode.panningModel = 'HRTF';
                        } catch (err) {
                            expect(err.code).to.equal(9);
                            expect(err.name).to.equal('NotSupportedError');

                            done();
                        }
                    });

                } else {

                    it('should be assignable to another panningModel', () => {
                        const panningModel = pannerNode.panningModel = 'HRTF'; // eslint-disable-line no-multi-assign

                        expect(panningModel).to.equal('HRTF');
                        expect(pannerNode.panningModel).to.equal('HRTF');
                    });

                }

                it('should not be assignable to something else', () => {
                    const string = 'none of the accepted panningModels';
                    const panningModel = pannerNode.panningModel = string; // eslint-disable-line no-multi-assign

                    expect(panningModel).to.equal(string);
                    expect(pannerNode.panningModel).to.equal('equalpower');
                });

            });

            describe('positionX', () => {

                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it('should return an instance of the AudioParam interface', () => {
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
                    expect(() => {
                        pannerNode.positionX = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelScheduledValues()', () => {

                    it('should be chainable', () => {
                        expect(pannerNode.positionX.cancelScheduledValues(0)).to.equal(pannerNode.positionX);
                    });

                });

                describe('exponentialRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        // @todo Firefox can't schedule an exponential ramp when the value is 0.
                        pannerNode.positionX.value = 1;

                        expect(pannerNode.positionX.exponentialRampToValueAtTime(1, 0)).to.equal(pannerNode.positionX);
                    });

                });

                describe('linearRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(pannerNode.positionX.linearRampToValueAtTime(1, 0)).to.equal(pannerNode.positionX);
                    });

                });

                describe('setTargetAtTime()', () => {

                    it('should be chainable', () => {
                        expect(pannerNode.positionX.setTargetAtTime(1, 0, 0.1)).to.equal(pannerNode.positionX);
                    });

                });

                describe('setValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(pannerNode.positionX.setValueAtTime(1, 0)).to.equal(pannerNode.positionX);
                    });

                });

                describe('setValueCurveAtTime()', () => {

                    it('should be chainable', () => {
                        expect(pannerNode.positionX.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(pannerNode.positionX);
                    });

                });

                // @todo automation

            });

            describe('positionY', () => {

                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it('should return an instance of the AudioParam interface', () => {
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
                        expect(pannerNode.positionY.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(pannerNode.positionY);
                    });

                });

                // @todo automation

            });

            describe('positionZ', () => {

                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it('should return an instance of the AudioParam interface', () => {
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
                        expect(pannerNode.positionZ.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(pannerNode.positionZ);
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

                let pannerNode;

                beforeEach(() => {
                    pannerNode = createPannerNode(context);
                });

                it('should be chainable', () => {
                    const gainNode = new GainNode(context);

                    expect(pannerNode.connect(gainNode)).to.equal(gainNode);
                });

                it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                    const gainNode = new GainNode(context);

                    try {
                        pannerNode.connect(gainNode.gain, -1);
                    } catch (err) {
                        expect(err.code).to.equal(1);
                        expect(err.name).to.equal('IndexSizeError');

                        done();
                    }
                });

                describe('with another context', () => {

                    let anotherContext;

                    afterEach(() => {
                        if (anotherContext.close !== undefined) {
                            return anotherContext.close();
                        }
                    });

                    beforeEach(() => {
                        anotherContext = createContext();
                    });

                    it('should not be connectable to an AudioNode of that context', (done) => {
                        try {
                            pannerNode.connect(anotherContext.destination);
                        } catch (err) {
                            expect(err.code).to.equal(15);
                            expect(err.name).to.equal('InvalidAccessError');

                            done();
                        }
                    });

                    it('should not be connectable to an AudioParam of that context', (done) => {
                        const gainNode = new GainNode(anotherContext);

                        try {
                            pannerNode.connect(gainNode.gain);
                        } catch (err) {
                            expect(err.code).to.equal(15);
                            expect(err.name).to.equal('InvalidAccessError');

                            done();
                        }
                    });

                });

            });

            describe('disconnect()', () => {

                let renderer;
                let values;

                beforeEach(function () {
                    this.timeout(10000);

                    values = [ 1, 1, 1, 1, 1 ];

                    renderer = createRenderer({
                        context,
                        length: (context.length === undefined) ? 5 : undefined,
                        prepare (destination) {
                            const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                            const audioBufferSourceNode = new AudioBufferSourceNode(context);
                            const firstDummyGainNode = new GainNode(context);
                            const secondDummyGainNode = new GainNode(context);
                            const pannerNode = createPannerNode(context);

                            audioBuffer.copyToChannel(new Float32Array(values), 0);

                            audioBufferSourceNode.buffer = audioBuffer;

                            audioBufferSourceNode
                                .connect(pannerNode)
                                .connect(firstDummyGainNode)
                                .connect(destination);

                            pannerNode.connect(secondDummyGainNode);

                            return { audioBufferSourceNode, firstDummyGainNode, pannerNode, secondDummyGainNode };
                        }
                    });
                });

                it('should be possible to disconnect a destination', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ firstDummyGainNode, pannerNode }) {
                            pannerNode.disconnect(firstDummyGainNode);
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
                    this.timeout(10000);

                    return renderer({
                        prepare ({ pannerNode, secondDummyGainNode }) {
                            pannerNode.disconnect(secondDummyGainNode);
                        },
                        start (startTime, { audioBufferSourceNode }) {
                            audioBufferSourceNode.start(startTime);
                        }
                    })
                        .then((channelData) => {
                            expect(channelData[0]).to.be.closeTo(0.7071067690849304, 0.0001);
                            expect(channelData[1]).to.be.closeTo(0.7071067690849304, 0.0001);
                            expect(channelData[2]).to.be.closeTo(0.7071067690849304, 0.0001);
                            expect(channelData[3]).to.be.closeTo(0.7071067690849304, 0.0001);
                            expect(channelData[4]).to.be.closeTo(0.7071067690849304, 0.0001);
                        });
                });

                it('should be possible to disconnect all destinations by specifying the output', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ pannerNode }) {
                            pannerNode.disconnect(0);
                        },
                        start (startTime, { audioBufferSourceNode }) {
                            audioBufferSourceNode.start(startTime);
                        }
                    })
                        .then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                        });
                });

                it('should be possible to disconnect all destinations', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ pannerNode }) {
                            pannerNode.disconnect();
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

        });

    }

});
