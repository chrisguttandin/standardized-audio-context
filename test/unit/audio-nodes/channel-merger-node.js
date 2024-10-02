import { AudioBuffer, AudioBufferSourceNode, ChannelMergerNode, ConstantSourceNode, GainNode } from '../../../src/module';
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

describe('ChannelMergerNode', () => {
    for (const [description, { createChannelMergerNode, createContext }] of Object.entries(testCases)) {
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
                }
            });

            describe('channelCount', () => {
                let channelMergerNode;

                beforeEach(() => {
                    channelMergerNode = createChannelMergerNode(context);
                });

                it('should not be assignable to another value', (done) => {
                    const channelCount = 4;

                    try {
                        channelMergerNode.channelCount = channelCount;
                    } catch (err) {
                        expect(err.code).to.equal(11);
                        expect(err.name).to.equal('InvalidStateError');

                        done();
                    }
                });
            });

            describe('channelCountMode', () => {
                let channelMergerNode;

                beforeEach(() => {
                    channelMergerNode = createChannelMergerNode(context);
                });

                it('should not be assignable to another value', (done) => {
                    const channelCountMode = 'max';

                    try {
                        channelMergerNode.channelCountMode = channelCountMode;
                    } catch (err) {
                        expect(err.code).to.equal(11);
                        expect(err.name).to.equal('InvalidStateError');

                        done();
                    }
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
                for (const type of ['AudioNode', 'AudioParam']) {
                    describe(`with an ${type}`, () => {
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

                        it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                            try {
                                channelMergerNode.connect(audioNodeOrAudioParam, -1);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                        if (type === 'AudioNode') {
                            it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                                try {
                                    channelMergerNode.connect(audioNodeOrAudioParam, 0, -1);
                                } catch (err) {
                                    expect(err.code).to.equal(1);
                                    expect(err.name).to.equal('IndexSizeError');

                                    done();
                                }
                            });

                            it('should not throw an error if the connection creates a cycle by connecting to the source', () => {
                                audioNodeOrAudioParam.connect(channelMergerNode).connect(audioNodeOrAudioParam);
                            });

                            it('should not throw an error if the connection creates a cycle by connecting to an AudioParam of the source', () => {
                                audioNodeOrAudioParam.connect(channelMergerNode).connect(audioNodeOrAudioParam.gain);
                            });
                        }
                    });

                    describe(`with an ${type} of another context`, () => {
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

                        it('should throw an InvalidAccessError', (done) => {
                            try {
                                channelMergerNode.connect(audioNodeOrAudioParam);
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });
                    });

                    describe(`with an ${type} of a native context`, () => {
                        let channelMergerNode;
                        let nativeAudioNodeOrAudioParam;
                        let nativeContext;

                        afterEach(() => nativeContext.close?.());

                        beforeEach(() => {
                            channelMergerNode = createChannelMergerNode(context);
                            nativeContext = description.includes('Offline')
                                ? createNativeOfflineAudioContext()
                                : createNativeAudioContext();

                            const nativeGainNode = nativeContext.createGain();

                            nativeAudioNodeOrAudioParam = type === 'AudioNode' ? nativeGainNode : nativeGainNode.gain;
                        });

                        it('should throw an InvalidAccessError', (done) => {
                            try {
                                channelMergerNode.connect(nativeAudioNodeOrAudioParam);
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
                                const channelMergerNode = createChannelMergerNode(context);
                                const constantSourceNode = new ConstantSourceNode(context);
                                const gainNode = new GainNode(context);

                                constantSourceNode.connect(channelMergerNode).connect(destination);

                                channelMergerNode.connect(gainNode).connect(channelMergerNode);

                                return { channelMergerNode, constantSourceNode, gainNode };
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

                    beforeEach(function () {
                        this.timeout(10000);

                        values = [1, 1, 1, 1, 1];

                        renderer = createPredefinedRenderer(values);
                    });

                    it('should disconnect all destinations', function () {
                        this.timeout(10000);

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

                        it('should throw an IndexSizeError', (done) => {
                            try {
                                channelMergerNode.disconnect(-1);
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

                        it('should throw an InvalidAccessError', (done) => {
                            try {
                                channelMergerNode.disconnect(new GainNode(context));
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

                        it('should disconnect another destination in isolation', function () {
                            this.timeout(10000);

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

                    it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                        try {
                            channelMergerNode.disconnect(new GainNode(context), -1);
                        } catch (err) {
                            expect(err.code).to.equal(1);
                            expect(err.name).to.equal('IndexSizeError');

                            done();
                        }
                    });

                    it('should throw an InvalidAccessError if there is no similar connection', (done) => {
                        try {
                            channelMergerNode.disconnect(new GainNode(context), 0);
                        } catch (err) {
                            expect(err.code).to.equal(15);
                            expect(err.name).to.equal('InvalidAccessError');

                            done();
                        }
                    });
                });

                describe('with a destination, an output and an input', () => {
                    let channelMergerNode;

                    beforeEach(() => {
                        channelMergerNode = createChannelMergerNode(context);
                    });

                    it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                        try {
                            channelMergerNode.disconnect(new GainNode(context), -1, 0);
                        } catch (err) {
                            expect(err.code).to.equal(1);
                            expect(err.name).to.equal('IndexSizeError');

                            done();
                        }
                    });

                    it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                        try {
                            channelMergerNode.disconnect(new GainNode(context), 0, -1);
                        } catch (err) {
                            expect(err.code).to.equal(1);
                            expect(err.name).to.equal('IndexSizeError');

                            done();
                        }
                    });

                    it('should throw an InvalidAccessError if there is no similar connection', (done) => {
                        try {
                            channelMergerNode.disconnect(new GainNode(context), 0, 0);
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
