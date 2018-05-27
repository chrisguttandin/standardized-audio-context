import { AudioBuffer, AudioBufferSourceNode, AudioWorkletNode, GainNode, IIRFilterNode } from '../../../src/module';
import { addAudioWorkletModule } from '../../../src/add-audio-worklet-module';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';

const createIIRFilterNodeWithConstructor = (context, options) => {
    return new IIRFilterNode(context, options);
};
const createIIRFilterNodeWithFactoryFunction = (context, options) => {
    const iIRFilterNode = context.createIIRFilter(options.feedforward, options.feedback);

    if (options !== null && options.channelCount !== undefined) {
        iIRFilterNode.channelCount = options.channelCount;
    }

    if (options !== null && options.channelCountMode !== undefined) {
        iIRFilterNode.channelCountMode = options.channelCountMode;
    }

    if (options !== null && options.channelInterpretation !== undefined) {
        iIRFilterNode.channelInterpretation = options.channelInterpretation;
    }

    return iIRFilterNode;
};
const testCases = {
    'constructor with AudioContext': {
        createContext: createAudioContext,
        createIIRFilterNode: createIIRFilterNodeWithConstructor
    },
    'constructor with MinimalAudioContext': {
        createContext: createMinimalAudioContext,
        createIIRFilterNode: createIIRFilterNodeWithConstructor
    },
    'constructor with MinimalOfflineAudioContext': {
        createContext: createMinimalOfflineAudioContext,
        createIIRFilterNode: createIIRFilterNodeWithConstructor
    },
    'constructor with OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createIIRFilterNode: createIIRFilterNodeWithConstructor
    },
    'factory function of AudioContext': {
        createContext: createAudioContext,
        createIIRFilterNode: createIIRFilterNodeWithFactoryFunction
    },
    'factory function of OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createIIRFilterNode: createIIRFilterNodeWithFactoryFunction
    }
};

// @todo Skip about 50% of the test cases in Safari or when running on Travis to prevent the browsers from crashing while running the tests.
if ((!/Chrome/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent)) || process.env.TRAVIS) { // eslint-disable-line no-undef
    for (const description of Object.keys(testCases)) {
        if (Math.random() < 0.5) {
            delete testCases[ description ];
        }
    }
}

