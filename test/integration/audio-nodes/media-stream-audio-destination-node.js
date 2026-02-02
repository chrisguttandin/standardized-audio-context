import { GainNode, MediaStreamAudioDestinationNode } from '../../../src/module';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
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

describe('MediaStreamAudioDestinationNode', { skip: typeof window === 'undefined' }, () => {
    describe.for(Object.entries(testCases))('with the %s', ([description, { createContext, createMediaStreamAudioDestinationNode }]) => {
        let context;

        afterEach(() => context.close?.());

        beforeEach(() => (context = createContext()));

        describe('constructor()', () => {
            describe.for(['closed', 'running'])('with an audioContextState of "%s"', (audioContextState) => {
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

                describe('with invalid options', { skip: typeof window === 'undefined' || !description.includes('constructor') }, () => {
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
                });
            });
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

            describe.for(['AudioNode', 'AudioParam'])('with an %s', (type) => {
                let audioNodeOrAudioParam;

                beforeEach(() => {
                    const gainNode = new GainNode(context);

                    audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                });

                it('should throw an IndexSizeError', () => {
                    expect(() => mediaStreamAudioDestinationNode.connect(audioNodeOrAudioParam))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });
            });

            describe.for(['AudioNode', 'AudioParam'])('with an %s of another context', (type) => {
                let anotherContext;
                let audioNodeOrAudioParam;

                afterEach(() => anotherContext.close?.());

                beforeEach(() => {
                    anotherContext = createContext();

                    const gainNode = new GainNode(anotherContext);

                    audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                });

                it('should throw an IndexSizeError', () => {
                    expect(() => mediaStreamAudioDestinationNode.connect(audioNodeOrAudioParam))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });
            });

            describe.for(['AudioNode', 'AudioParam'])('with an %s of a native context', (type) => {
                let nativeAudioNodeOrAudioParam;
                let nativeContext;

                afterEach(() => nativeContext.close?.());

                beforeEach(() => {
                    nativeContext = createNativeAudioContext();

                    const nativeGainNode = nativeContext.createGain();

                    nativeAudioNodeOrAudioParam = type === 'AudioNode' ? nativeGainNode : nativeGainNode.gain;
                });

                it('should throw an InvalidAccessError', () => {
                    expect(() => mediaStreamAudioDestinationNode.connect(nativeAudioNodeOrAudioParam))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });
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
                it('should throw an IndexSizeError', () => {
                    expect(() => mediaStreamAudioDestinationNode.disconnect(0))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });
            });

            describe('with a destination', () => {
                it('should throw an InvalidAccessError', () => {
                    expect(() => mediaStreamAudioDestinationNode.disconnect(new GainNode(context)))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });

            describe('with a destination and an output', () => {
                it('should throw an IndexSizeError', () => {
                    expect(() => mediaStreamAudioDestinationNode.disconnect(new GainNode(context), 0))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });
            });

            describe('with a destination, an output and an input', () => {
                it('should throw an IndexSizeError', () => {
                    expect(() => mediaStreamAudioDestinationNode.disconnect(new GainNode(context), 0, 0))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });
            });
        });
    });
});
