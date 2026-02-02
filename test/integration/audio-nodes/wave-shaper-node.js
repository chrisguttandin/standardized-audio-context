import { AudioBuffer, AudioBufferSourceNode, ConstantSourceNode, GainNode, WaveShaperNode } from '../../../src/module';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
import { createNativeAudioContext } from '../../helper/create-native-audio-context';
import { createNativeOfflineAudioContext } from '../../helper/create-native-offline-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';

const createWaveShaperNodeWithConstructor = (context, options = null) => {
    if (options === null) {
        return new WaveShaperNode(context);
    }

    return new WaveShaperNode(context, options);
};
const createWaveShaperNodeWithFactoryFunction = (context, options = null) => {
    const waveShaperNode = context.createWaveShaper();

    if (options !== null && options.channelCount !== undefined) {
        waveShaperNode.channelCount = options.channelCount;
    }

    if (options !== null && options.channelCountMode !== undefined) {
        waveShaperNode.channelCountMode = options.channelCountMode;
    }

    if (options !== null && options.channelInterpretation !== undefined) {
        waveShaperNode.channelInterpretation = options.channelInterpretation;
    }

    if (options !== null && options.curve !== undefined) {
        waveShaperNode.curve = options.curve;
    }

    if (options !== null && options.oversample !== undefined) {
        waveShaperNode.oversample = options.oversample;
    }

    return waveShaperNode;
};
const testCases = {
    'constructor of a MinimalAudioContext': {
        createContext: createMinimalAudioContext,
        createWaveShaperNode: createWaveShaperNodeWithConstructor
    },
    'constructor of a MinimalOfflineAudioContext': {
        createContext: createMinimalOfflineAudioContext,
        createWaveShaperNode: createWaveShaperNodeWithConstructor
    },
    'constructor of an AudioContext': {
        createContext: createAudioContext,
        createWaveShaperNode: createWaveShaperNodeWithConstructor
    },
    'constructor of an OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createWaveShaperNode: createWaveShaperNodeWithConstructor
    },
    'factory function of an AudioContext': {
        createContext: createAudioContext,
        createWaveShaperNode: createWaveShaperNodeWithFactoryFunction
    },
    'factory function of an OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createWaveShaperNode: createWaveShaperNodeWithFactoryFunction
    }
};

