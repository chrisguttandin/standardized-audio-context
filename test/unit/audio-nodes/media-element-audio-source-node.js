import { AudioContext } from '../../../src/audio-contexts/audio-context';
import { GainNode } from '../../../src/audio-nodes/gain-node';
import { MediaElementAudioSourceNode } from '../../../src/audio-nodes/media-element-audio-source-node';
import { MinimalAudioContext } from '../../../src/audio-contexts/minimal-audio-context';
import { createRenderer } from '../../helper/create-renderer';

describe('MediaElementAudioSourceNode', () => {

    // @todo leche seems to need a unique string as identifier as first argument.
    leche.withData([
        [ 'constructor with AudioContext', () => new AudioContext(), (context, mediaElement) => new MediaElementAudioSourceNode(context, { mediaElement }) ],
        [ 'constructor with MinimalAudioContext', () => new MinimalAudioContext(), (context, mediaElement) => new MediaElementAudioSourceNode(context, { mediaElement }) ],
        [ 'factory function of AudioContext', () => new AudioContext(), (context, mediaElement) => context.createMediaElementSource(mediaElement) ]
    ], (_, createContext, createMediaElementAudioSourceNode) => {

        let context;
        let mediaElement;

        afterEach(() => {
            if (context.close !== undefined) {
                return context.close();
            }
        });

        beforeEach(() => {
            context = createContext();
            mediaElement = new Audio();
        });

        it('should be an instance of the EventTarget interface', () => {
            const mediaElementAudioSourceNode = createMediaElementAudioSourceNode(context, mediaElement);

            expect(mediaElementAudioSourceNode.addEventListener).to.be.a('function');
            expect(mediaElementAudioSourceNode.dispatchEvent).to.be.a('function');
            expect(mediaElementAudioSourceNode.removeEventListener).to.be.a('function');
        });

        it('should be an instance of the AudioNode interface', () => {
            const mediaElementAudioSourceNode = createMediaElementAudioSourceNode(context, mediaElement);

            expect(mediaElementAudioSourceNode.channelCount).to.equal(2);
            expect(mediaElementAudioSourceNode.channelCountMode).to.equal('max');
            expect(mediaElementAudioSourceNode.channelInterpretation).to.equal('speakers');
            expect(mediaElementAudioSourceNode.connect).to.be.a('function');
            expect(mediaElementAudioSourceNode.context).to.be.an.instanceOf(context.constructor);
            expect(mediaElementAudioSourceNode.disconnect).to.be.a('function');
            expect(mediaElementAudioSourceNode.numberOfInputs).to.equal(0);
            expect(mediaElementAudioSourceNode.numberOfOutputs).to.equal(1);
        });

        it('should return an instance of the MediaElementAudioSourceNode interface', () => {
            const mediaElementAudioSourceNode = createMediaElementAudioSourceNode(context, mediaElement);

            expect(mediaElementAudioSourceNode.mediaElement).to.be.an.instanceOf(HTMLMediaElement);
        });

        it('should throw an error if the AudioContext is closed', (done) => {
            ((context.close === undefined) ? context.startRendering() : context.close())
                .then(() => createMediaElementAudioSourceNode(context, mediaElement))
                .catch((err) => {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    context.close = undefined;

                    done();
                });
        });

        describe('mediaElement', () => {

            let mediaElementAudioSourceNode;

            beforeEach(() => {
                mediaElementAudioSourceNode = createMediaElementAudioSourceNode(context, mediaElement);
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

        describe('connect()', () => {

            let mediaElementAudioSourceNode;

            beforeEach(() => {
                mediaElementAudioSourceNode = createMediaElementAudioSourceNode(context, mediaElement);
            });

            it('should be chainable', () => {
                const gainNode = new GainNode(context);

                expect(mediaElementAudioSourceNode.connect(gainNode)).to.equal(gainNode);
            });

            it('should not be connectable to an AudioNode of another AudioContext', (done) => {
                const anotherContext = createContext();

                try {
                    mediaElementAudioSourceNode.connect(anotherContext.destination);
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
                    mediaElementAudioSourceNode.connect(gainNode.gain);
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
                    mediaElementAudioSourceNode.connect(gainNode.gain, -1);
                } catch (err) {
                    expect(err.code).to.equal(1);
                    expect(err.name).to.equal('IndexSizeError');

                    done();
                }
            });

        });

        describe('disconnect()', () => {

            let firstDummyGainNode;
            let mediaElementAudioSourceNode;
            let secondDummyGainNode;
            let renderer;

            afterEach(() => {
                if (!mediaElement.paused) {
                    return new Promise((resolve, reject) => {
                        mediaElement.onerror = () => reject(mediaElement.error);
                        mediaElement.onpause = resolve;
                        mediaElement.pause();
                    });
                }
            });

            beforeEach(function () {
                this.timeout(10000);

                firstDummyGainNode = new GainNode(context);
                mediaElementAudioSourceNode = createMediaElementAudioSourceNode(context, mediaElement);
                secondDummyGainNode = new GainNode(context);

                renderer = createRenderer({
                    connect (destination) {
                        mediaElementAudioSourceNode
                            .connect(firstDummyGainNode)
                            .connect(destination);

                        mediaElementAudioSourceNode.connect(secondDummyGainNode);
                    },
                    context,
                    length: (context.length === undefined) ? 5 : undefined
                });

                /*
                 * Muting the mediaElement seems to be crazy, but Safari only plays muted audio without any user interaction. However even
                 * though the mediaElement is muted the audio gets routed into the audio graph.
                 */
                mediaElement.muted = !/Chrome/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent);
                mediaElement.loop = true;
                // Edge delivers far more consistent results when playing an MP3 file.
                mediaElement.src = (/Edge/.test(navigator.userAgent)) ?
                    'base/test/fixtures/1000-hertz-for-ten-seconds.mp3' :
                    'base/test/fixtures/1000-hertz-for-ten-seconds.wav';

                // @todo Edge doesn't yet return a promise.
                const promise = mediaElement.play();

                if (promise === undefined) {
                    return new Promise((resolve, reject) => {
                        mediaElement.oncanplaythrough = resolve;
                        mediaElement.onerror = () => reject(mediaElement.error);
                    });
                }

                return promise;
            });

            it('should be possible to disconnect a destination', function () {
                this.timeout(10000);

                return renderer(() => mediaElementAudioSourceNode.disconnect(firstDummyGainNode))
                    .then((channelData) => {
                        expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                    });
            });

            it('should be possible to disconnect another destination in isolation', function () {
                this.timeout(10000);

                return renderer(() => mediaElementAudioSourceNode.disconnect(secondDummyGainNode))
                    .then((channelData) => {
                        // @todo The mediaElement will just play a sine wave. Therefore it is okay to only test for non zero values.
                        expect(Array.from(channelData)).to.not.deep.equal([ 0, 0, 0, 0, 0 ]);

                        mediaElementAudioSourceNode.disconnect(firstDummyGainNode);
                        firstDummyGainNode.disconnect();
                    });
            });

            it('should be possible to disconnect all destinations', function () {
                this.timeout(10000);

                return renderer(() => mediaElementAudioSourceNode.disconnect())
                    .then((channelData) => {
                        expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                    });
            });

        });

    });

});
