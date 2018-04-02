import { GainNode, MediaStreamAudioSourceNode } from '../../../src/module';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createRenderer } from '../../helper/create-renderer';

const createMediaStreamAudioSourceNodeWithConstructor = (context, options) => {
    return new MediaStreamAudioSourceNode(context, options);
};
const createMediaStreamAudioSourceNodeWithFactoryFunction = (context, options) => {
    const mediaStreamAudioSourceNode = context.createMediaStreamSource(options.mediaStream);

    if (options !== null && options.channelCount !== undefined) {
        mediaStreamAudioSourceNode.channelCount = options.channelCount;
    }

    if (options !== null && options.channelCountMode !== undefined) {
        mediaStreamAudioSourceNode.channelCountMode = options.channelCountMode;
    }

    if (options !== null && options.channelInterpretation !== undefined) {
        mediaStreamAudioSourceNode.channelInterpretation = options.channelInterpretation;
    }

    return mediaStreamAudioSourceNode;
};
const testCases = {
    'constructor with AudioContext': {
        createContext: createAudioContext,
        createMediaStreamAudioSourceNode: createMediaStreamAudioSourceNodeWithConstructor
    },
    'constructor with MinimalAudioContext': {
        createContext: createMinimalAudioContext,
        createMediaStreamAudioSourceNode: createMediaStreamAudioSourceNodeWithConstructor
    },
    'factory function of AudioContext': {
        createContext: createAudioContext,
        createMediaStreamAudioSourceNode: createMediaStreamAudioSourceNodeWithFactoryFunction
    }
};

