import { ConstantSourceNode, PannerNode } from '../../src/module';
import { createAudioContext } from '../helper/create-audio-context';
import { createMinimalAudioContext } from '../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../helper/create-minimal-offline-audio-context';
import { createOfflineAudioContext } from '../helper/create-offline-audio-context';
import { createRenderer } from '../helper/create-renderer';

const testCases = {
    'a MinimalAudioContext': {
        createContext: createMinimalAudioContext
    },
    'a MinimalOfflineAudioContext': {
        createContext: createMinimalOfflineAudioContext
    },
    'an AudioContext': {
        createContext: createAudioContext
    },
    'an OfflineAudioContext': {
        createContext: createOfflineAudioContext
    }
};

describe('AudioListener', () => {
    for (const [description, { createContext }] of Object.entries(testCases)) {
        describe(`with ${description}`, () => {
            let context;

            afterEach(() => context.close?.());

            beforeEach(() => (context = createContext()));

            describe('forwardX', () => {
                let listener;

                beforeEach(() => {
                    listener = context.listener;
                });

                it('should return an implementation of the AudioParam interface', () => {
                    expect(listener.forwardX.cancelAndHoldAtTime).to.be.a('function');
                    expect(listener.forwardX.cancelScheduledValues).to.be.a('function');
                    expect(listener.forwardX.defaultValue).to.equal(0);
                    expect(listener.forwardX.exponentialRampToValueAtTime).to.be.a('function');
                    expect(listener.forwardX.linearRampToValueAtTime).to.be.a('function');
                    expect(listener.forwardX.maxValue).to.equal(3.4028234663852886e38);
                    expect(listener.forwardX.minValue).to.equal(-3.4028234663852886e38);
                    expect(listener.forwardX.setTargetAtTime).to.be.a('function');
                    expect(listener.forwardX.setValueAtTime).to.be.a('function');
                    expect(listener.forwardX.setValueCurveAtTime).to.be.a('function');
                    expect(listener.forwardX.value).to.equal(0);
                });

                it('should be readonly', () => {
                    expect(() => {
                        listener.forwardX = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelAndHoldAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.forwardX.cancelAndHoldAtTime(0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.forwardX.cancelAndHoldAtTime(0)).to.equal(listener.forwardX);
                        });
                    }
                });

                describe('cancelScheduledValues()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.forwardX.cancelScheduledValues(0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.forwardX.cancelScheduledValues(0)).to.equal(listener.forwardX);
                        });
                    }
                });

                describe('exponentialRampToValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            // @todo Firefox can't schedule an exponential ramp when the value is 0.
                            listener.forwardX.value = 1;

                            try {
                                listener.forwardX.exponentialRampToValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            // @todo Firefox can't schedule an exponential ramp when the value is 0.
                            listener.forwardX.value = 1;

                            expect(listener.forwardX.exponentialRampToValueAtTime(1, 0)).to.equal(listener.forwardX);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                listener.forwardX.exponentialRampToValueAtTime(0, 1);
                            }).to.throw(RangeError);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                listener.forwardX.exponentialRampToValueAtTime(1, -1);
                            }).to.throw(RangeError);
                        });
                    }
                });

                describe('linearRampToValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.forwardX.linearRampToValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.forwardX.linearRampToValueAtTime(1, 0)).to.equal(listener.forwardX);
                        });
                    }
                });

                describe('setTargetAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.forwardX.setTargetAtTime(1, 0, 0.1);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.forwardX.setTargetAtTime(1, 0, 0.1)).to.equal(listener.forwardX);
                        });
                    }
                });

                describe('setValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.forwardX.setValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.forwardX.setValueAtTime(1, 0)).to.equal(listener.forwardX);
                        });
                    }
                });

                describe('setValueCurveAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.forwardX.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.forwardX.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1)).to.equal(listener.forwardX);
                        });
                    }
                });

                describe('automation', () => {
                    let renderer;

                    beforeEach(function () {
                        this.timeout(10000);

                        renderer = createRenderer({
                            context,
                            length: context.length === undefined ? 5 : undefined,
                            setup(destination) {
                                const constantSourceNode = new ConstantSourceNode(context);
                                const pannerNode = new PannerNode(context, {
                                    positionX: 1,
                                    positionY: 10,
                                    positionZ: 100
                                });

                                constantSourceNode.connect(pannerNode).connect(destination);

                                return { constantSourceNode, pannerNode };
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
                                expect(channelData[0]).to.be.closeTo(0.007035539, 0.00000001);
                                expect(channelData[1]).to.be.closeTo(0.007035539, 0.00000001);
                                expect(channelData[2]).to.be.closeTo(0.007035539, 0.00000001);
                                expect(channelData[3]).to.be.closeTo(0.007035539, 0.00000001);
                                expect(channelData[4]).to.be.closeTo(0.007035539, 0.00000001);
                            });
                        });
                    });

                    describe('with a modified value', () => {
                        it('should modify the signal', function () {
                            this.timeout(10000);

                            return renderer({
                                prepare() {
                                    context.listener.forwardX.value = -1;
                                },
                                start(startTime, { constantSourceNode }) {
                                    constantSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(channelData[0]).to.be.closeTo(0.00651345, 0.00000001);
                                expect(channelData[1]).to.be.closeTo(0.00651345, 0.00000001);
                                expect(channelData[2]).to.be.closeTo(0.00651345, 0.00000001);
                                expect(channelData[3]).to.be.closeTo(0.00651345, 0.00000001);
                                expect(channelData[4]).to.be.closeTo(0.00651345, 0.00000001);
                            });
                        });
                    });
                });
            });

            describe('forwardY', () => {
                let listener;

                beforeEach(() => {
                    listener = context.listener;
                });

                it('should return an implementation of the AudioParam interface', () => {
                    expect(listener.forwardY.cancelAndHoldAtTime).to.be.a('function');
                    expect(listener.forwardY.cancelScheduledValues).to.be.a('function');
                    expect(listener.forwardY.defaultValue).to.equal(0);
                    expect(listener.forwardY.exponentialRampToValueAtTime).to.be.a('function');
                    expect(listener.forwardY.linearRampToValueAtTime).to.be.a('function');
                    expect(listener.forwardY.maxValue).to.equal(3.4028234663852886e38);
                    expect(listener.forwardY.minValue).to.equal(-3.4028234663852886e38);
                    expect(listener.forwardY.setTargetAtTime).to.be.a('function');
                    expect(listener.forwardY.setValueAtTime).to.be.a('function');
                    expect(listener.forwardY.setValueCurveAtTime).to.be.a('function');
                    expect(listener.forwardY.value).to.equal(0);
                });

                it('should be readonly', () => {
                    expect(() => {
                        listener.forwardY = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelAndHoldAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.forwardY.cancelAndHoldAtTime(0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.forwardY.cancelAndHoldAtTime(0)).to.equal(listener.forwardY);
                        });
                    }
                });

                describe('cancelScheduledValues()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.forwardY.cancelScheduledValues(0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.forwardY.cancelScheduledValues(0)).to.equal(listener.forwardY);
                        });
                    }
                });

                describe('exponentialRampToValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            // @todo Firefox can't schedule an exponential ramp when the value is 0.
                            listener.forwardY.value = 1;

                            try {
                                listener.forwardY.exponentialRampToValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            // @todo Firefox can't schedule an exponential ramp when the value is 0.
                            listener.forwardY.value = 1;

                            expect(listener.forwardY.exponentialRampToValueAtTime(1, 0)).to.equal(listener.forwardY);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                listener.forwardY.exponentialRampToValueAtTime(0, 1);
                            }).to.throw(RangeError);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                listener.forwardY.exponentialRampToValueAtTime(1, -1);
                            }).to.throw(RangeError);
                        });
                    }
                });

                describe('linearRampToValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.forwardY.linearRampToValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.forwardY.linearRampToValueAtTime(1, 0)).to.equal(listener.forwardY);
                        });
                    }
                });

                describe('setTargetAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.forwardY.setTargetAtTime(1, 0, 0.1);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.forwardY.setTargetAtTime(1, 0, 0.1)).to.equal(listener.forwardY);
                        });
                    }
                });

                describe('setValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.forwardY.setValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.forwardY.setValueAtTime(1, 0)).to.equal(listener.forwardY);
                        });
                    }
                });

                describe('setValueCurveAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.forwardY.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.forwardY.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1)).to.equal(listener.forwardY);
                        });
                    }
                });

                describe('automation', () => {
                    let renderer;

                    beforeEach(function () {
                        this.timeout(10000);

                        renderer = createRenderer({
                            context,
                            length: context.length === undefined ? 5 : undefined,
                            setup(destination) {
                                const constantSourceNode = new ConstantSourceNode(context);
                                const pannerNode = new PannerNode(context, {
                                    positionX: 1,
                                    positionY: 10,
                                    positionZ: 100
                                });

                                constantSourceNode.connect(pannerNode).connect(destination);

                                return { constantSourceNode, pannerNode };
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
                                expect(channelData[0]).to.be.closeTo(0.007035539, 0.00000001);
                                expect(channelData[1]).to.be.closeTo(0.007035539, 0.00000001);
                                expect(channelData[2]).to.be.closeTo(0.007035539, 0.00000001);
                                expect(channelData[3]).to.be.closeTo(0.007035539, 0.00000001);
                                expect(channelData[4]).to.be.closeTo(0.007035539, 0.00000001);
                            });
                        });
                    });

                    describe('with a modified value', () => {
                        it('should modify the signal', function () {
                            this.timeout(10000);

                            return renderer({
                                prepare() {
                                    context.listener.forwardY.value = -1;
                                },
                                start(startTime, { constantSourceNode }) {
                                    constantSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(channelData[0]).to.be.closeTo(0.007035482, 0.00000001);
                                expect(channelData[1]).to.be.closeTo(0.007035482, 0.00000001);
                                expect(channelData[2]).to.be.closeTo(0.007035482, 0.00000001);
                                expect(channelData[3]).to.be.closeTo(0.007035482, 0.00000001);
                                expect(channelData[4]).to.be.closeTo(0.007035482, 0.00000001);
                            });
                        });
                    });
                });
            });

            describe('forwardZ', () => {
                let listener;

                beforeEach(() => {
                    listener = context.listener;
                });

                it('should return an implementation of the AudioParam interface', () => {
                    expect(listener.forwardZ.cancelAndHoldAtTime).to.be.a('function');
                    expect(listener.forwardZ.cancelScheduledValues).to.be.a('function');
                    expect(listener.forwardZ.defaultValue).to.equal(-1);
                    expect(listener.forwardZ.exponentialRampToValueAtTime).to.be.a('function');
                    expect(listener.forwardZ.linearRampToValueAtTime).to.be.a('function');
                    expect(listener.forwardZ.maxValue).to.equal(3.4028234663852886e38);
                    expect(listener.forwardZ.minValue).to.equal(-3.4028234663852886e38);
                    expect(listener.forwardZ.setTargetAtTime).to.be.a('function');
                    expect(listener.forwardZ.setValueAtTime).to.be.a('function');
                    expect(listener.forwardZ.setValueCurveAtTime).to.be.a('function');
                    expect(listener.forwardZ.value).to.equal(-1);
                });

                it('should be readonly', () => {
                    expect(() => {
                        listener.forwardZ = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelAndHoldAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.forwardZ.cancelAndHoldAtTime(0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.forwardZ.cancelAndHoldAtTime(0)).to.equal(listener.forwardZ);
                        });
                    }
                });

                describe('cancelScheduledValues()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.forwardZ.cancelScheduledValues(0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.forwardZ.cancelScheduledValues(0)).to.equal(listener.forwardZ);
                        });
                    }
                });

                describe('exponentialRampToValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            // @todo Firefox can't schedule an exponential ramp when the value is 0.
                            listener.forwardZ.value = 1;

                            try {
                                listener.forwardZ.exponentialRampToValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            // @todo Firefox can't schedule an exponential ramp when the value is 0.
                            listener.forwardZ.value = 1;

                            expect(listener.forwardZ.exponentialRampToValueAtTime(1, 0)).to.equal(listener.forwardZ);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                listener.forwardZ.exponentialRampToValueAtTime(0, 1);
                            }).to.throw(RangeError);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                listener.forwardZ.exponentialRampToValueAtTime(1, -1);
                            }).to.throw(RangeError);
                        });
                    }
                });

                describe('linearRampToValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.forwardZ.linearRampToValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.forwardZ.linearRampToValueAtTime(1, 0)).to.equal(listener.forwardZ);
                        });
                    }
                });

                describe('setTargetAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.forwardZ.setTargetAtTime(1, 0, 0.1);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.forwardZ.setTargetAtTime(1, 0, 0.1)).to.equal(listener.forwardZ);
                        });
                    }
                });

                describe('setValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.forwardZ.setValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.forwardZ.setValueAtTime(1, 0)).to.equal(listener.forwardZ);
                        });
                    }
                });

                describe('setValueCurveAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.forwardZ.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.forwardZ.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1)).to.equal(listener.forwardZ);
                        });
                    }
                });

                describe('automation', () => {
                    let renderer;

                    beforeEach(function () {
                        this.timeout(10000);

                        renderer = createRenderer({
                            context,
                            length: context.length === undefined ? 5 : undefined,
                            setup(destination) {
                                const constantSourceNode = new ConstantSourceNode(context);
                                const pannerNode = new PannerNode(context, {
                                    positionX: 1,
                                    positionY: 10,
                                    positionZ: 100
                                });

                                // Changing only the forwardZ AudioParam while keeping the value of forwardX at 0 doesn't have an effect.
                                context.listener.forwardX.value = -1;

                                constantSourceNode.connect(pannerNode).connect(destination);

                                return { constantSourceNode, pannerNode };
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
                                expect(channelData[0]).to.be.closeTo(0.00651345, 0.00000001);
                                expect(channelData[1]).to.be.closeTo(0.00651345, 0.00000001);
                                expect(channelData[2]).to.be.closeTo(0.00651345, 0.00000001);
                                expect(channelData[3]).to.be.closeTo(0.00651345, 0.00000001);
                                expect(channelData[4]).to.be.closeTo(0.00651345, 0.00000001);
                            });
                        });
                    });

                    describe('with a modified value', () => {
                        it('should modify the signal', function () {
                            this.timeout(10000);

                            return renderer({
                                prepare() {
                                    context.listener.forwardZ.value = 1;
                                },
                                start(startTime, { constantSourceNode }) {
                                    constantSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([
                                    0.0064865294843912125, 0.0064865294843912125, 0.0064865294843912125, 0.0064865294843912125,
                                    0.0064865294843912125
                                ]);
                            });
                        });
                    });
                });
            });

            describe('positionX', () => {
                let listener;

                beforeEach(() => {
                    listener = context.listener;
                });

                it('should return an implementation of the AudioParam interface', () => {
                    expect(listener.positionX.cancelAndHoldAtTime).to.be.a('function');
                    expect(listener.positionX.cancelScheduledValues).to.be.a('function');
                    expect(listener.positionX.defaultValue).to.equal(0);
                    expect(listener.positionX.exponentialRampToValueAtTime).to.be.a('function');
                    expect(listener.positionX.linearRampToValueAtTime).to.be.a('function');
                    expect(listener.positionX.maxValue).to.equal(3.4028234663852886e38);
                    expect(listener.positionX.minValue).to.equal(-3.4028234663852886e38);
                    expect(listener.positionX.setTargetAtTime).to.be.a('function');
                    expect(listener.positionX.setValueAtTime).to.be.a('function');
                    expect(listener.positionX.setValueCurveAtTime).to.be.a('function');
                    expect(listener.positionX.value).to.equal(0);
                });

                it('should be readonly', () => {
                    expect(() => {
                        listener.positionX = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelAndHoldAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.positionX.cancelAndHoldAtTime(0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.positionX.cancelAndHoldAtTime(0)).to.equal(listener.positionX);
                        });
                    }
                });

                describe('cancelScheduledValues()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.positionX.cancelScheduledValues(0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.positionX.cancelScheduledValues(0)).to.equal(listener.positionX);
                        });
                    }
                });

                describe('exponentialRampToValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            // @todo Firefox can't schedule an exponential ramp when the value is 0.
                            listener.positionX.value = 1;

                            try {
                                listener.positionX.exponentialRampToValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            // @todo Firefox can't schedule an exponential ramp when the value is 0.
                            listener.positionX.value = 1;

                            expect(listener.positionX.exponentialRampToValueAtTime(1, 0)).to.equal(listener.positionX);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                listener.positionX.exponentialRampToValueAtTime(0, 1);
                            }).to.throw(RangeError);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                listener.positionX.exponentialRampToValueAtTime(1, -1);
                            }).to.throw(RangeError);
                        });
                    }
                });

                describe('linearRampToValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.positionX.linearRampToValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.positionX.linearRampToValueAtTime(1, 0)).to.equal(listener.positionX);
                        });
                    }
                });

                describe('setTargetAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.positionX.setTargetAtTime(1, 0, 0.1);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.positionX.setTargetAtTime(1, 0, 0.1)).to.equal(listener.positionX);
                        });
                    }
                });

                describe('setValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.positionX.setValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.positionX.setValueAtTime(1, 0)).to.equal(listener.positionX);
                        });
                    }
                });

                describe('setValueCurveAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.positionX.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.positionX.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1)).to.equal(listener.positionX);
                        });
                    }
                });

                describe('automation', () => {
                    let renderer;

                    beforeEach(function () {
                        this.timeout(10000);

                        renderer = createRenderer({
                            context,
                            length: context.length === undefined ? 5 : undefined,
                            setup(destination) {
                                const constantSourceNode = new ConstantSourceNode(context);
                                const pannerNode = new PannerNode(context, {
                                    positionX: 1,
                                    positionY: 10,
                                    positionZ: 100
                                });

                                constantSourceNode.connect(pannerNode).connect(destination);

                                return { constantSourceNode, pannerNode };
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
                                expect(channelData[0]).to.be.closeTo(0.007035539, 0.000000001);
                                expect(channelData[1]).to.be.closeTo(0.007035539, 0.000000001);
                                expect(channelData[2]).to.be.closeTo(0.007035539, 0.000000001);
                                expect(channelData[3]).to.be.closeTo(0.007035539, 0.000000001);
                                expect(channelData[4]).to.be.closeTo(0.007035539, 0.000000001);
                            });
                        });
                    });

                    describe('with a modified value', () => {
                        it('should modify the signal', function () {
                            this.timeout(10000);

                            return renderer({
                                prepare() {
                                    context.listener.positionX.value = 1;
                                },
                                start(startTime, { constantSourceNode }) {
                                    constantSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([
                                    0.007035974878817797, 0.007035974878817797, 0.007035974878817797, 0.007035974878817797,
                                    0.007035974878817797
                                ]);
                            });
                        });
                    });
                });
            });

            describe('positionY', () => {
                let listener;

                beforeEach(() => {
                    listener = context.listener;
                });

                it('should return an implementation of the AudioParam interface', () => {
                    expect(listener.positionY.cancelAndHoldAtTime).to.be.a('function');
                    expect(listener.positionY.cancelScheduledValues).to.be.a('function');
                    expect(listener.positionY.defaultValue).to.equal(0);
                    expect(listener.positionY.exponentialRampToValueAtTime).to.be.a('function');
                    expect(listener.positionY.linearRampToValueAtTime).to.be.a('function');
                    expect(listener.positionY.maxValue).to.equal(3.4028234663852886e38);
                    expect(listener.positionY.minValue).to.equal(-3.4028234663852886e38);
                    expect(listener.positionY.setTargetAtTime).to.be.a('function');
                    expect(listener.positionY.setValueAtTime).to.be.a('function');
                    expect(listener.positionY.setValueCurveAtTime).to.be.a('function');
                    expect(listener.positionY.value).to.equal(0);
                });

                it('should be readonly', () => {
                    expect(() => {
                        listener.positionY = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelAndHoldAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.positionY.cancelAndHoldAtTime(0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.positionY.cancelAndHoldAtTime(0)).to.equal(listener.positionY);
                        });
                    }
                });

                describe('cancelScheduledValues()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.positionY.cancelScheduledValues(0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.positionY.cancelScheduledValues(0)).to.equal(listener.positionY);
                        });
                    }
                });

                describe('exponentialRampToValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            // @todo Firefox can't schedule an exponential ramp when the value is 0.
                            listener.positionY.value = 1;

                            try {
                                listener.positionY.exponentialRampToValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            // @todo Firefox can't schedule an exponential ramp when the value is 0.
                            listener.positionY.value = 1;

                            expect(listener.positionY.exponentialRampToValueAtTime(1, 0)).to.equal(listener.positionY);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                listener.positionY.exponentialRampToValueAtTime(0, 1);
                            }).to.throw(RangeError);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                listener.positionY.exponentialRampToValueAtTime(1, -1);
                            }).to.throw(RangeError);
                        });
                    }
                });

                describe('linearRampToValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.positionY.linearRampToValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.positionY.linearRampToValueAtTime(1, 0)).to.equal(listener.positionY);
                        });
                    }
                });

                describe('setTargetAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.positionY.setTargetAtTime(1, 0, 0.1);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.positionY.setTargetAtTime(1, 0, 0.1)).to.equal(listener.positionY);
                        });
                    }
                });

                describe('setValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.positionY.setValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.positionY.setValueAtTime(1, 0)).to.equal(listener.positionY);
                        });
                    }
                });

                describe('setValueCurveAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.positionY.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.positionY.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1)).to.equal(listener.positionY);
                        });
                    }
                });

                describe('automation', () => {
                    let renderer;

                    beforeEach(function () {
                        this.timeout(10000);

                        renderer = createRenderer({
                            context,
                            length: context.length === undefined ? 5 : undefined,
                            setup(destination) {
                                const constantSourceNode = new ConstantSourceNode(context);
                                const pannerNode = new PannerNode(context, {
                                    positionX: 1,
                                    positionY: 10,
                                    positionZ: 100
                                });

                                constantSourceNode.connect(pannerNode).connect(destination);

                                return { constantSourceNode, pannerNode };
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
                                expect(channelData[0]).to.be.closeTo(0.007035539, 0.000000001);
                                expect(channelData[1]).to.be.closeTo(0.007035539, 0.000000001);
                                expect(channelData[2]).to.be.closeTo(0.007035539, 0.000000001);
                                expect(channelData[3]).to.be.closeTo(0.007035539, 0.000000001);
                                expect(channelData[4]).to.be.closeTo(0.007035539, 0.000000001);
                            });
                        });
                    });

                    describe('with a modified value', () => {
                        it('should modify the signal', function () {
                            this.timeout(10000);

                            return renderer({
                                prepare() {
                                    context.listener.positionY.value = 1;
                                },
                                start(startTime, { constantSourceNode }) {
                                    constantSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(channelData[0]).to.be.closeTo(0.007042165, 0.000000001);
                                expect(channelData[1]).to.be.closeTo(0.007042165, 0.000000001);
                                expect(channelData[2]).to.be.closeTo(0.007042165, 0.000000001);
                                expect(channelData[3]).to.be.closeTo(0.007042165, 0.000000001);
                                expect(channelData[4]).to.be.closeTo(0.007042165, 0.000000001);
                            });
                        });
                    });
                });
            });

            describe('positionZ', () => {
                let listener;

                beforeEach(() => {
                    listener = context.listener;
                });

                it('should return an implementation of the AudioParam interface', () => {
                    expect(listener.positionZ.cancelAndHoldAtTime).to.be.a('function');
                    expect(listener.positionZ.cancelScheduledValues).to.be.a('function');
                    expect(listener.positionZ.defaultValue).to.equal(0);
                    expect(listener.positionZ.exponentialRampToValueAtTime).to.be.a('function');
                    expect(listener.positionZ.linearRampToValueAtTime).to.be.a('function');
                    expect(listener.positionZ.maxValue).to.equal(3.4028234663852886e38);
                    expect(listener.positionZ.minValue).to.equal(-3.4028234663852886e38);
                    expect(listener.positionZ.setTargetAtTime).to.be.a('function');
                    expect(listener.positionZ.setValueAtTime).to.be.a('function');
                    expect(listener.positionZ.setValueCurveAtTime).to.be.a('function');
                    expect(listener.positionZ.value).to.equal(0);
                });

                it('should be readonly', () => {
                    expect(() => {
                        listener.positionZ = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelAndHoldAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.positionZ.cancelAndHoldAtTime(0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.positionZ.cancelAndHoldAtTime(0)).to.equal(listener.positionZ);
                        });
                    }
                });

                describe('cancelScheduledValues()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.positionZ.cancelScheduledValues(0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.positionZ.cancelScheduledValues(0)).to.equal(listener.positionZ);
                        });
                    }
                });

                describe('exponentialRampToValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            // @todo Firefox can't schedule an exponential ramp when the value is 0.
                            listener.positionZ.value = 1;

                            try {
                                listener.positionZ.exponentialRampToValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            // @todo Firefox can't schedule an exponential ramp when the value is 0.
                            listener.positionZ.value = 1;

                            expect(listener.positionZ.exponentialRampToValueAtTime(1, 0)).to.equal(listener.positionZ);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                listener.positionZ.exponentialRampToValueAtTime(0, 1);
                            }).to.throw(RangeError);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                listener.positionZ.exponentialRampToValueAtTime(1, -1);
                            }).to.throw(RangeError);
                        });
                    }
                });

                describe('linearRampToValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.positionZ.linearRampToValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.positionZ.linearRampToValueAtTime(1, 0)).to.equal(listener.positionZ);
                        });
                    }
                });

                describe('setTargetAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.positionZ.setTargetAtTime(1, 0, 0.1);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.positionZ.setTargetAtTime(1, 0, 0.1)).to.equal(listener.positionZ);
                        });
                    }
                });

                describe('setValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.positionZ.setValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.positionZ.setValueAtTime(1, 0)).to.equal(listener.positionZ);
                        });
                    }
                });

                describe('setValueCurveAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.positionZ.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.positionZ.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1)).to.equal(listener.positionZ);
                        });
                    }
                });

                describe('automation', () => {
                    let renderer;

                    beforeEach(function () {
                        this.timeout(10000);

                        renderer = createRenderer({
                            context,
                            length: context.length === undefined ? 5 : undefined,
                            setup(destination) {
                                const constantSourceNode = new ConstantSourceNode(context);
                                const pannerNode = new PannerNode(context, {
                                    positionX: 1,
                                    positionY: 10,
                                    positionZ: 100
                                });

                                constantSourceNode.connect(pannerNode).connect(destination);

                                return { constantSourceNode, pannerNode };
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
                                expect(channelData[0]).to.be.closeTo(0.007035539, 0.000000001);
                                expect(channelData[1]).to.be.closeTo(0.007035539, 0.000000001);
                                expect(channelData[2]).to.be.closeTo(0.007035539, 0.000000001);
                                expect(channelData[3]).to.be.closeTo(0.007035539, 0.000000001);
                                expect(channelData[4]).to.be.closeTo(0.007035539, 0.000000001);
                            });
                        });
                    });

                    describe('with a modified value', () => {
                        it('should modify the signal', function () {
                            this.timeout(10000);

                            return renderer({
                                prepare() {
                                    context.listener.positionZ.value = 1;
                                },
                                start(startTime, { constantSourceNode }) {
                                    constantSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(channelData[0]).to.be.closeTo(0.007105881, 0.000000002);
                                expect(channelData[1]).to.be.closeTo(0.007105881, 0.000000002);
                                expect(channelData[2]).to.be.closeTo(0.007105881, 0.000000002);
                                expect(channelData[3]).to.be.closeTo(0.007105881, 0.000000002);
                                expect(channelData[4]).to.be.closeTo(0.007105881, 0.000000002);
                            });
                        });
                    });
                });
            });

            describe('upX', () => {
                let listener;

                beforeEach(() => {
                    listener = context.listener;
                });

                it('should return an implementation of the AudioParam interface', () => {
                    expect(listener.upX.cancelAndHoldAtTime).to.be.a('function');
                    expect(listener.upX.cancelScheduledValues).to.be.a('function');
                    expect(listener.upX.defaultValue).to.equal(0);
                    expect(listener.upX.exponentialRampToValueAtTime).to.be.a('function');
                    expect(listener.upX.linearRampToValueAtTime).to.be.a('function');
                    expect(listener.upX.maxValue).to.equal(3.4028234663852886e38);
                    expect(listener.upX.minValue).to.equal(-3.4028234663852886e38);
                    expect(listener.upX.setTargetAtTime).to.be.a('function');
                    expect(listener.upX.setValueAtTime).to.be.a('function');
                    expect(listener.upX.setValueCurveAtTime).to.be.a('function');
                    expect(listener.upX.value).to.equal(0);
                });

                it('should be readonly', () => {
                    expect(() => {
                        listener.upX = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelAndHoldAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.upX.cancelAndHoldAtTime(0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.upX.cancelAndHoldAtTime(0)).to.equal(listener.upX);
                        });
                    }
                });

                describe('cancelScheduledValues()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.upX.cancelScheduledValues(0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.upX.cancelScheduledValues(0)).to.equal(listener.upX);
                        });
                    }
                });

                describe('exponentialRampToValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            // @todo Firefox can't schedule an exponential ramp when the value is 0.
                            listener.upX.value = 1;

                            try {
                                listener.upX.exponentialRampToValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            // @todo Firefox can't schedule an exponential ramp when the value is 0.
                            listener.upX.value = 1;

                            expect(listener.upX.exponentialRampToValueAtTime(1, 0)).to.equal(listener.upX);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                listener.upX.exponentialRampToValueAtTime(0, 1);
                            }).to.throw(RangeError);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                listener.upX.exponentialRampToValueAtTime(1, -1);
                            }).to.throw(RangeError);
                        });
                    }
                });

                describe('linearRampToValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.upX.linearRampToValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.upX.linearRampToValueAtTime(1, 0)).to.equal(listener.upX);
                        });
                    }
                });

                describe('setTargetAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.upX.setTargetAtTime(1, 0, 0.1);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.upX.setTargetAtTime(1, 0, 0.1)).to.equal(listener.upX);
                        });
                    }
                });

                describe('setValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.upX.setValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.upX.setValueAtTime(1, 0)).to.equal(listener.upX);
                        });
                    }
                });

                describe('setValueCurveAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.upX.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.upX.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1)).to.equal(listener.upX);
                        });
                    }
                });

                describe('automation', () => {
                    let renderer;

                    beforeEach(function () {
                        this.timeout(10000);

                        renderer = createRenderer({
                            context,
                            length: context.length === undefined ? 5 : undefined,
                            setup(destination) {
                                const constantSourceNode = new ConstantSourceNode(context);
                                const pannerNode = new PannerNode(context, {
                                    positionX: 1,
                                    positionY: 10,
                                    positionZ: 100
                                });

                                constantSourceNode.connect(pannerNode).connect(destination);

                                return { constantSourceNode, pannerNode };
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
                                expect(channelData[0]).to.be.closeTo(0.007035539, 0.000000001);
                                expect(channelData[1]).to.be.closeTo(0.007035539, 0.000000001);
                                expect(channelData[2]).to.be.closeTo(0.007035539, 0.000000001);
                                expect(channelData[3]).to.be.closeTo(0.007035539, 0.000000001);
                                expect(channelData[4]).to.be.closeTo(0.007035539, 0.000000001);
                            });
                        });
                    });

                    describe('with a modified value', () => {
                        it('should modify the signal', function () {
                            this.timeout(10000);

                            return renderer({
                                prepare() {
                                    context.listener.upX.value = 1;
                                },
                                start(startTime, { constantSourceNode }) {
                                    constantSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(channelData[0]).to.be.closeTo(0.007032075, 0.000000001);
                                expect(channelData[1]).to.be.closeTo(0.007032075, 0.000000001);
                                expect(channelData[2]).to.be.closeTo(0.007032075, 0.000000001);
                                expect(channelData[3]).to.be.closeTo(0.007032075, 0.000000001);
                                expect(channelData[4]).to.be.closeTo(0.007032075, 0.000000001);
                            });
                        });
                    });
                });
            });

            describe('upY', () => {
                let listener;

                beforeEach(() => {
                    listener = context.listener;
                });

                it('should return an implementation of the AudioParam interface', () => {
                    expect(listener.upY.cancelAndHoldAtTime).to.be.a('function');
                    expect(listener.upY.cancelScheduledValues).to.be.a('function');
                    expect(listener.upY.defaultValue).to.equal(1);
                    expect(listener.upY.exponentialRampToValueAtTime).to.be.a('function');
                    expect(listener.upY.linearRampToValueAtTime).to.be.a('function');
                    expect(listener.upY.maxValue).to.equal(3.4028234663852886e38);
                    expect(listener.upY.minValue).to.equal(-3.4028234663852886e38);
                    expect(listener.upY.setTargetAtTime).to.be.a('function');
                    expect(listener.upY.setValueAtTime).to.be.a('function');
                    expect(listener.upY.setValueCurveAtTime).to.be.a('function');
                    expect(listener.upY.value).to.equal(1);
                });

                it('should be readonly', () => {
                    expect(() => {
                        listener.upY = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelAndHoldAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.upY.cancelAndHoldAtTime(0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.upY.cancelAndHoldAtTime(0)).to.equal(listener.upY);
                        });
                    }
                });

                describe('cancelScheduledValues()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.upY.cancelScheduledValues(0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.upY.cancelScheduledValues(0)).to.equal(listener.upY);
                        });
                    }
                });

                describe('exponentialRampToValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            // @todo Firefox can't schedule an exponential ramp when the value is 0.
                            listener.upY.value = 1;

                            try {
                                listener.upY.exponentialRampToValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            // @todo Firefox can't schedule an exponential ramp when the value is 0.
                            listener.upY.value = 1;

                            expect(listener.upY.exponentialRampToValueAtTime(1, 0)).to.equal(listener.upY);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                listener.upY.exponentialRampToValueAtTime(0, 1);
                            }).to.throw(RangeError);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                listener.upY.exponentialRampToValueAtTime(1, -1);
                            }).to.throw(RangeError);
                        });
                    }
                });

                describe('linearRampToValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.upY.linearRampToValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.upY.linearRampToValueAtTime(1, 0)).to.equal(listener.upY);
                        });
                    }
                });

                describe('setTargetAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.upY.setTargetAtTime(1, 0, 0.1);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.upY.setTargetAtTime(1, 0, 0.1)).to.equal(listener.upY);
                        });
                    }
                });

                describe('setValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.upY.setValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.upY.setValueAtTime(1, 0)).to.equal(listener.upY);
                        });
                    }
                });

                describe('setValueCurveAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.upY.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.upY.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1)).to.equal(listener.upY);
                        });
                    }
                });

                describe('automation', () => {
                    let renderer;

                    beforeEach(function () {
                        this.timeout(10000);

                        renderer = createRenderer({
                            context,
                            length: context.length === undefined ? 5 : undefined,
                            setup(destination) {
                                const constantSourceNode = new ConstantSourceNode(context);
                                const pannerNode = new PannerNode(context, {
                                    positionX: 1,
                                    positionY: 10,
                                    positionZ: 100
                                });

                                // Changing only the upY AudioParam while keeping the value of upX at 0 doesn't have an effect.
                                context.listener.upX.value = 1;

                                constantSourceNode.connect(pannerNode).connect(destination);

                                return { constantSourceNode, pannerNode };
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
                                expect(channelData[0]).to.be.closeTo(0.007032075, 0.000000001);
                                expect(channelData[1]).to.be.closeTo(0.007032075, 0.000000001);
                                expect(channelData[2]).to.be.closeTo(0.007032075, 0.000000001);
                                expect(channelData[3]).to.be.closeTo(0.007032075, 0.000000001);
                                expect(channelData[4]).to.be.closeTo(0.007032075, 0.000000001);
                            });
                        });
                    });

                    describe('with a modified value', () => {
                        it('should modify the signal', function () {
                            this.timeout(10000);

                            return renderer({
                                prepare() {
                                    context.listener.upY.value = 100;
                                },
                                start(startTime, { constantSourceNode }) {
                                    constantSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([
                                    0.007035556249320507, 0.007035556249320507, 0.007035556249320507, 0.007035556249320507,
                                    0.007035556249320507
                                ]);
                            });
                        });
                    });
                });
            });

            describe('upZ', () => {
                let listener;

                beforeEach(() => {
                    listener = context.listener;
                });

                it('should return an implementation of the AudioParam interface', () => {
                    expect(listener.upZ.cancelAndHoldAtTime).to.be.a('function');
                    expect(listener.upZ.cancelScheduledValues).to.be.a('function');
                    expect(listener.upZ.defaultValue).to.equal(0);
                    expect(listener.upZ.exponentialRampToValueAtTime).to.be.a('function');
                    expect(listener.upZ.linearRampToValueAtTime).to.be.a('function');
                    expect(listener.upZ.maxValue).to.equal(3.4028234663852886e38);
                    expect(listener.upZ.minValue).to.equal(-3.4028234663852886e38);
                    expect(listener.upZ.setTargetAtTime).to.be.a('function');
                    expect(listener.upZ.setValueAtTime).to.be.a('function');
                    expect(listener.upZ.setValueCurveAtTime).to.be.a('function');
                    expect(listener.upZ.value).to.equal(0);
                });

                it('should be readonly', () => {
                    expect(() => {
                        listener.upZ = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelAndHoldAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.upZ.cancelAndHoldAtTime(0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.upZ.cancelAndHoldAtTime(0)).to.equal(listener.upZ);
                        });
                    }
                });

                describe('cancelScheduledValues()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.upZ.cancelScheduledValues(0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.upZ.cancelScheduledValues(0)).to.equal(listener.upZ);
                        });
                    }
                });

                describe('exponentialRampToValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            // @todo Firefox can't schedule an exponential ramp when the value is 0.
                            listener.upZ.value = 1;

                            try {
                                listener.upZ.exponentialRampToValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            // @todo Firefox can't schedule an exponential ramp when the value is 0.
                            listener.upZ.value = 1;

                            expect(listener.upZ.exponentialRampToValueAtTime(1, 0)).to.equal(listener.upZ);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                listener.upZ.exponentialRampToValueAtTime(0, 1);
                            }).to.throw(RangeError);
                        });

                        it('should throw a RangeError', () => {
                            expect(() => {
                                listener.upZ.exponentialRampToValueAtTime(1, -1);
                            }).to.throw(RangeError);
                        });
                    }
                });

                describe('linearRampToValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.upZ.linearRampToValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.upZ.linearRampToValueAtTime(1, 0)).to.equal(listener.upZ);
                        });
                    }
                });

                describe('setTargetAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.upZ.setTargetAtTime(1, 0, 0.1);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.upZ.setTargetAtTime(1, 0, 0.1)).to.equal(listener.upZ);
                        });
                    }
                });

                describe('setValueAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.upZ.setValueAtTime(1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.upZ.setValueAtTime(1, 0)).to.equal(listener.upZ);
                        });
                    }
                });

                describe('setValueCurveAtTime()', () => {
                    // Bug #117: Firefox does allow any AudioParam automation when using an OfflineAudioContext.
                    if (/Firefox/.test(navigator.userAgent) && description.includes('Offline')) {
                        it('should throw a NotSupportedError', (done) => {
                            try {
                                listener.upZ.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1);
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });
                    } else {
                        it('should be chainable', () => {
                            expect(listener.upZ.setValueCurveAtTime(new Float32Array([1, 0]), 0, 1)).to.equal(listener.upZ);
                        });
                    }
                });

                describe('automation', () => {
                    let renderer;

                    beforeEach(function () {
                        this.timeout(10000);

                        renderer = createRenderer({
                            context,
                            length: context.length === undefined ? 5 : undefined,
                            setup(destination) {
                                const constantSourceNode = new ConstantSourceNode(context);
                                const pannerNode = new PannerNode(context, {
                                    positionX: 1,
                                    positionY: 10,
                                    positionZ: 100
                                });

                                // Changing only the upZ AudioParam while keeping the value of upX and upY at 0 doesn't have an effect.
                                context.listener.upX.value = 1;
                                context.listener.upY.value = 100;

                                constantSourceNode.connect(pannerNode).connect(destination);

                                return { constantSourceNode, pannerNode };
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
                                expect(Array.from(channelData)).to.deep.equal([
                                    0.007035556249320507, 0.007035556249320507, 0.007035556249320507, 0.007035556249320507,
                                    0.007035556249320507
                                ]);
                            });
                        });
                    });

                    describe('with a modified value', () => {
                        it('should modify the signal', function () {
                            this.timeout(10000);

                            return renderer({
                                prepare() {
                                    context.listener.upZ.value = 1;
                                },
                                start(startTime, { constantSourceNode }) {
                                    constantSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([
                                    0.007035556249320507, 0.007035556249320507, 0.007035556249320507, 0.007035556249320507,
                                    0.007035556249320507
                                ]);
                            });
                        });
                    });
                });
            });
        });
    }
});
