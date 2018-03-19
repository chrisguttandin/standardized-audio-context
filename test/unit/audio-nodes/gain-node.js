import { AudioBuffer } from '../../../src/audio-buffer';
import { AudioBufferSourceNode } from '../../../src/audio-nodes/audio-buffer-source-node';
import { AudioContext } from '../../../src/audio-contexts/audio-context';
import { GainNode } from '../../../src/audio-nodes/gain-node';
import { MinimalAudioContext } from '../../../src/audio-contexts/minimal-audio-context';
import { MinimalOfflineAudioContext } from '../../../src/audio-contexts/minimal-offline-audio-context';
import { OfflineAudioContext } from '../../../src/audio-contexts/offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';

describe('GainNode', () => {

    // @todo leche seems to need a unique string as identifier as first argument.
    leche.withData([
        [ 'constructor with AudioContext', () => new AudioContext(), (context) => new GainNode(context) ],
        [ 'constructor with MinimalAudioContext', () => new MinimalAudioContext(), (context) => new GainNode(context) ],
        [ 'constructor with OfflineAudioContext', () => new OfflineAudioContext({ length: 5, sampleRate: 44100 }), (context) => new GainNode(context) ],
        [ 'constructor with MinimalOfflineAudioContext', () => new MinimalOfflineAudioContext({ length: 5, sampleRate: 44100 }), (context) => new GainNode(context) ],
        [ 'factory function of AudioContext', () => new AudioContext(), (context) => context.createGain() ],
        [ 'factory function of OfflineAudioContext', () => new OfflineAudioContext({ length: 5, sampleRate: 44100 }), (context) => context.createGain() ]
    ], (_, createContext, createGainNode) => {

        let context;

        afterEach(() => {
            if (context.close !== undefined) {
                return context.close();
            }
        });

        beforeEach(() => context = createContext());

        it('should be an instance of the EventTarget interface', () => {
            const gainNode = createGainNode(context);

            expect(gainNode.addEventListener).to.be.a('function');
            expect(gainNode.dispatchEvent).to.be.a('function');
            expect(gainNode.removeEventListener).to.be.a('function');
        });

        it('should be an instance of the AudioNode interface', () => {
            const gainNode = createGainNode(context);

            expect(gainNode.channelCount).to.equal(2);
            expect(gainNode.channelCountMode).to.equal('max');
            expect(gainNode.channelInterpretation).to.equal('speakers');
            expect(gainNode.connect).to.be.a('function');
            expect(gainNode.context).to.be.an.instanceOf(context.constructor);
            expect(gainNode.disconnect).to.be.a('function');
            expect(gainNode.numberOfInputs).to.equal(1);
            expect(gainNode.numberOfOutputs).to.equal(1);
        });

        it('should return an instance of the GainNode interface', () => {
            const gainNode = createGainNode(context);

            expect(gainNode.gain).not.to.be.undefined;
        });

        it('should throw an error if the AudioContext is closed', (done) => {
            ((context.close === undefined) ? context.startRendering() : context.close())
                .then(() => createGainNode(context))
                .catch((err) => {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    context.close = undefined;

                    done();
                });
        });

        describe('gain', () => {

            let gainNode;

            beforeEach(() => {
                gainNode = createGainNode(context);
            });

            it('should return an instance of the AudioParam interface', () => {
                // @todo cancelAndHoldAtTime
                expect(gainNode.gain.cancelScheduledValues).to.be.a('function');
                expect(gainNode.gain.defaultValue).to.equal(1);
                expect(gainNode.gain.exponentialRampToValueAtTime).to.be.a('function');
                expect(gainNode.gain.linearRampToValueAtTime).to.be.a('function');
                /*
                 * @todo maxValue
                 * @todo minValue
                 */
                expect(gainNode.gain.setTargetAtTime).to.be.a('function');
                // @todo setValueAtTime
                expect(gainNode.gain.setValueCurveAtTime).to.be.a('function');
                expect(gainNode.gain.value).to.equal(1);
            });

            it('should be readonly', () => {
                expect(() => {
                    gainNode.gain = 'anything';
                }).to.throw(TypeError);
            });

            describe('automation', () => {

                let audioBufferSourceNode;
                let renderer;
                let values;

                beforeEach(() => {
                    audioBufferSourceNode = new AudioBufferSourceNode(context);
                    values = [ 1, 0.5, 0, -0.5, -1 ];

                    const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });

                    audioBuffer.copyToChannel(new Float32Array(values), 0);

                    audioBufferSourceNode.buffer = audioBuffer;

                    renderer = createRenderer({
                        connect (destination) {
                            audioBufferSourceNode
                                .connect(gainNode)
                                .connect(destination);
                        },
                        context,
                        length: (context.length === undefined) ? 5 : undefined
                    });
                });

                describe('without any automation', () => {

                    it('should not modify the signal', function () {
                        this.timeout(5000);

                        return renderer((startTime) => audioBufferSourceNode.start(startTime))
                            .then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal(values);
                            });
                    });

                });

                describe('with a modified value', () => {

                    it('should modify the signal', function () {
                        this.timeout(5000);

                        gainNode.gain.value = 0.5;

                        return renderer((startTime) => audioBufferSourceNode.start(startTime))
                            .then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([ 0.5, 0.25, 0, -0.25, -0.5 ]);
                            });
                    });

                });

                describe('with a call to setValueAtTime()', () => {

                    it('should modify the signal', function () {
                        this.timeout(5000);

                        return renderer((startTime) => {
                            gainNode.gain.setValueAtTime(0.5, startTime + (2 / context.sampleRate));

                            audioBufferSourceNode.start(startTime);
                        })
                            .then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([ 1, 0.5, 0, -0.25, -0.5 ]);
                            });
                    });

                });

                describe('with a call to setValueCurveAtTime()', () => {

                    it('should modify the signal', function () {
                        this.timeout(5000);

                        return renderer((startTime) => {
                            gainNode.gain.setValueCurveAtTime(new Float32Array([ 0, 0.25, 0.5, 0.75, 1 ]), startTime, startTime + (5 / context.sampleRate));

                            audioBufferSourceNode.start(startTime);
                        })
                            .then((channelData) => {
                                // @todo The implementation of Safari is different. Therefore this test only checks if the values have changed.
                                expect(Array.from(channelData)).to.not.deep.equal(values);
                            });
                    });

                });

                describe('with another AudioNode connected to the AudioParam', () => {

                    it('should modify the signal', function () {
                        this.timeout(5000);

                        const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                        const audioBufferSourceNodeForAudioParam = new AudioBufferSourceNode(context);

                        audioBuffer.copyToChannel(new Float32Array([ 0.5, 0.5, 0.5, 0.5, 0.5 ]), 0);

                        audioBufferSourceNodeForAudioParam.buffer = audioBuffer;

                        return renderer((startTime) => {
                            gainNode.gain.value = 0;
                            // @todo This should probably be inside of the connect method.
                            audioBufferSourceNodeForAudioParam.connect(gainNode.gain);

                            audioBufferSourceNode.start(startTime);
                            audioBufferSourceNodeForAudioParam.start(startTime);
                        })
                            .then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([ 0.5, 0.25, 0, -0.25, -0.5 ]);
                            });
                    });

                });

                // @todo Test other automations as well.

            });

        });

        describe('connect()', () => {

            let gainNode;

            beforeEach(() => {
                gainNode = createGainNode(context);
            });

            it('should be chainable', () => {
                const antoherGainNode = createGainNode(context);

                expect(gainNode.connect(antoherGainNode)).to.equal(antoherGainNode);
            });

            it('should not be connectable to an AudioNode of another AudioContext', (done) => {
                const anotherContext = createContext();

                try {
                    gainNode.connect(anotherContext.destination);
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
                const anotherGainNode = createGainNode(anotherContext);

                try {
                    gainNode.connect(anotherGainNode.gain);
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
                const anotherGainNode = createGainNode(context);

                try {
                    gainNode.connect(anotherGainNode.gain, -1);
                } catch (err) {
                    expect(err.code).to.equal(1);
                    expect(err.name).to.equal('IndexSizeError');

                    done();
                }
            });

        });

        describe('disconnect()', () => {

            let audioBufferSourceNode;
            let firstDummyGainNode;
            let gainNode;
            let secondDummyGainNode;
            let renderer;
            let values;

            beforeEach(() => {
                audioBufferSourceNode = new AudioBufferSourceNode(context);
                gainNode = createGainNode(context);
                firstDummyGainNode = new GainNode(context);
                secondDummyGainNode = new GainNode(context);
                values = [ 1, 1, 1, 1, 1 ];

                const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });

                audioBuffer.copyToChannel(new Float32Array(values), 0);

                audioBufferSourceNode.buffer = audioBuffer;

                renderer = createRenderer({
                    connect (destination) {
                        audioBufferSourceNode
                            .connect(gainNode)
                            .connect(firstDummyGainNode)
                            .connect(destination);

                        gainNode.connect(secondDummyGainNode);
                    },
                    context,
                    length: (context.length === undefined) ? 5 : undefined
                });
            });

            it('should be possible to disconnect a destination', function () {
                this.timeout(5000);

                return renderer((startTime) => {
                    gainNode.disconnect(firstDummyGainNode);

                    audioBufferSourceNode.start(startTime);
                })
                    .then((channelData) => {
                        expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                    });
            });

            it('should be possible to disconnect another destination in isolation', function () {
                this.timeout(5000);

                return renderer((startTime) => {
                    gainNode.disconnect(secondDummyGainNode);

                    audioBufferSourceNode.start(startTime);
                })
                    .then((channelData) => {
                        expect(Array.from(channelData)).to.deep.equal(values);
                    });
            });

            it('should be possible to disconnect all destinations', function () {
                this.timeout(5000);

                return renderer((startTime) => {
                    gainNode.disconnect();

                    audioBufferSourceNode.start(startTime);
                })
                    .then((channelData) => {
                        expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                    });
            });

        });

    });

});
