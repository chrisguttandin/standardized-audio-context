import '../../helper/play-silence';
import { GainNode, MediaStreamTrackAudioSourceNode } from '../../../src/module';
import { BACKUP_NATIVE_CONTEXT_STORE } from '../../../src/globals';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';
import { isSafari } from '../../helper/is-safari';

const createMediaStreamTrackAudioSourceNodeWithConstructor = (context, options) => {
    return new MediaStreamTrackAudioSourceNode(context, options);
};
const createMediaStreamTrackAudioSourceNodeWithFactoryFunction = (context, options) => {
    const mediaStreamTrackAudioSourceNode = context.createMediaStreamTrackSource(options.mediaStreamTrack);

    if (options !== null && options.channelCount !== undefined) {
        mediaStreamTrackAudioSourceNode.channelCount = options.channelCount;
    }

    if (options !== null && options.channelCountMode !== undefined) {
        mediaStreamTrackAudioSourceNode.channelCountMode = options.channelCountMode;
    }

    if (options !== null && options.channelInterpretation !== undefined) {
        mediaStreamTrackAudioSourceNode.channelInterpretation = options.channelInterpretation;
    }

    return mediaStreamTrackAudioSourceNode;
};
const testCases = {
    'constructor of a MinimalAudioContext': {
        createContext: createMinimalAudioContext,
        createMediaStreamTrackAudioSourceNode: createMediaStreamTrackAudioSourceNodeWithConstructor
    },
    'constructor of an AudioContext': {
        createContext: createAudioContext,
        createMediaStreamTrackAudioSourceNode: createMediaStreamTrackAudioSourceNodeWithConstructor
    },
    'factory function of an AudioContext': {
        createContext: createAudioContext,
        createMediaStreamTrackAudioSourceNode: createMediaStreamTrackAudioSourceNodeWithFactoryFunction
    }
};

