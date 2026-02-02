import { AnalyserNode, GainNode, MediaElementAudioSourceNode } from '../../../src/module';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createNativeAudioContext } from '../../helper/create-native-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';
import { isSafari } from '../../helper/is-safari';

const createMediaElementAudioSourceNodeWithConstructor = (context, options) => {
    return new MediaElementAudioSourceNode(context, options);
};
const createMediaElementAudioSourceNodeWithFactoryFunction = (context, options) => {
    const mediaElementAudioSourceNode = context.createMediaElementSource(options.mediaElement);

    if (options.channelCount !== undefined) {
        mediaElementAudioSourceNode.channelCount = options.channelCount;
    }

    if (options.channelCountMode !== undefined) {
        mediaElementAudioSourceNode.channelCountMode = options.channelCountMode;
    }

    if (options.channelInterpretation !== undefined) {
        mediaElementAudioSourceNode.channelInterpretation = options.channelInterpretation;
    }

    return mediaElementAudioSourceNode;
};
const testCases = {
    'constructor of a MinimalAudioContext': {
        createContext: createMinimalAudioContext,
        createMediaElementAudioSourceNode: createMediaElementAudioSourceNodeWithConstructor
    },
    'constructor of an AudioContext': {
        createContext: createAudioContext,
        createMediaElementAudioSourceNode: createMediaElementAudioSourceNodeWithConstructor
    },
    'factory function of an AudioContext': {
        createContext: createAudioContext,
        createMediaElementAudioSourceNode: createMediaElementAudioSourceNodeWithFactoryFunction
    }
};

