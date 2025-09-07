import { AudioBuffer, AudioBufferSourceNode, ChannelSplitterNode, ConstantSourceNode, GainNode } from '../../../src/module';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
import { createNativeAudioContext } from '../../helper/create-native-audio-context';
import { createNativeOfflineAudioContext } from '../../helper/create-native-offline-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';

const createChannelSplitterNodeWithConstructor = (context, options = null) => {
    if (options === null) {
        return new ChannelSplitterNode(context);
    }

    return new ChannelSplitterNode(context, options);
};
const createChannelSplitterNodeWithFactoryFunction = (context, options = null) => {
    const channelSplitterNode =
        options !== null && options.numberOfOutputs !== undefined
            ? context.createChannelSplitter(options.numberOfOutputs)
            : context.createChannelSplitter();

    if (options !== null && options.channelCount !== undefined) {
        channelSplitterNode.channelCount = options.channelCount;
    }

    if (options !== null && options.channelCountMode !== undefined) {
        channelSplitterNode.channelCountMode = options.channelCountMode;
    }

    if (options !== null && options.channelInterpretation !== undefined) {
        channelSplitterNode.channelInterpretation = options.channelInterpretation;
    }

    return channelSplitterNode;
};
const testCases = {
    'constructor of a MinimalAudioContext': {
        createChannelSplitterNode: createChannelSplitterNodeWithConstructor,
        createContext: createMinimalAudioContext
    },
    'constructor of a MinimalOfflineAudioContext': {
        createChannelSplitterNode: createChannelSplitterNodeWithConstructor,
        createContext: createMinimalOfflineAudioContext
    },
    'constructor of an AudioContext': {
        createChannelSplitterNode: createChannelSplitterNodeWithConstructor,
        createContext: createAudioContext
    },
    'constructor of an OfflineAudioContext': {
        createChannelSplitterNode: createChannelSplitterNodeWithConstructor,
        createContext: createOfflineAudioContext
    },
    'factory function of an AudioContext': {
        createChannelSplitterNode: createChannelSplitterNodeWithFactoryFunction,
        createContext: createAudioContext
    },
    'factory function of an OfflineAudioContext': {
        createChannelSplitterNode: createChannelSplitterNodeWithFactoryFunction,
        createContext: createOfflineAudioContext
    }
};

