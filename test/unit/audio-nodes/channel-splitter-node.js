import { AudioBuffer } from '../../../src/audio-buffer';
import { AudioBufferSourceNode } from '../../../src/audio-nodes/audio-buffer-source-node';
import { ChannelSplitterNode } from '../../../src/audio-nodes/channel-splitter-node';
import { GainNode } from '../../../src/audio-nodes/gain-node';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';

const createChannelSplitterNodeWithConstructor = (context, options = null) => {
    if (options === null) {
        return new ChannelSplitterNode(context);
    }

    return new ChannelSplitterNode(context, options);
};
const createChannelSplitterNodeWithFactoryFunction = (context, options = null) => {
    const channelSplitterNode = (options !== null && options.numberOfOutputs !== undefined) ?
        context.createChannelSplitter(options.numberOfOutputs) :
        context.createChannelSplitter();

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
    'constructor with AudioContext': {
        createChannelSplitterNode: createChannelSplitterNodeWithConstructor,
        createContext: createAudioContext
    },
    'constructor with MinimalAudioContext': {
        createChannelSplitterNode: createChannelSplitterNodeWithConstructor,
        createContext: createMinimalAudioContext
    },
    'constructor with MinimalOfflineAudioContext': {
        createChannelSplitterNode: createChannelSplitterNodeWithConstructor,
        createContext: createMinimalOfflineAudioContext
    },
    'constructor with OfflineAudioContext': {
        createChannelSplitterNode: createChannelSplitterNodeWithConstructor,
        createContext: createOfflineAudioContext
    },
    'factory function of AudioContext': {
        createChannelSplitterNode: createChannelSplitterNodeWithFactoryFunction,
        createContext: createAudioContext
    },
    'factory function of OfflineAudioContext': {
        createChannelSplitterNode: createChannelSplitterNodeWithFactoryFunction,
        createContext: createOfflineAudioContext
    }
};

describe('ChannelSplitterNode', () => {

    for (const [ description, { createChannelSplitterNode, createContext } ] of Object.entries(testCases)) {

        describe(`with the ${ description }`, () => {

            let context;

            afterEach(() => {
                if (context.close !== undefined) {
                    return context.close();
                }
            });

            beforeEach(() => context = createContext());

            describe('constructor()', () => {

                describe('without any options', () => {

                    let channelSplitterNode;

                    beforeEach(() => {
                        channelSplitterNode = createChannelSplitterNode(context);
                    });

                    it('should be an instance of the EventTarget interface', () => {
                        expect(channelSplitterNode.addEventListener).to.be.a('function');
                        expect(channelSplitterNode.dispatchEvent).to.be.a('function');
                        expect(channelSplitterNode.removeEventListener).to.be.a('function');
                    });

                    it('should be an instance of the AudioNode interface', () => {
                        expect(channelSplitterNode.channelCount).to.equal(6);
                        expect(channelSplitterNode.channelCountMode).to.equal('explicit');
                        expect(channelSplitterNode.channelInterpretation).to.equal('discrete');
                        expect(channelSplitterNode.connect).to.be.a('function');
                        expect(channelSplitterNode.context).to.be.an.instanceOf(context.constructor);
                        expect(channelSplitterNode.disconnect).to.be.a('function');
                        expect(channelSplitterNode.numberOfInputs).to.equal(1);
                        expect(channelSplitterNode.numberOfOutputs).to.equal(6);
                    });

                    it('should throw an error if the AudioContext is closed', (done) => {
                        ((context.close === undefined) ? context.startRendering() : context.close())
                            .then(() => createChannelSplitterNode(context))
                            .catch((err) => {
                                expect(err.code).to.equal(11);
                                expect(err.name).to.equal('InvalidStateError');

                                context.close = undefined;

                                done();
                            });
                    });

                });

                describe('with valid options', () => {

                    it('should return an instance with the given numberOfOutputs', () => {
                        const numberOfOutputs = 2;
                        const channelMergerNode = createChannelSplitterNode(context, { numberOfOutputs });

                        expect(channelMergerNode.numberOfOutputs).to.equal(numberOfOutputs);
                    });

                });

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

            describe('connect()', () => {

                let channelSplitterNode;

                beforeEach(() => {
                    channelSplitterNode = createChannelSplitterNode(context);
                });

                it('should be chainable', () => {
                    const gainNode = new GainNode(context);

                    expect(channelSplitterNode.connect(gainNode)).to.equal(gainNode);
                });

                it('should not be connectable to an AudioNode of another AudioContext', (done) => {
                    const anotherContext = createContext();

                    try {
                        channelSplitterNode.connect(anotherContext.destination);
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
                        channelSplitterNode.connect(gainNode.gain);
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
                        channelSplitterNode.connect(gainNode.gain, -1);
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

                beforeEach(() => {
                    values = [ 1, 1, 1, 1, 1 ];

                    renderer = createRenderer({
                        context,
                        length: (context.length === undefined) ? 5 : undefined,
                        prepare (destination) {
                            const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                            const audioBufferSourceNode = new AudioBufferSourceNode(context);
                            const firstDummyGainNode = new GainNode(context);
                            const channelSplitterNode = createChannelSplitterNode(context);
                            const secondDummyGainNode = new GainNode(context);

                            audioBuffer.copyToChannel(new Float32Array(values), 0);

                            audioBufferSourceNode.buffer = audioBuffer;

                            audioBufferSourceNode
                                .connect(channelSplitterNode)
                                .connect(firstDummyGainNode)
                                .connect(destination);

                            channelSplitterNode.connect(secondDummyGainNode);

                            return { audioBufferSourceNode, channelSplitterNode, firstDummyGainNode, secondDummyGainNode };
                        }
                    });
                });

                it('should be possible to disconnect a destination', function () {
                    this.timeout(5000);

                    return renderer({
                        prepare ({ firstDummyGainNode, channelSplitterNode }) {
                            channelSplitterNode.disconnect(firstDummyGainNode);
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
                    this.timeout(5000);

                    return renderer({
                        prepare ({ channelSplitterNode, secondDummyGainNode }) {
                            channelSplitterNode.disconnect(secondDummyGainNode);
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
                    this.timeout(5000);

                    return renderer({
                        prepare ({ channelSplitterNode }) {
                            channelSplitterNode.disconnect();
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
