import { AnalyserNode, AudioBuffer, AudioBufferSourceNode, ConstantSourceNode, GainNode } from '../../../src/module';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
import { createNativeAudioContext } from '../../helper/create-native-audio-context';
import { createNativeOfflineAudioContext } from '../../helper/create-native-offline-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';

const createAnalyserNodeWithConstructor = (context, options = null) => {
    if (options === null) {
        return new AnalyserNode(context);
    }

    return new AnalyserNode(context, options);
};
const createAnalyserNodeWithFactoryFunction = (context, options = null) => {
    const analyserNode = context.createAnalyser();

    if (options !== null && options.channelCount !== undefined) {
        analyserNode.channelCount = options.channelCount;
    }

    if (options !== null && options.channelCountMode !== undefined) {
        analyserNode.channelCountMode = options.channelCountMode;
    }

    if (options !== null && options.channelInterpretation !== undefined) {
        analyserNode.channelInterpretation = options.channelInterpretation;
    }

    if (options !== null && options.fftSize !== undefined) {
        analyserNode.fftSize = options.fftSize;
    }

    if (options !== null && options.maxDecibels !== undefined) {
        analyserNode.maxDecibels = options.maxDecibels;
    }

    if (options !== null && options.minDecibels !== undefined) {
        analyserNode.minDecibels = options.minDecibels;
    }

    if (options !== null && options.smoothingTimeConstant !== undefined) {
        analyserNode.smoothingTimeConstant = options.smoothingTimeConstant;
    }

    return analyserNode;
};
const testCases = {
    'constructor of a MinimalAudioContext': {
        createAnalyserNode: createAnalyserNodeWithConstructor,
        createContext: createMinimalAudioContext
    },
    'constructor of a MinimalOfflineAudioContext': {
        createAnalyserNode: createAnalyserNodeWithConstructor,
        createContext: createMinimalOfflineAudioContext
    },
    'constructor of an AudioContext': {
        createAnalyserNode: createAnalyserNodeWithConstructor,
        createContext: createAudioContext
    },
    'constructor of an OfflineAudioContext': {
        createAnalyserNode: createAnalyserNodeWithConstructor,
        createContext: createOfflineAudioContext
    },
    'factory function of an AudioContext': {
        createAnalyserNode: createAnalyserNodeWithFactoryFunction,
        createContext: createAudioContext
    },
    'factory function of an OfflineAudioContext': {
        createAnalyserNode: createAnalyserNodeWithFactoryFunction,
        createContext: createOfflineAudioContext
    }
};

