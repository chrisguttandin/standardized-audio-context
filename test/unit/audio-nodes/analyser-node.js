import { AnalyserNode, AudioBuffer, AudioBufferSourceNode, GainNode } from '../../../src/module';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
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
    'constructor with AudioContext': {
        createAnalyserNode: createAnalyserNodeWithConstructor,
        createContext: createAudioContext
    },
    'constructor with MinimalAudioContext': {
        createAnalyserNode: createAnalyserNodeWithConstructor,
        createContext: createMinimalAudioContext
    },
    'constructor with MinimalOfflineAudioContext': {
        createAnalyserNode: createAnalyserNodeWithConstructor,
        createContext: createMinimalOfflineAudioContext
    },
    'constructor with OfflineAudioContext': {
        createAnalyserNode: createAnalyserNodeWithConstructor,
        createContext: createOfflineAudioContext
    },
    'factory function of AudioContext': {
        createAnalyserNode: createAnalyserNodeWithFactoryFunction,
        createContext: createAudioContext
    },
    'factory function of OfflineAudioContext': {
        createAnalyserNode: createAnalyserNodeWithFactoryFunction,
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

describe('AnalyserNode', () => {

    for (const [ description, { createAnalyserNode, createContext } ] of Object.entries(testCases)) {

        describe(`with ${ description }`, () => {

            let context;

            afterEach(() => {
                if (context.close !== undefined) {
                    return context.close();
                }
            });

            beforeEach(() => context = createContext());

            describe('constructor()', () => {

                describe('without any options', () => {

                    let analyserNode;

                    beforeEach(() => {
                        analyserNode = createAnalyserNode(context);
                    });

                    it('should return an instance of the EventTarget interface', () => {
                        expect(analyserNode.addEventListener).to.be.a('function');
                        expect(analyserNode.dispatchEvent).to.be.a('function');
                        expect(analyserNode.removeEventListener).to.be.a('function');
                    });

                    it('should return an instance of the AudioNode interface', () => {
                        expect(analyserNode.channelCount).to.equal(2);
                        expect(analyserNode.channelCountMode).to.equal('max');
                        expect(analyserNode.channelInterpretation).to.equal('speakers');
                        expect(analyserNode.connect).to.be.a('function');
                        expect(analyserNode.context).to.be.an.instanceOf(context.constructor);
                        expect(analyserNode.disconnect).to.be.a('function');
                        expect(analyserNode.numberOfInputs).to.equal(1);
                        expect(analyserNode.numberOfOutputs).to.equal(1);
                    });

                    it('should return an instance of the AnalyserNode interface', () => {
                        expect(analyserNode.fftSize).to.equal(2048);
                        expect(analyserNode.frequencyBinCount).to.equal(1024);
                        expect(analyserNode.getByteFrequencyData).to.be.a('function');
                        expect(analyserNode.getByteTimeDomainData).to.be.a('function');
                        expect(analyserNode.getFloatFrequencyData).to.be.a('function');
                        expect(analyserNode.getFloatTimeDomainData).to.be.a('function');
                        expect(analyserNode.maxDecibels).to.equal(-30);
                        expect(analyserNode.minDecibels).to.equal(-100);
                        expect(analyserNode.smoothingTimeConstant).to.closeTo(0.8, 0.0000001);
                    });

                    it('should throw an error if the AudioContext is closed', (done) => {
                        ((context.close === undefined) ? context.startRendering() : context.close())
                            .then(() => createAnalyserNode(context))
                            .catch((err) => {
                                expect(err.code).to.equal(11);
                                expect(err.name).to.equal('InvalidStateError');

                                context.close = undefined;

                                done();
                            });
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

            describe('connect()', () => {

                let analyserNode;

                beforeEach(() => {
                    analyserNode = createAnalyserNode(context);
                });

                it('should be chainable', () => {
                    const gainNode = new GainNode(context);

                    expect(analyserNode.connect(gainNode)).to.equal(gainNode);
                });

                it('should not be connectable to an AudioNode of another AudioContext', (done) => {
                    const anotherContext = createContext();

                    try {
                        analyserNode.connect(anotherContext.destination);
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
                        analyserNode.connect(gainNode.gain);
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
                        analyserNode.connect(gainNode.gain, -1);
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
                            const analyserNode = createAnalyserNode(context);
                            const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                            const audioBufferSourceNode = new AudioBufferSourceNode(context);
                            const firstDummyGainNode = new GainNode(context);
                            const secondDummyGainNode = new GainNode(context);

                            audioBuffer.copyToChannel(new Float32Array(values), 0);

                            audioBufferSourceNode.buffer = audioBuffer;

                            audioBufferSourceNode
                                .connect(analyserNode)
                                .connect(firstDummyGainNode)
                                .connect(destination);

                            analyserNode.connect(secondDummyGainNode);

                            return { analyserNode, audioBufferSourceNode, firstDummyGainNode, secondDummyGainNode };
                        }
                    });
                });

                it('should be possible to disconnect a destination', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ analyserNode, firstDummyGainNode }) {
                            analyserNode.disconnect(firstDummyGainNode);
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
                        prepare ({ analyserNode, secondDummyGainNode }) {
                            analyserNode.disconnect(secondDummyGainNode);
                        },
                        start (startTime, { audioBufferSourceNode }) {
                            audioBufferSourceNode.start(startTime);
                        }
                    })
                        .then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal(values);
                        });
                });

                it('should be possible to disconnect all destinations', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ analyserNode }) {
                            analyserNode.disconnect();
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
