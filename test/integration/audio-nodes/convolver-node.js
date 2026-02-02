import {
    AudioBuffer,
    AudioBufferSourceNode,
    AudioWorkletNode,
    ConstantSourceNode,
    ConvolverNode,
    GainNode,
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

const createConvolverNodeWithConstructor = (context, options = null) => {
    if (options === null) {
        return new ConvolverNode(context);
    }

    return new ConvolverNode(context, options);
};
const createConvolverNodeWithFactoryFunction = (context, options = null) => {
    const convolverNode = context.createConvolver();

    if (options !== null && options.buffer !== undefined) {
        convolverNode.buffer = options.buffer;
    }

    if (options !== null && options.channelCount !== undefined) {
        convolverNode.channelCount = options.channelCount;
    }

    if (options !== null && options.channelCountMode !== undefined) {
        convolverNode.channelCountMode = options.channelCountMode;
    }

    if (options !== null && options.channelInterpretation !== undefined) {
        convolverNode.channelInterpretation = options.channelInterpretation;
    }

    if (options !== null && options.disableNormalization !== undefined) {
        convolverNode.normalize = !options.disableNormalization;
    }

    return convolverNode;
};
const testCases = {
    'constructor of a MinimalAudioContext': {
        createContext: createMinimalAudioContext,
        createConvolverNode: createConvolverNodeWithConstructor
    },
    'constructor of a MinimalOfflineAudioContext': {
        createContext: createMinimalOfflineAudioContext,
        createConvolverNode: createConvolverNodeWithConstructor
    },
    'constructor of an AudioContext': {
        createContext: createAudioContext,
        createConvolverNode: createConvolverNodeWithConstructor
    },
    'constructor of an OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createConvolverNode: createConvolverNodeWithConstructor
    },
    'factory function of an AudioContext': {
        createContext: createAudioContext,
        createConvolverNode: createConvolverNodeWithFactoryFunction
    },
    'factory function of an OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createConvolverNode: createConvolverNodeWithFactoryFunction
    }
};

