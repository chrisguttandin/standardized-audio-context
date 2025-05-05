import {
    AudioBuffer,
    AudioBufferSourceNode,
    AudioWorkletNode,
    ConstantSourceNode,
    GainNode,
    IIRFilterNode,
    addAudioWorkletModule
} from '../../../src/module';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
import { createNativeAudioContext } from '../../helper/create-native-audio-context';
import { createNativeOfflineAudioContext } from '../../helper/create-native-offline-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';

const createIIRFilterNodeWithConstructor = (context, options) => {
    return new IIRFilterNode(context, options);
};
const createIIRFilterNodeWithFactoryFunction = (context, options) => {
    const iIRFilterNode = context.createIIRFilter(options.feedforward, options.feedback);

    if (options.channelCount !== undefined) {
        iIRFilterNode.channelCount = options.channelCount;
    }

    if (options.channelCountMode !== undefined) {
        iIRFilterNode.channelCountMode = options.channelCountMode;
    }

    if (options.channelInterpretation !== undefined) {
        iIRFilterNode.channelInterpretation = options.channelInterpretation;
    }

    return iIRFilterNode;
};
const testCases = {
    'constructor of a MinimalAudioContext': {
        createContext: createMinimalAudioContext,
        createIIRFilterNode: createIIRFilterNodeWithConstructor
    },
    'constructor of a MinimalOfflineAudioContext': {
        createContext: createMinimalOfflineAudioContext,
        createIIRFilterNode: createIIRFilterNodeWithConstructor
    },
    'constructor of an AudioContext': {
        createContext: createAudioContext,
        createIIRFilterNode: createIIRFilterNodeWithConstructor
    },
    'constructor of an OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createIIRFilterNode: createIIRFilterNodeWithConstructor
    },
    'factory function of an AudioContext': {
        createContext: createAudioContext,
        createIIRFilterNode: createIIRFilterNodeWithFactoryFunction
    },
    'factory function of an OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createIIRFilterNode: createIIRFilterNodeWithFactoryFunction
    }
};

