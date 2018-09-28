import '../../helper/play-silence';
import { AudioBuffer, AudioBufferSourceNode, AudioWorkletNode, GainNode, StereoPannerNode, addAudioWorkletModule } from '../../../src/module';
import { BACKUP_NATIVE_CONTEXT_STORE } from '../../../src/globals';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';

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
    'constructor with a MinimalAudioContext': {
        createContext: createMinimalAudioContext,
        createStereoPannerNode: createStereoPannerNodeWithConstructor
    },
    'constructor with a MinimalOfflineAudioContext': {
        createContext: createMinimalOfflineAudioContext,
        createStereoPannerNode: createStereoPannerNodeWithConstructor
    },
    'constructor with an AudioContext': {
        createContext: createAudioContext,
        createStereoPannerNode: createStereoPannerNodeWithConstructor
    },
    'constructor with an OfflineAudioContext': {
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

// @todo Skip about 50% of the test cases when running on Travis to prevent the browsers from crashing while running the tests.
if (process.env.TRAVIS) { // eslint-disable-line no-undef
    for (const description of Object.keys(testCases)) {
        if (Math.random() < 0.5) {
            delete testCases[ description ];
        }
    }
}

describe('StereoPannerNode', () => {

    for (const [ description, { createStereoPannerNode, createContext } ] of Object.entries(testCases)) {

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

                            let stereoPannerNode;

                            beforeEach(() => {
                                stereoPannerNode = createStereoPannerNode(context);
                            });

                            it('should return an instance of the EventTarget interface', () => {
                                expect(stereoPannerNode.addEventListener).to.be.a('function');
                                expect(stereoPannerNode.dispatchEvent).to.be.a('function');
                                expect(stereoPannerNode.removeEventListener).to.be.a('function');
                            });

                            it('should return an instance of the AudioNode interface', () => {
                                expect(stereoPannerNode.channelCount).to.equal(2);
                                // Bug #105: The channelCountMode should have a default value of 'clamped-max'.
                                expect(stereoPannerNode.channelCountMode).to.equal('explicit');
                                expect(stereoPannerNode.channelInterpretation).to.equal('speakers');
                                expect(stereoPannerNode.connect).to.be.a('function');
                                expect(stereoPannerNode.context).to.be.an.instanceOf(context.constructor);
                                expect(stereoPannerNode.disconnect).to.be.a('function');
                                expect(stereoPannerNode.numberOfInputs).to.equal(1);
                                expect(stereoPannerNode.numberOfOutputs).to.equal(1);
                            });

                            it('should return an instance of the StereoPannerNode interface', () => {
                                expect(stereoPannerNode.pan).not.to.be.undefined;
                            });

                        });

                        describe('with invalid options', () => {

                            describe('with a channelCount greater than 2', () => {

                                it('should throw an NotSupportedError', (done) => {
                                    try {
                                        createStereoPannerNode(context, { channelCount: 4 });
                                    } catch (err) {
                                        expect(err.code).to.equal(9);
                                        expect(err.name).to.equal('NotSupportedError');

                                        done();
                                    }
                                });

                            });

                            /*
                             * Bug #105: The channelCountMode of 'clamped-max' should actually be the default value but it is not supported
                             * to achieve a consistent behaviour of the polyfill and the native implementation.
                             */
                            describe("with a channelCountMode of 'clamped-max'", () => {

                                it('should throw an NotSupportedError', (done) => {
                                    try {
                                        createStereoPannerNode(context, { channelCountMode: 'clamped-max' });
                                    } catch (err) {
                                        expect(err.code).to.equal(9);
                                        expect(err.name).to.equal('NotSupportedError');

                                        done();
                                    }
                                });

                            });

                            describe("with a channelCountMode of 'max'", () => {

                                it('should throw an NotSupportedError', (done) => {
                                    try {
                                        createStereoPannerNode(context, { channelCountMode: 'max' });
                                    } catch (err) {
                                        expect(err.code).to.equal(9);
                                        expect(err.name).to.equal('NotSupportedError');

                                        done();
                                    }
                                });

                            });

                        });

                        describe('with valid options', () => {

                            it('should return an instance with the given channelCount', () => {
                                const channelCount = 1;
                                const stereoPannerNode = createStereoPannerNode(context, { channelCount });

                                expect(stereoPannerNode.channelCount).to.equal(channelCount);
                            });

                            it('should return an instance with the given channelInterpretation', () => {
                                const channelInterpretation = 'discrete';
                                const stereoPannerNode = createStereoPannerNode(context, { channelInterpretation });

                                expect(stereoPannerNode.channelInterpretation).to.equal(channelInterpretation);
                            });

                            it('should return an instance with the given initial value for pan', () => {
                                const pan = 0.5;
                                const stereoPannerNode = createStereoPannerNode(context, { pan });

                                expect(stereoPannerNode.pan.value).to.equal(pan);
                            });

                        });

                    });

                }

            });

            describe('channelCount', () => {

                let stereoPannerNode;

                beforeEach(() => {
                    stereoPannerNode = createStereoPannerNode(context);
                });

                it('should be assignable to a value smaller than 3', () => {
                    const channelCount = 1;

                    stereoPannerNode.channelCount = channelCount;

                    expect(stereoPannerNode.channelCount).to.equal(1);
                });

                it('should not be assignable to a value larger than 2', (done) => {
                    const channelCount = 4;

                    try {
                        stereoPannerNode.channelCount = channelCount;
                    } catch (err) {
                        expect(err.code).to.equal(9);
                        expect(err.name).to.equal('NotSupportedError');

                        done();
                    }
                });

            });

            describe('channelCountMode', () => {

                let stereoPannerNode;

                beforeEach(() => {
                    stereoPannerNode = createStereoPannerNode(context);
                });

                // Bug #105: This is kind of a dump test right now as the default value is 'explicit' anyway.
                it("should be assignable to 'explicit'", () => {
                    const channelCountMode = 'explicit';

                    stereoPannerNode.channelCountMode = channelCountMode;

                    expect(stereoPannerNode.channelCountMode).to.equal(channelCountMode);
                });

                it("should not be assignable to 'max'", (done) => {
                    try {
                        stereoPannerNode.channelCount = 'max';
                    } catch (err) {
                        expect(err.code).to.equal(9);
                        expect(err.name).to.equal('NotSupportedError');

                        done();
                    }
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

            describe('pan', () => {

                it('should return an instance of the AudioParam interface', () => {
                    const stereoPannerNode = createStereoPannerNode(context);

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

                    it('should be chainable', () => {
                        expect(stereoPannerNode.pan.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(stereoPannerNode.pan);
                    });

                });

                describe('automation', () => {

                    for (const withAnAppendedAudioWorklet of (description.includes('Offline') ? [ true, false ] : [ false ])) {

                        describe(`${ withAnAppendedAudioWorklet ? 'with' : 'without' } an appended AudioWorklet`, () => {

                            for (const channelLayout of [ 'mono', 'stereo' ]) {

                                describe(`with a channel layout of '${ channelLayout }'`, () => {

                                    let renderer;
                                    let values;

                                    beforeEach(async function () {
                                        this.timeout(10000);

                                        values = [ 1, 0.5, 0, -0.5, -1 ];

                                        if (withAnAppendedAudioWorklet) {
                                            await addAudioWorkletModule(context, 'base/test/fixtures/gain-processor.js');
                                        }

                                        renderer = createRenderer({
                                            context,
                                            length: (context.length === undefined) ? 5 : undefined,
                                            prepare (destination) {
                                                const audioBuffer = new AudioBuffer({
                                                    length: 5,
                                                    numberOfChannels: (channelLayout === 'mono') ? 1 : 2,
                                                    sampleRate: context.sampleRate
                                                });
                                                const audioBufferSourceNode = new AudioBufferSourceNode(context);
                                                const audioWorkletNode = (withAnAppendedAudioWorklet) ? new AudioWorkletNode(context, 'gain-processor') : null;
                                                const stereoPannerNode = createStereoPannerNode(context, { channelCount: (channelLayout === 'mono') ? 1 : 2 });

                                                audioBuffer.copyToChannel(new Float32Array(values), 0);

                                                if (channelLayout === 'stereo') {
                                                    audioBuffer.copyToChannel(new Float32Array(values), 1);
                                                }

                                                audioBufferSourceNode.buffer = audioBuffer;

                                                if (withAnAppendedAudioWorklet) {
                                                    audioBufferSourceNode
                                                        .connect(stereoPannerNode)
                                                        .connect(audioWorkletNode)
                                                        .connect(destination);
                                                } else {
                                                    audioBufferSourceNode
                                                        .connect(stereoPannerNode)
                                                        .connect(destination);
                                                }

                                                return { audioBufferSourceNode, stereoPannerNode };
                                            }
                                        });
                                    });

                                    describe('without any automation', () => {

                                        it(`should ${ (channelLayout === 'mono') ? 'modify' : 'not modify' } the signal`, function () {
                                            this.timeout(10000);

                                            return renderer({
                                                start (startTime, { audioBufferSourceNode }) {
                                                    audioBufferSourceNode.start(startTime);
                                                }
                                            })
                                                .then((channelData) => {
                                                    if (channelLayout === 'mono') {
                                                        expect(channelData[0]).to.be.closeTo(0.7071067, 0.000001);
                                                        expect(channelData[1]).to.be.closeTo(0.3535533, 0.000001);
                                                        expect(channelData[2]).to.equal(0);
                                                        expect(channelData[3]).to.be.closeTo(-0.3535533, 0.000001);
                                                        expect(channelData[4]).to.be.closeTo(-0.7071067, 0.000001);
                                                    } else {
                                                        expect(channelData[0]).to.be.closeTo(1, 0.0001);
                                                        expect(channelData[1]).to.be.closeTo(0.5, 0.0001);
                                                        expect(channelData[2]).to.equal(0);
                                                        expect(channelData[3]).to.be.closeTo(-0.5, 0.0001);
                                                        expect(channelData[4]).to.be.closeTo(-1, 0.0001);
                                                    }
                                                });
                                        });

                                    });

                                    describe('with a modified value', () => {

                                        it('should modify the signal', function () {
                                            this.timeout(10000);

                                            return renderer({
                                                prepare ({ stereoPannerNode }) {
                                                    stereoPannerNode.pan.value = 0.5;
                                                },
                                                start (startTime, { audioBufferSourceNode }) {
                                                    audioBufferSourceNode.start(startTime);
                                                }
                                            })
                                                .then((channelData) => {
                                                    if (channelLayout === 'mono') {
                                                        expect(channelData[0]).to.be.closeTo(0.6532, 0.001);
                                                        expect(channelData[1]).to.be.closeTo(0.3266, 0.001);
                                                        expect(channelData[2]).to.equal(0);
                                                        expect(channelData[3]).to.be.closeTo(-0.3266, 0.001);
                                                        expect(channelData[4]).to.be.closeTo(-0.6532, 0.001);
                                                    } else {
                                                        expect(channelData[0]).to.be.closeTo(1.207106, 0.000001);
                                                        expect(channelData[1]).to.be.closeTo(0.603553, 0.000001);
                                                        expect(channelData[2]).to.equal(0);
                                                        expect(channelData[3]).to.be.closeTo(-0.603553, 0.000001);
                                                        expect(channelData[4]).to.be.closeTo(-1.207106, 0.000001);
                                                    }
                                                });
                                        });

                                    });

                                    describe('with a call to setValueAtTime()', () => {

                                        it('should modify the signal', function () {
                                            this.timeout(10000);

                                            return renderer({
                                                start (startTime, { audioBufferSourceNode, stereoPannerNode }) {
                                                    stereoPannerNode.pan.setValueAtTime(0.5, startTime + (1.9 / context.sampleRate));

                                                    audioBufferSourceNode.start(startTime);
                                                }
                                            })
                                                .then((channelData) => {
                                                    if (channelLayout === 'mono') {
                                                        expect(channelData[0]).to.be.closeTo(0.7071067, 0.000001);
                                                        expect(channelData[1]).to.be.closeTo(0.3535533, 0.000001);
                                                        expect(channelData[2]).to.equal(0);
                                                        expect(channelData[3]).to.be.closeTo(-0.3266, 0.001);
                                                        expect(channelData[4]).to.be.closeTo(-0.6532, 0.001);
                                                    } else {
                                                        expect(channelData[0]).to.be.closeTo(1, 0.0001);
                                                        expect(channelData[1]).to.be.closeTo(0.5, 0.0001);
                                                        expect(channelData[2]).to.equal(0);
                                                        expect(channelData[3]).to.be.closeTo(-0.603553, 0.000001);
                                                        expect(channelData[4]).to.be.closeTo(-1.207106, 0.000001);
                                                    }
                                                });
                                        });

                                    });

                                    describe('with a call to setValueCurveAtTime()', () => {

                                        it('should modify the signal', function () {
                                            this.timeout(10000);

                                            return renderer({
                                                start (startTime, { audioBufferSourceNode, stereoPannerNode }) {
                                                    stereoPannerNode.pan.setValueCurveAtTime(new Float32Array([ 0, 0.25, 0.5, 0.75, 1 ]), startTime, (6 / context.sampleRate));

                                                    audioBufferSourceNode.start(startTime);
                                                }
                                            })
                                                .then((channelData) => {
                                                    // @todo The implementation of Safari is different. Therefore this test only checks if the values have changed.
                                                    expect(Array.from(channelData)).to.not.deep.equal(values);
                                                });
                                        });

                                    });

                                    describe('with another AudioNode connected to the AudioParam', () => {

                                        it('should modify the signal', function () {
                                            this.timeout(10000);

                                            return renderer({
                                                prepare ({ stereoPannerNode }) {
                                                    const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                                                    const audioBufferSourceNodeForAudioParam = new AudioBufferSourceNode(context);

                                                    audioBuffer.copyToChannel(new Float32Array([ 0.5, 0.5, 0.5, 0.5, 0.5 ]), 0);

                                                    audioBufferSourceNodeForAudioParam.buffer = audioBuffer;

                                                    stereoPannerNode.pan.value = 0;

                                                    audioBufferSourceNodeForAudioParam.connect(stereoPannerNode.pan);

                                                    return { audioBufferSourceNodeForAudioParam };
                                                },
                                                start (startTime, { audioBufferSourceNode, audioBufferSourceNodeForAudioParam }) {
                                                    audioBufferSourceNode.start(startTime);
                                                    audioBufferSourceNodeForAudioParam.start(startTime);
                                                }
                                            })
                                                .then((channelData) => {
                                                    if (channelLayout === 'mono') {
                                                        expect(channelData[0]).to.be.closeTo(0.6532, 0.001);
                                                        expect(channelData[1]).to.be.closeTo(0.3266, 0.001);
                                                        expect(channelData[2]).to.equal(0);
                                                        expect(channelData[3]).to.be.closeTo(-0.3266, 0.001);
                                                        expect(channelData[4]).to.be.closeTo(-0.6532, 0.001);
                                                    } else {
                                                        expect(channelData[0]).to.be.closeTo(1.207106, 0.000001);
                                                        expect(channelData[1]).to.be.closeTo(0.603553, 0.000001);
                                                        expect(channelData[2]).to.equal(0);
                                                        expect(channelData[3]).to.be.closeTo(-0.603553, 0.000001);
                                                        expect(channelData[4]).to.be.closeTo(-1.207106, 0.000001);
                                                    }
                                                });
                                        });

                                    });

                                    // @todo Test other automations as well.

                                });

                            }

                        });

                    }

                });

            });

            describe('connect()', () => {

                let stereoPannerNode;

                beforeEach(() => {
                    stereoPannerNode = createStereoPannerNode(context);
                });

                it('should be chainable', () => {
                    const antoherStereoPannerNode = createStereoPannerNode(context);

                    expect(stereoPannerNode.connect(antoherStereoPannerNode)).to.equal(antoherStereoPannerNode);
                });

                it('should not be connectable to an AudioNode of another AudioContext', (done) => {
                    const anotherContext = createContext();

                    try {
                        stereoPannerNode.connect(anotherContext.destination);
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
                    const anotherStereoPannerNode = createStereoPannerNode(anotherContext);

                    try {
                        stereoPannerNode.connect(anotherStereoPannerNode.pan);
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
                    const anotherStereoPannerNode = createStereoPannerNode(context);

                    try {
                        stereoPannerNode.connect(anotherStereoPannerNode.pan, -1);
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
                            const firstDummyGainNode = new GainNode(context);
                            const secondDummyGainNode = new GainNode(context);
                            const stereoPannerNode = createStereoPannerNode(context);

                            audioBuffer.copyToChannel(new Float32Array(values), 0);

                            audioBufferSourceNode.buffer = audioBuffer;

                            audioBufferSourceNode
                                .connect(stereoPannerNode)
                                .connect(firstDummyGainNode)
                                .connect(destination);

                            stereoPannerNode.connect(secondDummyGainNode);

                            return { audioBufferSourceNode, firstDummyGainNode, secondDummyGainNode, stereoPannerNode };
                        }
                    });
                });

                it('should be possible to disconnect a destination', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ firstDummyGainNode, stereoPannerNode }) {
                            stereoPannerNode.disconnect(firstDummyGainNode);
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
                        prepare ({ stereoPannerNode, secondDummyGainNode }) {
                            stereoPannerNode.disconnect(secondDummyGainNode);
                        },
                        start (startTime, { audioBufferSourceNode }) {
                            audioBufferSourceNode.start(startTime);
                        }
                    })
                        .then((channelData) => {
                            expect(channelData[0]).to.be.closeTo(1, 0.0001);
                            expect(channelData[1]).to.be.closeTo(1, 0.0001);
                            expect(channelData[2]).to.be.closeTo(1, 0.0001);
                            expect(channelData[3]).to.be.closeTo(1, 0.0001);
                            expect(channelData[4]).to.be.closeTo(1, 0.0001);
                        });
                });

                it('should be possible to disconnect all destinations', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ stereoPannerNode }) {
                            stereoPannerNode.disconnect();
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