describe('MediaStreamAudioSourceNode', () => {

    // Bug #65: Only Chrome & Opera implement captureStream() so far, which is why this test can't be executed in other browsers for now.
    if (/Chrome/.test(navigator.userAgent) && !/Edge/.test(navigator.userAgent)) {

        for (const [ description, { createContext, createMediaStreamAudioSourceNode } ] of Object.entries(testCases)) {

            describe(`with the ${ description }`, () => {

                let audioElement;
                let context;
                let mediaStream;

                afterEach(() => {
                    if (context.close !== undefined) {
                        return context.close();
                    }
                });

                beforeEach(async () => {
                    audioElement = new Audio();

                    audioElement.src = 'base/test/fixtures/1000-hertz-for-ten-seconds.wav';
                    audioElement.muted = true;

                    await audioElement.play();

                    context = createContext();
                    mediaStream = audioElement.captureStream();
                });

                describe('constructor()', () => {

                    describe('with valid options', () => {

                        it('should be an instance of the EventTarget interface', () => {
                            const mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, { mediaStream });

                            expect(mediaStreamAudioSourceNode.addEventListener).to.be.a('function');
                            expect(mediaStreamAudioSourceNode.dispatchEvent).to.be.a('function');
                            expect(mediaStreamAudioSourceNode.removeEventListener).to.be.a('function');
                        });

                        it('should be an instance of the AudioNode interface', () => {
                            const mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, { mediaStream });

                            expect(mediaStreamAudioSourceNode.channelCount).to.equal(2);
                            expect(mediaStreamAudioSourceNode.channelCountMode).to.equal('max');
                            expect(mediaStreamAudioSourceNode.channelInterpretation).to.equal('speakers');
                            expect(mediaStreamAudioSourceNode.connect).to.be.a('function');
                            expect(mediaStreamAudioSourceNode.context).to.be.an.instanceOf(context.constructor);
                            expect(mediaStreamAudioSourceNode.disconnect).to.be.a('function');
                            expect(mediaStreamAudioSourceNode.numberOfInputs).to.equal(0);
                            expect(mediaStreamAudioSourceNode.numberOfOutputs).to.equal(1);
                        });

                        it('should return an instance of the MediaStreamAudioSourceNode interface', () => {
                            const mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, { mediaStream });

                            expect(mediaStreamAudioSourceNode.mediaStream).to.be.an.instanceOf(MediaStream);
                        });

                        it('should throw an error if the AudioContext is closed', (done) => {
                            ((context.close === undefined) ? context.startRendering() : context.close())
                                .then(() => createMediaStreamAudioSourceNode(context, { mediaStream }))
                                .catch((err) => {
                                    expect(err.code).to.equal(11);
                                    expect(err.name).to.equal('InvalidStateError');

                                    context.close = undefined;

                                    done();
                                });
                        });

                    });

                });

                describe('channelCount', () => {

                    let mediaStreamAudioSourceNode;

                    beforeEach(() => {
                        mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, { mediaStream });
                    });

                    it('should be assignable to another value', () => {
                        const channelCount = 4;

                        mediaStreamAudioSourceNode.channelCount = channelCount;

                        expect(mediaStreamAudioSourceNode.channelCount).to.equal(channelCount);
                    });

                });

                describe('channelCountMode', () => {

                    let mediaStreamAudioSourceNode;

                    beforeEach(() => {
                        mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, { mediaStream });
                    });

                    it('should be assignable to another value', () => {
                        const channelCountMode = 'explicit';

                        mediaStreamAudioSourceNode.channelCountMode = channelCountMode;

                        expect(mediaStreamAudioSourceNode.channelCountMode).to.equal(channelCountMode);
                    });

                });

                describe('channelInterpretation', () => {

                    let mediaStreamAudioSourceNode;

                    beforeEach(() => {
                        mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, { mediaStream });
                    });

                    it('should be assignable to another value', () => {
                        const channelInterpretation = 'discrete';

                        mediaStreamAudioSourceNode.channelInterpretation = channelInterpretation;

                        expect(mediaStreamAudioSourceNode.channelInterpretation).to.equal(channelInterpretation);
                    });

                });

                describe('mediaStream', () => {

                    let mediaStreamAudioSourceNode;

                    beforeEach(() => {
                        mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, { mediaStream });
                    });

                    it('should return the given mediaStream', () => {
                        expect(mediaStreamAudioSourceNode.mediaStream).to.equal(mediaStream);
                    });

                    it('should be readonly', () => {
                        expect(() => {
                            mediaStreamAudioSourceNode.mediaStream = new MediaStream();
                        }).to.throw(TypeError);
                    });

                });

                describe('connect()', () => {

                    let mediaStreamAudioSourceNode;

                    beforeEach(() => {
                        mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, { mediaStream });
                    });

                    it('should be chainable', () => {
                        const gainNode = new GainNode(context);

                        expect(mediaStreamAudioSourceNode.connect(gainNode)).to.equal(gainNode);
                    });

                    it('should not be connectable to an AudioNode of another AudioContext', (done) => {
                        const anotherContext = createContext();

                        try {
                            mediaStreamAudioSourceNode.connect(anotherContext.destination);
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
                            mediaStreamAudioSourceNode.connect(gainNode.gain);
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
                            mediaStreamAudioSourceNode.connect(gainNode.gain, -1);
                        } catch (err) {
                            expect(err.code).to.equal(1);
                            expect(err.name).to.equal('IndexSizeError');

                            done();
                        }
                    });

                });

                describe('disconnect()', () => {

                    let renderer;

                    afterEach(() => {
                        if (!audioElement.paused) {
                            return new Promise((resolve, reject) => {
                                audioElement.onerror = () => reject(audioElement.error);
                                audioElement.onpause = resolve;
                                audioElement.pause();
                            });
                        }
                    });

                    beforeEach(async function () {
                        this.timeout(10000);

                        await audioElement.play();

                        renderer = createRenderer({
                            context,
                            length: (context.length === undefined) ? 5 : undefined,
                            prepare (destination) {
                                const firstDummyGainNode = new GainNode(context);
                                const mediaStream = audioElement.captureStream();
                                const mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, { mediaStream });
                                const secondDummyGainNode = new GainNode(context);

                                mediaStreamAudioSourceNode
                                    .connect(firstDummyGainNode)
                                    .connect(destination);

                                mediaStreamAudioSourceNode.connect(secondDummyGainNode);

                                return { firstDummyGainNode, mediaStreamAudioSourceNode, secondDummyGainNode };
                            }
                        });
                    });

                    it('should be possible to disconnect a destination', function () {
                        this.timeout(10000);

                        return renderer({
                            prepare ({ firstDummyGainNode, mediaStreamAudioSourceNode }) {
                                mediaStreamAudioSourceNode.disconnect(firstDummyGainNode);
                            }
                        })
                            .then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                            });
                    });

                    it('should be possible to disconnect another destination in isolation', function () {
                        this.timeout(10000);

                        return renderer({
                            prepare ({ mediaStreamAudioSourceNode, secondDummyGainNode }) {
                                mediaStreamAudioSourceNode.disconnect(secondDummyGainNode);
                            }
                        })
                            .then((channelData) => {
                                // @todo The audioElement will just play a sine wave. Therefore it is okay to only test for non zero values.
                                expect(Array.from(channelData)).to.not.deep.equal([ 0, 0, 0, 0, 0 ]);
                            });
                    });

                    it('should be possible to disconnect all destinations', function () {
                        this.timeout(10000);

                        return renderer({
                            prepare ({ mediaStreamAudioSourceNode }) {
                                mediaStreamAudioSourceNode.disconnect();
                            }
                        })
                            .then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                            });
                    });

                });

            });

        }

    }

});