describe('WaveShaperNode', { skip: typeof window === 'undefined' }, () => {
    describe.for(Object.entries(testCases))('with the %s', ([description, { createContext, createWaveShaperNode }]) => {
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
                    let waveShaperNode;

                    beforeEach(() => {
                        waveShaperNode = createWaveShaperNode(context);
                    });

                    it('should return an instance of the WaveShaperNode constructor', () => {
                        expect(waveShaperNode).to.be.an.instanceOf(WaveShaperNode);
                    });

                    it('should return an implementation of the EventTarget interface', () => {
                        expect(waveShaperNode.addEventListener).to.be.a('function');
                        expect(waveShaperNode.dispatchEvent).to.be.a('function');
                        expect(waveShaperNode.removeEventListener).to.be.a('function');
                    });

                    it('should return an implementation of the AudioNode interface', () => {
                        expect(waveShaperNode.channelCount).to.equal(2);
                        expect(waveShaperNode.channelCountMode).to.equal('max');
                        expect(waveShaperNode.channelInterpretation).to.equal('speakers');
                        expect(waveShaperNode.connect).to.be.a('function');
                        expect(waveShaperNode.context).to.be.an.instanceOf(context.constructor);
                        expect(waveShaperNode.disconnect).to.be.a('function');
                        expect(waveShaperNode.numberOfInputs).to.equal(1);
                        expect(waveShaperNode.numberOfOutputs).to.equal(1);
                    });

                    it('should return an implementation of the WaveShaperNode interface', () => {
                        expect(waveShaperNode.curve).to.be.null;
                        expect(waveShaperNode.oversample).to.equal('none');
                    });
                });

                describe('with valid options', () => {
                    it('should return an instance with the given channelCount', () => {
                        const channelCount = 4;
                        const waveShaperNode = createWaveShaperNode(context, { channelCount });

                        expect(waveShaperNode.channelCount).to.equal(channelCount);
                    });

                    it('should return an instance with the given channelCountMode', () => {
                        const channelCountMode = 'explicit';
                        const waveShaperNode = createWaveShaperNode(context, { channelCountMode });

                        expect(waveShaperNode.channelCountMode).to.equal(channelCountMode);
                    });

                    it('should return an instance with the given channelInterpretation', () => {
                        const channelInterpretation = 'discrete';
                        const waveShaperNode = createWaveShaperNode(context, { channelInterpretation });

                        expect(waveShaperNode.channelInterpretation).to.equal(channelInterpretation);
                    });

                    it('should return an instance with the given curve', () => {
                        const curve = new Float32Array([0.3, 0.5]);
                        const waveShaperNode = createWaveShaperNode(context, { curve });

                        expect(waveShaperNode.curve).to.be.an.instanceOf(Float32Array);
                        expect(waveShaperNode.curve).to.deep.equal(curve);
                    });

                    it('should return an instance with the given oversample type', () => {
                        const oversample = '2x';
                        const waveShaperNode = createWaveShaperNode(context, { oversample });

                        expect(waveShaperNode.oversample).to.equal(oversample);
                    });
                });

                describe('with invalid options', () => {
                    describe('with a curve of less than two samples', () => {
                        it('should throw an InvalidStateError', () => {
                            expect(() => createWaveShaperNode(context, { curve: new Float32Array([1]) }))
                                .to.throw(DOMException)
                                .to.include({ code: 11, name: 'InvalidStateError' });
                        });
                    });
                });
            });
        });

        describe('channelCount', () => {
            let waveShaperNode;

            beforeEach(() => {
                waveShaperNode = createWaveShaperNode(context);
            });

            it('should be assignable to another value', () => {
                const channelCount = 4;

                waveShaperNode.channelCount = channelCount;

                expect(waveShaperNode.channelCount).to.equal(channelCount);
            });
        });

        describe('channelCountMode', () => {
            let waveShaperNode;

            beforeEach(() => {
                waveShaperNode = createWaveShaperNode(context);
            });

            it('should be assignable to another value', () => {
                const channelCountMode = 'explicit';

                waveShaperNode.channelCountMode = channelCountMode;

                expect(waveShaperNode.channelCountMode).to.equal(channelCountMode);
            });
        });

        describe('channelInterpretation', () => {
            let waveShaperNode;

            beforeEach(() => {
                waveShaperNode = createWaveShaperNode(context);
            });

            it('should be assignable to another value', () => {
                const channelInterpretation = 'discrete';

                waveShaperNode.channelInterpretation = channelInterpretation;

                expect(waveShaperNode.channelInterpretation).to.equal(channelInterpretation);
            });
        });

        describe('curve', () => {
            describe('with a valid curve', () => {
                let waveShaperNode;

                beforeEach(() => {
                    waveShaperNode = createWaveShaperNode(context);
                });

                it('should be assignable to a Float32Array', () => {
                    const curve = new Float32Array([-1, 0, 1]);

                    waveShaperNode.curve = curve;

                    expect(waveShaperNode.curve).to.be.an.instanceOf(Float32Array);
                    expect(waveShaperNode.curve).to.deep.equal(curve);
                });
            });

            describe('with a previously assigned curve', () => {
                let waveShaperNode;

                beforeEach(() => {
                    waveShaperNode = createWaveShaperNode(context);
                });

                it('should be assignable to null', () => {
                    waveShaperNode.curve = new Float32Array([0.4, 0, 0.4]);
                    waveShaperNode.curve = null;

                    expect(waveShaperNode.curve).to.be.null;
                });
            });

            describe('with a curve of less than two samples', () => {
                let waveShaperNode;

                beforeEach(() => {
                    waveShaperNode = createWaveShaperNode(context);
                });

                it('should throw an InvalidStateError', () => {
                    expect(() => {
                        waveShaperNode.curve = new Float32Array([1]);
                    })
                        .to.throw(DOMException)
                        .to.include({ code: 11, name: 'InvalidStateError' });
                });
            });

            describe('with a curve that produces a DC signal', () => {
                let renderer;

                beforeEach(() => {
                    renderer = createRenderer({
                        context,
                        length: context.length === undefined ? 5 : undefined,
                        setup(destination) {
                            const waveShaperNode = createWaveShaperNode(context, { curve: new Float32Array([1, 1]) });

                            waveShaperNode.connect(destination);

                            return { waveShaperNode };
                        }
                    });
                });

                it('should render a constant signal', () => {
                    return renderer({}).then((channelData) => {
                        expect(Array.from(channelData)).to.deep.equal([1, 1, 1, 1, 1]);
                    });
                });
            });
        });

        describe('numberOfInputs', () => {
            let waveShaperNode;

            beforeEach(() => {
                waveShaperNode = createWaveShaperNode(context);
            });

            it('should be readonly', () => {
                expect(() => {
                    waveShaperNode.numberOfInputs = 2;
                }).to.throw(TypeError);
            });
        });

        describe('numberOfOutputs', () => {
            let waveShaperNode;

            beforeEach(() => {
                waveShaperNode = createWaveShaperNode(context);
            });

            it('should be readonly', () => {
                expect(() => {
                    waveShaperNode.numberOfOutputs = 2;
                }).to.throw(TypeError);
            });
        });

        describe('oversample', () => {
            let waveShaperNode;

            beforeEach(() => {
                waveShaperNode = createWaveShaperNode(context);
            });

            it('should be assignable to another oversample type', () => {
                const oversample = (waveShaperNode.oversample = '4x'); // eslint-disable-line no-multi-assign

                expect(oversample).to.equal('4x');
                expect(waveShaperNode.oversample).to.equal('4x');
            });

            it('should not be assignable to something else', () => {
                const string = 'none of the accepted oversample types';
                const oversample = (waveShaperNode.oversample = string); // eslint-disable-line no-multi-assign

                expect(oversample).to.equal(string);
                expect(waveShaperNode.oversample).to.equal('none');
            });
        });

        describe('connect()', () => {
            describe.for(['AudioNode', 'AudioParam'])('with an %s', (type) => {
                let audioNodeOrAudioParam;
                let waveShaperNode;

                beforeEach(() => {
                    const gainNode = new GainNode(context);

                    audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                    waveShaperNode = createWaveShaperNode(context);
                });

                if (type === 'AudioNode') {
                    it('should be chainable', () => {
                        expect(waveShaperNode.connect(audioNodeOrAudioParam)).to.equal(audioNodeOrAudioParam);
                    });
                } else {
                    it('should not be chainable', () => {
                        expect(waveShaperNode.connect(audioNodeOrAudioParam)).to.be.undefined;
                    });
                }

                it('should accept duplicate connections', () => {
                    waveShaperNode.connect(audioNodeOrAudioParam);
                    waveShaperNode.connect(audioNodeOrAudioParam);
                });

                it('should throw an IndexSizeError if the output is out-of-bound', () => {
                    expect(() => waveShaperNode.connect(audioNodeOrAudioParam, -1))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                if (type === 'AudioNode') {
                    it('should throw an IndexSizeError if the input is out-of-bound', () => {
                        expect(() => waveShaperNode.connect(audioNodeOrAudioParam, 0, -1))
                            .to.throw(DOMException)
                            .to.include({ code: 1, name: 'IndexSizeError' });
                    });

                    it('should not throw an error if the connection creates a cycle by connecting to the source', () => {
                        audioNodeOrAudioParam.connect(waveShaperNode).connect(audioNodeOrAudioParam);
                    });

                    it('should not throw an error if the connection creates a cycle by connecting to an AudioParam of the source', () => {
                        audioNodeOrAudioParam.connect(waveShaperNode).connect(audioNodeOrAudioParam.gain);
                    });
                }
            });

            describe.for(['AudioNode', 'AudioParam'])('with an %s of another context', (type) => {
                let anotherContext;
                let audioNodeOrAudioParam;
                let waveShaperNode;

                afterEach(() => anotherContext.close?.());

                beforeEach(() => {
                    anotherContext = createContext();

                    const gainNode = new GainNode(anotherContext);

                    audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                    waveShaperNode = createWaveShaperNode(context);
                });

                it('should throw an InvalidAccessError', () => {
                    expect(() => waveShaperNode.connect(audioNodeOrAudioParam))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });

            describe.for(['AudioNode', 'AudioParam'])('with an %s of a native context', (type) => {
                let nativeAudioNodeOrAudioParam;
                let nativeContext;
                let waveShaperNode;

                afterEach(() => nativeContext.close?.());

                beforeEach(() => {
                    nativeContext = description.includes('Offline') ? createNativeOfflineAudioContext() : createNativeAudioContext();

                    const nativeGainNode = nativeContext.createGain();

                    nativeAudioNodeOrAudioParam = type === 'AudioNode' ? nativeGainNode : nativeGainNode.gain;
                    waveShaperNode = createWaveShaperNode(context);
                });

                it('should throw an InvalidAccessError', () => {
                    expect(() => waveShaperNode.connect(nativeAudioNodeOrAudioParam))
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
                            const waveShaperNode = createWaveShaperNode(context);

                            constantSourceNode.connect(waveShaperNode).connect(destination);

                            waveShaperNode.connect(gainNode).connect(waveShaperNode);

                            return { constantSourceNode, gainNode, waveShaperNode };
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
                            const waveShaperNode = createWaveShaperNode(context, {
                                curve: new Float32Array([0, 0.25, 0.5, 0.75, 1])
                            });

                            audioBuffer.copyToChannel(new Float32Array(values), 0);

                            audioBufferSourceNode.buffer = audioBuffer;

                            audioBufferSourceNode.connect(waveShaperNode).connect(firstDummyGainNode).connect(destination);

                            waveShaperNode.connect(secondDummyGainNode);

                            return { audioBufferSourceNode, firstDummyGainNode, secondDummyGainNode, waveShaperNode };
                        }
                    });
            });

            describe('without any parameters', () => {
                let renderer;
                let values;

                beforeEach(() => {
                    values = [1, 0.5, 0, -0.5, -1];

                    renderer = createPredefinedRenderer(values);
                });

                it('should disconnect all destinations', () => {
                    return renderer({
                        prepare({ waveShaperNode }) {
                            waveShaperNode.disconnect();
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
                    let waveShaperNode;

                    beforeEach(() => {
                        waveShaperNode = createWaveShaperNode(context);
                    });

                    it('should throw an IndexSizeError', () => {
                        expect(() => waveShaperNode.disconnect(-1))
                            .to.throw(DOMException)
                            .to.include({ code: 1, name: 'IndexSizeError' });
                    });
                });

                describe('with a connection from the given output', () => {
                    let renderer;
                    let values;

                    beforeEach(() => {
                        values = [1, 0.5, 0, -0.5, -1];

                        renderer = createPredefinedRenderer(values);
                    });

                    it('should disconnect all destinations from the given output', () => {
                        return renderer({
                            prepare({ waveShaperNode }) {
                                waveShaperNode.disconnect(0);
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
                    let waveShaperNode;

                    beforeEach(() => {
                        waveShaperNode = createWaveShaperNode(context);
                    });

                    it('should throw an InvalidAccessError', () => {
                        expect(() => waveShaperNode.disconnect(new GainNode(context)))
                            .to.throw(DOMException)
                            .to.include({ code: 15, name: 'InvalidAccessError' });
                    });
                });

                describe('with a connection to the given destination', () => {
                    let renderer;
                    let values;

                    beforeEach(() => {
                        values = [1, 0.5, 0, -0.5, -1];

                        renderer = createPredefinedRenderer(values);
                    });

                    it('should disconnect the destination', () => {
                        return renderer({
                            prepare({ firstDummyGainNode, waveShaperNode }) {
                                waveShaperNode.disconnect(firstDummyGainNode);
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
                            prepare({ secondDummyGainNode, waveShaperNode }) {
                                waveShaperNode.disconnect(secondDummyGainNode);
                            },
                            start(startTime, { audioBufferSourceNode }) {
                                audioBufferSourceNode.start(startTime);
                            }
                        }).then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([1, 0.75, 0.5, 0.25, 0]);
                        });
                    });
                });
            });

            describe('with a destination and an output', () => {
                let waveShaperNode;

                beforeEach(() => {
                    waveShaperNode = createWaveShaperNode(context);
                });

                it('should throw an IndexSizeError if the output is out-of-bound', () => {
                    expect(() => waveShaperNode.disconnect(new GainNode(context), -1))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                it('should throw an InvalidAccessError if there is no similar connection', () => {
                    expect(() => waveShaperNode.disconnect(new GainNode(context), 0))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });

            describe('with a destination, an output and an input', () => {
                let waveShaperNode;

                beforeEach(() => {
                    waveShaperNode = createWaveShaperNode(context);
                });

                it('should throw an IndexSizeError if the output is out-of-bound', () => {
                    expect(() => waveShaperNode.disconnect(new GainNode(context), -1, 0))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                it('should throw an IndexSizeError if the input is out-of-bound', () => {
                    expect(() => waveShaperNode.disconnect(new GainNode(context), 0, -1))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                it('should throw an InvalidAccessError if there is no similar connection', () => {
                    expect(() => waveShaperNode.disconnect(new GainNode(context), 0, 0))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });
        });
    });
});