if (typeof window !== 'undefined') {
    describe('IIRFilterNode', () => {
        for (const [description, { createIIRFilterNode, createContext }] of Object.entries(testCases)) {
            describe(`with the ${description}`, () => {
                let context;
                let feedback;
                let feedforward;

                afterEach(() => context.close?.());

                beforeEach(() => {
                    context = createContext();
                    feedback = [1];
                    feedforward = [1];
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

                            describe('with valid options', () => {
                                it('should return an instance of the IIRFilterNode constructor', () => {
                                    const iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });

                                    expect(iIRFilterNode).to.be.an.instanceOf(IIRFilterNode);
                                });

                                it('should return an implementation of the EventTarget interface', () => {
                                    const iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });

                                    expect(iIRFilterNode.addEventListener).to.be.a('function');
                                    expect(iIRFilterNode.dispatchEvent).to.be.a('function');
                                    expect(iIRFilterNode.removeEventListener).to.be.a('function');
                                });

                                it('should return an implementation of the AudioNode interface', () => {
                                    const iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });

                                    expect(iIRFilterNode.channelCount).to.equal(2);
                                    expect(iIRFilterNode.channelCountMode).to.equal('max');
                                    expect(iIRFilterNode.channelInterpretation).to.equal('speakers');
                                    expect(iIRFilterNode.connect).to.be.a('function');
                                    expect(iIRFilterNode.context).to.be.an.instanceOf(context.constructor);
                                    expect(iIRFilterNode.disconnect).to.be.a('function');
                                    expect(iIRFilterNode.numberOfInputs).to.equal(1);
                                    expect(iIRFilterNode.numberOfOutputs).to.equal(1);
                                });

                                it('should return an implementation of the IIRFilterNode interface', () => {
                                    const iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });

                                    expect(iIRFilterNode.getFrequencyResponse).to.be.a('function');
                                });

                                it('should return an instance with the given channelCount', () => {
                                    const channelCount = 4;
                                    const iIRFilterNode = createIIRFilterNode(context, { channelCount, feedback, feedforward });

                                    expect(iIRFilterNode.channelCount).to.equal(channelCount);
                                });

                                it('should return an instance with the given channelCountMode', () => {
                                    const channelCountMode = 'explicit';
                                    const iIRFilterNode = createIIRFilterNode(context, { channelCountMode, feedback, feedforward });

                                    expect(iIRFilterNode.channelCountMode).to.equal(channelCountMode);
                                });

                                it('should return an instance with the given channelInterpretation', () => {
                                    const channelInterpretation = 'discrete';
                                    const iIRFilterNode = createIIRFilterNode(context, { channelInterpretation, feedback, feedforward });

                                    expect(iIRFilterNode.channelInterpretation).to.equal(channelInterpretation);
                                });

                                // @todo Test that at least the plumbing works with a closed AudioContext.
                                if (audioContextState !== 'closed') {
                                    describe('rendering', () => {
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

                                                describe('with some filter coefficients', () => {
                                                    beforeEach(async function () {
                                                        this.timeout(10000);

                                                        if (withAnAppendedAudioWorklet) {
                                                            await addAudioWorkletModule(context, 'base/test/fixtures/gain-processor.js');
                                                        }

                                                        renderer = createRenderer({
                                                            context,
                                                            length: context.length === undefined ? 5 : undefined,
                                                            setup(destination) {
                                                                const audioBuffer = new AudioBuffer({
                                                                    length: 5,
                                                                    numberOfChannels: 1,
                                                                    sampleRate: context.sampleRate
                                                                });
                                                                const audioBufferSourceNode = new AudioBufferSourceNode(context);
                                                                const audioWorkletNode = withAnAppendedAudioWorklet
                                                                    ? new AudioWorkletNode(context, 'gain-processor', { channelCount: 1 })
                                                                    : null;
                                                                const iIRFilterNode = createIIRFilterNode(context, {
                                                                    feedback: [1, -0.5],
                                                                    feedforward: [1, -1]
                                                                });
                                                                const masterGainNode = new GainNode(context, {
                                                                    gain: withADirectConnection && withAnAppendedAudioWorklet ? 0.5 : 1
                                                                });

                                                                audioBuffer.copyToChannel(new Float32Array([1, 0, 0, 0, 0]), 0);
                                                                // @todo Render a second channel with the following values: 0, 1, 1 ...

                                                                audioBufferSourceNode.buffer = audioBuffer;

                                                                audioBufferSourceNode.connect(iIRFilterNode);

                                                                if (withADirectConnection) {
                                                                    iIRFilterNode.connect(masterGainNode);
                                                                }

                                                                if (withAnAppendedAudioWorklet) {
                                                                    iIRFilterNode.connect(audioWorkletNode).connect(masterGainNode);
                                                                }

                                                                masterGainNode.connect(destination);

                                                                return { audioBufferSourceNode, iIRFilterNode };
                                                            }
                                                        });
                                                    });

                                                    it('should modify the signal', function () {
                                                        this.timeout(10000);

                                                        return renderer({
                                                            start(startTime, { audioBufferSourceNode }) {
                                                                audioBufferSourceNode.start(startTime);
                                                            }
                                                        }).then((channelData) => {
                                                            expect(Array.from(channelData)).to.deep.equal([
                                                                1, -0.5, -0.25, -0.125, -0.0625
                                                            ]);
                                                            // @todo The second channel should be 0, 1, 0.5 ...
                                                        });
                                                    });
                                                });

                                                describe('with some other filter coefficients', () => {
                                                    beforeEach(async function () {
                                                        this.timeout(10000);

                                                        if (withAnAppendedAudioWorklet) {
                                                            await addAudioWorkletModule(context, 'base/test/fixtures/gain-processor.js');
                                                        }

                                                        renderer = createRenderer({
                                                            context,
                                                            length: context.length === undefined ? 5 : undefined,
                                                            setup(destination) {
                                                                const audioBuffer = new AudioBuffer({
                                                                    length: 5,
                                                                    numberOfChannels: 1,
                                                                    sampleRate: context.sampleRate
                                                                });
                                                                const audioBufferSourceNode = new AudioBufferSourceNode(context);
                                                                const audioWorkletNode = withAnAppendedAudioWorklet
                                                                    ? new AudioWorkletNode(context, 'gain-processor', { channelCount: 1 })
                                                                    : null;
                                                                const iIRFilterNode = createIIRFilterNode(context, {
                                                                    feedback: [1, 0.5],
                                                                    feedforward: [0.5, -1]
                                                                });

                                                                audioBuffer.copyToChannel(new Float32Array([1, 1, 1, 1, 1]), 0);
                                                                /*
                                                                 * @todo Render a second channel with the following values: 1, 0, 0 ...
                                                                 * @todo Render a third channel with the following values: 0, 1, 1 ...
                                                                 */

                                                                audioBufferSourceNode.buffer = audioBuffer;

                                                                if (withAnAppendedAudioWorklet) {
                                                                    audioBufferSourceNode
                                                                        .connect(iIRFilterNode)
                                                                        .connect(audioWorkletNode)
                                                                        .connect(destination);
                                                                } else {
                                                                    audioBufferSourceNode.connect(iIRFilterNode).connect(destination);
                                                                }

                                                                return { audioBufferSourceNode, iIRFilterNode };
                                                            }
                                                        });
                                                    });

                                                    it('should modify the signal', function () {
                                                        this.timeout(10000);

                                                        return renderer({
                                                            start(startTime, { audioBufferSourceNode }) {
                                                                audioBufferSourceNode.start(startTime);
                                                            }
                                                        }).then((channelData) => {
                                                            expect(Array.from(channelData)).to.deep.equal([
                                                                0.5, -0.75, -0.125, -0.4375, -0.28125
                                                            ]);
                                                            /*
                                                             * @todo The second channel should be 0.5, -1.25, 0.625 ...
                                                             * @todo The third channel should be 0, 0.5, -0.75 ...
                                                             */
                                                        });
                                                    });
                                                });
                                            });
                                        }
                                    });
                                }
                            });

                            describe('with invalid options', () => {
                                describe('without any feedback coefficients', () => {
                                    it('should throw a NotSupportedError', (done) => {
                                        try {
                                            createIIRFilterNode(context, { feedback: [], feedforward });
                                        } catch (err) {
                                            expect(err.code).to.equal(9);
                                            expect(err.name).to.equal('NotSupportedError');

                                            done();
                                        }
                                    });
                                });

                                describe('with feedback coefficients beginning with zero', () => {
                                    it('should throw an InvalidStateError', (done) => {
                                        try {
                                            createIIRFilterNode(context, { feedback: [0, 1], feedforward });
                                        } catch (err) {
                                            expect(err.code).to.equal(11);
                                            expect(err.name).to.equal('InvalidStateError');

                                            done();
                                        }
                                    });
                                });

                                describe('with too many feedback coefficients', () => {
                                    it('should throw a NotSupportedError', (done) => {
                                        try {
                                            createIIRFilterNode(context, {
                                                feedback: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                                                feedforward
                                            });
                                        } catch (err) {
                                            expect(err.code).to.equal(9);
                                            expect(err.name).to.equal('NotSupportedError');

                                            done();
                                        }
                                    });
                                });

                                describe('without any feedforward coefficients', () => {
                                    it('should throw a NotSupportedError', (done) => {
                                        try {
                                            createIIRFilterNode(context, { feedback, feedforward: [] });
                                        } catch (err) {
                                            expect(err.code).to.equal(9);
                                            expect(err.name).to.equal('NotSupportedError');

                                            done();
                                        }
                                    });
                                });

                                describe('with feedforward coefficients of only zero', () => {
                                    it('should throw an InvalidStateError', (done) => {
                                        try {
                                            createIIRFilterNode(context, { feedback, feedforward: [0] });
                                        } catch (err) {
                                            expect(err.code).to.equal(11);
                                            expect(err.name).to.equal('InvalidStateError');

                                            done();
                                        }
                                    });
                                });

                                describe('with too many feedforward coefficients', () => {
                                    it('should throw a NotSupportedError', (done) => {
                                        try {
                                            createIIRFilterNode(context, {
                                                feedback,
                                                feedforward: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
                                            });
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
                    let iIRFilterNode;

                    beforeEach(() => {
                        iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });
                    });

                    it('should be assignable to another value', () => {
                        const channelCount = 4;

                        iIRFilterNode.channelCount = channelCount;

                        expect(iIRFilterNode.channelCount).to.equal(channelCount);
                    });
                });

                describe('channelCountMode', () => {
                    let iIRFilterNode;

                    beforeEach(() => {
                        iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });
                    });

                    it('should be assignable to another value', () => {
                        const channelCountMode = 'explicit';

                        iIRFilterNode.channelCountMode = channelCountMode;

                        expect(iIRFilterNode.channelCountMode).to.equal(channelCountMode);
                    });
                });

                describe('channelInterpretation', () => {
                    let iIRFilterNode;

                    beforeEach(() => {
                        iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });
                    });

                    it('should be assignable to another value', () => {
                        const channelInterpretation = 'discrete';

                        iIRFilterNode.channelInterpretation = channelInterpretation;

                        expect(iIRFilterNode.channelInterpretation).to.equal(channelInterpretation);
                    });
                });

                describe('numberOfInputs', () => {
                    let iIRFilterNode;

                    beforeEach(() => {
                        iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });
                    });

                    it('should be readonly', () => {
                        expect(() => {
                            iIRFilterNode.numberOfInputs = 2;
                        }).to.throw(TypeError);
                    });
                });

                describe('numberOfOutputs', () => {
                    let iIRFilterNode;

                    beforeEach(() => {
                        iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });
                    });

                    it('should be readonly', () => {
                        expect(() => {
                            iIRFilterNode.numberOfOutputs = 2;
                        }).to.throw(TypeError);
                    });
                });

                describe('connect()', () => {
                    for (const type of ['AudioNode', 'AudioParam']) {
                        describe(`with an ${type}`, () => {
                            let audioNodeOrAudioParam;
                            let iIRFilterNode;

                            beforeEach(() => {
                                const gainNode = new GainNode(context);

                                audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                                iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });
                            });

                            if (type === 'AudioNode') {
                                it('should be chainable', () => {
                                    expect(iIRFilterNode.connect(audioNodeOrAudioParam)).to.equal(audioNodeOrAudioParam);
                                });
                            } else {
                                it('should not be chainable', () => {
                                    expect(iIRFilterNode.connect(audioNodeOrAudioParam)).to.be.undefined;
                                });
                            }

                            it('should accept duplicate connections', () => {
                                iIRFilterNode.connect(audioNodeOrAudioParam);
                                iIRFilterNode.connect(audioNodeOrAudioParam);
                            });

                            it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                                try {
                                    iIRFilterNode.connect(audioNodeOrAudioParam, -1);
                                } catch (err) {
                                    expect(err.code).to.equal(1);
                                    expect(err.name).to.equal('IndexSizeError');

                                    done();
                                }
                            });

                            if (type === 'AudioNode') {
                                it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                                    try {
                                        iIRFilterNode.connect(audioNodeOrAudioParam, 0, -1);
                                    } catch (err) {
                                        expect(err.code).to.equal(1);
                                        expect(err.name).to.equal('IndexSizeError');

                                        done();
                                    }
                                });

                                it('should not throw an error if the connection creates a cycle by connecting to the source', () => {
                                    audioNodeOrAudioParam.connect(iIRFilterNode).connect(audioNodeOrAudioParam);
                                });

                                it('should not throw an error if the connection creates a cycle by connecting to an AudioParam of the source', () => {
                                    audioNodeOrAudioParam.connect(iIRFilterNode).connect(audioNodeOrAudioParam.gain);
                                });
                            }
                        });

                        describe(`with an ${type} of another context`, () => {
                            let anotherContext;
                            let audioNodeOrAudioParam;
                            let iIRFilterNode;

                            afterEach(() => anotherContext.close?.());

                            beforeEach(() => {
                                anotherContext = createContext();

                                const gainNode = new GainNode(anotherContext);

                                audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                                iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });
                            });

                            it('should throw an InvalidAccessError', (done) => {
                                try {
                                    iIRFilterNode.connect(audioNodeOrAudioParam);
                                } catch (err) {
                                    expect(err.code).to.equal(15);
                                    expect(err.name).to.equal('InvalidAccessError');

                                    done();
                                }
                            });
                        });

                        describe(`with an ${type} of a native context`, () => {
                            let iIRFilterNode;
                            let nativeAudioNodeOrAudioParam;
                            let nativeContext;

                            afterEach(() => nativeContext.close?.());

                            beforeEach(() => {
                                iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });
                                nativeContext = description.includes('Offline')
                                    ? createNativeOfflineAudioContext()
                                    : createNativeAudioContext();

                                const nativeGainNode = nativeContext.createGain();

                                nativeAudioNodeOrAudioParam = type === 'AudioNode' ? nativeGainNode : nativeGainNode.gain;
                            });

                            it('should throw an InvalidAccessError', (done) => {
                                try {
                                    iIRFilterNode.connect(nativeAudioNodeOrAudioParam);
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
                                setup(destination) {
                                    const constantSourceNode = new ConstantSourceNode(context);
                                    const gainNode = new GainNode(context);
                                    const iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });

                                    constantSourceNode.connect(iIRFilterNode).connect(destination);

                                    iIRFilterNode.connect(gainNode).connect(iIRFilterNode);

                                    return { constantSourceNode, gainNode, iIRFilterNode };
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
                                setup(destination) {
                                    const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                                    const audioBufferSourceNode = new AudioBufferSourceNode(context);
                                    const firstDummyGainNode = new GainNode(context);
                                    const iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });
                                    const secondDummyGainNode = new GainNode(context);

                                    audioBuffer.copyToChannel(new Float32Array(values), 0);

                                    audioBufferSourceNode.buffer = audioBuffer;

                                    audioBufferSourceNode.connect(iIRFilterNode).connect(firstDummyGainNode).connect(destination);

                                    iIRFilterNode.connect(secondDummyGainNode);

                                    return { audioBufferSourceNode, firstDummyGainNode, iIRFilterNode, secondDummyGainNode };
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
                                prepare({ iIRFilterNode }) {
                                    iIRFilterNode.disconnect();
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
                            let iIRFilterNode;

                            beforeEach(() => {
                                iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });
                            });

                            it('should throw an IndexSizeError', (done) => {
                                try {
                                    iIRFilterNode.disconnect(-1);
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
                                    prepare({ iIRFilterNode }) {
                                        iIRFilterNode.disconnect(0);
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
                            let iIRFilterNode;

                            beforeEach(() => {
                                iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });
                            });

                            it('should throw an InvalidAccessError', (done) => {
                                try {
                                    iIRFilterNode.disconnect(new GainNode(context));
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
                                    prepare({ firstDummyGainNode, iIRFilterNode }) {
                                        iIRFilterNode.disconnect(firstDummyGainNode);
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
                                    prepare({ iIRFilterNode, secondDummyGainNode }) {
                                        iIRFilterNode.disconnect(secondDummyGainNode);
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
                        let iIRFilterNode;

                        beforeEach(() => {
                            iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });
                        });

                        it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                            try {
                                iIRFilterNode.disconnect(new GainNode(context), -1);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                        it('should throw an InvalidAccessError if there is no similar connection', (done) => {
                            try {
                                iIRFilterNode.disconnect(new GainNode(context), 0);
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });
                    });

                    describe('with a destination, an output and an input', () => {
                        let iIRFilterNode;

                        beforeEach(() => {
                            iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });
                        });

                        it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                            try {
                                iIRFilterNode.disconnect(new GainNode(context), -1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                        it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                            try {
                                iIRFilterNode.disconnect(new GainNode(context), 0, -1);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                        it('should throw an InvalidAccessError if there is no similar connection', (done) => {
                            try {
                                iIRFilterNode.disconnect(new GainNode(context), 0, 0);
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });
                    });
                });

                describe('getFrequencyResponse()', () => {
                    describe('with a frequencyHz parameter smaller as the others', () => {
                        it('should throw an InvalidAccessError', (done) => {
                            const iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });

                            try {
                                iIRFilterNode.getFrequencyResponse(new Float32Array(), new Float32Array(1), new Float32Array(1));
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });
                    });

                    describe('with a magResponse parameter smaller as the others', () => {
                        it('should throw an InvalidAccessError', (done) => {
                            const iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });

                            try {
                                iIRFilterNode.getFrequencyResponse(new Float32Array([1]), new Float32Array(0), new Float32Array(1));
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });
                    });

                    describe('with a phaseResponse parameter smaller as the others', () => {
                        it('should throw an InvalidAccessError', (done) => {
                            const iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });

                            try {
                                iIRFilterNode.getFrequencyResponse(new Float32Array([1]), new Float32Array(1), new Float32Array(0));
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });
                    });

                    describe('with valid parameters', () => {
                        describe('with some filter coefficients', () => {
                            it('should fill the magResponse and phaseResponse arrays', () => {
                                const iIRFilterNode = createIIRFilterNode(context, { feedback: [1], feedforward: [1] });
                                const magResponse = new Float32Array(5);
                                const phaseResponse = new Float32Array(5);

                                iIRFilterNode.getFrequencyResponse(
                                    new Float32Array([200, 400, 800, 1600, 3200]),
                                    magResponse,
                                    phaseResponse
                                );

                                expect(Array.from(magResponse)).to.deep.equal([1, 1, 1, 1, 1]);
                                expect(Array.from(phaseResponse)).to.deep.equal([0, 0, 0, 0, 0]);
                            });
                        });

                        describe('with some other filter coefficients', () => {
                            it('should fill the magResponse and phaseResponse arrays', () => {
                                const iIRFilterNode = createIIRFilterNode(context, { feedback: [1, -0.5], feedforward: [1, -1] });
                                const magResponse = new Float32Array(5);
                                const phaseResponse = new Float32Array(5);
                                const value = context.sampleRate / 100;

                                iIRFilterNode.getFrequencyResponse(
                                    new Float32Array([value, value * 2, value * 4, value * 8, value * 16]),
                                    magResponse,
                                    phaseResponse
                                );

                                expect(Array.from(magResponse)).to.deep.equal([
                                    0.12515009939670563, 0.2472923994064331, 0.4725210964679718, 0.8136365413665771, 1.1401270627975464
                                ]);

                                expect(phaseResponse[0]).to.equal(1.4767954349517822);
                                expect(phaseResponse[1]).to.equal(1.3842469453811646);
                                expect(phaseResponse[2]).to.equal(1.208533763885498);
                                expect(phaseResponse[3]).to.be.closeTo(0.9144487, 0.0000001);
                                expect(phaseResponse[4]).to.equal(0.5450617074966431);
                            });
                        });
                    });
                });
            });
        }
    });
}
