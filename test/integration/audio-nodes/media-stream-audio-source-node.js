import { AnalyserNode, AudioContext, GainNode, MediaStreamAudioSourceNode } from '../../../src/module';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createNativeAudioContext } from '../../helper/create-native-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';
import { isSafari } from '../../helper/is-safari';

const createMediaStreamAudioSourceNodeWithConstructor = (context, options) => {
    return new MediaStreamAudioSourceNode(context, options);
};
const createMediaStreamAudioSourceNodeWithFactoryFunction = (context, options) => {
    const mediaStreamAudioSourceNode = context.createMediaStreamSource(options.mediaStream);

    if (options.channelCount !== undefined) {
        mediaStreamAudioSourceNode.channelCount = options.channelCount;
    }

    if (options.channelCountMode !== undefined) {
        mediaStreamAudioSourceNode.channelCountMode = options.channelCountMode;
    }

    if (options.channelInterpretation !== undefined) {
        mediaStreamAudioSourceNode.channelInterpretation = options.channelInterpretation;
    }

    return mediaStreamAudioSourceNode;
};
const testCases = {
    'constructor of a MinimalAudioContext': {
        createContext: createMinimalAudioContext,
        createMediaStreamAudioSourceNode: createMediaStreamAudioSourceNodeWithConstructor
    },
    'constructor of an AudioContext': {
        createContext: createAudioContext,
        createMediaStreamAudioSourceNode: createMediaStreamAudioSourceNodeWithConstructor
    },
    'factory function of an AudioContext': {
        createContext: createAudioContext,
        createMediaStreamAudioSourceNode: createMediaStreamAudioSourceNodeWithFactoryFunction
    }
};

