import { AudioBuffer } from '../../../src/audio-buffer';
import { AudioBufferSourceNode } from '../../../src/audio-nodes/audio-buffer-source-node';
import { AudioContext } from '../../../src/audio-contexts/audio-context';
import { ConstantSourceNode } from '../../../src/audio-nodes/constant-source-node';
import { GainNode } from '../../../src/audio-nodes/gain-node';
import { MinimalAudioContext } from '../../../src/audio-contexts/minimal-audio-context';
import { MinimalOfflineAudioContext } from '../../../src/audio-contexts/minimal-offline-audio-context';
import { OfflineAudioContext } from '../../../src/audio-contexts/offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';

describe('ConstantSourceNode', () => {

    // @todo leche seems to need a unique string as identifier as first argument.
    leche.withData([
        [ 'constructor with AudioContext', () => new AudioContext(), (context) => new ConstantSourceNode(context) ],
        [ 'constructor with MinimalAudioContext', () => new MinimalAudioContext(), (context) => new ConstantSourceNode(context) ],
        [ 'constructor with OfflineAudioContext', () => new OfflineAudioContext({ length: 5, sampleRate: 44100 }), (context) => new ConstantSourceNode(context) ],
        [ 'constructor with MinimalOfflineAudioContext', () => new MinimalOfflineAudioContext({ length: 5, sampleRate: 44100 }), (context) => new ConstantSourceNode(context) ],
        [ 'factory function of AudioContext', () => new AudioContext(), (context) => context.createConstantSource() ],
        [ 'factory function of OfflineAudioContext', () => new OfflineAudioContext({ length: 5, sampleRate: 44100 }), (context) => context.createConstantSource() ]
    ], (_, createContext, createConstantSourceNode) => {

        let context;

        afterEach(() => {
            if (context.close !== undefined) {
                return context.close();
            }
        });

        beforeEach(() => context = createContext());

        it('should be an instance of the EventTarget interface', () => {
            const constantSourceNode = createConstantSourceNode(context);

            expect(constantSourceNode.addEventListener).to.be.a('function');
            expect(constantSourceNode.dispatchEvent).to.be.a('function');
            expect(constantSourceNode.removeEventListener).to.be.a('function');
        });

        it('should be an instance of the AudioNode interface', () => {
            const constantSourceNode = createConstantSourceNode(context);

            expect(constantSourceNode.channelCount).to.equal(2);
            expect(constantSourceNode.channelCountMode).to.equal('max');
            expect(constantSourceNode.channelInterpretation).to.equal('speakers');
            expect(constantSourceNode.connect).to.be.a('function');
            expect(constantSourceNode.context).to.be.an.instanceOf(context.constructor);
            expect(constantSourceNode.disconnect).to.be.a('function');
            expect(constantSourceNode.numberOfInputs).to.equal(0);
            expect(constantSourceNode.numberOfOutputs).to.equal(1);
        });

        it('should return an instance of the ConstantSourceNode interface', () => {
            const constantSourceNode = createConstantSourceNode(context);

            expect(constantSourceNode.offset).not.to.be.undefined;
        });

        it('should throw an error if the AudioContext is closed', (done) => {
            ((context.close === undefined) ? context.startRendering() : context.close())
                .then(() => createConstantSourceNode(context))
                .catch((err) => {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    context.close = undefined;

                    done();
                });
        });

        describe('offset', () => {

            let constantSourceNode;

            beforeEach(() => {
                constantSourceNode = createConstantSourceNode(context);
            });

            it('should return an instance of the AudioParam interface', () => {
                // @todo cancelAndHoldAtTime
                expect(constantSourceNode.offset.cancelScheduledValues).to.be.a('function');
                expect(constantSourceNode.offset.defaultValue).to.equal(1);
                expect(constantSourceNode.offset.exponentialRampToValueAtTime).to.be.a('function');
                expect(constantSourceNode.offset.linearRampToValueAtTime).to.be.a('function');
                /*
                 * @todo maxValue
                 * @todo minValue
                 */
                expect(constantSourceNode.offset.setTargetAtTime).to.be.a('function');
                // @todo setValueAtTime
                expect(constantSourceNode.offset.setValueCurveAtTime).to.be.a('function');
                expect(constantSourceNode.offset.value).to.equal(1);
            });

            it('should be readonly', () => {
                expect(() => {
                    constantSourceNode.offset = 'anything';
                }).to.throw(TypeError);
            });

            describe('automation', () => {

                let renderer;

                beforeEach(() => {
                    renderer = createRenderer({
                        context,
                        length: (context.length === undefined) ? 5 : undefined,
                        prepare (destination) {
                            const constantSourceNode = createConstantSourceNode(context);

                            constantSourceNode
                                .connect(destination);

                            return { constantSourceNode };
                        }
                    });
                });

                describe('without any automation', () => {

                    it('should not modify the signal', function () {
                        this.timeout(5000);

                        return renderer({
                            start (startTime, { constantSourceNode }) {
                                constantSourceNode.start(startTime);
                            }
                        })
                            .then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([ 1, 1, 1, 1, 1 ]);
                            });
                    });

                });

                describe('with a modified value', () => {

                    it('should modify the signal', function () {
                        this.timeout(5000);

                        return renderer({
                            prepare ({ constantSourceNode }) {
                                constantSourceNode.offset.value = 0.5;
                            },
                            start (startTime, { constantSourceNode }) {
                                constantSourceNode.start(startTime);
                            }
                        })
                            .then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([ 0.5, 0.5, 0.5, 0.5, 0.5 ]);
                            });
                    });

                });

                describe('with a call to setValueAtTime()', () => {

                    it('should modify the signal', function () {
                        this.timeout(5000);

                        return renderer({
                            start (startTime, { constantSourceNode }) {
                                constantSourceNode.offset.setValueAtTime(0.5, startTime + (2 / context.sampleRate));

                                constantSourceNode.start(startTime);
                            }
                        })
                            .then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([ 1, 1, 0.5, 0.5, 0.5 ]);
                            });
                    });

                });

                describe('with a call to setValueCurveAtTime()', () => {

                    it('should modify the signal', function () {
                        this.timeout(5000);

                        return renderer({
                            start (startTime, { constantSourceNode }) {
                                constantSourceNode.offset.setValueCurveAtTime(new Float32Array([ 0, 0.25, 0.5, 0.75, 1 ]), startTime, startTime + (5 / context.sampleRate));

                                constantSourceNode.start(startTime);
                            }
                        })
                            .then((channelData) => {
                                // @todo The implementation of Safari is different. Therefore this test only checks if the values have changed.
                                expect(Array.from(channelData)).to.not.deep.equal([ 1, 1, 1, 1, 1 ]);
                            });
                    });

                });

                describe('with another AudioNode connected to the AudioParam', () => {

                    it('should modify the signal', function () {
                        this.timeout(5000);

                        return renderer({
                            prepare ({ constantSourceNode }) {
                                const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                                const audioBufferSourceNodeForAudioParam = new AudioBufferSourceNode(context);

                                audioBuffer.copyToChannel(new Float32Array([ 0.5, 0.25, 0, -0.25, -0.5 ]), 0);

                                audioBufferSourceNodeForAudioParam.buffer = audioBuffer;

                                constantSourceNode.offset.value = 0;

                                audioBufferSourceNodeForAudioParam.connect(constantSourceNode.offset);

                                return { audioBufferSourceNodeForAudioParam };
                            },
                            start (startTime, { audioBufferSourceNodeForAudioParam, constantSourceNode }) {
                                audioBufferSourceNodeForAudioParam.start(startTime);
                                constantSourceNode.start(startTime);
                            }
                        })
                            .then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([ 0.5, 0.25, 0, -0.25, -0.5 ]);
                            });
                    });

                });

                // @todo Test other automations as well.

            });

        });

        describe('onended', () => {

            // @todo

        });

        describe('connect()', () => {

            let constantSourceNode;

            beforeEach(() => {
                constantSourceNode = createConstantSourceNode(context);
            });

            it('should be chainable', () => {
                const gainNode = new GainNode(context);

                expect(constantSourceNode.connect(gainNode)).to.equal(gainNode);
            });

            it('should not be connectable to an AudioNode of another AudioContext', (done) => {
                const anotherContext = createContext();

                try {
                    constantSourceNode.connect(anotherContext.destination);
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
                    constantSourceNode.connect(gainNode.gain);
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
                    constantSourceNode.connect(gainNode.gain, -1);
                } catch (err) {
                    expect(err.code).to.equal(1);
                    expect(err.name).to.equal('IndexSizeError');

                    done();
                }
            });

        });

        describe('disconnect()', () => {

            let renderer;

            beforeEach(() => {
                renderer = createRenderer({
                    context,
                    length: (context.length === undefined) ? 5 : undefined,
                    prepare (destination) {
                        const constantSourceNode = createConstantSourceNode(context);
                        const firstDummyGainNode = new GainNode(context);
                        const secondDummyGainNode = new GainNode(context);

                        constantSourceNode
                            .connect(firstDummyGainNode)
                            .connect(destination);

                        constantSourceNode.connect(secondDummyGainNode);

                        return { constantSourceNode, firstDummyGainNode, secondDummyGainNode };
                    }
                });
            });

            it('should be possible to disconnect a destination', function () {
                this.timeout(5000);

                return renderer({
                    prepare ({ constantSourceNode, firstDummyGainNode }) {
                        constantSourceNode.disconnect(firstDummyGainNode);
                    },
                    start (startTime, { constantSourceNode }) {
                        constantSourceNode.start(startTime);
                    }
                })
                    .then((channelData) => {
                        expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                    });
            });

            it('should be possible to disconnect another destination in isolation', function () {
                this.timeout(5000);

                return renderer({
                    prepare ({ constantSourceNode, secondDummyGainNode }) {
                        constantSourceNode.disconnect(secondDummyGainNode);
                    },
                    start (startTime, { constantSourceNode }) {
                        constantSourceNode.start(startTime);
                    }
                })
                    .then((channelData) => {
                        expect(Array.from(channelData)).to.deep.equal([ 1, 1, 1, 1, 1 ]);
                    });
            });

            it('should be possible to disconnect all destinations', function () {
                this.timeout(5000);

                return renderer({
                    prepare ({ constantSourceNode }) {
                        constantSourceNode.disconnect();
                    },
                    start (startTime, { constantSourceNode }) {
                        constantSourceNode.start(startTime);
                    }
                })
                    .then((channelData) => {
                        expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                    });
            });

        });

        describe('start()', () => {

            // @todo

        });

        describe('stop()', () => {

            // @todo

        });

    });

});
