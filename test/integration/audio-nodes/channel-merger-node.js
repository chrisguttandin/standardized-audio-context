import { AudioBuffer, AudioBufferSourceNode, ChannelMergerNode, ConstantSourceNode, GainNode } from '../../../src/module';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
import { createNativeAudioContext } from '../../helper/create-native-audio-context';
import { createNativeOfflineAudioContext } from '../../helper/create-native-offline-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';

const createChannelMergerNodeWithConstructor = (context, options = null) => {
    if (options === null) {
        return new ChannelMergerNode(context);
    }

    return new ChannelMergerNode(context, options);
};
const createChannelMergerNodeWithFactoryFunction = (context, options = null) => {
    const channelMergerNode =
        options !== null && options.numberOfInputs !== undefined
            ? context.createChannelMerger(options.numberOfInputs)
            : context.createChannelMerger();

    if (options !== null && options.channelCount !== undefined) {
        channelMergerNode.channelCount = options.channelCount;
    }

    if (options !== null && options.channelCountMode !== undefined) {
        channelMergerNode.channelCountMode = options.channelCountMode;
    }

    if (options !== null && options.channelInterpretation !== undefined) {
        channelMergerNode.channelInterpretation = options.channelInterpretation;
    }

    return channelMergerNode;
};
const testCases = {
    'constructor of a MinimalAudioContext': {
        createChannelMergerNode: createChannelMergerNodeWithConstructor,
        createContext: createMinimalAudioContext
    },
    'constructor of a MinimalOfflineAudioContext': {
        createChannelMergerNode: createChannelMergerNodeWithConstructor,
        createContext: createMinimalOfflineAudioContext
    },
    'constructor of an AudioContext': {
        createChannelMergerNode: createChannelMergerNodeWithConstructor,
        createContext: createAudioContext
    },
    'constructor of an OfflineAudioContext': {
        createChannelMergerNode: createChannelMergerNodeWithConstructor,
        createContext: createOfflineAudioContext
    },
    'factory function of an AudioContext': {
        createChannelMergerNode: createChannelMergerNodeWithFactoryFunction,
        createContext: createAudioContext
    },
    'factory function of an OfflineAudioContext': {
        createChannelMergerNode: createChannelMergerNodeWithFactoryFunction,
        createContext: createOfflineAudioContext
    }
};