describe('MediaStreamAudioSourceNode', { skip: typeof window === 'undefined' }, () => {
    /*
     * Bug #209: Only Chrome implements the MediaStreamTrackGenerator for audio. But Firefox can be configured to allow user media
     * access without any user interaction. Safari already supports createMediaStreamDestination().
     */
    describe.for(Object.entries(testCases))('with the %s', ([description, { createContext, createMediaStreamAudioSourceNode }]) => {
        let context;
        let mediaStream;
        let teardownMediaStream;

        afterEach(async () => {
            for (const mediaStreamTrack of mediaStream.getTracks()) {
                mediaStreamTrack.stop();
            }

            if (typeof teardownMediaStream === 'function') {
                await teardownMediaStream();
            }

            return context.close?.();
        });

        beforeEach(async () => {
            context = createContext();

            if (typeof MediaStreamTrackGenerator !== 'undefined') {
                const { sampleRate } = context;
                const numberOfFrames = sampleRate / 20;
                const data = new Float32Array(numberOfFrames);

                data.fill(1);

                // eslint-disable-next-line no-undef
                const trackGenerator = new MediaStreamTrackGenerator({ kind: 'audio' });
                const writer = trackGenerator.writable.getWriter();

                let timestamp = 0;

                await writer.write(
                    // eslint-disable-next-line no-undef
                    new AudioData({
                        data,
                        format: 'f32',
                        numberOfChannels: 1,
                        numberOfFrames,
                        sampleRate,
                        timestamp
                    })
                );

                const duration = (numberOfFrames / sampleRate) * 1000000;

                timestamp += duration;

                await writer.write(
                    // eslint-disable-next-line no-undef
                    new AudioData({
                        data,
                        format: 'f32',
                        numberOfChannels: 1,
                        numberOfFrames,
                        sampleRate,
                        timestamp
                    })
                );

                const intervalId = setInterval(() => {
                    timestamp += duration;

                    writer.write(
                        // eslint-disable-next-line no-undef
                        new AudioData({
                            data,
                            format: 'f32',
                            numberOfChannels: 1,
                            numberOfFrames,
                            sampleRate,
                            timestamp
                        })
                    );
                }, duration / 1000);

                mediaStream = new MediaStream([trackGenerator]);
                teardownMediaStream = () => {
                    clearInterval(intervalId);
                    writer.close();
                };
            } else if (isSafari(navigator)) {
                const audioContext = new AudioContext();
                const oscillatorNode = audioContext.createOscillator();
                const mediaStreamAudioDestinationNode = audioContext.createMediaStreamDestination();

                oscillatorNode.connect(mediaStreamAudioDestinationNode);
                oscillatorNode.start();

                mediaStream = mediaStreamAudioDestinationNode.stream;
                teardownMediaStream = () => {
                    oscillatorNode.stop();
                    oscillatorNode.disconnect();

                    return audioContext.close();
                };
            } else {
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        // Turn off everything which could attenuate the signal.
                        autoGainControl: false,
                        echoCancellation: false,
                        noiseSuppression: false
                    }
                });
                teardownMediaStream = null;
            }
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
                    it('should return an instance of the MediaStreamAudioSourceNode constructor', () => {
                        const mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, { mediaStream });

                        expect(mediaStreamAudioSourceNode).to.be.an.instanceOf(MediaStreamAudioSourceNode);
                    });

                    it('should return an implementation of the EventTarget interface', () => {
                        const mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, { mediaStream });

                        expect(mediaStreamAudioSourceNode.addEventListener).to.be.a('function');
                        expect(mediaStreamAudioSourceNode.dispatchEvent).to.be.a('function');
                        expect(mediaStreamAudioSourceNode.removeEventListener).to.be.a('function');
                    });

                    it('should return an implementation of the AudioNode interface', () => {
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

                    it('should return an implementation of the MediaStreamAudioSourceNode interface', () => {
                        const mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, { mediaStream });

                        expect(mediaStreamAudioSourceNode.mediaStream).to.be.an.instanceOf(MediaStream);
                    });

                    if (audioContextState === 'running') {
                        describe('with a mediaStream that has more than one audio track', () => {
                            let audioStreamTrackIds;
                            let renderer;

                            beforeEach(() => {
                                // Bug #214 Safari can't stop a MediaStream coming from a MediaStreamAudioDestinationNode.
                                if (isSafari(navigator)) {
                                    const gainNodes = [context._nativeContext.createGain(), context._nativeContext.createGain()];
                                    const mediaStreamAudioDestinationNodes = [
                                        context._nativeContext.createMediaStreamDestination(),
                                        context._nativeContext.createMediaStreamDestination()
                                    ];
                                    const mediaStreamAudioSourceNode = context._nativeContext.createMediaStreamSource(mediaStream);

                                    mediaStreamAudioSourceNode.connect(gainNodes[0]).connect(mediaStreamAudioDestinationNodes[0]);

                                    mediaStreamAudioSourceNode.connect(gainNodes[1]).connect(mediaStreamAudioDestinationNodes[1]);

                                    const audioStreamTracks = mediaStreamAudioDestinationNodes.map(
                                        ({ stream }) => stream.getAudioTracks()[0]
                                    );

                                    mediaStream = new MediaStream(audioStreamTracks);

                                    // @todo For some reason Safari doesn't care if a MediaStreamTrack gets stopped.
                                    audioStreamTracks.forEach(
                                        (audioStreamTrack, index) => (audioStreamTrack.stop = () => (gainNodes[index].gain.value = 0))
                                    );
                                } else {
                                    mediaStream.addTrack(mediaStream.getAudioTracks()[0].clone());
                                }

                                audioStreamTrackIds = mediaStream
                                    .getAudioTracks()
                                    .map((audioStreamTrack) => audioStreamTrack.id)
                                    .sort();

                                renderer = createRenderer({
                                    context,
                                    /*
                                     * Bug #207 & #208: It's necessary to pipe the stream through the AudioContext once more
                                     * in Chrome and Safari. There will be an additional delay to account for. It's not
                                     * necessarily a bug but still something that needs to be tracked.
                                     */
                                    length:
                                        context.length === undefined
                                            ? isSafari(navigator)
                                                ? 2437
                                                : /Chrome/.test(navigator.userAgent)
                                                  ? 1477
                                                  : 5
                                            : undefined,
                                    async setup(destination) {
                                        const analyserNode = new AnalyserNode(context);
                                        const firstDummyGainNode = new GainNode(context);
                                        const mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, {
                                            mediaStream
                                        });
                                        const secondDummyGainNode = new GainNode(context);

                                        mediaStreamAudioSourceNode.connect(firstDummyGainNode).connect(destination);

                                        mediaStreamAudioSourceNode.connect(secondDummyGainNode);

                                        await new Promise((resolve) => {
                                            mediaStreamAudioSourceNode.connect(analyserNode);

                                            const data = new Float32Array(analyserNode.fftSize);
                                            const intervalId = setInterval(() => {
                                                analyserNode.getFloatTimeDomainData(data);

                                                if (data.some((sample) => sample !== 0)) {
                                                    mediaStreamAudioSourceNode.disconnect(analyserNode);

                                                    clearInterval(intervalId);
                                                    resolve();
                                                }
                                            });
                                        });

                                        return { firstDummyGainNode, mediaStreamAudioSourceNode, secondDummyGainNode };
                                    }
                                });
                            });

                            describe('with a noisy and a silent audio track', () => {
                                it('should pick the correct audio track', () => {
                                    return renderer({
                                        prepare() {
                                            for (const audioStreamTrack of mediaStream.getAudioTracks()) {
                                                if (audioStreamTrack.id === audioStreamTrackIds[1]) {
                                                    audioStreamTrack.stop();
                                                }
                                            }
                                        }
                                    }).then((channelData) => {
                                        expect(
                                            Array.from(channelData).slice(
                                                isSafari(navigator) ? 2432 : /Chrome/.test(navigator.userAgent) ? 1472 : 0
                                            )
                                        ).to.not.deep.equal([0, 0, 0, 0, 0]);
                                    });
                                });
                            });

                            describe('with a silent and a noisy audio track', () => {
                                it('should pick the correct audio track', () => {
                                    return renderer({
                                        prepare() {
                                            for (const audioStreamTrack of mediaStream.getAudioTracks()) {
                                                if (audioStreamTrack.id === audioStreamTrackIds[0]) {
                                                    audioStreamTrack.stop();
                                                }
                                            }
                                        }
                                    }).then((channelData) => {
                                        expect(
                                            Array.from(channelData).slice(
                                                isSafari(navigator) ? 2432 : /Chrome/.test(navigator.userAgent) ? 1472 : 0
                                            )
                                        ).to.deep.equal([0, 0, 0, 0, 0]);
                                    });
                                });
                            });
                        });
                    }
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
                                    createMediaStreamAudioSourceNode(offlineAudioContext, { mediaStream });
                                }).to.throw(TypeError);
                            });
                        });
                    }

                    describe('with a mediaStream that has no audio track', () => {
                        let videoStream;

                        afterEach(() => {
                            for (const videoStreamTrack of videoStream.getTracks()) {
                                videoStreamTrack.stop();
                            }
                        });

                        beforeEach(() => {
                            const canvasElement = document.createElement('canvas');

                            // @todo https://bugzilla.mozilla.org/show_bug.cgi?id=1388974
                            canvasElement.getContext('2d');

                            videoStream = canvasElement.captureStream();
                        });

                        it('should throw an InvalidStateError', () => {
                            expect(() => createMediaStreamAudioSourceNode(context, { mediaStream: videoStream }))
                                .to.throw(DOMException)
                                .to.include({ code: 11, name: 'InvalidStateError' });
                        });
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

        describe('numberOfInputs', () => {
            let mediaStreamAudioSourceNode;

            beforeEach(() => {
                mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, { mediaStream });
            });

            it('should be readonly', () => {
                expect(() => {
                    mediaStreamAudioSourceNode.numberOfInputs = 2;
                }).to.throw(TypeError);
            });
        });

        describe('numberOfOutputs', () => {
            let mediaStreamAudioSourceNode;

            beforeEach(() => {
                mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, { mediaStream });
            });

            it('should be readonly', () => {
                expect(() => {
                    mediaStreamAudioSourceNode.numberOfOutputs = 2;
                }).to.throw(TypeError);
            });
        });

        describe('connect()', () => {
            let mediaStreamAudioSourceNode;

            beforeEach(() => {
                mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, { mediaStream });
            });

            describe.for(['AudioNode', 'AudioParam'])('with an %s', (type) => {
                let audioNodeOrAudioParam;

                beforeEach(() => {
                    const gainNode = new GainNode(context);

                    audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                });

                if (type === 'AudioNode') {
                    it('should be chainable', () => {
                        expect(mediaStreamAudioSourceNode.connect(audioNodeOrAudioParam)).to.equal(audioNodeOrAudioParam);
                    });
                } else {
                    it('should not be chainable', () => {
                        expect(mediaStreamAudioSourceNode.connect(audioNodeOrAudioParam)).to.be.undefined;
                    });
                }

                it('should accept duplicate connections', () => {
                    mediaStreamAudioSourceNode.connect(audioNodeOrAudioParam);
                    mediaStreamAudioSourceNode.connect(audioNodeOrAudioParam);
                });

                it('should throw an IndexSizeError if the output is out-of-bound', () => {
                    expect(() => mediaStreamAudioSourceNode.connect(audioNodeOrAudioParam, -1))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                if (type === 'AudioNode') {
                    it('should throw an IndexSizeError if the input is out-of-bound', () => {
                        expect(() => mediaStreamAudioSourceNode.connect(audioNodeOrAudioParam, 0, -1))
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
                    expect(() => mediaStreamAudioSourceNode.connect(audioNodeOrAudioParam))
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
                    expect(() => mediaStreamAudioSourceNode.connect(nativeAudioNodeOrAudioParam))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });
        });

        describe('disconnect()', () => {
            let createPredefinedRenderer;

            beforeEach(() => {
                createPredefinedRenderer = (isAudioStreamTrackRemoved) =>
                    createRenderer({
                        context,
                        /*
                         * Bug #207 & #208: It's necessary to pipe the stream through the AudioContext once more in Chrome and
                         * Safari. There will be an additional delay to account for. It's not necessarily a bug but still something
                         * that needs to be tracked.
                         */
                        length:
                            context.length === undefined
                                ? isSafari(navigator)
                                    ? 2437
                                    : /Chrome/.test(navigator.userAgent)
                                      ? 1477
                                      : 5
                                : undefined,
                        async setup(destination) {
                            const analyserNode = new AnalyserNode(context);
                            const firstDummyGainNode = new GainNode(context);
                            const mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, { mediaStream });
                            const secondDummyGainNode = new GainNode(context);

                            if (isAudioStreamTrackRemoved === 'removed') {
                                for (const audioStreamTrack of mediaStream.getAudioTracks()) {
                                    mediaStream.removeTrack(audioStreamTrack);
                                }
                            }

                            mediaStreamAudioSourceNode.connect(firstDummyGainNode).connect(destination);

                            mediaStreamAudioSourceNode.connect(secondDummyGainNode);

                            await new Promise((resolve) => {
                                mediaStreamAudioSourceNode.connect(analyserNode);

                                const data = new Float32Array(analyserNode.fftSize);
                                const intervalId = setInterval(() => {
                                    analyserNode.getFloatTimeDomainData(data);

                                    if (data.some((sample) => sample !== 0)) {
                                        mediaStreamAudioSourceNode.disconnect(analyserNode);

                                        clearInterval(intervalId);
                                        resolve();
                                    }
                                });
                            });

                            return { firstDummyGainNode, mediaStreamAudioSourceNode, secondDummyGainNode };
                        }
                    });
            });

            describe('without any parameters', () => {
                for (const isAudioStreamTrackRemoved of [true, false]) {
                    describe(`with an audio track that gets ${isAudioStreamTrackRemoved ? 'not ' : ''}removed`, () => {
                        let renderer;

                        beforeEach(() => {
                            renderer = createPredefinedRenderer(isAudioStreamTrackRemoved);
                        });

                        it('should disconnect all destinations', () => {
                            return renderer({
                                prepare({ mediaStreamAudioSourceNode }) {
                                    mediaStreamAudioSourceNode.disconnect();
                                }
                            }).then((channelData) => {
                                expect(
                                    Array.from(channelData).slice(
                                        isSafari(navigator) ? 2432 : /Chrome/.test(navigator.userAgent) ? 1472 : 0
                                    )
                                ).to.deep.equal([0, 0, 0, 0, 0]);
                            });
                        });
                    });
                }
            });

            describe('with an output', () => {
                describe('with a value which is out-of-bound', () => {
                    let mediaStreamAudioSourceNode;

                    beforeEach(() => {
                        mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, { mediaStream });
                    });

                    it('should throw an IndexSizeError', () => {
                        expect(() => mediaStreamAudioSourceNode.disconnect(-1))
                            .to.throw(DOMException)
                            .to.include({ code: 1, name: 'IndexSizeError' });
                    });
                });

                describe('with a connection from the given output', () => {
                    for (const isAudioStreamTrackRemoved of [true, false]) {
                        describe(`with an audio track that gets ${isAudioStreamTrackRemoved ? 'not ' : ''}removed`, () => {
                            let renderer;

                            beforeEach(() => {
                                renderer = createPredefinedRenderer(isAudioStreamTrackRemoved);
                            });

                            it('should disconnect all destinations from the given output', () => {
                                return renderer({
                                    prepare({ mediaStreamAudioSourceNode }) {
                                        mediaStreamAudioSourceNode.disconnect(0);
                                    }
                                }).then((channelData) => {
                                    expect(
                                        Array.from(channelData).slice(
                                            isSafari(navigator) ? 2432 : /Chrome/.test(navigator.userAgent) ? 1472 : 0
                                        )
                                    ).to.deep.equal([0, 0, 0, 0, 0]);
                                });
                            });
                        });
                    }
                });
            });

            describe('with a destination', () => {
                describe('without a connection to the given destination', () => {
                    let mediaStreamAudioSourceNode;

                    beforeEach(() => {
                        mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, { mediaStream });
                    });

                    it('should throw an InvalidAccessError', () => {
                        expect(() => mediaStreamAudioSourceNode.disconnect(new GainNode(context)))
                            .to.throw(DOMException)
                            .to.include({ code: 15, name: 'InvalidAccessError' });
                    });
                });

                describe('with a connection to the given destination', () => {
                    for (const isAudioStreamTrackRemoved of [true, false]) {
                        describe(`with an audio track that gets ${isAudioStreamTrackRemoved ? 'not ' : ''}removed`, () => {
                            let renderer;

                            beforeEach(() => {
                                renderer = createPredefinedRenderer(isAudioStreamTrackRemoved);
                            });

                            it('should disconnect the destination', () => {
                                return renderer({
                                    prepare({ firstDummyGainNode, mediaStreamAudioSourceNode }) {
                                        mediaStreamAudioSourceNode.disconnect(firstDummyGainNode);
                                    }
                                }).then((channelData) => {
                                    expect(
                                        Array.from(channelData).slice(
                                            isSafari(navigator) ? 2432 : /Chrome/.test(navigator.userAgent) ? 1472 : 0
                                        )
                                    ).to.deep.equal([0, 0, 0, 0, 0]);
                                });
                            });

                            it('should disconnect another destination in isolation', () => {
                                return renderer({
                                    prepare({ mediaStreamAudioSourceNode, secondDummyGainNode }) {
                                        mediaStreamAudioSourceNode.disconnect(secondDummyGainNode);
                                    }
                                }).then((channelData) => {
                                    expect(
                                        Array.from(channelData).slice(
                                            isSafari(navigator) ? 2432 : /Chrome/.test(navigator.userAgent) ? 1472 : 0
                                        )
                                    ).to.not.deep.equal([0, 0, 0, 0, 0]);
                                });
                            });
                        });
                    }
                });
            });

            describe('with a destination and an output', () => {
                let mediaStreamAudioSourceNode;

                beforeEach(() => {
                    mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, { mediaStream });
                });

                it('should throw an IndexSizeError if the output is out-of-bound', () => {
                    expect(() => mediaStreamAudioSourceNode.disconnect(new GainNode(context), -1))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                it('should throw an InvalidAccessError if there is no similar connection', () => {
                    expect(() => mediaStreamAudioSourceNode.disconnect(new GainNode(context), 0))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });

            describe('with a destination, an output and an input', () => {
                let mediaStreamAudioSourceNode;

                beforeEach(() => {
                    mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, { mediaStream });
                });

                it('should throw an IndexSizeError if the output is out-of-bound', () => {
                    expect(() => mediaStreamAudioSourceNode.disconnect(new GainNode(context), -1, 0))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                it('should throw an IndexSizeError if the input is out-of-bound', () => {
                    expect(() => mediaStreamAudioSourceNode.disconnect(new GainNode(context), 0, -1))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                it('should throw an InvalidAccessError if there is no similar connection', () => {
                    expect(() => mediaStreamAudioSourceNode.disconnect(new GainNode(context), 0, 0))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });
        });
    });
});
