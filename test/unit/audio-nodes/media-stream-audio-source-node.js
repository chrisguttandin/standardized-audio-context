import '../../helper/play-silence';
import { GainNode, MediaStreamAudioSourceNode } from '../../../src/module';
import { BACKUP_NATIVE_CONTEXT_STORE } from '../../../src/globals';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';
import { isSafari } from '../../helper/is-safari';

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
     * Bug #65: Only Chrome & Opera implement captureStream() so far. But Firefox can be configured to allow user media access without any
     * user interaction. This leaves Edge and Safari as the browsers which can't be tested so far.
     * @todo There is currently no way to disable the autoplay policy on BrowserStack or Sauce Labs.
     */
    if (!process.env.TRAVIS && !/Edge/.test(navigator.userAgent) && !isSafari(navigator)) { // eslint-disable-line no-undef

        for (const [ description, { createContext, createMediaStreamAudioSourceNode } ] of Object.entries(testCases)) {

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

                        await audioElement.play();

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

                                it('should return an instance of the EventTarget interface', () => {
                                    const mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, { mediaStream });

                                    expect(mediaStreamAudioSourceNode.addEventListener).to.be.a('function');
                                    expect(mediaStreamAudioSourceNode.dispatchEvent).to.be.a('function');
                                    expect(mediaStreamAudioSourceNode.removeEventListener).to.be.a('function');
                                });

                                it('should return an instance of the AudioNode interface', () => {
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

                            });

                            describe('with invalid options', () => {

                                if (description.includes('constructor')) {

                                    describe('with an OfflineAudioContext', () => {

                                        let offlineAudioContext;

                                        beforeEach(() => {
                                            offlineAudioContext = createOfflineAudioContext();
                                        });

                                        it('should throw a NotSupportedError', (done) => {
                                            try {
                                                createMediaStreamAudioSourceNode(offlineAudioContext, { mediaStream });
                                            } catch (err) {
                                                expect(err.code).to.equal(9);
                                                expect(err.name).to.equal('NotSupportedError');

                                                done();
                                            }
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

                describe('connect()', () => {

                    let mediaStreamAudioSourceNode;

                    beforeEach(() => {
                        mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, { mediaStream });
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
                                    expect(mediaStreamAudioSourceNode.connect(audioNodeOrAudioParam)).to.equal(audioNodeOrAudioParam);
                                });

                            } else {

                                it('should not be chainable', () => {
                                    expect(mediaStreamAudioSourceNode.connect(audioNodeOrAudioParam)).to.be.undefined;
                                });

                            }

                            it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                                try {
                                    mediaStreamAudioSourceNode.connect(audioNodeOrAudioParam, -1);
                                } catch (err) {
                                    expect(err.code).to.equal(1);
                                    expect(err.name).to.equal('IndexSizeError');

                                    done();
                                }
                            });

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
                                    mediaStreamAudioSourceNode.connect(audioNodeOrAudioParam);
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

                    let renderer;

                    beforeEach(function () {
                        this.timeout(10000);

                        renderer = createRenderer({
                            context,
                            length: (context.length === undefined) ? 5 : undefined,
                            prepare (destination) {
                                const firstDummyGainNode = new GainNode(context);
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
                            },
                            verifyChannelData: false
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
                            },
                            verifyChannelData: false
                        })
                            .then((channelData) => {
                                /*
                                 * @todo The audioElement will just play a sine wave and Firefox will just capture the signal from the
                                 * microphone. Therefore it is okay to only test for non zero values.
                                 */
                                expect(Array.from(channelData)).to.not.deep.equal([ 0, 0, 0, 0, 0 ]);
                            });
                    });

                    it('should be possible to disconnect all destinations by specifying the output', function () {
                        this.timeout(10000);

                        return renderer({
                            prepare ({ mediaStreamAudioSourceNode }) {
                                mediaStreamAudioSourceNode.disconnect(0);
                            },
                            verifyChannelData: false
                        })
                            .then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                            });
                    });

                    it('should be possible to disconnect all destinations', function () {
                        this.timeout(10000);

                        return renderer({
                            prepare ({ mediaStreamAudioSourceNode }) {
                                mediaStreamAudioSourceNode.disconnect();
                            },
                            verifyChannelData: false
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