describe('ChannelMergerNode', { skip: typeof window === 'undefined' }, () => {
    describe.for(Object.entries(testCases))('with the %s', ([description, { createChannelMergerNode, createContext }]) => {
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
                    let channelMergerNode;

                    beforeEach(() => {
                        channelMergerNode = createChannelMergerNode(context);
                    });

                    it('should return an instance of the ChannelMergerNode constructor', () => {
                        expect(channelMergerNode).to.be.an.instanceOf(ChannelMergerNode);
                    });

                    it('should return an implementation of the EventTarget interface', () => {
                        expect(channelMergerNode.addEventListener).to.be.a('function');
                        expect(channelMergerNode.dispatchEvent).to.be.a('function');
                        expect(channelMergerNode.removeEventListener).to.be.a('function');
                    });

                    it('should return an implementation of the AudioNode interface', () => {
                        expect(channelMergerNode.channelCount).to.equal(1);
                        expect(channelMergerNode.channelCountMode).to.equal('explicit');
                        expect(channelMergerNode.channelInterpretation).to.equal('speakers');
                        expect(channelMergerNode.connect).to.be.a('function');
                        expect(channelMergerNode.context).to.be.an.instanceOf(context.constructor);
                        expect(channelMergerNode.disconnect).to.be.a('function');
                        expect(channelMergerNode.numberOfInputs).to.equal(6);
                        expect(channelMergerNode.numberOfOutputs).to.equal(1);
                    });
                });

                describe('with valid options', () => {
                    it('should return an instance with the given numberOfInputs', () => {
                        const numberOfInputs = 2;
                        const channelMergerNode = createChannelMergerNode(context, { numberOfInputs });

                        expect(channelMergerNode.numberOfInputs).to.equal(numberOfInputs);
                    });
                });
            });
        });

        describe('channelCount', () => {
            let channelMergerNode;

            beforeEach(() => {
                channelMergerNode = createChannelMergerNode(context);
            });

            it('should not be assignable to another value', () => {
                const channelCount = 4;

                expect(() => {
                    channelMergerNode.channelCount = channelCount;
                })
                    .to.throw(DOMException)
                    .to.include({ code: 11, name: 'InvalidStateError' });
            });
        });

        describe('channelCountMode', () => {
            let channelMergerNode;

            beforeEach(() => {
                channelMergerNode = createChannelMergerNode(context);
            });

            it('should not be assignable to another value', () => {
                const channelCountMode = 'max';

                expect(() => {
                    channelMergerNode.channelCountMode = channelCountMode;
                })
                    .to.throw(DOMException)
                    .to.include({ code: 11, name: 'InvalidStateError' });
            });
        });

        describe('channelInterpretation', () => {
            let channelMergerNode;

            beforeEach(() => {
                channelMergerNode = createChannelMergerNode(context);
            });

            it('should be assignable to another value', () => {
                const channelInterpretation = 'discrete';

                channelMergerNode.channelInterpretation = channelInterpretation;

                expect(channelMergerNode.channelInterpretation).to.equal(channelInterpretation);
            });
        });

        describe('numberOfInputs', () => {
            let channelMergerNode;

            beforeEach(() => {
                channelMergerNode = createChannelMergerNode(context);
            });

            it('should be readonly', () => {
                expect(() => {
                    channelMergerNode.numberOfInputs = 2;
                }).to.throw(TypeError);
            });
        });

        describe('numberOfOutputs', () => {
            let channelMergerNode;

            beforeEach(() => {
                channelMergerNode = createChannelMergerNode(context);
            });

            it('should be readonly', () => {
                expect(() => {
                    channelMergerNode.numberOfOutputs = 2;
                }).to.throw(TypeError);
            });
        });

        describe('connect()', () => {
            describe.for(['AudioNode', 'AudioParam'])('with an %s', (type) => {
                let audioNodeOrAudioParam;
                let channelMergerNode;

                beforeEach(() => {
                    const gainNode = new GainNode(context);

                    audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                    channelMergerNode = createChannelMergerNode(context);
                });

                if (type === 'AudioNode') {
                    it('should be chainable', () => {
                        expect(channelMergerNode.connect(audioNodeOrAudioParam)).to.equal(audioNodeOrAudioParam);
                    });
                } else {
                    it('should not be chainable', () => {
                        expect(channelMergerNode.connect(audioNodeOrAudioParam)).to.be.undefined;
                    });
                }

                it('should accept duplicate connections', () => {
                    channelMergerNode.connect(audioNodeOrAudioParam);
                    channelMergerNode.connect(audioNodeOrAudioParam);
                });

                it('should throw an IndexSizeError if the output is out-of-bound', () => {
                    expect(() => channelMergerNode.connect(audioNodeOrAudioParam, -1))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                if (type === 'AudioNode') {
                    it('should throw an IndexSizeError if the input is out-of-bound', () => {
                        expect(() => channelMergerNode.connect(audioNodeOrAudioParam, 0, -1))
                            .to.throw(DOMException)
                            .to.include({ code: 1, name: 'IndexSizeError' });
                    });

                    it('should not throw an error if the connection creates a cycle by connecting to the source', () => {
                        audioNodeOrAudioParam.connect(channelMergerNode).connect(audioNodeOrAudioParam);
                    });

                    it('should not throw an error if the connection creates a cycle by connecting to an AudioParam of the source', () => {
                        audioNodeOrAudioParam.connect(channelMergerNode).connect(audioNodeOrAudioParam.gain);
                    });
                }
            });

            describe.for(['AudioNode', 'AudioParam'])('with an %s of another context', (type) => {
                let anotherContext;
                let audioNodeOrAudioParam;
                let channelMergerNode;

                afterEach(() => anotherContext.close?.());

                beforeEach(() => {
                    anotherContext = createContext();

                    const gainNode = new GainNode(anotherContext);

                    audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                    channelMergerNode = createChannelMergerNode(context);
                });

                it('should throw an InvalidAccessError', () => {
                    expect(() => channelMergerNode.connect(audioNodeOrAudioParam))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });

            describe.for(['AudioNode', 'AudioParam'])('with an %s of a native context', (type) => {
                let channelMergerNode;
                let nativeAudioNodeOrAudioParam;
                let nativeContext;

                afterEach(() => nativeContext.close?.());

                beforeEach(() => {
                    channelMergerNode = createChannelMergerNode(context);
                    nativeContext = description.includes('Offline') ? createNativeOfflineAudioContext() : createNativeAudioContext();

                    const nativeGainNode = nativeContext.createGain();

                    nativeAudioNodeOrAudioParam = type === 'AudioNode' ? nativeGainNode : nativeGainNode.gain;
                });

                it('should throw an InvalidAccessError', () => {
                    expect(() => channelMergerNode.connect(nativeAudioNodeOrAudioParam))
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
                            const channelMergerNode = createChannelMergerNode(context);
                            const constantSourceNode = new ConstantSourceNode(context);
                            const gainNode = new GainNode(context);

                            constantSourceNode.connect(channelMergerNode).connect(destination);

                            channelMergerNode.connect(gainNode).connect(channelMergerNode);

                            return { channelMergerNode, constantSourceNode, gainNode };
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
                            const channelMergerNode = createChannelMergerNode(context, { numberOfInputs: 2 });
                            const firstDummyGainNode = new GainNode(context);
                            const secondDummyGainNode = new GainNode(context);

                            audioBuffer.copyToChannel(new Float32Array(values), 0);

                            audioBufferSourceNode.buffer = audioBuffer;

                            audioBufferSourceNode.connect(channelMergerNode).connect(firstDummyGainNode).connect(destination);

                            channelMergerNode.connect(secondDummyGainNode);

                            return { audioBufferSourceNode, channelMergerNode, firstDummyGainNode, secondDummyGainNode };
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
                        prepare({ channelMergerNode }) {
                            channelMergerNode.disconnect();
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
                    let channelMergerNode;

                    beforeEach(() => {
                        channelMergerNode = createChannelMergerNode(context);
                    });

                    it('should throw an IndexSizeError', () => {
                        expect(() => channelMergerNode.disconnect(-1))
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
                            prepare({ channelMergerNode }) {
                                channelMergerNode.disconnect(0);
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
                    let channelMergerNode;

                    beforeEach(() => {
                        channelMergerNode = createChannelMergerNode(context);
                    });

                    it('should throw an InvalidAccessError', () => {
                        expect(() => channelMergerNode.disconnect(new GainNode(context)))
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
                            prepare({ channelMergerNode, firstDummyGainNode }) {
                                channelMergerNode.disconnect(firstDummyGainNode);
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
                            prepare({ channelMergerNode, secondDummyGainNode }) {
                                channelMergerNode.disconnect(secondDummyGainNode);
                            },
                            start(startTime, { audioBufferSourceNode }) {
                                audioBufferSourceNode.start(startTime);
                            }
                        }).then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([0.5, 0.5, 0.5, 0.5, 0.5]);
                        });
                    });
                });
            });

            describe('with a destination and an output', () => {
                let channelMergerNode;

                beforeEach(() => {
                    channelMergerNode = createChannelMergerNode(context);
                });

                it('should throw an IndexSizeError if the output is out-of-bound', () => {
                    expect(() => channelMergerNode.disconnect(new GainNode(context), -1))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                it('should throw an InvalidAccessError if there is no similar connection', () => {
                    expect(() => channelMergerNode.disconnect(new GainNode(context), 0))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });

            describe('with a destination, an output and an input', () => {
                let channelMergerNode;

                beforeEach(() => {
                    channelMergerNode = createChannelMergerNode(context);
                });

                it('should throw an IndexSizeError if the output is out-of-bound', () => {
                    expect(() => channelMergerNode.disconnect(new GainNode(context), -1, 0))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                it('should throw an IndexSizeError if the input is out-of-bound', () => {
                    expect(() => channelMergerNode.disconnect(new GainNode(context), 0, -1))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                it('should throw an InvalidAccessError if there is no similar connection', () => {
                    expect(() => channelMergerNode.disconnect(new GainNode(context), 0, 0))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });
        });
    });
});