describe('MediaElementAudioSourceNode', { skip: typeof window === 'undefined' }, () => {
    describe.for(Object.entries(testCases))('with the %s', ([description, { createContext, createMediaElementAudioSourceNode }]) => {
        let context;
        let mediaElement;

        afterEach(() => context.close?.());

        beforeEach(() => {
            context = createContext();
            mediaElement = new Audio();
        });

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

                describe('with valid options', () => {
                    it('should return an instance of the MediaElementAudioSourceNode constructor', () => {
                        const mediaElementAudioSourceNode = createMediaElementAudioSourceNode(context, { mediaElement });

                        expect(mediaElementAudioSourceNode).to.be.an.instanceOf(MediaElementAudioSourceNode);
                    });

                    it('should return an implementation of the EventTarget interface', () => {
                        const mediaElementAudioSourceNode = createMediaElementAudioSourceNode(context, { mediaElement });

                        expect(mediaElementAudioSourceNode.addEventListener).to.be.a('function');
                        expect(mediaElementAudioSourceNode.dispatchEvent).to.be.a('function');
                        expect(mediaElementAudioSourceNode.removeEventListener).to.be.a('function');
                    });

                    it('should return an implementation of the AudioNode interface', () => {
                        const mediaElementAudioSourceNode = createMediaElementAudioSourceNode(context, { mediaElement });

                        expect(mediaElementAudioSourceNode.channelCount).to.equal(2);
                        expect(mediaElementAudioSourceNode.channelCountMode).to.equal('max');
                        expect(mediaElementAudioSourceNode.channelInterpretation).to.equal('speakers');
                        expect(mediaElementAudioSourceNode.connect).to.be.a('function');
                        expect(mediaElementAudioSourceNode.context).to.be.an.instanceOf(context.constructor);
                        expect(mediaElementAudioSourceNode.disconnect).to.be.a('function');
                        expect(mediaElementAudioSourceNode.numberOfInputs).to.equal(0);
                        expect(mediaElementAudioSourceNode.numberOfOutputs).to.equal(1);
                    });

                    it('should return an implementation of the MediaElementAudioSourceNode interface', () => {
                        const mediaElementAudioSourceNode = createMediaElementAudioSourceNode(context, { mediaElement });

                        expect(mediaElementAudioSourceNode.mediaElement).to.be.an.instanceOf(HTMLMediaElement);
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
                                createMediaElementAudioSourceNode(offlineAudioContext, { mediaElement });
                            }).to.throw(TypeError);
                        });
                    });
                });
            });
        });

        describe('channelCount', () => {
            let mediaElementAudioSourceNode;

            beforeEach(() => {
                mediaElementAudioSourceNode = createMediaElementAudioSourceNode(context, { mediaElement });
            });

            it('should be assignable to another value', () => {
                const channelCount = 4;

                mediaElementAudioSourceNode.channelCount = channelCount;

                expect(mediaElementAudioSourceNode.channelCount).to.equal(channelCount);
            });
        });

        describe('channelCountMode', () => {
            let mediaElementAudioSourceNode;

            beforeEach(() => {
                mediaElementAudioSourceNode = createMediaElementAudioSourceNode(context, { mediaElement });
            });

            it('should be assignable to another value', () => {
                const channelCountMode = 'explicit';

                mediaElementAudioSourceNode.channelCountMode = channelCountMode;

                expect(mediaElementAudioSourceNode.channelCountMode).to.equal(channelCountMode);
            });
        });

        describe('channelInterpretation', () => {
            let mediaElementAudioSourceNode;

            beforeEach(() => {
                mediaElementAudioSourceNode = createMediaElementAudioSourceNode(context, { mediaElement });
            });

            it('should be assignable to another value', () => {
                const channelInterpretation = 'discrete';

                mediaElementAudioSourceNode.channelInterpretation = channelInterpretation;

                expect(mediaElementAudioSourceNode.channelInterpretation).to.equal(channelInterpretation);
            });
        });

        describe('mediaElement', () => {
            let mediaElementAudioSourceNode;

            beforeEach(() => {
                mediaElementAudioSourceNode = createMediaElementAudioSourceNode(context, { mediaElement });
            });

            it('should return the given mediaElement', () => {
                expect(mediaElementAudioSourceNode.mediaElement).to.equal(mediaElement);
            });

            it('should be readonly', () => {
                expect(() => {
                    mediaElementAudioSourceNode.mediaElement = new Audio();
                }).to.throw(TypeError);
            });
        });

        describe('numberOfInputs', () => {
            let mediaElementAudioSourceNode;

            beforeEach(() => {
                mediaElementAudioSourceNode = createMediaElementAudioSourceNode(context, { mediaElement });
            });

            it('should be readonly', () => {
                expect(() => {
                    mediaElementAudioSourceNode.numberOfInputs = 2;
                }).to.throw(TypeError);
            });
        });

        describe('numberOfOutputs', () => {
            let mediaElementAudioSourceNode;

            beforeEach(() => {
                mediaElementAudioSourceNode = createMediaElementAudioSourceNode(context, { mediaElement });
            });

            it('should be readonly', () => {
                expect(() => {
                    mediaElementAudioSourceNode.numberOfOutputs = 2;
                }).to.throw(TypeError);
            });
        });

        describe('connect()', () => {
            let mediaElementAudioSourceNode;

            beforeEach(() => {
                mediaElementAudioSourceNode = createMediaElementAudioSourceNode(context, { mediaElement });
            });

            describe.for(['AudioNode', 'AudioParam'])('with an %s', (type) => {
                let audioNodeOrAudioParam;

                beforeEach(() => {
                    const gainNode = new GainNode(context);

                    audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                });

                if (type === 'AudioNode') {
                    it('should be chainable', () => {
                        expect(mediaElementAudioSourceNode.connect(audioNodeOrAudioParam)).to.equal(audioNodeOrAudioParam);
                    });
                } else {
                    it('should not be chainable', () => {
                        expect(mediaElementAudioSourceNode.connect(audioNodeOrAudioParam)).to.be.undefined;
                    });
                }

                it('should accept duplicate connections', () => {
                    mediaElementAudioSourceNode.connect(audioNodeOrAudioParam);
                    mediaElementAudioSourceNode.connect(audioNodeOrAudioParam);
                });

                it('should throw an IndexSizeError if the output is out-of-bound', () => {
                    expect(() => mediaElementAudioSourceNode.connect(audioNodeOrAudioParam, -1))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                if (type === 'AudioNode') {
                    it('should throw an IndexSizeError if the input is out-of-bound', () => {
                        expect(() => mediaElementAudioSourceNode.connect(audioNodeOrAudioParam, 0, -1))
                            .to.throw(DOMException)
                            .to.include({ code: 1, name: 'IndexSizeError' });
                    });
                }
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

                it('should throw an InvalidAccessError', () => {
                    expect(() => mediaElementAudioSourceNode.connect(audioNodeOrAudioParam))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
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
                    expect(() => mediaElementAudioSourceNode.connect(nativeAudioNodeOrAudioParam))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });
        });

        describe('disconnect()', () => {
            let createPredefinedRenderer;
            let pauseMediaElement;
            let playMediaElement;

            beforeEach(() => {
                createPredefinedRenderer = () =>
                    createRenderer({
                        context,
                        length: context.length === undefined ? 5 : undefined,
                        async setup(destination) {
                            const analyserNode = new AnalyserNode(context);
                            const firstDummyGainNode = new GainNode(context);
                            const mediaElementAudioSourceNode = createMediaElementAudioSourceNode(context, { mediaElement });
                            const secondDummyGainNode = new GainNode(context);

                            mediaElementAudioSourceNode.connect(firstDummyGainNode).connect(destination);

                            mediaElementAudioSourceNode.connect(secondDummyGainNode);

                            await new Promise((resolve) => {
                                mediaElementAudioSourceNode.connect(analyserNode);

                                const data = new Float32Array(analyserNode.fftSize);
                                const intervalId = setInterval(() => {
                                    analyserNode.getFloatTimeDomainData(data);

                                    if (data.some((sample) => sample !== 0)) {
                                        mediaElementAudioSourceNode.disconnect(analyserNode);

                                        clearInterval(intervalId);
                                        resolve();
                                    }
                                });
                            });

                            return { firstDummyGainNode, mediaElementAudioSourceNode, secondDummyGainNode };
                        }
                    });

                pauseMediaElement = () => {
                    if (!mediaElement.paused) {
                        return new Promise((resolve, reject) => {
                            mediaElement.onerror = () => reject(mediaElement.error);
                            mediaElement.onpause = resolve;
                            mediaElement.pause();
                        });
                    }
                };

                playMediaElement = () => {
                    /*
                     * Muting the mediaElement seems to be crazy, but Safari only plays muted audio without any user interaction. However even
                     * though the mediaElement is muted the audio gets routed into the audio graph.
                     */
                    mediaElement.muted = isSafari(navigator);
                    mediaElement.loop = true;
                    mediaElement.src = 'test/fixtures/1000-hertz-for-ten-seconds.wav';

                    mediaElement.play();

                    return new Promise((resolve, reject) => {
                        mediaElement.oncanplaythrough = resolve;
                        mediaElement.onerror = () => reject(mediaElement.error);
                    });
                };
            });

            describe('without any parameters', () => {
                let renderer;

                afterEach(() => pauseMediaElement());

                beforeEach(() => {
                    renderer = createPredefinedRenderer();

                    return playMediaElement();
                });

                it('should disconnect all destinations', () => {
                    return renderer({
                        prepare({ mediaElementAudioSourceNode }) {
                            mediaElementAudioSourceNode.disconnect();
                        }
                    }).then((channelData) => {
                        expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                    });
                });
            });

            describe('with an output', () => {
                describe('with a value which is out-of-bound', () => {
                    let mediaElementAudioSourceNode;

                    beforeEach(() => {
                        mediaElementAudioSourceNode = createMediaElementAudioSourceNode(context, { mediaElement });
                    });

                    it('should throw an IndexSizeError', () => {
                        expect(() => mediaElementAudioSourceNode.disconnect(-1))
                            .to.throw(DOMException)
                            .to.include({ code: 1, name: 'IndexSizeError' });
                    });
                });

                describe('with a connection from the given output', () => {
                    let renderer;

                    afterEach(() => pauseMediaElement());

                    beforeEach(() => {
                        renderer = createPredefinedRenderer();

                        return playMediaElement();
                    });

                    it('should disconnect all destinations from the given output', () => {
                        return renderer({
                            prepare({ mediaElementAudioSourceNode }) {
                                mediaElementAudioSourceNode.disconnect(0);
                            }
                        }).then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                        });
                    });
                });
            });

            describe('with a destination', () => {
                describe('without a connection to the given destination', () => {
                    let mediaElementAudioSourceNode;

                    beforeEach(() => {
                        mediaElementAudioSourceNode = createMediaElementAudioSourceNode(context, { mediaElement });
                    });

                    it('should throw an InvalidAccessError', () => {
                        expect(() => mediaElementAudioSourceNode.disconnect(new GainNode(context)))
                            .to.throw(DOMException)
                            .to.include({ code: 15, name: 'InvalidAccessError' });
                    });
                });

                describe('with a connection to the given destination', () => {
                    let renderer;

                    afterEach(() => pauseMediaElement());

                    beforeEach(() => {
                        renderer = createPredefinedRenderer();

                        return playMediaElement();
                    });

                    it('should disconnect the destination', () => {
                        return renderer({
                            prepare({ firstDummyGainNode, mediaElementAudioSourceNode }) {
                                mediaElementAudioSourceNode.disconnect(firstDummyGainNode);
                            }
                        }).then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                        });
                    });

                    it('should disconnect another destination in isolation', () => {
                        return renderer({
                            prepare({ mediaElementAudioSourceNode, secondDummyGainNode }) {
                                mediaElementAudioSourceNode.disconnect(secondDummyGainNode);
                            }
                        }).then((channelData) => {
                            /*
                             * @todo The mediaElement will just play a sine wave. Therefore it is okay to only test for non
                             * zero values.
                             */
                            expect(Array.from(channelData)).to.not.deep.equal([0, 0, 0, 0, 0]);
                        });
                    });
                });
            });

            describe('with a destination and an output', () => {
                let mediaElementAudioSourceNode;

                beforeEach(() => {
                    mediaElementAudioSourceNode = createMediaElementAudioSourceNode(context, { mediaElement });
                });

                it('should throw an IndexSizeError if the output is out-of-bound', () => {
                    expect(() => mediaElementAudioSourceNode.disconnect(new GainNode(context), -1))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                it('should throw an InvalidAccessError if there is no similar connection', () => {
                    expect(() => mediaElementAudioSourceNode.disconnect(new GainNode(context), 0))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });

            describe('with a destination, an output and an input', () => {
                let mediaElementAudioSourceNode;

                beforeEach(() => {
                    mediaElementAudioSourceNode = createMediaElementAudioSourceNode(context, { mediaElement });
                });

                it('should throw an IndexSizeError if the output is out-of-bound', () => {
                    expect(() => mediaElementAudioSourceNode.disconnect(new GainNode(context), -1, 0))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                it('should throw an IndexSizeError if the input is out-of-bound', () => {
                    expect(() => mediaElementAudioSourceNode.disconnect(new GainNode(context), 0, -1))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                it('should throw an InvalidAccessError if there is no similar connection', () => {
                    expect(() => mediaElementAudioSourceNode.disconnect(new GainNode(context), 0, 0))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });
        });
    });
});