if (typeof window !== 'undefined') {
    describe('ChannelSplitterNode', () => {
        for (const [description, { createChannelSplitterNode, createContext }] of Object.entries(testCases)) {
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
                                let channelSplitterNode;

                                beforeEach(() => {
                                    channelSplitterNode = createChannelSplitterNode(context);
                                });

                                it('should return an instance of the ChannelSplitterNode constructor', () => {
                                    expect(channelSplitterNode).to.be.an.instanceOf(ChannelSplitterNode);
                                });

                                it('should return an implementation of the EventTarget interface', () => {
                                    expect(channelSplitterNode.addEventListener).to.be.a('function');
                                    expect(channelSplitterNode.dispatchEvent).to.be.a('function');
                                    expect(channelSplitterNode.removeEventListener).to.be.a('function');
                                });

                                it('should return an implementation of the AudioNode interface', () => {
                                    expect(channelSplitterNode.channelCount).to.equal(6);
                                    expect(channelSplitterNode.channelCountMode).to.equal('explicit');
                                    expect(channelSplitterNode.channelInterpretation).to.equal('discrete');
                                    expect(channelSplitterNode.connect).to.be.a('function');
                                    expect(channelSplitterNode.context).to.be.an.instanceOf(context.constructor);
                                    expect(channelSplitterNode.disconnect).to.be.a('function');
                                    expect(channelSplitterNode.numberOfInputs).to.equal(1);
                                    expect(channelSplitterNode.numberOfOutputs).to.equal(6);
                                });
                            });

                            describe('with valid options', () => {
                                it('should return an instance with the given numberOfOutputs', () => {
                                    const numberOfOutputs = 2;
                                    const channelSplitterNode = createChannelSplitterNode(context, { numberOfOutputs });

                                    expect(channelSplitterNode.numberOfOutputs).to.equal(numberOfOutputs);
                                });

                                it('should return an instance with the given numberOfOutputs as channelCount', () => {
                                    const numberOfOutputs = 4;
                                    const channelSplitterNode = createChannelSplitterNode(context, { numberOfOutputs });

                                    expect(channelSplitterNode.channelCount).to.equal(numberOfOutputs);
                                });
                            });
                        });
                    }
                });

                describe('channelCount', () => {
                    let channelSplitterNode;

                    beforeEach(() => {
                        channelSplitterNode = createChannelSplitterNode(context);
                    });

                    it('should not be assignable to another value', (done) => {
                        const channelCount = 4;

                        try {
                            channelSplitterNode.channelCount = channelCount;
                        } catch (err) {
                            expect(err.code).to.equal(11);
                            expect(err.name).to.equal('InvalidStateError');

                            done();
                        }
                    });
                });

                describe('channelCountMode', () => {
                    let channelSplitterNode;

                    beforeEach(() => {
                        channelSplitterNode = createChannelSplitterNode(context);
                    });

                    it('should not be assignable to another value', (done) => {
                        const channelCountMode = 'max';

                        try {
                            channelSplitterNode.channelCountMode = channelCountMode;
                        } catch (err) {
                            expect(err.code).to.equal(11);
                            expect(err.name).to.equal('InvalidStateError');

                            done();
                        }
                    });
                });

                describe('channelInterpretation', () => {
                    let channelSplitterNode;

                    beforeEach(() => {
                        channelSplitterNode = createChannelSplitterNode(context);
                    });

                    it('should not be assignable to another value', (done) => {
                        const channelInterpretation = 'speakers';

                        try {
                            channelSplitterNode.channelInterpretation = channelInterpretation;
                        } catch (err) {
                            expect(err.code).to.equal(11);
                            expect(err.name).to.equal('InvalidStateError');

                            done();
                        }
                    });
                });

                describe('numberOfInputs', () => {
                    let channelSplitterNode;

                    beforeEach(() => {
                        channelSplitterNode = createChannelSplitterNode(context);
                    });

                    it('should be readonly', () => {
                        expect(() => {
                            channelSplitterNode.numberOfInputs = 2;
                        }).to.throw(TypeError);
                    });
                });

                describe('numberOfOutputs', () => {
                    let channelSplitterNode;

                    beforeEach(() => {
                        channelSplitterNode = createChannelSplitterNode(context);
                    });

                    it('should be readonly', () => {
                        expect(() => {
                            channelSplitterNode.numberOfOutputs = 2;
                        }).to.throw(TypeError);
                    });
                });

                describe('connect()', () => {
                    for (const type of ['AudioNode', 'AudioParam']) {
                        describe(`with an ${type}`, () => {
                            let audioNodeOrAudioParam;
                            let channelSplitterNode;

                            beforeEach(() => {
                                const gainNode = new GainNode(context);

                                audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                                channelSplitterNode = createChannelSplitterNode(context);
                            });

                            if (type === 'AudioNode') {
                                it('should be chainable', () => {
                                    expect(channelSplitterNode.connect(audioNodeOrAudioParam)).to.equal(audioNodeOrAudioParam);
                                });
                            } else {
                                it('should not be chainable', () => {
                                    expect(channelSplitterNode.connect(audioNodeOrAudioParam)).to.be.undefined;
                                });
                            }

                            it('should accept duplicate connections', () => {
                                channelSplitterNode.connect(audioNodeOrAudioParam);
                                channelSplitterNode.connect(audioNodeOrAudioParam);
                            });

                            it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                                try {
                                    channelSplitterNode.connect(audioNodeOrAudioParam, -1);
                                } catch (err) {
                                    expect(err.code).to.equal(1);
                                    expect(err.name).to.equal('IndexSizeError');

                                    done();
                                }
                            });

                            if (type === 'AudioNode') {
                                it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                                    try {
                                        channelSplitterNode.connect(audioNodeOrAudioParam, 0, -1);
                                    } catch (err) {
                                        expect(err.code).to.equal(1);
                                        expect(err.name).to.equal('IndexSizeError');

                                        done();
                                    }
                                });

                                it('should not throw an error if the connection creates a cycle by connecting to the source', () => {
                                    audioNodeOrAudioParam.connect(channelSplitterNode).connect(audioNodeOrAudioParam);
                                });

                                it('should not throw an error if the connection creates a cycle by connecting to an AudioParam of the source', () => {
                                    audioNodeOrAudioParam.connect(channelSplitterNode).connect(audioNodeOrAudioParam.gain);
                                });
                            }
                        });

                        describe(`with an ${type} of another context`, () => {
                            let anotherContext;
                            let audioNodeOrAudioParam;
                            let channelSplitterNode;

                            afterEach(() => anotherContext.close?.());

                            beforeEach(() => {
                                anotherContext = createContext();

                                const gainNode = new GainNode(anotherContext);

                                audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                                channelSplitterNode = createChannelSplitterNode(context);
                            });

                            it('should throw an InvalidAccessError', (done) => {
                                try {
                                    channelSplitterNode.connect(audioNodeOrAudioParam);
                                } catch (err) {
                                    expect(err.code).to.equal(15);
                                    expect(err.name).to.equal('InvalidAccessError');

                                    done();
                                }
                            });
                        });

                        describe(`with an ${type} of a native context`, () => {
                            let channelSplitterNode;
                            let nativeAudioNodeOrAudioParam;
                            let nativeContext;

                            afterEach(() => nativeContext.close?.());

                            beforeEach(() => {
                                channelSplitterNode = createChannelSplitterNode(context);
                                nativeContext = description.includes('Offline')
                                    ? createNativeOfflineAudioContext()
                                    : createNativeAudioContext();

                                const nativeGainNode = nativeContext.createGain();

                                nativeAudioNodeOrAudioParam = type === 'AudioNode' ? nativeGainNode : nativeGainNode.gain;
                            });

                            it('should throw an InvalidAccessError', (done) => {
                                try {
                                    channelSplitterNode.connect(nativeAudioNodeOrAudioParam);
                                } catch (err) {
                                    expect(err.code).to.equal(15);
                                    expect(err.name).to.equal('InvalidAccessError');

                                    done();
                                }
                            });
                        });
                    }

                    // @todo There is currently no way to disable the autoplay policy on BrowserStack or Sauce Labs.
                    // eslint-disable-next-line no-undef
                    if (!process.env.CI || description.includes('Offline')) {
                        describe('with a cycle', () => {
                            let renderer;

                            beforeEach(() => {
                                renderer = createRenderer({
                                    context,
                                    length: context.length === undefined ? 5 : undefined,
                                    setup(destination) {
                                        const channelSplitterNode = createChannelSplitterNode(context);
                                        const constantSourceNode = new ConstantSourceNode(context);
                                        const gainNode = new GainNode(context);

                                        constantSourceNode.connect(channelSplitterNode).connect(destination);

                                        channelSplitterNode.connect(gainNode).connect(channelSplitterNode);

                                        return { channelSplitterNode, constantSourceNode, gainNode };
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
                    }
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
                                    const channelSplitterNode = createChannelSplitterNode(context);
                                    const firstDummyGainNode = new GainNode(context);
                                    const secondDummyGainNode = new GainNode(context);

                                    audioBuffer.copyToChannel(new Float32Array(values), 0);

                                    audioBufferSourceNode.buffer = audioBuffer;

                                    audioBufferSourceNode.connect(channelSplitterNode).connect(firstDummyGainNode).connect(destination);

                                    channelSplitterNode.connect(secondDummyGainNode);

                                    return { audioBufferSourceNode, channelSplitterNode, firstDummyGainNode, secondDummyGainNode };
                                }
                            });
                    });

                    // @todo There is currently no way to disable the autoplay policy on BrowserStack or Sauce Labs.
                    // eslint-disable-next-line no-undef
                    if (!process.env.CI || description.includes('Offline')) {
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
                                    prepare({ channelSplitterNode }) {
                                        channelSplitterNode.disconnect();
                                    },
                                    start(startTime, { audioBufferSourceNode }) {
                                        audioBufferSourceNode.start(startTime);
                                    }
                                }).then((channelData) => {
                                    expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                                });
                            });
                        });
                    }

                    describe('with an output', () => {
                        describe('with a value which is out-of-bound', () => {
                            let channelSplitterNode;

                            beforeEach(() => {
                                channelSplitterNode = createChannelSplitterNode(context);
                            });

                            it('should throw an IndexSizeError', (done) => {
                                try {
                                    channelSplitterNode.disconnect(-1);
                                } catch (err) {
                                    expect(err.code).to.equal(1);
                                    expect(err.name).to.equal('IndexSizeError');

                                    done();
                                }
                            });
                        });

                        // @todo There is currently no way to disable the autoplay policy on BrowserStack or Sauce Labs.
                        // eslint-disable-next-line no-undef
                        if (!process.env.CI || description.includes('Offline')) {
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
                                        prepare({ channelSplitterNode }) {
                                            channelSplitterNode.disconnect(0);
                                        },
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

                    describe('with a destination', () => {
                        describe('without a connection to the given destination', () => {
                            let channelSplitterNode;

                            beforeEach(() => {
                                channelSplitterNode = createChannelSplitterNode(context);
                            });

                            it('should throw an InvalidAccessError', (done) => {
                                try {
                                    channelSplitterNode.disconnect(new GainNode(context));
                                } catch (err) {
                                    expect(err.code).to.equal(15);
                                    expect(err.name).to.equal('InvalidAccessError');

                                    done();
                                }
                            });
                        });

                        // @todo There is currently no way to disable the autoplay policy on BrowserStack or Sauce Labs.
                        // eslint-disable-next-line no-undef
                        if (!process.env.CI || description.includes('Offline')) {
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
                                        prepare({ channelSplitterNode, firstDummyGainNode }) {
                                            channelSplitterNode.disconnect(firstDummyGainNode);
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
                                        prepare({ channelSplitterNode, secondDummyGainNode }) {
                                            channelSplitterNode.disconnect(secondDummyGainNode);
                                        },
                                        start(startTime, { audioBufferSourceNode }) {
                                            audioBufferSourceNode.start(startTime);
                                        }
                                    }).then((channelData) => {
                                        expect(Array.from(channelData)).to.deep.equal(values);
                                    });
                                });
                            });
                        }
                    });

                    describe('with a destination and an output', () => {
                        let channelSplitterNode;

                        beforeEach(() => {
                            channelSplitterNode = createChannelSplitterNode(context);
                        });

                        it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                            try {
                                channelSplitterNode.disconnect(new GainNode(context), -1);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                        it('should throw an InvalidAccessError if there is no similar connection', (done) => {
                            try {
                                channelSplitterNode.disconnect(new GainNode(context), 0);
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });
                    });

                    describe('with a destination, an output and an input', () => {
                        let channelSplitterNode;

                        beforeEach(() => {
                            channelSplitterNode = createChannelSplitterNode(context);
                        });

                        it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                            try {
                                channelSplitterNode.disconnect(new GainNode(context), -1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                        it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                            try {
                                channelSplitterNode.disconnect(new GainNode(context), 0, -1);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                        it('should throw an InvalidAccessError if there is no similar connection', (done) => {
                            try {
                                channelSplitterNode.disconnect(new GainNode(context), 0, 0);
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
}
