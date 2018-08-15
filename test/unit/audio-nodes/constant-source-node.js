import '../../helper/play-silence';
import { AudioBuffer, AudioBufferSourceNode, AudioWorkletNode, ConstantSourceNode, GainNode, addAudioWorkletModule } from '../../../src/module';
import { BACKUP_NATIVE_CONTEXT_STORE } from '../../../src/globals';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';
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
    'constructor with a MinimalAudioContext': {
        createConstantSourceNode: createConstantSourceNodeWithConstructor,
        createContext: createMinimalAudioContext
    },
    'constructor with a MinimalOfflineAudioContext': {
        createConstantSourceNode: createConstantSourceNodeWithConstructor,
        createContext: createMinimalOfflineAudioContext
    },
    'constructor with an AudioContext': {
        createConstantSourceNode: createConstantSourceNodeWithConstructor,
        createContext: createAudioContext
    },
    'constructor with an OfflineAudioContext': {
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

// @todo Skip about 50% of the test cases when running on Travis to prevent the browsers from crashing while running the tests.
if (process.env.TRAVIS) { // eslint-disable-line no-undef
    for (const description of Object.keys(testCases)) {
        if (Math.random() < 0.5) {
            delete testCases[ description ];
        }
    }
}

describe('ConstantSourceNode', () => {

    for (const [ description, { createConstantSourceNode, createContext } ] of Object.entries(testCases)) {

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

                            let constantSourceNode;

                            beforeEach(() => {
                                constantSourceNode = createConstantSourceNode(context);
                            });

                            it('should return an instance of the EventTarget interface', () => {
                                expect(constantSourceNode.addEventListener).to.be.a('function');
                                expect(constantSourceNode.dispatchEvent).to.be.a('function');
                                expect(constantSourceNode.removeEventListener).to.be.a('function');
                            });

                            it('should return an instance of the AudioNode interface', () => {
                                expect(constantSourceNode.channelCount).to.equal(2);
                                expect(constantSourceNode.channelCountMode).to.equal('max');
                                expect(constantSourceNode.channelInterpretation).to.equal('speakers');
                                expect(constantSourceNode.connect).to.be.a('function');
                                expect(constantSourceNode.context).to.be.an.instanceOf(context.constructor);
                                expect(constantSourceNode.disconnect).to.be.a('function');
                                expect(constantSourceNode.numberOfInputs).to.equal(0);
                                expect(constantSourceNode.numberOfOutputs).to.equal(1);
                            });

                            it('should return an instance of the AudioScheduledSourceNode interface', () => {
                                expect(constantSourceNode.onended).to.be.null;
                                expect(constantSourceNode.start).to.be.a('function');
                                expect(constantSourceNode.stop).to.be.a('function');
                            });

                            it('should return an instance of the ConstantSourceNode interface', () => {
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

            describe('offset', () => {

                it('should return an instance of the AudioParam interface', () => {
                    const constantSourceNode = createConstantSourceNode(context);

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
                        expect(constantSourceNode.offset.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(constantSourceNode.offset);
                    });

                });

                describe('automation', () => {

                    for (const withAnAppendedAudioWorklet of (description.includes('Offline') ? [ true, false ] : [ false ])) {

                        describe(`${ withAnAppendedAudioWorklet ? 'with' : 'without' } an appended AudioWorklet`, () => {

                            let renderer;

                            beforeEach(async function () {
                                this.timeout(10000);

                                if (withAnAppendedAudioWorklet) {
                                    await addAudioWorkletModule(context, 'base/test/fixtures/gain-processor.js');
                                }

                                renderer = createRenderer({
                                    context,
                                    length: (context.length === undefined) ? 5 : undefined,
                                    prepare (destination) {
                                        const audioWorkletNode = (withAnAppendedAudioWorklet) ? new AudioWorkletNode(context, 'gain-processor') : null;
                                        const constantSourceNode = createConstantSourceNode(context);

                                        if (withAnAppendedAudioWorklet) {
                                            constantSourceNode
                                                .connect(audioWorkletNode)
                                                .connect(destination);
                                        } else {
                                            constantSourceNode.connect(destination);
                                        }

                                        return { constantSourceNode };
                                    }
                                });
                            });

                            describe('without any automation', () => {

                                it('should not modify the signal', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        start (startTime, { constantSourceNode }) {
                                            constantSourceNode.start(startTime);
                                        }
                                    })
                                        .then((channelData) => {
                                            expect(Array.from(channelData)).to.deep.equal([ 1, 1, 1, 1, 1 ]);
                                        });
                                });

                            });

                            describe('with a modified value', () => {

                                it('should modify the signal', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        prepare ({ constantSourceNode }) {
                                            constantSourceNode.offset.value = 0.5;
                                        },
                                        start (startTime, { constantSourceNode }) {
                                            constantSourceNode.start(startTime);
                                        }
                                    })
                                        .then((channelData) => {
                                            expect(Array.from(channelData)).to.deep.equal([ 0.5, 0.5, 0.5, 0.5, 0.5 ]);
                                        });
                                });

                            });

                            describe('with a call to setValueAtTime()', () => {

                                it('should modify the signal', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        start (startTime, { constantSourceNode }) {
                                            constantSourceNode.offset.setValueAtTime(0.5, startTime + (1.9 / context.sampleRate));

                                            constantSourceNode.start(startTime);
                                        }
                                    })
                                        .then((channelData) => {
                                            expect(Array.from(channelData)).to.deep.equal([ 1, 1, 0.5, 0.5, 0.5 ]);
                                        });
                                });

                            });

                            describe('with a call to setValueCurveAtTime()', () => {

                                it('should modify the signal', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        start (startTime, { constantSourceNode }) {
                                            constantSourceNode.offset.setValueCurveAtTime(new Float32Array([ 0, 0.25, 0.5, 0.75, 1 ]), startTime, (6 / context.sampleRate));

                                            constantSourceNode.start(startTime);
                                        }
                                    })
                                        .then((channelData) => {
                                            // @todo The implementation of Safari is different. Therefore this test only checks if the values have changed.
                                            expect(Array.from(channelData)).to.not.deep.equal([ 1, 1, 1, 1, 1 ]);
                                        });
                                });

                            });

                            describe('with another AudioNode connected to the AudioParam', () => {

                                it('should modify the signal', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        prepare ({ constantSourceNode }) {
                                            const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                                            const audioBufferSourceNodeForAudioParam = new AudioBufferSourceNode(context);

                                            audioBuffer.copyToChannel(new Float32Array([ 0.5, 0.25, 0, -0.25, -0.5 ]), 0);

                                            audioBufferSourceNodeForAudioParam.buffer = audioBuffer;

                                            constantSourceNode.offset.value = 0;

                                            audioBufferSourceNodeForAudioParam.connect(constantSourceNode.offset);

                                            return { audioBufferSourceNodeForAudioParam };
                                        },
                                        start (startTime, { audioBufferSourceNodeForAudioParam, constantSourceNode }) {
                                            audioBufferSourceNodeForAudioParam.start(startTime);
                                            constantSourceNode.start(startTime);
                                        }
                                    })
                                        .then((channelData) => {
                                            expect(Array.from(channelData)).to.deep.equal([ 0.5, 0.25, 0, -0.25, -0.5 ]);
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

                it('should fire an assigned ended event listener', (done) => {
                    constantSourceNode.onended = (event) => {
                        expect(event).to.be.an.instanceOf(Event);
                        expect(event.type).to.equal('ended');

                        done();
                    };

                    constantSourceNode.connect(context.destination);

                    constantSourceNode.start();
                    constantSourceNode.stop();

                    if (context.startRendering !== undefined) {
                        context.startRendering();
                    }
                });

            });

            describe('addEventListener()', () => {

                let constantSourceNode;

                beforeEach(() => {
                    constantSourceNode = createConstantSourceNode(context, { offset: 0 });
                });

                it('should fire a registered ended event listener', (done) => {
                    constantSourceNode.addEventListener('ended', (event) => {
                        expect(event).to.be.an.instanceOf(Event);
                        expect(event.type).to.equal('ended');

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

                let constantSourceNode;

                beforeEach(() => {
                    constantSourceNode = createConstantSourceNode(context);
                });

                it('should be chainable', () => {
                    const gainNode = new GainNode(context);

                    expect(constantSourceNode.connect(gainNode)).to.equal(gainNode);
                });

                it('should not be connectable to an AudioNode of another AudioContext', (done) => {
                    const anotherContext = createContext();

                    try {
                        constantSourceNode.connect(anotherContext.destination);
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
                        constantSourceNode.connect(gainNode.gain);
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
                        constantSourceNode.connect(gainNode.gain, -1);
                    } catch (err) {
                        expect(err.code).to.equal(1);
                        expect(err.name).to.equal('IndexSizeError');

                        done();
                    }
                });

            });

            describe('disconnect()', () => {

                let renderer;

                beforeEach(function () {
                    this.timeout(10000);

                    renderer = createRenderer({
                        context,
                        length: (context.length === undefined) ? 5 : undefined,
                        prepare (destination) {
                            const constantSourceNode = createConstantSourceNode(context);
                            const firstDummyGainNode = new GainNode(context);
                            const secondDummyGainNode = new GainNode(context);

                            constantSourceNode
                                .connect(firstDummyGainNode)
                                .connect(destination);

                            constantSourceNode.connect(secondDummyGainNode);

                            return { constantSourceNode, firstDummyGainNode, secondDummyGainNode };
                        }
                    });
                });

                it('should be possible to disconnect a destination', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ constantSourceNode, firstDummyGainNode }) {
                            constantSourceNode.disconnect(firstDummyGainNode);
                        },
                        start (startTime, { constantSourceNode }) {
                            constantSourceNode.start(startTime);
                        }
                    })
                        .then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                        });
                });

                it('should be possible to disconnect another destination in isolation', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ constantSourceNode, secondDummyGainNode }) {
                            constantSourceNode.disconnect(secondDummyGainNode);
                        },
                        start (startTime, { constantSourceNode }) {
                            constantSourceNode.start(startTime);
                        }
                    })
                        .then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([ 1, 1, 1, 1, 1 ]);
                        });
                });

                it('should be possible to disconnect all destinations', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ constantSourceNode }) {
                            constantSourceNode.disconnect();
                        },
                        start (startTime, { constantSourceNode }) {
                            constantSourceNode.start(startTime);
                        }
                    })
                        .then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
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

                    it('should throw an RangeError', () => {
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

                    for (const withAnAppendedAudioWorklet of (description.includes('Offline') ? [ true, false ] : [ false ])) {

                        describe(`${ withAnAppendedAudioWorklet ? 'with' : 'without' } an appended AudioWorklet`, () => {

                            let renderer;

                            beforeEach(async function () {
                                this.timeout(10000);

                                if (withAnAppendedAudioWorklet) {
                                    await addAudioWorkletModule(context, 'base/test/fixtures/gain-processor.js');
                                }

                                renderer = createRenderer({
                                    context,
                                    length: (context.length === undefined) ? 5 : undefined,
                                    prepare (destination) {
                                        const audioWorkletNode = (withAnAppendedAudioWorklet) ? new AudioWorkletNode(context, 'gain-processor') : null;
                                        const constantSourceNode = createConstantSourceNode(context);

                                        if (withAnAppendedAudioWorklet) {
                                            constantSourceNode
                                                .connect(audioWorkletNode)
                                                .connect(destination);
                                        } else {
                                            constantSourceNode.connect(destination);
                                        }

                                        return { constantSourceNode };
                                    }
                                });
                            });

                            it('should apply the values from the last invocation', function () {
                                this.timeout(10000);

                                return renderer({
                                    start (startTime, { constantSourceNode }) {
                                        constantSourceNode.start(startTime);
                                        constantSourceNode.stop(startTime + (4.9 / context.sampleRate));
                                        constantSourceNode.stop(startTime + (2.9 / context.sampleRate));
                                    }
                                })
                                    .then((channelData) => {
                                        expect(Array.from(channelData)).to.deep.equal([ 1, 1, 1, 0, 0 ]);
                                    });
                            });

                        });

                    }

                });

                describe('with a stop time reached prior to the start time', () => {

                    for (const withAnAppendedAudioWorklet of (description.includes('Offline') ? [ true, false ] : [ false ])) {

                        describe(`${ withAnAppendedAudioWorklet ? 'with' : 'without' } an appended AudioWorklet`, () => {

                            let renderer;

                            beforeEach(async function () {
                                this.timeout(10000);

                                if (withAnAppendedAudioWorklet) {
                                    await addAudioWorkletModule(context, 'base/test/fixtures/gain-processor.js');
                                }

                                renderer = createRenderer({
                                    context,
                                    length: (context.length === undefined) ? 5 : undefined,
                                    prepare (destination) {
                                        const audioWorkletNode = (withAnAppendedAudioWorklet) ? new AudioWorkletNode(context, 'gain-processor') : null;
                                        const constantSourceNode = createConstantSourceNode(context);

                                        if (withAnAppendedAudioWorklet) {
                                            constantSourceNode
                                                .connect(audioWorkletNode)
                                                .connect(destination);
                                        } else {
                                            constantSourceNode.connect(destination);
                                        }

                                        return { constantSourceNode };
                                    }
                                });
                            });

                            it('should not play anything', function () {
                                this.timeout(10000);

                                return renderer({
                                    start (startTime, { constantSourceNode }) {
                                        constantSourceNode.start(startTime + (2.9 / context.sampleRate));
                                        constantSourceNode.stop(startTime + (0.9 / context.sampleRate));
                                    }
                                })
                                    .then((channelData) => {
                                        expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
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

                    it('should throw an RangeError', () => {
                        expect(() => {
                            constantSourceNode.stop(-1);
                        }).to.throw(RangeError);
                    });

                });

            });

        });

    }

});