describe('MediaStreamTrackAudioSourceNode', () => {

    /*
     * Bug #65: Only Chrome & Opera implement captureStream() so far. But Firefox can be configured to allow user media access without any
     * user interaction. This leaves Edge and Safari as the browsers which can't be tested so far.
     * @todo There is currently no way to disable the autoplay policy on BrowserStack or Sauce Labs.
     */
    if (!process.env.TRAVIS && !/Edge/.test(navigator.userAgent) && !isSafari(navigator)) { // eslint-disable-line no-undef

        for (const [ description, { createContext, createMediaStreamTrackAudioSourceNode } ] of Object.entries(testCases)) {

            describe(`with the ${ description }`, () => {

                let audioElement;
                let context;
                let mediaStream;

                afterEach(async () => {
                    for (const mediaStreamTrack of mediaStream.getTracks()) {
                        mediaStreamTrack.stop();
                    }

                    if (typeof audioElement.captureStream === 'function') {
                        await new Promise((resolve, reject) => {
                            audioElement.onerror = () => reject(audioElement.error);
                            audioElement.onpause = resolve;
                            audioElement.pause();
                        });
                    }

                    if (context.close !== undefined) {
                        return context.close();
                    }
                });

                beforeEach(async function () {
                    this.timeout(10000);

                    audioElement = new Audio();

                    if (typeof audioElement.captureStream === 'function') {
                        audioElement.src = 'base/test/fixtures/1000-hertz-for-ten-seconds.wav';
                        audioElement.muted = true;

                        audioElement.play();

                        await new Promise((resolve, reject) => {
                            audioElement.oncanplaythrough = resolve;
                            audioElement.onerror = () => reject(audioElement.error);
                        });

                        mediaStream = audioElement.captureStream();
                    } else {
                        mediaStream = await navigator.mediaDevices.getUserMedia({
                            audio: {
                                // Turn off everything which could attenuate the signal.
                                autoGainControl: false,
                                echoCancellation: false,
                                noiseSuppression: false
                            }
                        });
                    }

                    context = createContext();
                });

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

                            describe('with valid options', () => {

                                let mediaStreamTrack;

                                beforeEach(() => {
                                    mediaStreamTrack = mediaStream.getAudioTracks()[0];
                                });

                                it('should return an instance of the EventTarget interface', () => {
                                    const mediaStreamTrackAudioSourceNode = createMediaStreamTrackAudioSourceNode(context, { mediaStreamTrack });

                                    expect(mediaStreamTrackAudioSourceNode.addEventListener).to.be.a('function');
                                    expect(mediaStreamTrackAudioSourceNode.dispatchEvent).to.be.a('function');
                                    expect(mediaStreamTrackAudioSourceNode.removeEventListener).to.be.a('function');
                                });

                                it('should return an instance of the AudioNode interface', () => {
                                    const mediaStreamTrackAudioSourceNode = createMediaStreamTrackAudioSourceNode(context, { mediaStreamTrack });

                                    expect(mediaStreamTrackAudioSourceNode.channelCount).to.equal(2);
                                    expect(mediaStreamTrackAudioSourceNode.channelCountMode).to.equal('max');
                                    expect(mediaStreamTrackAudioSourceNode.channelInterpretation).to.equal('speakers');
                                    expect(mediaStreamTrackAudioSourceNode.connect).to.be.a('function');
                                    expect(mediaStreamTrackAudioSourceNode.context).to.be.an.instanceOf(context.constructor);
                                    expect(mediaStreamTrackAudioSourceNode.disconnect).to.be.a('function');
                                    expect(mediaStreamTrackAudioSourceNode.numberOfInputs).to.equal(0);
                                    expect(mediaStreamTrackAudioSourceNode.numberOfOutputs).to.equal(1);
                                });

                            });

                            describe('with invalid options', () => {

                                if (description.includes('constructor')) {

                                    describe('with an OfflineAudioContext', () => {

                                        let mediaStreamTrack;
                                        let offlineAudioContext;

                                        beforeEach(() => {
                                            mediaStreamTrack = mediaStream.getAudioTracks()[0];
                                            offlineAudioContext = createOfflineAudioContext();
                                        });

                                        it('should throw a NotSupportedError', (done) => {
                                            try {
                                                createMediaStreamTrackAudioSourceNode(offlineAudioContext, { mediaStreamTrack });
                                            } catch (err) {
                                                expect(err.code).to.equal(9);
                                                expect(err.name).to.equal('NotSupportedError');

                                                done();
                                            }
                                        });

                                    });

                                }

                                describe('with a mediaStreamTrack that is not of kind audio', () => {

                                    let mediaStreamTrack;
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
                                        mediaStreamTrack = videoStream.getVideoTracks()[0];
                                    });

                                    it('should throw an InvalidStateError', (done) => {
                                        try {
                                            createMediaStreamTrackAudioSourceNode(context, { mediaStreamTrack });
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

                    let mediaStreamTrackAudioSourceNode;

                    beforeEach(() => {
                        const mediaStreamTrack = mediaStream.getAudioTracks()[0];

                        mediaStreamTrackAudioSourceNode = createMediaStreamTrackAudioSourceNode(context, { mediaStreamTrack });
                    });

                    it('should be assignable to another value', () => {
                        const channelCount = 4;

                        mediaStreamTrackAudioSourceNode.channelCount = channelCount;

                        expect(mediaStreamTrackAudioSourceNode.channelCount).to.equal(channelCount);
                    });

                });

                describe('channelCountMode', () => {

                    let mediaStreamTrackAudioSourceNode;

                    beforeEach(() => {
                        const mediaStreamTrack = mediaStream.getAudioTracks()[0];

                        mediaStreamTrackAudioSourceNode = createMediaStreamTrackAudioSourceNode(context, { mediaStreamTrack });
                    });

                    it('should be assignable to another value', () => {
                        const channelCountMode = 'explicit';

                        mediaStreamTrackAudioSourceNode.channelCountMode = channelCountMode;

                        expect(mediaStreamTrackAudioSourceNode.channelCountMode).to.equal(channelCountMode);
                    });

                });

                describe('channelInterpretation', () => {

                    let mediaStreamTrackAudioSourceNode;

                    beforeEach(() => {
                        const mediaStreamTrack = mediaStream.getAudioTracks()[0];

                        mediaStreamTrackAudioSourceNode = createMediaStreamTrackAudioSourceNode(context, { mediaStreamTrack });
                    });

                    it('should be assignable to another value', () => {
                        const channelInterpretation = 'discrete';

                        mediaStreamTrackAudioSourceNode.channelInterpretation = channelInterpretation;

                        expect(mediaStreamTrackAudioSourceNode.channelInterpretation).to.equal(channelInterpretation);
                    });

                });

                describe('connect()', () => {

                    let mediaStreamTrackAudioSourceNode;

                    beforeEach(() => {
                        const mediaStreamTrack = mediaStream.getAudioTracks()[0];

                        mediaStreamTrackAudioSourceNode = createMediaStreamTrackAudioSourceNode(context, { mediaStreamTrack });
                    });

                    for (const type of [ 'AudioNode', 'AudioParam' ]) {

                        describe(`with an ${ type }`, () => {

                            let audioNodeOrAudioParam;

                            beforeEach(() => {
                                const gainNode = new GainNode(context);

                                audioNodeOrAudioParam = (type === 'AudioNode') ? gainNode : gainNode.gain;
                            });

                            if (type === 'AudioNode') {

                                it('should be chainable', () => {
                                    expect(mediaStreamTrackAudioSourceNode.connect(audioNodeOrAudioParam)).to.equal(audioNodeOrAudioParam);
                                });

                            } else {

                                it('should not be chainable', () => {
                                    expect(mediaStreamTrackAudioSourceNode.connect(audioNodeOrAudioParam)).to.be.undefined;
                                });

                            }

                            it('should accept duplicate connections', () => {
                                mediaStreamTrackAudioSourceNode.connect(audioNodeOrAudioParam);
                                mediaStreamTrackAudioSourceNode.connect(audioNodeOrAudioParam);
                            });

                            it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                                try {
                                    mediaStreamTrackAudioSourceNode.connect(audioNodeOrAudioParam, -1);
                                } catch (err) {
                                    expect(err.code).to.equal(1);
                                    expect(err.name).to.equal('IndexSizeError');

                                    done();
                                }
                            });

                            if (type === 'AudioNode') {

                                it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                                    try {
                                        mediaStreamTrackAudioSourceNode.connect(audioNodeOrAudioParam, 0, -1);
                                    } catch (err) {
                                        expect(err.code).to.equal(1);
                                        expect(err.name).to.equal('IndexSizeError');

                                        done();
                                    }
                                });

                            }

                        });

                        describe(`with an ${ type } of another context`, () => {

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

                                audioNodeOrAudioParam = (type === 'AudioNode') ? gainNode : gainNode.gain;
                            });

                            it('should throw an InvalidAccessError', (done) => {
                                try {
                                    mediaStreamTrackAudioSourceNode.connect(audioNodeOrAudioParam);
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
                        createPredefinedRenderer = (isAudioStreamTrackRemoved) => createRenderer({
                            context,
                            length: (context.length === undefined) ? 5 : undefined,
                            prepare (destination) {
                                const firstDummyGainNode = new GainNode(context);
                                const mediaStreamTrack = mediaStream.getAudioTracks()[0];
                                const mediaStreamTrackAudioSourceNode = createMediaStreamTrackAudioSourceNode(context, { mediaStreamTrack });
                                const secondDummyGainNode = new GainNode(context);

                                if (isAudioStreamTrackRemoved === 'removed') {
                                    for (const audioStreamTrack of mediaStream.getAudioTracks()) {
                                        mediaStream.removeTrack(audioStreamTrack);
                                    }
                                }

                                mediaStreamTrackAudioSourceNode
                                    .connect(firstDummyGainNode)
                                    .connect(destination);

                                mediaStreamTrackAudioSourceNode.connect(secondDummyGainNode);

                                return { firstDummyGainNode, mediaStreamTrackAudioSourceNode, secondDummyGainNode };
                            }
                        });
                    });

                    describe('without any parameters', () => {

                        for (const isAudioStreamTrackRemoved of [ true, false ]) {

                            describe(`with an audio track that gets ${ (isAudioStreamTrackRemoved) ? 'not' : '' } removed`, () => {

                                let renderer;

                                beforeEach(function () {
                                    this.timeout(10000);

                                    renderer = createPredefinedRenderer(isAudioStreamTrackRemoved);
                                });

                                it('should disconnect all destinations', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        prepare ({ mediaStreamTrackAudioSourceNode }) {
                                            mediaStreamTrackAudioSourceNode.disconnect();
                                        },
                                        verifyChannelData: false
                                    })
                                        .then((channelData) => {
                                            expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                                        });
                                });

                            });

                        }

                    });

                    describe('with an output', () => {

                        describe('with a value which is out-of-bound', () => {

                            let mediaStreamTrackAudioSourceNode;

                            beforeEach(() => {
                                const mediaStreamTrack = mediaStream.getAudioTracks()[0];

                                mediaStreamTrackAudioSourceNode = createMediaStreamTrackAudioSourceNode(context, { mediaStreamTrack });
                            });

                            it('should throw an IndexSizeError', (done) => {
                                try {
                                    mediaStreamTrackAudioSourceNode.disconnect(-1);
                                } catch (err) {
                                    expect(err.code).to.equal(1);
                                    expect(err.name).to.equal('IndexSizeError');

                                    done();
                                }
                            });

                        });

                        describe('with a connection from the given output', () => {

                            for (const isAudioStreamTrackRemoved of [ true, false ]) {

                                describe(`with an audio track that gets ${ (isAudioStreamTrackRemoved) ? 'not' : '' } removed`, () => {

                                    let renderer;

                                    beforeEach(function () {
                                        this.timeout(10000);

                                        renderer = createPredefinedRenderer(isAudioStreamTrackRemoved);
                                    });

                                    it('should disconnect all destinations from the given output', function () {
                                        this.timeout(10000);

                                        return renderer({
                                            prepare ({ mediaStreamTrackAudioSourceNode }) {
                                                mediaStreamTrackAudioSourceNode.disconnect(0);
                                            },
                                            verifyChannelData: false
                                        })
                                            .then((channelData) => {
                                                expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                                            });
                                    });

                                });

                            }

                        });

                    });

                    describe('with a destination', () => {

                        describe('without a connection to the given destination', () => {

                            let mediaStreamTrackAudioSourceNode;

                            beforeEach(() => {
                                const mediaStreamTrack = mediaStream.getAudioTracks()[0];

                                mediaStreamTrackAudioSourceNode = createMediaStreamTrackAudioSourceNode(context, { mediaStreamTrack });
                            });

                            it('should throw an InvalidAccessError', (done) => {
                                try {
                                    mediaStreamTrackAudioSourceNode.disconnect(new GainNode(context));
                                } catch (err) {
                                    expect(err.code).to.equal(15);
                                    expect(err.name).to.equal('InvalidAccessError');

                                    done();
                                }
                            });

                        });

                        describe('with a connection to the given destination', () => {

                            for (const isAudioStreamTrackRemoved of [ true, false ]) {

                                describe(`with an audio track that gets ${ (isAudioStreamTrackRemoved) ? 'not' : '' } removed`, () => {

                                    let renderer;

                                    beforeEach(function () {
                                        this.timeout(10000);

                                        renderer = createPredefinedRenderer(isAudioStreamTrackRemoved);
                                    });

                                    it('should disconnect the destination', function () {
                                        this.timeout(10000);

                                        return renderer({
                                            prepare ({ firstDummyGainNode, mediaStreamTrackAudioSourceNode }) {
                                                mediaStreamTrackAudioSourceNode.disconnect(firstDummyGainNode);
                                            },
                                            verifyChannelData: false
                                        })
                                            .then((channelData) => {
                                                expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                                            });
                                    });

                                    it('should disconnect another destination in isolation', function () {
                                        this.timeout(10000);

                                        return renderer({
                                            prepare ({ mediaStreamTrackAudioSourceNode, secondDummyGainNode }) {
                                                mediaStreamTrackAudioSourceNode.disconnect(secondDummyGainNode);
                                            },
                                            verifyChannelData: false
                                        })
                                            .then((channelData) => {
                                                /*
                                                 * @todo The audioElement will just play a sine wave and Firefox will just capture the signal from
                                                 * the microphone. Therefore it is okay to only test for non zero values.
                                                 */
                                                expect(Array.from(channelData)).to.not.deep.equal([ 0, 0, 0, 0, 0 ]);
                                            });
                                    });

                                });

                            }

                        });

                    });

                    describe('with a destination and an output', () => {

                        let mediaStreamTrackAudioSourceNode;

                        beforeEach(() => {
                            const mediaStreamTrack = mediaStream.getAudioTracks()[0];

                            mediaStreamTrackAudioSourceNode = createMediaStreamTrackAudioSourceNode(context, { mediaStreamTrack });
                        });

                        it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                            try {
                                mediaStreamTrackAudioSourceNode.disconnect(new GainNode(context), -1);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                        it('should throw an InvalidAccessError if there is no similar connection', (done) => {
                            try {
                                mediaStreamTrackAudioSourceNode.disconnect(new GainNode(context), 0);
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });

                    });

                    describe('with a destination, an output and an input', () => {

                        let mediaStreamTrackAudioSourceNode;

                        beforeEach(() => {
                            const mediaStreamTrack = mediaStream.getAudioTracks()[0];

                            mediaStreamTrackAudioSourceNode = createMediaStreamTrackAudioSourceNode(context, { mediaStreamTrack });
                        });

                        it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                            try {
                                mediaStreamTrackAudioSourceNode.disconnect(new GainNode(context), -1, 0);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                        it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                            try {
                                mediaStreamTrackAudioSourceNode.disconnect(new GainNode(context), 0, -1);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                        it('should throw an InvalidAccessError if there is no similar connection', (done) => {
                            try {
                                mediaStreamTrackAudioSourceNode.disconnect(new GainNode(context), 0, 0);
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