if (typeof window !== 'undefined') {
    describe('AnalyserNode', () => {
        for (const [description, { createAnalyserNode, createContext }] of Object.entries(testCases)) {
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
                                let analyserNode;

                                beforeEach(() => {
                                    analyserNode = createAnalyserNode(context);
                                });

                                it('should return an instance of the AnalyserNode constructor', () => {
                                    expect(analyserNode).to.be.an.instanceOf(AnalyserNode);
                                });

                                it('should return an implementation of the EventTarget interface', () => {
                                    expect(analyserNode.addEventListener).to.be.a('function');
                                    expect(analyserNode.dispatchEvent).to.be.a('function');
                                    expect(analyserNode.removeEventListener).to.be.a('function');
                                });

                                it('should return an implementation of the AudioNode interface', () => {
                                    expect(analyserNode.channelCount).to.equal(2);
                                    expect(analyserNode.channelCountMode).to.equal('max');
                                    expect(analyserNode.channelInterpretation).to.equal('speakers');
                                    expect(analyserNode.connect).to.be.a('function');
                                    expect(analyserNode.context).to.be.an.instanceOf(context.constructor);
                                    expect(analyserNode.disconnect).to.be.a('function');
                                    expect(analyserNode.numberOfInputs).to.equal(1);
                                    expect(analyserNode.numberOfOutputs).to.equal(1);
                                });

                                it('should return an implementation of the AnalyserNode interface', () => {
                                    expect(analyserNode.fftSize).to.equal(2048);
                                    expect(analyserNode.frequencyBinCount).to.equal(1024);
                                    expect(analyserNode.getByteFrequencyData).to.be.a('function');
                                    expect(analyserNode.getByteTimeDomainData).to.be.a('function');
                                    expect(analyserNode.getFloatFrequencyData).to.be.a('function');
                                    expect(analyserNode.getFloatTimeDomainData).to.be.a('function');
                                    expect(analyserNode.maxDecibels).to.equal(-30);
                                    expect(analyserNode.minDecibels).to.equal(-100);
                                    expect(analyserNode.smoothingTimeConstant).to.equal(0.8);
                                });
                            });

                            describe('with valid options', () => {
                                it('should return an instance with the given channelCount', () => {
                                    const channelCount = 4;
                                    const analyserNode = createAnalyserNode(context, { channelCount });

                                    expect(analyserNode.channelCount).to.equal(channelCount);
                                });

                                it('should return an instance with the given channelCountMode', () => {
                                    const channelCountMode = 'explicit';
                                    const analyserNode = createAnalyserNode(context, { channelCountMode });

                                    expect(analyserNode.channelCountMode).to.equal(channelCountMode);
                                });

                                it('should return an instance with the given channelInterpretation', () => {
                                    const channelInterpretation = 'discrete';
                                    const analyserNode = createAnalyserNode(context, { channelInterpretation });

                                    expect(analyserNode.channelInterpretation).to.equal(channelInterpretation);
                                });

                                it('should return an instance with the given fftSize', () => {
                                    const fftSize = 1024;
                                    const analyserNode = createAnalyserNode(context, { fftSize });

                                    expect(analyserNode.fftSize).to.equal(fftSize);
                                });

                                it('should return an instance with the given maxDecibels', () => {
                                    const maxDecibels = -20;
                                    const analyserNode = createAnalyserNode(context, { maxDecibels });

                                    expect(analyserNode.maxDecibels).to.equal(maxDecibels);
                                });

                                it('should return an instance with the given minDecibels', () => {
                                    const minDecibels = -90;
                                    const analyserNode = createAnalyserNode(context, { minDecibels });

                                    expect(analyserNode.minDecibels).to.equal(minDecibels);
                                });

                                it('should return an instance with the given smoothingTimeConstant', () => {
                                    const smoothingTimeConstant = 0.5;
                                    const analyserNode = createAnalyserNode(context, { smoothingTimeConstant });

                                    expect(analyserNode.smoothingTimeConstant).to.equal(smoothingTimeConstant);
                                });
                            });

                            describe('with invalid options', () => {
                                describe('with an fftSize below 32', () => {
                                    it('should throw an IndexSizeError', (done) => {
                                        try {
                                            createAnalyserNode(context, { fftSize: 16 });
                                        } catch (err) {
                                            expect(err.code).to.equal(1);
                                            expect(err.name).to.equal('IndexSizeError');

                                            done();
                                        }
                                    });
                                });

                                describe('with an fftSize above 32768', () => {
                                    it('should throw an IndexSizeError', (done) => {
                                        try {
                                            createAnalyserNode(context, { fftSize: 65536 });
                                        } catch (err) {
                                            expect(err.code).to.equal(1);
                                            expect(err.name).to.equal('IndexSizeError');

                                            done();
                                        }
                                    });
                                });

                                describe('with an fftSize that is not a power of two', () => {
                                    it('should throw an IndexSizeError', (done) => {
                                        try {
                                            createAnalyserNode(context, { fftSize: 200 });
                                        } catch (err) {
                                            expect(err.code).to.equal(1);
                                            expect(err.name).to.equal('IndexSizeError');

                                            done();
                                        }
                                    });
                                });

                                describe('with a value for maxDecibels that is equal to minDecibels', () => {
                                    it('should throw an IndexSizeError', (done) => {
                                        try {
                                            createAnalyserNode(context, { maxDecibels: -100 });
                                        } catch (err) {
                                            expect(err.code).to.equal(1);
                                            expect(err.name).to.equal('IndexSizeError');

                                            done();
                                        }
                                    });
                                });

                                describe('with a value for minDecibels that is equal to maxDecibels', () => {
                                    it('should throw an IndexSizeError', (done) => {
                                        try {
                                            createAnalyserNode(context, { minDecibels: -30 });
                                        } catch (err) {
                                            expect(err.code).to.equal(1);
                                            expect(err.name).to.equal('IndexSizeError');

                                            done();
                                        }
                                    });
                                });

                                describe('with a smoothingTimeConstant below 0', () => {
                                    it('should throw an IndexSizeError', (done) => {
                                        try {
                                            createAnalyserNode(context, { smoothingTimeConstant: -0.1 });
                                        } catch (err) {
                                            expect(err.code).to.equal(1);
                                            expect(err.name).to.equal('IndexSizeError');

                                            done();
                                        }
                                    });
                                });

                                describe('with a smoothingTimeConstant above 1', () => {
                                    it('should throw an IndexSizeError', (done) => {
                                        try {
                                            createAnalyserNode(context, { smoothingTimeConstant: 1.1 });
                                        } catch (err) {
                                            expect(err.code).to.equal(1);
                                            expect(err.name).to.equal('IndexSizeError');

                                            done();
                                        }
                                    });
                                });
                            });
                        });
                    }
                });

                describe('channelCount', () => {
                    let analyserNode;

                    beforeEach(() => {
                        analyserNode = createAnalyserNode(context);
                    });

                    it('should be assignable to another value', () => {
                        const channelCount = 4;

                        analyserNode.channelCount = channelCount;

                        expect(analyserNode.channelCount).to.equal(channelCount);
                    });
                });

                describe('channelCountMode', () => {
                    let analyserNode;

                    beforeEach(() => {
                        analyserNode = createAnalyserNode(context);
                    });

                    it('should be assignable to another value', () => {
                        const channelCountMode = 'explicit';

                        analyserNode.channelCountMode = channelCountMode;

                        expect(analyserNode.channelCountMode).to.equal(channelCountMode);
                    });
                });

                describe('channelInterpretation', () => {
                    let analyserNode;

                    beforeEach(() => {
                        analyserNode = createAnalyserNode(context);
                    });

                    it('should be assignable to another value', () => {
                        const channelInterpretation = 'discrete';

                        analyserNode.channelInterpretation = channelInterpretation;

                        expect(analyserNode.channelInterpretation).to.equal(channelInterpretation);
                    });
                });

                describe('fftSize', () => {
                    // @todo
                });

                describe('frequencyBinCount', () => {
                    let analyserNode;

                    beforeEach(() => {
                        analyserNode = createAnalyserNode(context);
                    });

                    it('should be readonly', () => {
                        expect(() => {
                            analyserNode.frequencyBinCount = 512;
                        }).to.throw(TypeError);
                    });
                });

                describe('maxDecibels', () => {
                    // @todo
                });

                describe('minDecibels', () => {
                    // @todo
                });

                describe('numberOfInputs', () => {
                    let analyserNode;

                    beforeEach(() => {
                        analyserNode = createAnalyserNode(context);
                    });

                    it('should be readonly', () => {
                        expect(() => {
                            analyserNode.numberOfInputs = 2;
                        }).to.throw(TypeError);
                    });
                });

                describe('numberOfOutputs', () => {
                    let analyserNode;

                    beforeEach(() => {
                        analyserNode = createAnalyserNode(context);
                    });

                    it('should be readonly', () => {
                        expect(() => {
                            analyserNode.numberOfOutputs = 2;
                        }).to.throw(TypeError);
                    });
                });

                describe('smoothingTimeConstant', () => {
                    // @todo
                });

                describe('connect()', () => {
                    for (const type of ['AudioNode', 'AudioParam']) {
                        describe(`with an ${type}`, () => {
                            let analyserNode;
                            let audioNodeOrAudioParam;

                            beforeEach(() => {
                                analyserNode = createAnalyserNode(context);

                                const gainNode = new GainNode(context);

                                audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                            });

                            if (type === 'AudioNode') {
                                it('should be chainable', () => {
                                    expect(analyserNode.connect(audioNodeOrAudioParam)).to.equal(audioNodeOrAudioParam);
                                });
                            } else {
                                it('should not be chainable', () => {
                                    expect(analyserNode.connect(audioNodeOrAudioParam)).to.be.undefined;
                                });
                            }

                            it('should accept duplicate connections', () => {
                                analyserNode.connect(audioNodeOrAudioParam);
                                analyserNode.connect(audioNodeOrAudioParam);
                            });

                            it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                                try {
                                    analyserNode.connect(audioNodeOrAudioParam, -1);
                                } catch (err) {
                                    expect(err.code).to.equal(1);
                                    expect(err.name).to.equal('IndexSizeError');

                                    done();
                                }
                            });

                            if (type === 'AudioNode') {
                                it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                                    try {
                                        analyserNode.connect(audioNodeOrAudioParam, 0, -1);
                                    } catch (err) {
                                        expect(err.code).to.equal(1);
                                        expect(err.name).to.equal('IndexSizeError');

                                        done();
                                    }
                                });

                                it('should not throw an error if the connection creates a cycle by connecting to the source', () => {
                                    audioNodeOrAudioParam.connect(analyserNode).connect(audioNodeOrAudioParam);
                                });

                                it('should not throw an error if the connection creates a cycle by connecting to an AudioParam of the source', () => {
                                    audioNodeOrAudioParam.connect(analyserNode).connect(audioNodeOrAudioParam.gain);
                                });
                            }
                        });

                        describe(`with an ${type} of another context`, () => {
                            let analyserNode;
                            let anotherContext;
                            let audioNodeOrAudioParam;

                            afterEach(() => anotherContext.close?.());

                            beforeEach(function () {
                                this.timeout(5000);

                                analyserNode = createAnalyserNode(context);
                                anotherContext = createContext();

                                const gainNode = new GainNode(anotherContext);

                                audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                            });

                            it('should throw an InvalidAccessError', (done) => {
                                try {
                                    analyserNode.connect(audioNodeOrAudioParam);
                                } catch (err) {
                                    expect(err.code).to.equal(15);
                                    expect(err.name).to.equal('InvalidAccessError');

                                    done();
                                }
                            });
                        });

                        describe(`with an ${type} of a native context`, () => {
                            let analyserNode;
                            let nativeAudioNodeOrAudioParam;
                            let nativeContext;

                            afterEach(() => nativeContext.close?.());

                            beforeEach(() => {
                                analyserNode = createAnalyserNode(context);
                                nativeContext = description.includes('Offline')
                                    ? createNativeOfflineAudioContext()
                                    : createNativeAudioContext();

                                const nativeGainNode = nativeContext.createGain();

                                nativeAudioNodeOrAudioParam = type === 'AudioNode' ? nativeGainNode : nativeGainNode.gain;
                            });

                            it('should throw an InvalidAccessError', (done) => {
                                try {
                                    analyserNode.connect(nativeAudioNodeOrAudioParam);
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
                                    const analyserNode = createAnalyserNode(context);
                                    const constantSourceNode = new ConstantSourceNode(context);
                                    const gainNode = new GainNode(context);

                                    constantSourceNode.connect(analyserNode).connect(destination);

                                    analyserNode.connect(gainNode).connect(analyserNode);

                                    return { analyserNode, constantSourceNode, gainNode };
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
                                    const analyserNode = createAnalyserNode(context);
                                    const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                                    const audioBufferSourceNode = new AudioBufferSourceNode(context);
                                    const firstDummyGainNode = new GainNode(context);
                                    const secondDummyGainNode = new GainNode(context);

                                    audioBuffer.copyToChannel(new Float32Array(values), 0);

                                    audioBufferSourceNode.buffer = audioBuffer;

                                    audioBufferSourceNode.connect(analyserNode).connect(firstDummyGainNode).connect(destination);

                                    analyserNode.connect(secondDummyGainNode);

                                    return { analyserNode, audioBufferSourceNode, firstDummyGainNode, secondDummyGainNode };
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
                                prepare({ analyserNode }) {
                                    analyserNode.disconnect();
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
                            let analyserNode;

                            beforeEach(() => {
                                analyserNode = createAnalyserNode(context);
                            });

                            it('should throw an IndexSizeError', (done) => {
                                try {
                                    analyserNode.disconnect(-1);
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
                                    prepare({ analyserNode }) {
                                        analyserNode.disconnect(0);
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
                            let analyserNode;

                            beforeEach(() => {
                                analyserNode = createAnalyserNode(context);
                            });

                            it('should throw an InvalidAccessError', (done) => {
                                try {
                                    analyserNode.disconnect(new GainNode(context));
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
                                    prepare({ analyserNode, firstDummyGainNode }) {
                                        analyserNode.disconnect(firstDummyGainNode);
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
                                    prepare({ analyserNode, secondDummyGainNode }) {
                                        analyserNode.disconnect(secondDummyGainNode);
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
                        let analyserNode;

                        beforeEach(() => {
                            analyserNode = createAnalyserNode(context);
                        });

                        it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                            try {
                                analyserNode.disconnect(new GainNode(context), -1);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                        it('should throw an InvalidAccessError if there is no similar connection', (done) => {
                            try {
                                analyserNode.disconnect(new GainNode(context), 0);
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });
                    });

                    describe('with a destination, an output and an input', () => {
                        let analyserNode;

                        beforeEach(() => {
                            analyserNode = createAnalyserNode(context);
                        });

                        it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                            try {
                                analyserNode.disconnect(new GainNode(context), -1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                        it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                            try {
                                analyserNode.disconnect(new GainNode(context), 0, -1);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                        it('should throw an InvalidAccessError if there is no similar connection', (done) => {
                            try {
                                analyserNode.disconnect(new GainNode(context), 0, 0);
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });
                    });
                });

                describe('getFloatTimeDomainData()', () => {
                    let analyserNode;

                    beforeEach(() => {
                        analyserNode = createAnalyserNode(context);
                    });

                    it('should return time-domain data', () => {
                        const data = new Float32Array(analyserNode.fftSize);

                        analyserNode.getFloatTimeDomainData(data);

                        expect(data[0]).to.equal(0);
                    });
                });
            });
        }
    });
}
