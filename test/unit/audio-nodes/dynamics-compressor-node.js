import '../../helper/play-silence';
import { AudioBuffer, AudioBufferSourceNode, DynamicsCompressorNode, GainNode } from '../../../src/module';
import { BACKUP_NATIVE_CONTEXT_STORE } from '../../../src/globals';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
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
    'constructor with a MinimalAudioContext': {
        createContext: createMinimalAudioContext,
        createDynamicsCompressorNode: createDynamicsCompressorNodeWithConstructor
    },
    'constructor with a MinimalOfflineAudioContext': {
        createContext: createMinimalOfflineAudioContext,
        createDynamicsCompressorNode: createDynamicsCompressorNodeWithConstructor
    },
    'constructor with an AudioContext': {
        createContext: createAudioContext,
        createDynamicsCompressorNode: createDynamicsCompressorNodeWithConstructor
    },
    'constructor with an OfflineAudioContext': {
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

// @todo Skip about 50% of the test cases when running on Travis to prevent the browsers from crashing while running the tests.
if (process.env.TRAVIS) { // eslint-disable-line no-undef
    for (const description of Object.keys(testCases)) {
        if (Math.random() < 0.5) {
            delete testCases[ description ];
        }
    }
}

describe('DynamicsCompressorNode', () => {

    for (const [ description, { createDynamicsCompressorNode, createContext } ] of Object.entries(testCases)) {

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

                            let dynamicsCompressorNode;

                            beforeEach(() => {
                                dynamicsCompressorNode = createDynamicsCompressorNode(context);
                            });

                            it('should return an instance of the EventTarget interface', () => {
                                expect(dynamicsCompressorNode.addEventListener).to.be.a('function');
                                expect(dynamicsCompressorNode.dispatchEvent).to.be.a('function');
                                expect(dynamicsCompressorNode.removeEventListener).to.be.a('function');
                            });

                            it('should return an instance of the AudioNode interface', () => {
                                expect(dynamicsCompressorNode.channelCount).to.equal(2);
                                expect(dynamicsCompressorNode.channelCountMode).to.equal('clamped-max');
                                expect(dynamicsCompressorNode.channelInterpretation).to.equal('speakers');
                                expect(dynamicsCompressorNode.connect).to.be.a('function');
                                expect(dynamicsCompressorNode.context).to.be.an.instanceOf(context.constructor);
                                expect(dynamicsCompressorNode.disconnect).to.be.a('function');
                                expect(dynamicsCompressorNode.numberOfInputs).to.equal(1);
                                expect(dynamicsCompressorNode.numberOfOutputs).to.equal(1);
                            });

                            it('should return an instance of the DynamicsCompressorNode interface', () => {
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

                                expect(dynamicsCompressorNode.knee.value).to.equal(knee);
                            });

                            it('should return an instance with the given initial value for ratio', () => {
                                const ratio = 10;
                                const dynamicsCompressorNode = createDynamicsCompressorNode(context, { ratio });

                                expect(dynamicsCompressorNode.ratio.value).to.equal(ratio);
                            });

                            it('should return an instance with the given initial value for release', () => {
                                const release = 0.5;
                                const dynamicsCompressorNode = createDynamicsCompressorNode(context, { release });

                                expect(dynamicsCompressorNode.release.value).to.equal(release);
                            });

                            it('should return an instance with the given initial value for threshold', () => {
                                const threshold = -50;
                                const dynamicsCompressorNode = createDynamicsCompressorNode(context, { threshold });

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

                it('should return an instance of the AudioParam interface', () => {
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

                describe('cancelScheduledValues()', () => {

                    it('should be chainable', () => {
                        expect(dynamicsCompressorNode.attack.cancelScheduledValues(0)).to.equal(dynamicsCompressorNode.attack);
                    });

                });

                describe('exponentialRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(dynamicsCompressorNode.attack.exponentialRampToValueAtTime(1, 0)).to.equal(dynamicsCompressorNode.attack);
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

                    it('should be chainable', () => {
                        expect(dynamicsCompressorNode.attack.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(dynamicsCompressorNode.attack);
                    });

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

            describe('connect()', () => {

                let dynamicsCompressorNode;

                beforeEach(() => {
                    dynamicsCompressorNode = createDynamicsCompressorNode(context);
                });

                it('should be chainable', () => {
                    const gainNode = new GainNode(context);

                    expect(dynamicsCompressorNode.connect(gainNode)).to.equal(gainNode);
                });

                it('should not be connectable to an AudioNode of another AudioContext', (done) => {
                    const anotherContext = createContext();

                    try {
                        dynamicsCompressorNode.connect(anotherContext.destination);
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
                        dynamicsCompressorNode.connect(gainNode.gain);
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
                        dynamicsCompressorNode.connect(gainNode.gain, -1);
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

                beforeEach(function () {
                    this.timeout(10000);

                    values = [ 1, 1, 1, 1, 1 ];

                    renderer = createRenderer({
                        context,
                        length: (context.length === undefined) ? 5 : undefined,
                        prepare (destination) {
                            const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                            const audioBufferSourceNode = new AudioBufferSourceNode(context);
                            const dynamicsCompressorNode = createDynamicsCompressorNode(context);
                            const firstDummyGainNode = new GainNode(context);
                            const secondDummyGainNode = new GainNode(context);

                            audioBuffer.copyToChannel(new Float32Array(values), 0);

                            audioBufferSourceNode.buffer = audioBuffer;

                            audioBufferSourceNode
                                .connect(dynamicsCompressorNode)
                                .connect(firstDummyGainNode)
                                .connect(destination);

                            dynamicsCompressorNode.connect(secondDummyGainNode);

                            return { audioBufferSourceNode, dynamicsCompressorNode, firstDummyGainNode, secondDummyGainNode };
                        }
                    });
                });

                it('should be possible to disconnect a destination', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ dynamicsCompressorNode, firstDummyGainNode }) {
                            dynamicsCompressorNode.disconnect(firstDummyGainNode);
                        },
                        start (startTime, { audioBufferSourceNode }) {
                            // @todo Add the ability to render a buffer at on offset with an OfflineAudioContext as well.
                            audioBufferSourceNode.start((startTime === 0) ? startTime : startTime - (264 / 44100));
                        }
                    })
                        .then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                        });
                });

                /*
                 * Bug #112: Firefox and Safari do not have a tail-time.
                 * it('should be possible to disconnect another destination in isolation', function () {
                 *     this.timeout(10000);
                 *
                 *     return renderer({
                 *         prepare ({ dynamicsCompressorNode, secondDummyGainNode }) {
                 *             dynamicsCompressorNode.disconnect(secondDummyGainNode);
                 *         },
                 *         start (startTime, { audioBufferSourceNode }) {
                 *             // @todo Add the ability to render a buffer at on offset with an OfflineAudioContext as well.
                 *             audioBufferSourceNode.start((startTime === 0) ? startTime : startTime - (264 / 44100));
                 *         }
                 *     })
                 *         .then((channelData) => {
                 *             expect(Array.from(channelData)).to.deep.equal(values);
                 *         });
                 * });
                 */

                it('should be possible to disconnect all destinations by specifying the output', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ dynamicsCompressorNode }) {
                            dynamicsCompressorNode.disconnect(0);
                        },
                        start (startTime, { audioBufferSourceNode }) {
                            // @todo Add the ability to render a buffer at on offset with an OfflineAudioContext as well.
                            audioBufferSourceNode.start((startTime === 0) ? startTime : startTime - (264 / 44100));
                        }
                    })
                        .then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                        });
                });

                it('should be possible to disconnect all destinations', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ dynamicsCompressorNode }) {
                            dynamicsCompressorNode.disconnect();
                        },
                        start (startTime, { audioBufferSourceNode }) {
                            // @todo Add the ability to render a buffer at on offset with an OfflineAudioContext as well.
                            audioBufferSourceNode.start((startTime === 0) ? startTime : startTime - (264 / 44100));
                        }
                    })
                        .then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                        });
                });

            });

            describe('knee', () => {

                let dynamicsCompressorNode;

                beforeEach(() => {
                    dynamicsCompressorNode = createDynamicsCompressorNode(context);
                });

                it('should return an instance of the AudioParam interface', () => {
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

                describe('cancelScheduledValues()', () => {

                    it('should be chainable', () => {
                        expect(dynamicsCompressorNode.knee.cancelScheduledValues(0)).to.equal(dynamicsCompressorNode.knee);
                    });

                });

                describe('exponentialRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(dynamicsCompressorNode.knee.exponentialRampToValueAtTime(1, 0)).to.equal(dynamicsCompressorNode.knee);
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

                    it('should be chainable', () => {
                        expect(dynamicsCompressorNode.knee.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(dynamicsCompressorNode.knee);
                    });

                });

                // @todo automation

            });

            describe('ratio', () => {

                let dynamicsCompressorNode;

                beforeEach(() => {
                    dynamicsCompressorNode = createDynamicsCompressorNode(context);
                });

                it('should return an instance of the AudioParam interface', () => {
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

                describe('cancelScheduledValues()', () => {

                    it('should be chainable', () => {
                        expect(dynamicsCompressorNode.ratio.cancelScheduledValues(0)).to.equal(dynamicsCompressorNode.ratio);
                    });

                });

                describe('exponentialRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(dynamicsCompressorNode.ratio.exponentialRampToValueAtTime(1, 0)).to.equal(dynamicsCompressorNode.ratio);
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

                    it('should be chainable', () => {
                        expect(dynamicsCompressorNode.ratio.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(dynamicsCompressorNode.ratio);
                    });

                });

                // @todo automation

            });

            describe('release', () => {

                let dynamicsCompressorNode;

                beforeEach(() => {
                    dynamicsCompressorNode = createDynamicsCompressorNode(context);
                });

                it('should return an instance of the AudioParam interface', () => {
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

                describe('cancelScheduledValues()', () => {

                    it('should be chainable', () => {
                        expect(dynamicsCompressorNode.release.cancelScheduledValues(0)).to.equal(dynamicsCompressorNode.release);
                    });

                });

                describe('exponentialRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(dynamicsCompressorNode.release.exponentialRampToValueAtTime(1, 0)).to.equal(dynamicsCompressorNode.release);
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

                    it('should be chainable', () => {
                        expect(dynamicsCompressorNode.release.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(dynamicsCompressorNode.release);
                    });

                });

                // @todo automation

            });

            describe('threshold', () => {

                let dynamicsCompressorNode;

                beforeEach(() => {
                    dynamicsCompressorNode = createDynamicsCompressorNode(context);
                });

                it('should return an instance of the AudioParam interface', () => {
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

                describe('cancelScheduledValues()', () => {

                    it('should be chainable', () => {
                        expect(dynamicsCompressorNode.threshold.cancelScheduledValues(0)).to.equal(dynamicsCompressorNode.threshold);
                    });

                });

                describe('exponentialRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        // @todo expect(dynamicsCompressorNode.threshold.exponentialRampToValueAtTime(-1, 0)).to.equal(dynamicsCompressorNode.threshold);
                    });

                });

                describe('linearRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(dynamicsCompressorNode.threshold.linearRampToValueAtTime(-1, 0)).to.equal(dynamicsCompressorNode.threshold);
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

                    it('should be chainable', () => {
                        expect(dynamicsCompressorNode.threshold.setValueAtTime(new Float32Array([ -1 ]), 0, 0)).to.equal(dynamicsCompressorNode.threshold);
                    });

                });

                // @todo automation

            });

        });

    }

});
