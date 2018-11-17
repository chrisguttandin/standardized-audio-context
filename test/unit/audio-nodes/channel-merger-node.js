import '../../helper/play-silence';
import { AudioBuffer, AudioBufferSourceNode, ChannelMergerNode, GainNode } from '../../../src/module';
import { BACKUP_NATIVE_CONTEXT_STORE } from '../../../src/globals';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';

const createChannelMergerNodeWithConstructor = (context, options = null) => {
    if (options === null) {
        return new ChannelMergerNode(context);
    }

    return new ChannelMergerNode(context, options);
};
const createChannelMergerNodeWithFactoryFunction = (context, options = null) => {
    const channelMergerNode = (options !== null && options.numberOfInputs !== undefined) ?
        context.createChannelMerger(options.numberOfInputs) :
        context.createChannelMerger();

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
    'constructor with a MinimalAudioContext': {
        createChannelMergerNode: createChannelMergerNodeWithConstructor,
        createContext: createMinimalAudioContext
    },
    'constructor with a MinimalOfflineAudioContext': {
        createChannelMergerNode: createChannelMergerNodeWithConstructor,
        createContext: createMinimalOfflineAudioContext
    },
    'constructor with an AudioContext': {
        createChannelMergerNode: createChannelMergerNodeWithConstructor,
        createContext: createAudioContext
    },
    'constructor with an OfflineAudioContext': {
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

// @todo Skip about 50% of the test cases when running on Travis to prevent the browsers from crashing while running the tests.
if (process.env.TRAVIS) { // eslint-disable-line no-undef
    for (const description of Object.keys(testCases)) {
        if (Math.random() < 0.5) {
            delete testCases[ description ];
        }
    }
}

describe('ChannelMergerNode', () => {

    for (const [ description, { createChannelMergerNode, createContext } ] of Object.entries(testCases)) {

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

                            let channelMergerNode;

                            beforeEach(() => {
                                channelMergerNode = createChannelMergerNode(context);
                            });

                            it('should return an instance of the EventTarget interface', () => {
                                expect(channelMergerNode.addEventListener).to.be.a('function');
                                expect(channelMergerNode.dispatchEvent).to.be.a('function');
                                expect(channelMergerNode.removeEventListener).to.be.a('function');
                            });

                            it('should return an instance of the AudioNode interface', () => {
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

            describe('connect()', () => {

                let channelMergerNode;

                beforeEach(() => {
                    channelMergerNode = createChannelMergerNode(context);
                });

                it('should be chainable', () => {
                    const gainNode = new GainNode(context);

                    expect(channelMergerNode.connect(gainNode)).to.equal(gainNode);
                });

                it('should not be connectable to an AudioNode of another AudioContext', (done) => {
                    const anotherContext = createContext();

                    try {
                        channelMergerNode.connect(anotherContext.destination);
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
                        channelMergerNode.connect(gainNode.gain);
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
                        channelMergerNode.connect(gainNode.gain, -1);
                    } catch (err) {
                        expect(err.code).to.equal(1);
                        expect(err.name).to.equal('IndexSizeError');

                        done();
                    }
                });

            });

            describe('disconnect()', () => {

                let renderer;

                beforeEach(function () {
                    this.timeout(10000);

                    renderer = createRenderer({
                        context,
                        length: (context.length === undefined) ? 5 : undefined,
                        prepare (destination) {
                            const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                            const audioBufferSourceNode = new AudioBufferSourceNode(context);
                            const channelMergerNode = createChannelMergerNode(context, { numberOfInputs: 2 });
                            const firstDummyGainNode = new GainNode(context);
                            const secondDummyGainNode = new GainNode(context);

                            audioBuffer.copyToChannel(new Float32Array([ 1, 1, 1, 1, 1 ]), 0);

                            audioBufferSourceNode.buffer = audioBuffer;

                            audioBufferSourceNode
                                .connect(channelMergerNode)
                                .connect(firstDummyGainNode)
                                .connect(destination);

                            channelMergerNode.connect(secondDummyGainNode);

                            return { audioBufferSourceNode, channelMergerNode, firstDummyGainNode, secondDummyGainNode };
                        }
                    });
                });

                it('should be possible to disconnect a destination', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ channelMergerNode, firstDummyGainNode }) {
                            channelMergerNode.disconnect(firstDummyGainNode);
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
                        prepare ({ channelMergerNode, secondDummyGainNode }) {
                            channelMergerNode.disconnect(secondDummyGainNode);
                        },
                        start (startTime, { audioBufferSourceNode }) {
                            audioBufferSourceNode.start(startTime);
                        }
                    })
                        .then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([ 0.5, 0.5, 0.5, 0.5, 0.5 ]);
                        });
                });

                it('should be possible to disconnect all destinations by specifying the output', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ channelMergerNode }) {
                            channelMergerNode.disconnect(0);
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
                        prepare ({ channelMergerNode }) {
                            channelMergerNode.disconnect();
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
