import { GainNode, MediaStreamAudioDestinationNode } from '../../../src/module';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createNativeAudioContext } from '../../helper/create-native-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';

const createMediaStreamAudioDestinationNodeWithConstructor = (context, options = null) => {
    return new MediaStreamAudioDestinationNode(context, options);
};
const createMediaStreamAudioDestinationNodeWithFactoryFunction = (context, options = null) => {
    const mediaStreamAudioDestinationNode = context.createMediaStreamDestination();

    if (options !== null && options.channelCount !== undefined) {
        mediaStreamAudioDestinationNode.channelCount = options.channelCount;
    }

    if (options !== null && options.channelCountMode !== undefined) {
        mediaStreamAudioDestinationNode.channelCountMode = options.channelCountMode;
    }

    if (options !== null && options.channelInterpretation !== undefined) {
        mediaStreamAudioDestinationNode.channelInterpretation = options.channelInterpretation;
    }

    return mediaStreamAudioDestinationNode;
};
const testCases = {
    'constructor of a MinimalAudioContext': {
        createContext: createMinimalAudioContext,
        createMediaStreamAudioDestinationNode: createMediaStreamAudioDestinationNodeWithConstructor
    },
    'constructor of an AudioContext': {
        createContext: createAudioContext,
        createMediaStreamAudioDestinationNode: createMediaStreamAudioDestinationNodeWithConstructor
    },
    'factory function of an AudioContext': {
        createContext: createAudioContext,
        createMediaStreamAudioDestinationNode: createMediaStreamAudioDestinationNodeWithFactoryFunction
    }
};

