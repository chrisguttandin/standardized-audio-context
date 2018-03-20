import { AudioContext } from '../../../src/audio-contexts/audio-context';
import { GainNode } from '../../../src/audio-nodes/gain-node';
import { MediaStreamAudioSourceNode } from '../../../src/audio-nodes/media-stream-audio-source-node';
import { MinimalAudioContext } from '../../../src/audio-contexts/minimal-audio-context';
import { createRenderer } from '../../helper/create-renderer';

describe('MediaStreamAudioSourceNode', () => {

    // Bug #65: Only Chrome & Opera implement captureStream() so far, which is why this test can't be executed in other browsers for now.
    if (/Chrome/.test(navigator.userAgent) && !/Edge/.test(navigator.userAgent)) {

        // @todo leche seems to need a unique string as identifier as first argument.
        leche.withData([
            [ 'constructor with AudioContext', () => new AudioContext(), (context, mediaStream) => new MediaStreamAudioSourceNode(context, { mediaStream }) ],
            [ 'constructor with MinimalAudioContext', () => new MinimalAudioContext(), (context, mediaStream) => new MediaStreamAudioSourceNode(context, { mediaStream }) ],
            [ 'factory function of AudioContext', () => new AudioContext(), (context, mediaStream) => context.createMediaStreamSource(mediaStream) ]
        ], (_, createContext, createMediaStreamAudioSourceNode) => {

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

            it('should be an instance of the EventTarget interface', () => {
                const mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, mediaStream);

                expect(mediaStreamAudioSourceNode.addEventListener).to.be.a('function');
                expect(mediaStreamAudioSourceNode.dispatchEvent).to.be.a('function');
                expect(mediaStreamAudioSourceNode.removeEventListener).to.be.a('function');
            });

            it('should be an instance of the AudioNode interface', () => {
                const mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, mediaStream);

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
                const mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, mediaStream);

                expect(mediaStreamAudioSourceNode.mediaStream).to.be.an.instanceOf(MediaStream);
            });

            it('should throw an error if the AudioContext is closed', (done) => {
                ((context.close === undefined) ? context.startRendering() : context.close())
                    .then(() => createMediaStreamAudioSourceNode(context, mediaStream))
                    .catch((err) => {
                        expect(err.code).to.equal(11);
                        expect(err.name).to.equal('InvalidStateError');

                        context.close = undefined;

                        done();
                    });
            });

            describe('mediaStream', () => {

                let mediaStreamAudioSourceNode;

                beforeEach(() => {
                    mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, mediaStream);
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
                    mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, mediaStream);
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
                            const mediaStreamAudioSourceNode = createMediaStreamAudioSourceNode(context, mediaStream);
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

});
