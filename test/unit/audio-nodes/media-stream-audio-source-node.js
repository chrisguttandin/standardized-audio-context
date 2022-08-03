import { AudioContext, GainNode, MediaStreamAudioSourceNode } from '../../../src/module';
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

describe('MediaStreamAudioSourceNode', () => {
    /*
     * Bug #65: Only Chrome & Edge implement captureStream() so far. But Firefox can be configured to allow user media access without any
     * user interaction. Safari already supports createMediaStreamDestination().
     * @todo There is currently no way to disable the autoplay policy on BrowserStack or Sauce Labs.
     */
    // eslint-disable-next-line no-undef
    if (!process.env.CI) {
        for (const [description, { createContext, createMediaStreamAudioSourceNode }] of Object.entries(testCases)) {
            describe(`with the ${description}`, () => {
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

                    if (context.close !== undefined) {
                        return context.close();
                    }
                });

                beforeEach(async function () {
                    this.timeout(10000);

                    const audioElement = new Audio();

                    if (typeof audioElement.captureStream === 'function') {
                        audioElement.src = 'base/test/fixtures/1000-hertz-for-ten-seconds.wav';
                        audioElement.muted = true;

                        const playPromise = audioElement.play();

                        mediaStream = audioElement.captureStream();

                        await Promise.all([
                            playPromise,
                            new Promise((resolve, reject) => {
                                audioElement.oncanplaythrough = resolve;
                                audioElement.onerror = () => reject(audioElement.error);
                            }),
                            playPromise
                        ]);

                        teardownMediaStream = () =>
                            new Promise((resolve, reject) => {
                                audioElement.onerror = () => reject(audioElement.error);
                                audioElement.onpause = resolve;
                                audioElement.pause();
                            });
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

                    context = createContext();
                });

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
                                    if (typeof context.startRendering === 'function') {
                                        return context.startRendering();
                                    }

                                    return context.close();
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
                                            if (isSafari(navigator)) {
                                                const gainNodes = [
                                                    context._nativeContext.createGain(),
                                                    context._nativeContext.createGain()
                                                ];
                                                const mediaStreamAudioDestinationNodes = [
                                                    context._nativeContext.createMediaStreamDestination(),
                                                    context._nativeContext.createMediaStreamDestination()
                                                ];
                                                const mediaStreamAudioSourceNode =
                                                    context._nativeContext.createMediaStreamSource(mediaStream);

                                                mediaStreamAudioSourceNode
                                                    .connect(gainNodes[0])
                                                    .connect(mediaStreamAudioDestinationNodes[0]);

                                                mediaStreamAudioSourceNode
                                                    .connect(gainNodes[1])
                                                    .connect(mediaStreamAudioDestinationNodes[1]);

                                                const audioStreamTracks = mediaStreamAudioDestinationNodes.map(
                                                    ({ stream }) => stream.getAudioTracks()[0]
                                                );

                                                mediaStream = new MediaStream(audioStreamTracks);

                                                // @todo For some reason Safari doesn't care if a MediaStreamTrack gets stopped.
                                                audioStreamTracks.forEach(
                                                    (audioStreamTrack, index) =>
                                                        (audioStreamTrack.stop = () => (gainNodes[index].gain.value = 0))
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
                                                length: context.length === undefined ? 5 : undefined,
                                                prepare(destination) {
                                                    const firstDummyGainNode = new GainNode(context);
                                                    const mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, {
                                                        mediaStream
                                                    });
                                                    const secondDummyGainNode = new GainNode(context);

                                                    mediaStreamAudioSourceNode.connect(firstDummyGainNode).connect(destination);

                                                    mediaStreamAudioSourceNode.connect(secondDummyGainNode);

                                                    return { firstDummyGainNode, mediaStreamAudioSourceNode, secondDummyGainNode };
                                                }
                                            });
                                        });

                                        describe('with a noisy and a silent audio track', () => {
                                            beforeEach(() => {
                                                for (const audioStreamTrack of mediaStream.getAudioTracks()) {
                                                    if (audioStreamTrack.id === audioStreamTrackIds[1]) {
                                                        audioStreamTrack.stop();
                                                    }
                                                }
                                            });

                                            it('should pick the correct audio track', function () {
                                                this.timeout(10000);

                                                return renderer({ verifyChannelData: false }).then((channelData) => {
                                                    expect(Array.from(channelData)).to.not.deep.equal([0, 0, 0, 0, 0]);
                                                });
                                            });
                                        });

                                        describe('with a silent and a noisy audio track', () => {
                                            beforeEach(() => {
                                                for (const audioStreamTrack of mediaStream.getAudioTracks()) {
                                                    if (audioStreamTrack.id === audioStreamTrackIds[0]) {
                                                        audioStreamTrack.stop();
                                                    }
                                                }
                                            });

                                            it('should pick the correct audio track', function () {
                                                this.timeout(10000);

                                                return renderer({ verifyChannelData: false }).then((channelData) => {
                                                    expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
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

                                    it('should throw an InvalidStateError', (done) => {
                                        try {
                                            createMediaStreamAudioSourceNode(context, { mediaStream: videoStream });
                                        } catch (err) {
                                            expect(err.code).to.equal(11);
                                            expect(err.name).to.equal('InvalidStateError');

                                            done();
                                        }
                                    });
                                });
                            });
                        });
                    }
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

                    for (const type of ['AudioNode', 'AudioParam']) {
                        describe(`with an ${type}`, () => {
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

                            it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                                try {
                                    mediaStreamAudioSourceNode.connect(audioNodeOrAudioParam, -1);
                                } catch (err) {
                                    expect(err.code).to.equal(1);
                                    expect(err.name).to.equal('IndexSizeError');

                                    done();
                                }
                            });

                            if (type === 'AudioNode') {
                                it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                                    try {
                                        mediaStreamAudioSourceNode.connect(audioNodeOrAudioParam, 0, -1);
                                    } catch (err) {
                                        expect(err.code).to.equal(1);
                                        expect(err.name).to.equal('IndexSizeError');

                                        done();
                                    }
                                });
                            }
                        });

                        describe(`with an ${type} of another context`, () => {
                            let anotherContext;
                            let audioNodeOrAudioParam;

                            afterEach(() => {
                                if (anotherContext.close !== undefined) {
                                    return anotherContext.close();
                                }
                            });

                            beforeEach(() => {
                                anotherContext = createContext();

                                const gainNode = new GainNode(anotherContext);

                                audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                            });

                            it('should throw an InvalidAccessError', (done) => {
                                try {
                                    mediaStreamAudioSourceNode.connect(audioNodeOrAudioParam);
                                } catch (err) {
                                    expect(err.code).to.equal(15);
                                    expect(err.name).to.equal('InvalidAccessError');

                                    done();
                                }
                            });
                        });

                        describe(`with an ${type} of a native context`, () => {
                            let nativeAudioNodeOrAudioParam;
                            let nativeContext;

                            afterEach(() => {
                                /*
                                 * Bug #94: Safari also exposes a close() method on an OfflineAudioContext which is why the extra check for
                                 * the startRendering() method is necessary.
                                 * Bug #160: Safari also exposes a startRendering() method on an AudioContext.
                                 */
                                if (
                                    nativeContext.close !== undefined &&
                                    (nativeContext.startRendering === undefined || !nativeContext.constructor.name.includes('Offline'))
                                ) {
                                    return nativeContext.close();
                                }
                            });

                            beforeEach(() => {
                                nativeContext = createNativeAudioContext();

                                const nativeGainNode = nativeContext.createGain();

                                nativeAudioNodeOrAudioParam = type === 'AudioNode' ? nativeGainNode : nativeGainNode.gain;
                            });

                            it('should throw an InvalidAccessError', (done) => {
                                try {
                                    mediaStreamAudioSourceNode.connect(nativeAudioNodeOrAudioParam);
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
                    let createPredefinedRenderer;

                    beforeEach(() => {
                        createPredefinedRenderer = (isAudioStreamTrackRemoved) =>
                            createRenderer({
                                context,
                                length: context.length === undefined ? 5 : undefined,
                                prepare(destination) {
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

                                    return { firstDummyGainNode, mediaStreamAudioSourceNode, secondDummyGainNode };
                                }
                            });
                    });

                    describe('without any parameters', () => {
                        for (const isAudioStreamTrackRemoved of [true, false]) {
                            describe(`with an audio track that gets ${isAudioStreamTrackRemoved ? 'not' : ''} removed`, () => {
                                let renderer;

                                beforeEach(function () {
                                    this.timeout(10000);

                                    renderer = createPredefinedRenderer(isAudioStreamTrackRemoved);
                                });

                                it('should disconnect all destinations', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        prepare({ mediaStreamAudioSourceNode }) {
                                            mediaStreamAudioSourceNode.disconnect();
                                        },
                                        verifyChannelData: false
                                    }).then((channelData) => {
                                        expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
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

                            it('should throw an IndexSizeError', (done) => {
                                try {
                                    mediaStreamAudioSourceNode.disconnect(-1);
                                } catch (err) {
                                    expect(err.code).to.equal(1);
                                    expect(err.name).to.equal('IndexSizeError');

                                    done();
                                }
                            });
                        });

                        describe('with a connection from the given output', () => {
                            for (const isAudioStreamTrackRemoved of [true, false]) {
                                describe(`with an audio track that gets ${isAudioStreamTrackRemoved ? 'not' : ''} removed`, () => {
                                    let renderer;

                                    beforeEach(function () {
                                        this.timeout(10000);

                                        renderer = createPredefinedRenderer(isAudioStreamTrackRemoved);
                                    });

                                    it('should disconnect all destinations from the given output', function () {
                                        this.timeout(10000);

                                        return renderer({
                                            prepare({ mediaStreamAudioSourceNode }) {
                                                mediaStreamAudioSourceNode.disconnect(0);
                                            },
                                            verifyChannelData: false
                                        }).then((channelData) => {
                                            expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
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

                            it('should throw an InvalidAccessError', (done) => {
                                try {
                                    mediaStreamAudioSourceNode.disconnect(new GainNode(context));
                                } catch (err) {
                                    expect(err.code).to.equal(15);
                                    expect(err.name).to.equal('InvalidAccessError');

                                    done();
                                }
                            });
                        });

                        describe('with a connection to the given destination', () => {
                            for (const isAudioStreamTrackRemoved of [true, false]) {
                                describe(`with an audio track that gets ${isAudioStreamTrackRemoved ? 'not' : ''} removed`, () => {
                                    let renderer;

                                    beforeEach(function () {
                                        this.timeout(10000);

                                        renderer = createPredefinedRenderer(isAudioStreamTrackRemoved);
                                    });

                                    it('should disconnect the destination', function () {
                                        this.timeout(10000);

                                        return renderer({
                                            prepare({ firstDummyGainNode, mediaStreamAudioSourceNode }) {
                                                mediaStreamAudioSourceNode.disconnect(firstDummyGainNode);
                                            },
                                            verifyChannelData: false
                                        }).then((channelData) => {
                                            expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                                        });
                                    });

                                    it('should disconnect another destination in isolation', function () {
                                        this.timeout(10000);

                                        return renderer({
                                            prepare({ mediaStreamAudioSourceNode, secondDummyGainNode }) {
                                                mediaStreamAudioSourceNode.disconnect(secondDummyGainNode);
                                            },
                                            verifyChannelData: false
                                        }).then((channelData) => {
                                            /*
                                             * @todo The audioElement will just play a sine wave and Firefox will just capture the signal from
                                             * the microphone. Therefore it is okay to only test for non zero values.
                                             */
                                            expect(Array.from(channelData)).to.not.deep.equal([0, 0, 0, 0, 0]);
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

                        it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                            try {
                                mediaStreamAudioSourceNode.disconnect(new GainNode(context), -1);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                        it('should throw an InvalidAccessError if there is no similar connection', (done) => {
                            try {
                                mediaStreamAudioSourceNode.disconnect(new GainNode(context), 0);
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });
                    });

                    describe('with a destination, an output and an input', () => {
                        let mediaStreamAudioSourceNode;

                        beforeEach(() => {
                            mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, { mediaStream });
                        });

                        it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                            try {
                                mediaStreamAudioSourceNode.disconnect(new GainNode(context), -1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                        it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                            try {
                                mediaStreamAudioSourceNode.disconnect(new GainNode(context), 0, -1);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                        it('should throw an InvalidAccessError if there is no similar connection', (done) => {
                            try {
                                mediaStreamAudioSourceNode.disconnect(new GainNode(context), 0, 0);
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });
                    });
                });
            });
        }
    }
});