describe('ConvolverNode', { skip: typeof window === 'undefined' }, () => {
    describe.for(Object.entries(testCases))('with the %s', ([description, { createContext, createConvolverNode }]) => {
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
                    let convolverNode;

                    beforeEach(() => {
                        convolverNode = createConvolverNode(context);
                    });

                    it('should return an instance of the ConvolverNode constructor', () => {
                        expect(convolverNode).to.be.an.instanceOf(ConvolverNode);
                    });

                    it('should return an implementation of the EventTarget interface', () => {
                        expect(convolverNode.addEventListener).to.be.a('function');
                        expect(convolverNode.dispatchEvent).to.be.a('function');
                        expect(convolverNode.removeEventListener).to.be.a('function');
                    });

                    it('should return an implementation of the AudioNode interface', () => {
                        expect(convolverNode.channelCount).to.equal(2);
                        expect(convolverNode.channelCountMode).to.equal('clamped-max');
                        expect(convolverNode.channelInterpretation).to.equal('speakers');
                        expect(convolverNode.connect).to.be.a('function');
                        expect(convolverNode.context).to.be.an.instanceOf(context.constructor);
                        expect(convolverNode.disconnect).to.be.a('function');
                        expect(convolverNode.numberOfInputs).to.equal(1);
                        expect(convolverNode.numberOfOutputs).to.equal(1);
                    });

                    it('should return an implementation of the ConvolverNode interface', () => {
                        expect(convolverNode.buffer).to.be.null;
                        expect(convolverNode.normalize).to.be.true;
                    });
                });

                describe('with valid options', () => {
                    it('should return an instance with the given buffer', () => {
                        const audioBuffer = new AudioBuffer({ length: 1, sampleRate: context.sampleRate });
                        const convolverNode = createConvolverNode(context, { buffer: audioBuffer });

                        expect(convolverNode.buffer).to.equal(audioBuffer);
                    });

                    it('should return an instance without a buffer', () => {
                        const buffer = null;
                        const convolverNode = createConvolverNode(context, { buffer });

                        expect(convolverNode.buffer).to.equal(buffer);
                    });

                    it('should return an instance with the given channelCount', () => {
                        const channelCount = 1;
                        const convolverNode = createConvolverNode(context, { channelCount });

                        expect(convolverNode.channelCount).to.equal(channelCount);
                    });

                    it('should return an instance with the given channelCountMode', () => {
                        const channelCountMode = 'explicit';
                        const convolverNode = createConvolverNode(context, { channelCountMode });

                        expect(convolverNode.channelCountMode).to.equal(channelCountMode);
                    });

                    it('should return an instance with the given channelInterpretation', () => {
                        const channelInterpretation = 'discrete';
                        const convolverNode = createConvolverNode(context, { channelInterpretation });

                        expect(convolverNode.channelInterpretation).to.equal(channelInterpretation);
                    });

                    it('should return an instance with the negated value of disableNormalization as normalize', () => {
                        const disableNormalization = true;
                        const convolverNode = createConvolverNode(context, { disableNormalization });

                        expect(convolverNode.normalize).to.equal(!disableNormalization);
                    });
                });

                describe('with invalid options', () => {
                    describe('with a channelCount greater than 2', () => {
                        it('should throw a NotSupportedError', () => {
                            expect(() => createConvolverNode(context, { channelCount: 4 }))
                                .to.throw(DOMException)
                                .to.include({ code: 9, name: 'NotSupportedError' });
                        });
                    });

                    describe("with a channelCountMode of 'max'", () => {
                        it('should throw a NotSupportedError', () => {
                            expect(() => createConvolverNode(context, { channelCountMode: 'max' }))
                                .to.throw(DOMException)
                                .to.include({ code: 9, name: 'NotSupportedError' });
                        });
                    });

                    describe('with a buffer with an unsupported numberOfChannels', () => {
                        let audioBuffer;

                        beforeEach(() => {
                            audioBuffer = new AudioBuffer({ length: 1, numberOfChannels: 3, sampleRate: context.sampleRate });
                        });

                        it('should throw a NotSupportedError', () => {
                            expect(() => createConvolverNode(context, { buffer: audioBuffer }))
                                .to.throw(DOMException)
                                .to.include({ code: 9, name: 'NotSupportedError' });
                        });
                    });

                    describe('with a buffer with a different sampleRate', () => {
                        let audioBuffer;

                        beforeEach(() => {
                            audioBuffer = new AudioBuffer({
                                length: 1,
                                numberOfChannels: 3,
                                sampleRate: context.sampleRate / 2
                            });
                        });

                        it('should throw a NotSupportedError', () => {
                            expect(() => createConvolverNode(context, { buffer: audioBuffer }))
                                .to.throw(DOMException)
                                .to.include({ code: 9, name: 'NotSupportedError' });
                        });
                    });
                });
            });
        });

        describe('buffer', () => {
            for (const assignment of ['with', 'without']) {
                describe(`${assignment} a previously assigned AudioBuffer`, () => {
                    let convolverNode;

                    beforeEach(() => {
                        convolverNode = createConvolverNode(context);

                        if (assignment === 'with') {
                            convolverNode.buffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                        }
                    });

                    it('should be assignable to null', () => {
                        convolverNode.buffer = null;

                        expect(convolverNode.buffer).to.be.null;
                    });

                    describe('with a supported buffer', () => {
                        let audioBuffer;

                        beforeEach(() => {
                            audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                        });

                        it('should be assignable', () => {
                            convolverNode.buffer = audioBuffer;

                            expect(convolverNode.buffer).to.equal(audioBuffer);
                        });
                    });

                    describe('with a buffer with an unsupported numberOfChannels', () => {
                        let audioBuffer;

                        beforeEach(() => {
                            audioBuffer = new AudioBuffer({ length: 5, numberOfChannels: 5, sampleRate: context.sampleRate });
                        });

                        it('should throw a NotSupportedError', () => {
                            expect(() => {
                                convolverNode.buffer = audioBuffer;
                            })
                                .to.throw(DOMException)
                                .to.include({ code: 9, name: 'NotSupportedError' });
                        });
                    });

                    describe('with a buffer with a different sampleRate', () => {
                        let audioBuffer;

                        beforeEach(() => {
                            audioBuffer = new AudioBuffer({ length: 5, numberOfChannels: 5, sampleRate: context.sampleRate * 2 });
                        });

                        it('should throw a NotSupportedError', () => {
                            expect(() => {
                                convolverNode.buffer = audioBuffer;
                            })
                                .to.throw(DOMException)
                                .to.include({ code: 9, name: 'NotSupportedError' });
                        });
                    });
                });
            }

            describe('with a nullified AudioBuffer', () => {
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

                        beforeEach(async () => {
                            if (withAnAppendedAudioWorklet) {
                                await addAudioWorkletModule(context, 'test/fixtures/gain-processor.js');
                            }

                            renderer = createRenderer({
                                context,
                                length: context.length === undefined ? 5 : undefined,
                                setup(destination) {
                                    const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                                    const audioBufferSourceNode = new AudioBufferSourceNode(context);
                                    const audioWorkletNode = withAnAppendedAudioWorklet
                                        ? new AudioWorkletNode(context, 'gain-processor', { channelCount: 1 })
                                        : null;
                                    const convolverNode = createConvolverNode(context, { disableNormalization: true });
                                    const masterGainNode = new GainNode(context, {
                                        gain: withADirectConnection && withAnAppendedAudioWorklet ? 0.5 : 1
                                    });

                                    audioBuffer.copyToChannel(new Float32Array([1, 1, 1, 1, 1]), 0);

                                    audioBufferSourceNode.buffer = audioBuffer;

                                    const convolverBuffer = new AudioBuffer({ length: 1, sampleRate: context.sampleRate });

                                    convolverBuffer.copyToChannel(new Float32Array([0.8]), 0);

                                    convolverNode.buffer = convolverBuffer;
                                    convolverNode.buffer = null;

                                    audioBufferSourceNode.connect(convolverNode);

                                    if (withADirectConnection) {
                                        convolverNode.connect(masterGainNode);
                                    }

                                    if (withAnAppendedAudioWorklet) {
                                        convolverNode.connect(audioWorkletNode).connect(masterGainNode);
                                    }

                                    masterGainNode.connect(destination);

                                    return { audioBufferSourceNode, convolverNode };
                                }
                            });
                        });

                        it('should render silence', () => {
                            return renderer({
                                start(startTime, { audioBufferSourceNode }) {
                                    audioBufferSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                            });
                        });
                    });
                }
            });

            describe('with a reassigned AudioBuffer', () => {
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

                        beforeEach(async () => {
                            if (withAnAppendedAudioWorklet) {
                                await addAudioWorkletModule(context, 'test/fixtures/gain-processor.js');
                            }

                            renderer = createRenderer({
                                context,
                                length: context.length === undefined ? 5 : undefined,
                                setup(destination) {
                                    const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                                    const audioBufferSourceNode = new AudioBufferSourceNode(context);
                                    const audioWorkletNode = withAnAppendedAudioWorklet
                                        ? new AudioWorkletNode(context, 'gain-processor', { channelCount: 1 })
                                        : null;
                                    const convolverNode = createConvolverNode(context, { disableNormalization: true });
                                    const masterGainNode = new GainNode(context, {
                                        gain: withADirectConnection && withAnAppendedAudioWorklet ? 0.5 : 1
                                    });

                                    audioBuffer.copyToChannel(new Float32Array([1, 1, 1, 1, 1]), 0);

                                    audioBufferSourceNode.buffer = audioBuffer;

                                    const convolverBuffer = new AudioBuffer({ length: 1, sampleRate: context.sampleRate });

                                    convolverBuffer.copyToChannel(new Float32Array([0.8]), 0);

                                    convolverNode.buffer = convolverBuffer;

                                    const reassignedConvolverBuffer = new AudioBuffer({
                                        length: 1,
                                        numberOfChannels: 1,
                                        sampleRate: context.sampleRate
                                    });

                                    reassignedConvolverBuffer.copyToChannel(new Float32Array([0.5]), 0);

                                    convolverNode.buffer = reassignedConvolverBuffer;

                                    audioBufferSourceNode.connect(convolverNode);

                                    if (withADirectConnection) {
                                        convolverNode.connect(masterGainNode);
                                    }

                                    if (withAnAppendedAudioWorklet) {
                                        convolverNode.connect(audioWorkletNode).connect(masterGainNode);
                                    }

                                    masterGainNode.connect(destination);

                                    return { audioBufferSourceNode, convolverNode };
                                }
                            });
                        });

                        it('should apply the reassigned AudioBuffer', () => {
                            return renderer({
                                start(startTime, { audioBufferSourceNode }) {
                                    audioBufferSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([0.5, 0.5, 0.5, 0.5, 0.5]);
                            });
                        });
                    });
                }
            });
        });

        describe('channelCount', () => {
            let convolverNode;

            beforeEach(() => {
                convolverNode = createConvolverNode(context);
            });

            it('should be assignable to a value smaller than 3', () => {
                const channelCount = 1;

                convolverNode.channelCount = channelCount;

                expect(convolverNode.channelCount).to.equal(channelCount);
            });

            it('should not be assignable to a value larger than 2', () => {
                const channelCount = 4;

                expect(() => {
                    convolverNode.channelCount = channelCount;
                })
                    .to.throw(DOMException)
                    .to.include({ code: 9, name: 'NotSupportedError' });
            });
        });

        describe('channelCountMode', () => {
            let convolverNode;

            beforeEach(() => {
                convolverNode = createConvolverNode(context);
            });

            it("should be assignable to 'explicit'", () => {
                const channelCountMode = 'explicit';

                convolverNode.channelCountMode = channelCountMode;

                expect(convolverNode.channelCountMode).to.equal(channelCountMode);
            });

            it("should not be assignable to 'max'", () => {
                expect(() => {
                    convolverNode.channelCountMode = 'max';
                })
                    .to.throw(DOMException)
                    .to.include({ code: 9, name: 'NotSupportedError' });
            });
        });

        describe('channelInterpretation', () => {
            let convolverNode;

            beforeEach(() => {
                convolverNode = createConvolverNode(context);
            });

            it('should be assignable to another value', () => {
                const channelInterpretation = 'discrete';

                convolverNode.channelInterpretation = channelInterpretation;

                expect(convolverNode.channelInterpretation).to.equal(channelInterpretation);
            });
        });

        describe('normalize', () => {
            let convolverNode;

            beforeEach(() => {
                convolverNode = createConvolverNode(context);
            });

            it('should be assignable to the negated value', () => {
                const normalize = !convolverNode.normalize;

                convolverNode.normalize = normalize;

                expect(convolverNode.normalize).to.equal(normalize);
            });

            it('should not be assignable to something else', () => {
                const string = 'not a boolean';
                const normalize = (convolverNode.normalize = string); // eslint-disable-line no-multi-assign

                expect(normalize).to.equal(string);
                expect(convolverNode.normalize).to.be.true;
            });
        });

        describe('numberOfInputs', () => {
            let convolverNode;

            beforeEach(() => {
                convolverNode = createConvolverNode(context);
            });

            it('should be readonly', () => {
                expect(() => {
                    convolverNode.numberOfInputs = 2;
                }).to.throw(TypeError);
            });
        });

        describe('numberOfOutputs', () => {
            let convolverNode;

            beforeEach(() => {
                convolverNode = createConvolverNode(context);
            });

            it('should be readonly', () => {
                expect(() => {
                    convolverNode.numberOfOutputs = 2;
                }).to.throw(TypeError);
            });
        });

        describe('connect()', () => {
            describe.for(['AudioNode', 'AudioParam'])('with an %s', (type) => {
                let audioNodeOrAudioParam;
                let convolverNode;

                beforeEach(() => {
                    const gainNode = new GainNode(context);

                    audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                    convolverNode = createConvolverNode(context);
                });

                if (type === 'AudioNode') {
                    it('should be chainable', () => {
                        expect(convolverNode.connect(audioNodeOrAudioParam)).to.equal(audioNodeOrAudioParam);
                    });
                } else {
                    it('should not be chainable', () => {
                        expect(convolverNode.connect(audioNodeOrAudioParam)).to.be.undefined;
                    });
                }

                it('should accept duplicate connections', () => {
                    convolverNode.connect(audioNodeOrAudioParam);
                    convolverNode.connect(audioNodeOrAudioParam);
                });

                it('should throw an IndexSizeError if the output is out-of-bound', () => {
                    expect(() => convolverNode.connect(audioNodeOrAudioParam, -1))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                if (type === 'AudioNode') {
                    it('should throw an IndexSizeError if the input is out-of-bound', () => {
                        expect(() => convolverNode.connect(audioNodeOrAudioParam, 0, -1))
                            .to.throw(DOMException)
                            .to.include({ code: 1, name: 'IndexSizeError' });
                    });

                    it('should not throw an error if the connection creates a cycle by connecting to the source', () => {
                        audioNodeOrAudioParam.connect(convolverNode).connect(audioNodeOrAudioParam);
                    });

                    it('should not throw an error if the connection creates a cycle by connecting to an AudioParam of the source', () => {
                        audioNodeOrAudioParam.connect(convolverNode).connect(audioNodeOrAudioParam.gain);
                    });
                }
            });

            describe.for(['AudioNode', 'AudioParam'])('with an %s of another context', (type) => {
                let anotherContext;
                let audioNodeOrAudioParam;
                let convolverNode;

                afterEach(() => anotherContext.close?.());

                beforeEach(() => {
                    anotherContext = createContext();

                    const gainNode = new GainNode(anotherContext);

                    audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                    convolverNode = createConvolverNode(context);
                });

                it('should throw an InvalidAccessError', () => {
                    expect(() => convolverNode.connect(audioNodeOrAudioParam))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });

            describe.for(['AudioNode', 'AudioParam'])('with an %s of a native context', (type) => {
                let convolverNode;
                let nativeAudioNodeOrAudioParam;
                let nativeContext;

                afterEach(() => nativeContext.close?.());

                beforeEach(() => {
                    convolverNode = createConvolverNode(context);
                    nativeContext = description.includes('Offline') ? createNativeOfflineAudioContext() : createNativeAudioContext();

                    const nativeGainNode = nativeContext.createGain();

                    nativeAudioNodeOrAudioParam = type === 'AudioNode' ? nativeGainNode : nativeGainNode.gain;
                });

                it('should throw an InvalidAccessError', () => {
                    expect(() => convolverNode.connect(nativeAudioNodeOrAudioParam))
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
                            const convolverNode = createConvolverNode(context);
                            const gainNode = new GainNode(context);

                            constantSourceNode.connect(convolverNode).connect(destination);

                            convolverNode.connect(gainNode).connect(convolverNode);

                            return { constantSourceNode, convolverNode, gainNode };
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
                            const convolverNode = createConvolverNode(context, { disableNormalization: true });
                            const firstDummyGainNode = new GainNode(context);
                            const secondDummyGainNode = new GainNode(context);

                            audioBuffer.copyToChannel(new Float32Array(values), 0);

                            audioBufferSourceNode.buffer = audioBuffer;

                            const convolverBuffer = new AudioBuffer({ length: 1, sampleRate: context.sampleRate });

                            convolverBuffer.copyToChannel(new Float32Array([0.8]), 0);

                            convolverNode.buffer = convolverBuffer;

                            audioBufferSourceNode.connect(convolverNode).connect(firstDummyGainNode).connect(destination);

                            convolverNode.connect(secondDummyGainNode);

                            return { audioBufferSourceNode, convolverNode, firstDummyGainNode, secondDummyGainNode };
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
                        prepare({ convolverNode }) {
                            convolverNode.disconnect();
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
                    let convolverNode;

                    beforeEach(() => {
                        convolverNode = createConvolverNode(context);
                    });

                    it('should throw an IndexSizeError', () => {
                        expect(() => convolverNode.disconnect(-1))
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
                            prepare({ convolverNode }) {
                                convolverNode.disconnect(0);
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
                    let convolverNode;

                    beforeEach(() => {
                        convolverNode = createConvolverNode(context);
                    });

                    it('should throw an InvalidAccessError', () => {
                        expect(() => convolverNode.disconnect(new GainNode(context)))
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
                            prepare({ convolverNode, firstDummyGainNode }) {
                                convolverNode.disconnect(firstDummyGainNode);
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
                            prepare({ convolverNode, secondDummyGainNode }) {
                                convolverNode.disconnect(secondDummyGainNode);
                            },
                            start(startTime, { audioBufferSourceNode }) {
                                audioBufferSourceNode.start(startTime);
                            }
                        }).then((channelData) => {
                            expect(channelData[0]).to.be.closeTo(0.8, 0.00001);
                            expect(channelData[1]).to.be.closeTo(0.8, 0.00001);
                            expect(channelData[2]).to.be.closeTo(0.8, 0.00001);
                            expect(channelData[3]).to.be.closeTo(0.8, 0.00001);
                            expect(channelData[4]).to.be.closeTo(0.8, 0.00001);
                        });
                    });
                });
            });

            describe('with a destination and an output', () => {
                let convolverNode;

                beforeEach(() => {
                    convolverNode = createConvolverNode(context);
                });

                it('should throw an IndexSizeError if the output is out-of-bound', () => {
                    expect(() => convolverNode.disconnect(new GainNode(context), -1))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                it('should throw an InvalidAccessError if there is no similar connection', () => {
                    expect(() => convolverNode.disconnect(new GainNode(context), 0))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });

            describe('with a destination, an output and an input', () => {
                let convolverNode;

                beforeEach(() => {
                    convolverNode = createConvolverNode(context);
                });

                it('should throw an IndexSizeError if the output is out-of-bound', () => {
                    expect(() => convolverNode.disconnect(new GainNode(context), -1, 0))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                it('should throw an IndexSizeError if the input is out-of-bound', () => {
                    expect(() => convolverNode.disconnect(new GainNode(context), 0, -1))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                it('should throw an InvalidAccessError if there is no similar connection', () => {
                    expect(() => convolverNode.disconnect(new GainNode(context), 0, 0))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });
        });
    });
});
