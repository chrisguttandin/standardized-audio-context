import '../../helper/play-silence';
import { AudioBuffer, AudioBufferSourceNode, ConvolverNode, GainNode } from '../../../src/module';
import { BACKUP_NATIVE_CONTEXT_STORE } from '../../../src/globals';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
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
    'constructor with a MinimalAudioContext': {
        createContext: createMinimalAudioContext,
        createConvolverNode: createConvolverNodeWithConstructor
    },
    'constructor with a MinimalOfflineAudioContext': {
        createContext: createMinimalOfflineAudioContext,
        createConvolverNode: createConvolverNodeWithConstructor
    },
    'constructor with an AudioContext': {
        createContext: createAudioContext,
        createConvolverNode: createConvolverNodeWithConstructor
    },
    'constructor with an OfflineAudioContext': {
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

describe('ConvolverNode', () => {

    for (const [ description, { createConvolverNode, createContext } ] of Object.entries(testCases)) {

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

                            let convolverNode;

                            beforeEach(() => {
                                convolverNode = createConvolverNode(context);
                            });

                            it('should return an instance of the EventTarget interface', () => {
                                expect(convolverNode.addEventListener).to.be.a('function');
                                expect(convolverNode.dispatchEvent).to.be.a('function');
                                expect(convolverNode.removeEventListener).to.be.a('function');
                            });

                            it('should return an instance of the AudioNode interface', () => {
                                expect(convolverNode.channelCount).to.equal(2);
                                expect(convolverNode.channelCountMode).to.equal('clamped-max');
                                expect(convolverNode.channelInterpretation).to.equal('speakers');
                                expect(convolverNode.connect).to.be.a('function');
                                expect(convolverNode.context).to.be.an.instanceOf(context.constructor);
                                expect(convolverNode.disconnect).to.be.a('function');
                                expect(convolverNode.numberOfInputs).to.equal(1);
                                expect(convolverNode.numberOfOutputs).to.equal(1);
                            });

                            it('should return an instance of the ConvolverNode interface', () => {
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

                            describe('with a buffer with an unsupported numberOfChannels', () => {

                                let audioBuffer;

                                beforeEach(() => {
                                    audioBuffer = new AudioBuffer({ length: 1, numberOfChannels: 3, sampleRate: context.sampleRate });
                                });

                                it('should throw a NotSupportedError', (done) => {
                                    try {
                                        createConvolverNode(context, { buffer: audioBuffer });
                                    } catch (err) {
                                        expect(err.code).to.equal(9);
                                        expect(err.name).to.equal('NotSupportedError');

                                        done();
                                    }
                                });

                            });

                            describe('with a buffer with a different sampleRate', () => {

                                let audioBuffer;

                                beforeEach(() => {
                                    audioBuffer = new AudioBuffer({ length: 1, numberOfChannels: 3, sampleRate: context.sampleRate / 2 });
                                });

                                it('should throw a NotSupportedError', (done) => {
                                    try {
                                        createConvolverNode(context, { buffer: audioBuffer });
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

            describe('buffer', () => {

                let convolverNode;

                beforeEach(() => {
                    convolverNode = createConvolverNode(context);
                });

                for (const assignment of [ 'with', 'without' ]) {

                    describe(`${ assignment } a previously assigned AudioBuffer`, () => {

                        beforeEach(() => {
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

                            it('should throw a NotSupportedError', (done) => {
                                try {
                                    convolverNode.buffer = audioBuffer;
                                } catch (err) {
                                    expect(err.code).to.equal(9);
                                    expect(err.name).to.equal('NotSupportedError');

                                    done();
                                }
                            });

                        });

                        describe('with a buffer with a different sampleRate', () => {

                            let audioBuffer;

                            beforeEach(() => {
                                audioBuffer = new AudioBuffer({ length: 5, numberOfChannels: 5, sampleRate: context.sampleRate * 2 });
                            });

                            it('should throw a NotSupportedError', (done) => {
                                try {
                                    convolverNode.buffer = audioBuffer;
                                } catch (err) {
                                    expect(err.code).to.equal(9);
                                    expect(err.name).to.equal('NotSupportedError');

                                    done();
                                }
                            });

                        });

                    });

                }

            });

            describe('channelCount', () => {

                let convolverNode;

                beforeEach(() => {
                    convolverNode = createConvolverNode(context);
                });

                it('should not be assignable to another value', (done) => {
                    const channelCount = 4;

                    try {
                        convolverNode.channelCount = channelCount;
                    } catch (err) {
                        expect(err.code).to.equal(9);
                        expect(err.name).to.equal('NotSupportedError');

                        done();
                    }
                });

            });

            describe('channelCountMode', () => {

                let convolverNode;

                beforeEach(() => {
                    convolverNode = createConvolverNode(context);
                });

                it('should not be assignable to another value', (done) => {
                    const channelCountMode = 'max';

                    try {
                        convolverNode.channelCountMode = channelCountMode;
                    } catch (err) {
                        expect(err.code).to.equal(9);
                        expect(err.name).to.equal('NotSupportedError');

                        done();
                    }
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
                    const normalize = convolverNode.normalize = string; // eslint-disable-line no-multi-assign

                    expect(normalize).to.equal(string);
                    expect(convolverNode.normalize).to.be.true;
                });

            });

            describe('connect()', () => {

                let convolverNode;

                beforeEach(() => {
                    convolverNode = createConvolverNode(context);
                });

                it('should be chainable', () => {
                    const gainNode = new GainNode(context);

                    expect(convolverNode.connect(gainNode)).to.equal(gainNode);
                });

                it('should not be connectable to an AudioNode of another AudioContext', (done) => {
                    const anotherContext = createContext();

                    try {
                        convolverNode.connect(anotherContext.destination);
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
                        convolverNode.connect(gainNode.gain);
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
                        convolverNode.connect(gainNode.gain, -1);
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
                            const convolverNode = createConvolverNode(context, { disableNormalization: true });
                            const firstDummyGainNode = new GainNode(context);
                            const secondDummyGainNode = new GainNode(context);

                            audioBuffer.copyToChannel(new Float32Array(values), 0);

                            audioBufferSourceNode.buffer = audioBuffer;

                            const convolverBuffer = new AudioBuffer({ length: 1, sampleRate: context.sampleRate });

                            convolverBuffer.copyToChannel(new Float32Array([ 0.8 ]), 0);

                            convolverNode.buffer = convolverBuffer;

                            audioBufferSourceNode
                                .connect(convolverNode)
                                .connect(firstDummyGainNode)
                                .connect(destination);

                            convolverNode.connect(secondDummyGainNode);

                            return { audioBufferSourceNode, convolverNode, firstDummyGainNode, secondDummyGainNode };
                        }
                    });
                });

                it('should be possible to disconnect a destination', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ convolverNode, firstDummyGainNode }) {
                            convolverNode.disconnect(firstDummyGainNode);
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
                        prepare ({ convolverNode, secondDummyGainNode }) {
                            convolverNode.disconnect(secondDummyGainNode);
                        },
                        start (startTime, { audioBufferSourceNode }) {
                            audioBufferSourceNode.start(startTime);
                        }
                    })
                        .then((channelData) => {
                            expect(channelData[0]).to.closeTo(0.8, 0.00001);
                            expect(channelData[1]).to.closeTo(0.8, 0.00001);
                            expect(channelData[2]).to.closeTo(0.8, 0.00001);
                            expect(channelData[3]).to.closeTo(0.8, 0.00001);
                            expect(channelData[4]).to.closeTo(0.8, 0.00001);
                        });
                });

                it('should be possible to disconnect all destinations by specifying the output', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ convolverNode }) {
                            convolverNode.disconnect(0);
                        },
                        start (startTime, { audioBufferSourceNode }) {
                            audioBufferSourceNode.start(startTime);
                        }
                    })
                        .then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                        });
                });

                it('should be possible to disconnect all destinations', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ convolverNode }) {
                            convolverNode.disconnect();
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