if (typeof window !== 'undefined') {
    describe('MediaStreamAudioDestinationNode', () => {
        for (const [description, { createContext, createMediaStreamAudioDestinationNode }] of Object.entries(testCases)) {
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
                                it('should return an instance of the MediaStreamAudioDestinationNode constructor', () => {
                                    const mediaStreamAudioDestinationNode = createMediaStreamAudioDestinationNode(context);

                                    expect(mediaStreamAudioDestinationNode).to.be.an.instanceOf(MediaStreamAudioDestinationNode);
                                });

                                it('should return an implementation of the EventTarget interface', () => {
                                    const mediaStreamAudioDestinationNode = createMediaStreamAudioDestinationNode(context);

                                    expect(mediaStreamAudioDestinationNode.addEventListener).to.be.a('function');
                                    expect(mediaStreamAudioDestinationNode.dispatchEvent).to.be.a('function');
                                    expect(mediaStreamAudioDestinationNode.removeEventListener).to.be.a('function');
                                });

                                it('should return an implementation of the AudioNode interface', () => {
                                    const mediaStreamAudioDestinationNode = createMediaStreamAudioDestinationNode(context);

                                    expect(mediaStreamAudioDestinationNode.channelCount).to.equal(2);
                                    expect(mediaStreamAudioDestinationNode.channelCountMode).to.equal('explicit');
                                    expect(mediaStreamAudioDestinationNode.channelInterpretation).to.equal('speakers');
                                    expect(mediaStreamAudioDestinationNode.connect).to.be.a('function');
                                    expect(mediaStreamAudioDestinationNode.context).to.be.an.instanceOf(context.constructor);
                                    expect(mediaStreamAudioDestinationNode.disconnect).to.be.a('function');
                                    expect(mediaStreamAudioDestinationNode.numberOfInputs).to.equal(1);
                                    expect(mediaStreamAudioDestinationNode.numberOfOutputs).to.equal(0);
                                });

                                it('should return an implementation of the MediaStreamAudioDestinationNode interface', () => {
                                    const mediaStreamAudioDestinationNode = createMediaStreamAudioDestinationNode(context);

                                    expect(mediaStreamAudioDestinationNode.stream).to.be.an.instanceOf(MediaStream);
                                });
                            });

                            describe('with valid options', () => {
                                it('should return an instance with the given channelCount', () => {
                                    const channelCount = 4;
                                    const mediaStreamAudioDestinationNode = createMediaStreamAudioDestinationNode(context, {
                                        channelCount
                                    });

                                    expect(mediaStreamAudioDestinationNode.channelCount).to.equal(channelCount);
                                });

                                it('should return an instance with the given channelCountMode', () => {
                                    const channelCountMode = 'max';
                                    const mediaStreamAudioDestinationNode = createMediaStreamAudioDestinationNode(context, {
                                        channelCountMode
                                    });

                                    expect(mediaStreamAudioDestinationNode.channelCountMode).to.equal(channelCountMode);
                                });

                                it('should return an instance with the given channelInterpretation', () => {
                                    const channelInterpretation = 'discrete';
                                    const mediaStreamAudioDestinationNode = createMediaStreamAudioDestinationNode(context, {
                                        channelInterpretation
                                    });

                                    expect(mediaStreamAudioDestinationNode.channelInterpretation).to.equal(channelInterpretation);
                                });
                            });

                            describe('with invalid options', () => {
                                if (description.includes('constructor')) {
                                    describe('with an OfflineAudioContext', () => {
                                        let offlineAudioContext;

                                        beforeEach(() => {
                                            offlineAudioContext = createOfflineAudioContext();
                                        });

                                        it('should throw a TypeError', () => {
                                            expect(() => {
                                                createMediaStreamAudioDestinationNode(offlineAudioContext);
                                            }).to.throw(TypeError);
                                        });
                                    });
                                }
                            });
                        });
                    }
                });

                describe('channelCount', () => {
                    let mediaStreamAudioDestinationNode;

                    beforeEach(() => {
                        mediaStreamAudioDestinationNode = createMediaStreamAudioDestinationNode(context);
                    });

                    it('should be assignable to another value', () => {
                        const channelCount = 4;

                        mediaStreamAudioDestinationNode.channelCount = channelCount;

                        expect(mediaStreamAudioDestinationNode.channelCount).to.equal(channelCount);
                    });
                });

                describe('channelCountMode', () => {
                    let mediaStreamAudioDestinationNode;

                    beforeEach(() => {
                        mediaStreamAudioDestinationNode = createMediaStreamAudioDestinationNode(context);
                    });

                    it('should be assignable to another value', () => {
                        const channelCountMode = 'max';

                        mediaStreamAudioDestinationNode.channelCountMode = channelCountMode;

                        expect(mediaStreamAudioDestinationNode.channelCountMode).to.equal(channelCountMode);
                    });
                });

                describe('channelInterpretation', () => {
                    let mediaStreamAudioDestinationNode;

                    beforeEach(() => {
                        mediaStreamAudioDestinationNode = createMediaStreamAudioDestinationNode(context);
                    });

                    it('should be assignable to another value', () => {
                        const channelInterpretation = 'discrete';

                        mediaStreamAudioDestinationNode.channelInterpretation = channelInterpretation;

                        expect(mediaStreamAudioDestinationNode.channelInterpretation).to.equal(channelInterpretation);
                    });
                });

                describe('numberOfInputs', () => {
                    let mediaStreamAudioDestinationNode;

                    beforeEach(() => {
                        mediaStreamAudioDestinationNode = createMediaStreamAudioDestinationNode(context);
                    });

                    it('should be readonly', () => {
                        expect(() => {
                            mediaStreamAudioDestinationNode.numberOfInputs = 2;
                        }).to.throw(TypeError);
                    });
                });

                describe('numberOfOutputs', () => {
                    let mediaStreamAudioDestinationNode;

                    beforeEach(() => {
                        mediaStreamAudioDestinationNode = createMediaStreamAudioDestinationNode(context);
                    });

                    it('should be readonly', () => {
                        expect(() => {
                            mediaStreamAudioDestinationNode.numberOfOutputs = 2;
                        }).to.throw(TypeError);
                    });
                });

                describe('stream', () => {
                    let mediaStreamAudioDestinationNode;

                    beforeEach(() => {
                        mediaStreamAudioDestinationNode = createMediaStreamAudioDestinationNode(context);
                    });

                    it('should be readonly', () => {
                        expect(() => {
                            mediaStreamAudioDestinationNode.stream = new MediaStream();
                        }).to.throw(TypeError);
                    });
                });

                describe('connect()', () => {
                    let mediaStreamAudioDestinationNode;

                    beforeEach(() => {
                        mediaStreamAudioDestinationNode = createMediaStreamAudioDestinationNode(context);
                    });

                    for (const type of ['AudioNode', 'AudioParam']) {
                        describe(`with an ${type}`, () => {
                            let audioNodeOrAudioParam;

                            beforeEach(() => {
                                const gainNode = new GainNode(context);

                                audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                            });

                            it('should throw an IndexSizeError', (done) => {
                                try {
                                    mediaStreamAudioDestinationNode.connect(audioNodeOrAudioParam);
                                } catch (err) {
                                    expect(err.code).to.equal(1);
                                    expect(err.name).to.equal('IndexSizeError');

                                    done();
                                }
                            });
                        });

                        describe(`with an ${type} of another context`, () => {
                            let anotherContext;
                            let audioNodeOrAudioParam;

                            afterEach(() => anotherContext.close?.());

                            beforeEach(function () {
                                this.timeout(5000);

                                anotherContext = createContext();

                                const gainNode = new GainNode(anotherContext);

                                audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                            });

                            it('should throw an IndexSizeError', (done) => {
                                try {
                                    mediaStreamAudioDestinationNode.connect(audioNodeOrAudioParam);
                                } catch (err) {
                                    expect(err.code).to.equal(1);
                                    expect(err.name).to.equal('IndexSizeError');

                                    done();
                                }
                            });
                        });

                        describe(`with an ${type} of a native context`, () => {
                            let nativeAudioNodeOrAudioParam;
                            let nativeContext;

                            afterEach(() => nativeContext.close?.());

                            beforeEach(() => {
                                nativeContext = createNativeAudioContext();

                                const nativeGainNode = nativeContext.createGain();

                                nativeAudioNodeOrAudioParam = type === 'AudioNode' ? nativeGainNode : nativeGainNode.gain;
                            });

                            it('should throw an InvalidAccessError', (done) => {
                                try {
                                    mediaStreamAudioDestinationNode.connect(nativeAudioNodeOrAudioParam);
                                } catch (err) {
                                    expect(err.code).to.equal(15);
                                    expect(err.name).to.equal('InvalidAccessError');

                                    done();
                                }
                            });
                        });
                    }
                });

                describe('disconnect()', () => {
                    let mediaStreamAudioDestinationNode;

                    beforeEach(() => {
                        mediaStreamAudioDestinationNode = createMediaStreamAudioDestinationNode(context);
                    });

                    describe('without any parameters', () => {
                        it('should disconnect all destinations', () => {
                            mediaStreamAudioDestinationNode.disconnect();
                        });
                    });

                    describe('with an output', () => {
                        it('should throw an IndexSizeError', (done) => {
                            try {
                                mediaStreamAudioDestinationNode.disconnect(0);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });
                    });

                    describe('with a destination', () => {
                        it('should throw an InvalidAccessError', (done) => {
                            try {
                                mediaStreamAudioDestinationNode.disconnect(new GainNode(context));
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });
                    });

                    describe('with a destination and an output', () => {
                        it('should throw an IndexSizeError', (done) => {
                            try {
                                mediaStreamAudioDestinationNode.disconnect(new GainNode(context), 0);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });
                    });

                    describe('with a destination, an output and an input', () => {
                        it('should throw an IndexSizeError', (done) => {
                            try {
                                mediaStreamAudioDestinationNode.disconnect(new GainNode(context), 0, 0);
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
}