describe('IIRFilterNode', () => {

    for (const [ description, { createIIRFilterNode, createContext } ] of Object.entries(testCases)) {

        describe(`with the ${ description }`, () => {

            let context;
            let feedback;
            let feedforward;

            afterEach(() => {
                if (context.close !== undefined) {
                    return context.close();
                }
            });

            beforeEach(() => {
                context = createContext();
                feedback = [ 1 ];
                feedforward = [ 1 ];
            });

            describe('constructor()', () => {

                describe('with invalid options', () => {

                    describe('without any feedback coefficients', () => {

                        it('should throw an NotSupportedError', (done) => {
                            try {
                                createIIRFilterNode(context, { feedback: [ ], feedforward });
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
                                createIIRFilterNode(context, { feedback: [ 0, 1 ], feedforward });
                            } catch (err) {
                                expect(err.code).to.equal(11);
                                expect(err.name).to.equal('InvalidStateError');

                                done();
                            }
                        });

                    });

                    describe('with too many feedback coefficients', () => {

                        it('should throw an NotSupportedError', (done) => {
                            try {
                                createIIRFilterNode(context, { feedback: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21 ], feedforward });
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });

                    });

                    describe('without any feedforward coefficients', () => {

                        it('should throw an NotSupportedError', (done) => {
                            try {
                                createIIRFilterNode(context, { feedback, feedforward: [ ] });
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
                                createIIRFilterNode(context, { feedback, feedforward: [ 0 ] });
                            } catch (err) {
                                expect(err.code).to.equal(11);
                                expect(err.name).to.equal('InvalidStateError');

                                done();
                            }
                        });

                    });

                    describe('with too many feedforward coefficients', () => {

                        it('should throw an NotSupportedError', (done) => {
                            try {
                                createIIRFilterNode(context, { feedback, feedforward: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21 ] });
                            } catch (err) {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');

                                done();
                            }
                        });

                    });

                });

                describe('with valid options', () => {

                    it('should return an instance of the EventTarget interface', () => {
                        const iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });

                        expect(iIRFilterNode.addEventListener).to.be.a('function');
                        expect(iIRFilterNode.dispatchEvent).to.be.a('function');
                        expect(iIRFilterNode.removeEventListener).to.be.a('function');
                    });

                    it('should return an instance of the AudioNode interface', () => {
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

                    it('should return an instance of the IIRFilterNode interface', () => {
                        const iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });

                        expect(iIRFilterNode.getFrequencyResponse).to.be.a('function');
                    });

                    it('should throw an error if the AudioContext is closed', (done) => {
                        ((context.close === undefined) ? context.startRendering() : context.close())
                            .then(() => createIIRFilterNode(context, { feedback, feedforward }))
                            .catch((err) => {
                                expect(err.code).to.equal(11);
                                expect(err.name).to.equal('InvalidStateError');

                                context.close = undefined;

                                done();
                            });
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

                    describe('rendering', () => {

                        for (const withAnAppendedAudioWorklet of (description.includes('Offline') ? [ true, false ] : [ false ])) {

                            describe(`${ withAnAppendedAudioWorklet ? 'with' : 'without' } an appended AudioWorklet`, () => {

                                let renderer;

                                describe('with some filter coefficients', () => {

                                    beforeEach(async function () {
                                        this.timeout(10000);

                                        if (withAnAppendedAudioWorklet) {
                                            await addAudioWorkletModule(context, 'base/test/fixtures/gain-processor.js');
                                        }

                                        renderer = createRenderer({
                                            context,
                                            length: (context.length === undefined) ? 5 : undefined,
                                            prepare (destination) {
                                                const audioBuffer = new AudioBuffer({ length: 5, numberOfChannels: 1, sampleRate: context.sampleRate });
                                                const audioBufferSourceNode = new AudioBufferSourceNode(context);
                                                const audioWorkletNode = (withAnAppendedAudioWorklet) ? new AudioWorkletNode(context, 'gain-processor') : null;
                                                const iIRFilterNode = createIIRFilterNode(context, { feedback: [ 1, -0.5 ], feedforward: [ 1, -1 ] });

                                                audioBuffer.copyToChannel(new Float32Array([ 1, 0, 0, 0, 0 ]), 0);
                                                // @todo Render a second channel with the following values: 0, 1, 1 ...

                                                audioBufferSourceNode.buffer = audioBuffer;

                                                if (withAnAppendedAudioWorklet) {
                                                    audioBufferSourceNode
                                                        .connect(iIRFilterNode)
                                                        .connect(audioWorkletNode)
                                                        .connect(destination);
                                                } else {
                                                    audioBufferSourceNode
                                                        .connect(iIRFilterNode)
                                                        .connect(destination);
                                                }

                                                return { audioBufferSourceNode, iIRFilterNode };
                                            }
                                        });
                                    });

                                    it('should modify the signal', function () {
                                        this.timeout(10000);

                                        return renderer({
                                            start (startTime, { audioBufferSourceNode }) {
                                                audioBufferSourceNode.start(startTime);
                                            }
                                        })
                                            .then((channelData) => {
                                                expect(Array.from(channelData)).to.deep.equal([ 1, -0.5, -0.25, -0.125, -0.0625 ]);
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
                                            length: (context.length === undefined) ? 5 : undefined,
                                            prepare (destination) {
                                                const audioBuffer = new AudioBuffer({ length: 5, numberOfChannels: 1, sampleRate: context.sampleRate });
                                                const audioBufferSourceNode = new AudioBufferSourceNode(context);
                                                const audioWorkletNode = (withAnAppendedAudioWorklet) ? new AudioWorkletNode(context, 'gain-processor') : null;
                                                const iIRFilterNode = createIIRFilterNode(context, { feedback: [ 1, 0.5 ], feedforward: [ 0.5, -1 ] });

                                                audioBuffer.copyToChannel(new Float32Array([ 1, 1, 1, 1, 1 ]), 0);
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
                                                    audioBufferSourceNode
                                                        .connect(iIRFilterNode)
                                                        .connect(destination);
                                                }

                                                return { audioBufferSourceNode, iIRFilterNode };
                                            }
                                        });
                                    });

                                    it('should modify the signal', function () {
                                        this.timeout(10000);

                                        return renderer({
                                            start (startTime, { audioBufferSourceNode }) {
                                                audioBufferSourceNode.start(startTime);
                                            }
                                        })
                                            .then((channelData) => {
                                                expect(Array.from(channelData)).to.deep.equal([ 0.5, -0.75, -0.125, -0.4375, -0.28125 ]);
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

                });

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

            describe('connect()', () => {

                let iIRFilterNode;

                beforeEach(() => {
                    iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });
                });

                it('should be chainable', () => {
                    const gainNode = new GainNode(context);

                    expect(iIRFilterNode.connect(gainNode)).to.equal(gainNode);
                });

                it('should not be connectable to an AudioNode of another AudioContext', (done) => {
                    const anotherContext = createContext();

                    try {
                        iIRFilterNode.connect(anotherContext.destination);
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
                        iIRFilterNode.connect(gainNode.gain);
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
                        iIRFilterNode.connect(gainNode.gain, -1);
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
                            const iIRFilterNode = createIIRFilterNode(context, { feedback, feedforward });
                            const secondDummyGainNode = new GainNode(context);

                            audioBuffer.copyToChannel(new Float32Array(values), 0);

                            audioBufferSourceNode.buffer = audioBuffer;

                            audioBufferSourceNode
                                .connect(iIRFilterNode)
                                .connect(firstDummyGainNode)
                                .connect(destination);

                            iIRFilterNode.connect(secondDummyGainNode);

                            return { audioBufferSourceNode, firstDummyGainNode, iIRFilterNode, secondDummyGainNode };
                        }
                    });
                });

                it('should be possible to disconnect a destination', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ firstDummyGainNode, iIRFilterNode }) {
                            iIRFilterNode.disconnect(firstDummyGainNode);
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
                        prepare ({ iIRFilterNode, secondDummyGainNode }) {
                            iIRFilterNode.disconnect(secondDummyGainNode);
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
                        prepare ({ iIRFilterNode }) {
                            iIRFilterNode.disconnect();
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
                            iIRFilterNode.getFrequencyResponse(new Float32Array([ 1 ]), new Float32Array(0), new Float32Array(1));
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
                            iIRFilterNode.getFrequencyResponse(new Float32Array([ 1 ]), new Float32Array(1), new Float32Array(0));
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
                            const iIRFilterNode = createIIRFilterNode(context, { feedback: [ 1 ], feedforward: [ 1 ] });
                            const magResponse = new Float32Array(5);
                            const phaseResponse = new Float32Array(5);

                            iIRFilterNode.getFrequencyResponse(new Float32Array([ 200, 400, 800, 1600, 3200 ]), magResponse, phaseResponse);

                            expect(Array.from(magResponse)).to.deep.equal([ 1, 1, 1, 1, 1 ]);
                            expect(Array.from(phaseResponse)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                        });

                    });

                    describe('with some other filter coefficients', () => {

                        it('should fill the magResponse and phaseResponse arrays', () => {
                            const iIRFilterNode = createIIRFilterNode(context, { feedback: [ 1, -0.5 ], feedforward: [ 1, -1 ] });
                            const magResponse = new Float32Array(5);
                            const phaseResponse = new Float32Array(5);

                            iIRFilterNode.getFrequencyResponse(new Float32Array([ 200, 400, 800, 1600, 3200 ]), magResponse, phaseResponse);

                            expect(Array.from(magResponse)).to.deep.equal([ 0.056942202150821686, 0.11359700560569763, 0.2249375581741333, 0.43307945132255554, 0.7616625428199768 ]);
                            expect(Array.from(phaseResponse)).to.deep.equal([ 1.5280766487121582, 1.4854952096939087, 1.401282548904419, 1.2399859428405762, 0.9627721309661865 ]);
                        });

                    });

                });

            });

        });

    }

});
