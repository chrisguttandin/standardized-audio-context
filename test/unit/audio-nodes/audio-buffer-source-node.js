import { AudioBuffer, AudioBufferSourceNode, AudioWorkletNode, GainNode, addAudioWorkletModule } from '../../../src/module';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
import { createNativeAudioContext } from '../../helper/create-native-audio-context';
import { createNativeOfflineAudioContext } from '../../helper/create-native-offline-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';
import { roundToSamples } from '../../helper/round-to-samples';
import { spy } from 'sinon';

const createAudioBufferSourceNodeWithConstructor = (context, options = null) => {
    if (options === null) {
        return new AudioBufferSourceNode(context);
    }

    return new AudioBufferSourceNode(context, options);
};
const createAudioBufferSourceNodeWithFactoryFunction = (context, options = null) => {
    const audioBufferSourceNode = context.createBufferSource();

    if (options !== null && options.buffer !== undefined) {
        audioBufferSourceNode.buffer = options.buffer;
    }

    if (options !== null && options.channelCount !== undefined) {
        audioBufferSourceNode.channelCount = options.channelCount;
    }

    if (options !== null && options.channelCountMode !== undefined) {
        audioBufferSourceNode.channelCountMode = options.channelCountMode;
    }

    if (options !== null && options.channelInterpretation !== undefined) {
        audioBufferSourceNode.channelInterpretation = options.channelInterpretation;
    }

    /*
     * @todo if (options !== null && options.detune !== undefined) {
     * @todo     audioBufferSourceNode.detune.value = options.detune;
     * @todo }
     */

    if (options !== null && options.loop !== undefined) {
        audioBufferSourceNode.loop = options.loop;
    }

    if (options !== null && options.loopEnd !== undefined) {
        audioBufferSourceNode.loopEnd = options.loopEnd;
    }

    if (options !== null && options.loopStart !== undefined) {
        audioBufferSourceNode.loopStart = options.loopStart;
    }

    if (options !== null && options.playbackRate !== undefined) {
        audioBufferSourceNode.playbackRate.value = options.playbackRate;
    }

    return audioBufferSourceNode;
};
const testCases = {
    'constructor of a MinimalAudioContext': {
        createAudioBufferSourceNode: createAudioBufferSourceNodeWithConstructor,
        createContext: createMinimalAudioContext
    },
    'constructor of a MinimalOfflineAudioContext': {
        createAudioBufferSourceNode: createAudioBufferSourceNodeWithConstructor,
        createContext: createMinimalOfflineAudioContext
    },
    'constructor of an AudioContext': {
        createAudioBufferSourceNode: createAudioBufferSourceNodeWithConstructor,
        createContext: createAudioContext
    },
    'constructor of an OfflineAudioContext': {
        createAudioBufferSourceNode: createAudioBufferSourceNodeWithConstructor,
        createContext: createOfflineAudioContext
    },
    'factory function of an AudioContext': {
        createAudioBufferSourceNode: createAudioBufferSourceNodeWithFactoryFunction,
        createContext: createAudioContext
    },
    'factory function of an OfflineAudioContext': {
        createAudioBufferSourceNode: createAudioBufferSourceNodeWithFactoryFunction,
        createContext: createOfflineAudioContext
    }
};

describe('AudioBufferSourceNode', () => {
    for (const [description, { createAudioBufferSourceNode, createContext }] of Object.entries(testCases)) {
        describe(`with the ${description}`, () => {
            let context;

            afterEach(() => context.close?.());

            beforeEach(() => (context = createContext()));

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
                                return context.close?.() ?? context.startRendering?.();
                            }
                        });

                        describe('without any options', () => {
                            let audioBufferSourceNode;

                            beforeEach(() => {
                                audioBufferSourceNode = createAudioBufferSourceNode(context);
                            });

                            it('should return an instance of the AudioBufferSourceNode constructor', () => {
                                expect(audioBufferSourceNode).to.be.an.instanceOf(AudioBufferSourceNode);
                            });

                            it('should return an implementation of the EventTarget interface', () => {
                                expect(audioBufferSourceNode.addEventListener).to.be.a('function');
                                expect(audioBufferSourceNode.dispatchEvent).to.be.a('function');
                                expect(audioBufferSourceNode.removeEventListener).to.be.a('function');
                            });

                            it('should return an implementation of the AudioNode interface', () => {
                                expect(audioBufferSourceNode.channelCount).to.equal(2);
                                expect(audioBufferSourceNode.channelCountMode).to.equal('max');
                                expect(audioBufferSourceNode.channelInterpretation).to.equal('speakers');
                                expect(audioBufferSourceNode.connect).to.be.a('function');
                                expect(audioBufferSourceNode.context).to.be.an.instanceOf(context.constructor);
                                expect(audioBufferSourceNode.disconnect).to.be.a('function');
                                expect(audioBufferSourceNode.numberOfInputs).to.equal(0);
                                expect(audioBufferSourceNode.numberOfOutputs).to.equal(1);
                            });

                            it('should return an implementation of the AudioScheduledSourceNode interface', () => {
                                expect(audioBufferSourceNode.onended).to.be.null;
                                expect(audioBufferSourceNode.start).to.be.a('function');
                                expect(audioBufferSourceNode.stop).to.be.a('function');
                            });

                            it('should return an implementation of the AudioBufferSourceNode interface', () => {
                                expect(audioBufferSourceNode.buffer).to.be.null;
                                // expect(audioBufferSourceNode.detune).not.to.be.undefined;
                                expect(audioBufferSourceNode.loop).to.be.false;
                                expect(audioBufferSourceNode.loopEnd).to.equal(0);
                                expect(audioBufferSourceNode.loopStart).to.equal(0);
                                expect(audioBufferSourceNode.playbackRate).not.to.be.undefined;
                            });
                        });

                        describe('with valid options', () => {
                            it('should return an instance with the given buffer', () => {
                                const audioBuffer = new AudioBuffer({ length: 1, sampleRate: context.sampleRate });
                                const audioBufferSourceNode = createAudioBufferSourceNode(context, { buffer: audioBuffer });

                                expect(audioBufferSourceNode.buffer).to.equal(audioBuffer);
                            });

                            it('should return an instance without a buffer', () => {
                                const buffer = null;
                                const audioBufferSourceNode = createAudioBufferSourceNode(context, { buffer });

                                expect(audioBufferSourceNode.buffer).to.equal(buffer);
                            });

                            it('should return an instance with the given channelCount', () => {
                                const channelCount = 4;
                                const audioBufferSourceNode = createAudioBufferSourceNode(context, { channelCount });

                                expect(audioBufferSourceNode.channelCount).to.equal(channelCount);
                            });

                            it('should return an instance with the given channelCountMode', () => {
                                const channelCountMode = 'explicit';
                                const audioBufferSourceNode = createAudioBufferSourceNode(context, { channelCountMode });

                                expect(audioBufferSourceNode.channelCountMode).to.equal(channelCountMode);
                            });

                            it('should return an instance with the given channelInterpretation', () => {
                                const channelInterpretation = 'discrete';
                                const audioBufferSourceNode = createAudioBufferSourceNode(context, { channelInterpretation });

                                expect(audioBufferSourceNode.channelInterpretation).to.equal(channelInterpretation);
                            });

                            /*
                             * @todo it('should return an instance with the given initial value for detune', () => {
                             * @todo     const detune = 0.5;
                             * @todo     const audioBufferSourceNode = createAudioBufferSourceNode(context, { detune });
                             * @todo
                             * @todo     expect(audioBufferSourceNode.detune.value).to.equal(detune);
                             * @todo });
                             */

                            it('should return an instance with the given loop', () => {
                                const loop = true;
                                const audioBufferSourceNode = createAudioBufferSourceNode(context, { loop });

                                expect(audioBufferSourceNode.loop).to.equal(loop);
                            });

                            it('should return an instance with the given loopEnd', () => {
                                const loopEnd = 10;
                                const audioBufferSourceNode = createAudioBufferSourceNode(context, { loopEnd });

                                expect(audioBufferSourceNode.loopEnd).to.equal(loopEnd);
                            });

                            it('should return an instance with the given loopStart', () => {
                                const loopStart = 2;
                                const audioBufferSourceNode = createAudioBufferSourceNode(context, { loopStart });

                                expect(audioBufferSourceNode.loopStart).to.equal(loopStart);
                            });

                            it('should return an instance with the given initial value for playbackRate', () => {
                                const playbackRate = 2;
                                const audioBufferSourceNode = createAudioBufferSourceNode(context, { playbackRate });

                                if (description.startsWith('constructor')) {
                                    expect(audioBufferSourceNode.playbackRate.defaultValue).to.equal(playbackRate);
                                } else {
                                    expect(audioBufferSourceNode.playbackRate.defaultValue).to.equal(1);
                                }

                                expect(audioBufferSourceNode.playbackRate.value).to.equal(playbackRate);
                            });
                        });
                    });
                }
            });

            describe('buffer', () => {
                describe('without a previously assigned AudioBuffer', () => {
                    let audioBufferSourceNode;

                    beforeEach(() => {
                        audioBufferSourceNode = createAudioBufferSourceNode(context);
                    });

                    it('should be assignable to an AudioBuffer', () => {
                        const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });

                        audioBufferSourceNode.buffer = audioBuffer;

                        expect(audioBufferSourceNode.buffer).to.equal(audioBuffer);
                    });
                });

                describe('with a initially assigned AudioBuffer', () => {
                    let audioBufferSourceNode;

                    beforeEach(() => {
                        const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });

                        audioBufferSourceNode = createAudioBufferSourceNode(context, { buffer: audioBuffer });
                    });

                    it('should throw an InvalidStateError', (done) => {
                        const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });

                        try {
                            audioBufferSourceNode.buffer = audioBuffer;
                        } catch (err) {
                            expect(err.code).to.equal(11);
                            expect(err.name).to.equal('InvalidStateError');

                            done();
                        }
                    });

                    it('should be assignable to null', () => {
                        audioBufferSourceNode.buffer = null;

                        expect(audioBufferSourceNode.buffer).to.be.null;
                    });
                });

                describe('with a previously assigned AudioBuffer', () => {
                    let audioBufferSourceNode;

                    beforeEach(() => {
                        audioBufferSourceNode = createAudioBufferSourceNode(context);
                        audioBufferSourceNode.buffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                    });

                    it('should throw an InvalidStateError', (done) => {
                        const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });

                        try {
                            audioBufferSourceNode.buffer = audioBuffer;
                        } catch (err) {
                            expect(err.code).to.equal(11);
                            expect(err.name).to.equal('InvalidStateError');

                            done();
                        }
                    });

                    it('should be assignable to null', () => {
                        audioBufferSourceNode.buffer = null;

                        expect(audioBufferSourceNode.buffer).to.be.null;
                    });
                });

                describe('with a nullified AudioBuffer', () => {
                    for (const [withADirectConnection, withAnAppendedAudioWorklet] of description.includes('Offline')
                        ? [
                              [true, true],
                              [true, false],
                              [false, true]
                          ]
                        : [[true, false]]) {
                        describe(`${withADirectConnection ? 'with' : 'without'} a direct connection and ${
                            withAnAppendedAudioWorklet ? 'with' : 'without'
                        } an appended AudioWorklet`, () => {
                            let renderer;

                            beforeEach(async function () {
                                this.timeout(10000);

                                if (withAnAppendedAudioWorklet) {
                                    await addAudioWorkletModule(context, 'base/test/fixtures/gain-processor.js');
                                }

                                renderer = createRenderer({
                                    context,
                                    length: context.length === undefined ? 5 : undefined,
                                    prepare(destination) {
                                        const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });

                                        audioBuffer.copyToChannel(new Float32Array([1, 1, 1, 1, 1]), 0);

                                        const audioBufferSourceNode = createAudioBufferSourceNode(context, { buffer: audioBuffer });
                                        const audioWorkletNode = withAnAppendedAudioWorklet
                                            ? new AudioWorkletNode(context, 'gain-processor')
                                            : null;
                                        const masterGainNode = new GainNode(context, {
                                            gain: withADirectConnection && withAnAppendedAudioWorklet ? 0.5 : 1
                                        });

                                        audioBufferSourceNode.buffer = null;

                                        if (withADirectConnection) {
                                            audioBufferSourceNode.connect(masterGainNode);
                                        }

                                        if (withAnAppendedAudioWorklet) {
                                            audioBufferSourceNode.connect(audioWorkletNode).connect(masterGainNode);
                                        }

                                        masterGainNode.connect(destination);

                                        return { audioBufferSourceNode };
                                    }
                                });
                            });

                            it('should render silence', function () {
                                this.timeout(10000);

                                return renderer({
                                    start(startTime, { audioBufferSourceNode }) {
                                        audioBufferSourceNode.start(startTime);
                                    }
                                }).then((channelData) => {
                                    expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                                });
                            });
                        });
                    }
                });
            });

            describe('channelCount', () => {
                let audioBufferSourceNode;

                beforeEach(() => {
                    audioBufferSourceNode = createAudioBufferSourceNode(context);
                });

                it('should be assignable to another value', () => {
                    const channelCount = 4;

                    audioBufferSourceNode.channelCount = channelCount;

                    expect(audioBufferSourceNode.channelCount).to.equal(channelCount);
                });
            });

            describe('channelCountMode', () => {
                let audioBufferSourceNode;

                beforeEach(() => {
                    audioBufferSourceNode = createAudioBufferSourceNode(context);
                });

                it('should be assignable to another value', () => {
                    const channelCountMode = 'explicit';

                    audioBufferSourceNode.channelCountMode = channelCountMode;

                    expect(audioBufferSourceNode.channelCountMode).to.equal(channelCountMode);
                });
            });

            describe('channelInterpretation', () => {
                let audioBufferSourceNode;

                beforeEach(() => {
                    audioBufferSourceNode = createAudioBufferSourceNode(context);
                });

                it('should be assignable to another value', () => {
                    const channelInterpretation = 'discrete';

                    audioBufferSourceNode.channelInterpretation = channelInterpretation;

                    expect(audioBufferSourceNode.channelInterpretation).to.equal(channelInterpretation);
                });
            });

            describe('detune', () => {
                /*
                 * @todo let audioBufferSourceNode;
                 * @todo
                 * @todo beforeEach(() => {
                 * @todo     audioBufferSourceNode = createAudioBufferSourceNode(context);
                 * @todo });
                 * @todo
                 * @todo it('should return an implementation of the AudioParam interface', () => {
                 * @todo     expect(audioBufferSourceNode.detune.cancelAndHoldAtTime).to.be.a('function');
                 * @todo     expect(audioBufferSourceNode.detune.cancelScheduledValues).to.be.a('function');
                 * @todo     expect(audioBufferSourceNode.detune.defaultValue).to.equal(0);
                 * @todo     expect(audioBufferSourceNode.detune.exponentialRampToValueAtTime).to.be.a('function');
                 * @todo     expect(audioBufferSourceNode.detune.linearRampToValueAtTime).to.be.a('function');
                 * @todo     expect(audioBufferSourceNode.detune.maxValue).to.equal(3.4028234663852886e38);
                 * @todo     expect(audioBufferSourceNode.detune.minValue).to.equal(-3.4028234663852886e38);
                 * @todo     expect(audioBufferSourceNode.detune.setTargetAtTime).to.be.a('function');
                 * @todo     expect(audioBufferSourceNode.detune.setValueAtTime).to.be.a('function');
                 * @todo     expect(audioBufferSourceNode.detune.setValueCurveAtTime).to.be.a('function');
                 * @todo     expect(audioBufferSourceNode.detune.value).to.equal(0);
                 * @todo });
                 * @todo
                 * @todo it('should be readonly', () => {
                 * @todo     expect(() => {
                 * @todo         audioBufferSourceNode.detune = 'anything';
                 * @todo     }).to.throw(TypeError);
                 * @todo });
                 * @todo
                 * @todo describe('cancelAndHoldAtTime()', () => { });
                 * @todo
                 * @todo describe('cancelScheduledValues()', () => {
                 * @todo
                 * @todo     it('should be chainable', () => {
                 * @todo         expect(audioBufferSourceNode.detune.cancelScheduledValues(0)).to.equal(audioBufferSourceNode.detune);
                 * @todo     });
                 * @todo
                 * @todo });
                 * @todo
                 * @todo describe('exponentialRampToValueAtTime()', () => {
                 * @todo
                 * @todo     it('should be chainable', () => {
                 * @todo         expect(audioBufferSourceNode.detune.exponentialRampToValueAtTime(1, 0)).to.equal(audioBufferSourceNode.detune);
                 * @todo     });
                 * @todo
                 * @todo     it('should throw a RangeError', () => {
                 * @todo         expect(() => {
                 * @todo             audioBufferSourceNode.detune.exponentialRampToValueAtTime(0, 1);
                 * @todo         }).to.throw(RangeError);
                 * @todo     });
                 * @todo
                 * @todo     it('should throw a RangeError', () => {
                 * @todo         expect(() => {
                 * @todo             audioBufferSourceNode.detune.exponentialRampToValueAtTime(1, -1);
                 * @todo         }).to.throw(RangeError);
                 * @todo     });
                 * @todo
                 * @todo });
                 * @todo
                 * @todo describe('linearRampToValueAtTime()', () => {
                 * @todo
                 * @todo     it('should be chainable', () => {
                 * @todo         expect(audioBufferSourceNode.detune.linearRampToValueAtTime(1, 0)).to.equal(audioBufferSourceNode.detune);
                 * @todo     });
                 * @todo
                 * @todo });
                 * @todo
                 * @todo describe('setTargetAtTime()', () => {
                 * @todo
                 * @todo     it('should be chainable', () => {
                 * @todo         expect(audioBufferSourceNode.detune.setTargetAtTime(1, 0, 0.1)).to.equal(audioBufferSourceNode.detune);
                 * @todo     });
                 * @todo
                 * @todo });
                 * @todo
                 * @todo describe('setValueAtTime()', () => {
                 * @todo
                 * @todo     it('should be chainable', () => {
                 * @todo         expect(audioBufferSourceNode.detune.setValueAtTime(1, 0)).to.equal(audioBufferSourceNode.detune);
                 * @todo     });
                 * @todo
                 * @todo });
                 * @todo
                 * @todo describe('setValueCurveAtTime()', () => {
                 * @todo
                 * @todo     it('should be chainable', () => {
                 * @todo         expect(audioBufferSourceNode.detune.setValueCurveAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(audioBufferSourceNode.detune);
                 * @todo     });
                 * @todo
                 * @todo });
                 * @todo
                 * @todo describe('automation', () => {
                 * @todo
                 * @todo     let renderer;
                 * @todo
                 * @todo     beforeEach(function () {
                 * @todo         this.timeout(10000);
                 * @todo
                 * @todo         renderer = createRenderer({
                 * @todo             context,
                 * @todo             length: (context.length === undefined) ? 5 : undefined,
                 * @todo             prepare (destination) {
                 * @todo                 const audioBufferSourceNode = createAudioBufferSourceNode(context);
                 * @todo
                 * @todo                 audioBufferSourceNode
                 * @todo                     .connect(destination);
                 * @todo
                 * @todo                 return { audioBufferSourceNode };
                 * @todo             }
                 * @todo         });
                 * @todo     });
                 * @todo
                 * @todo     describe('without any automation', () => {
                 * @todo
                 * @todo         it('should not modify the signal', function () {
                 * @todo             this.timeout(10000);
                 * @todo
                 * @todo             return renderer({
                 * @todo                 start (startTime, { audioBufferSourceNode }) {
                 * @todo                     audioBufferSourceNode.start(startTime);
                 * @todo                 }
                 * @todo             })
                 * @todo                 .then((channelData) => {
                 * @todo                     expect(Array.from(channelData)).to.deep.equal([ 1, 1, 1, 1, 1 ]);
                 * @todo                 });
                 * @todo         });
                 * @todo
                 * @todo     });
                 * @todo
                 * @todo     describe('with a modified value', () => {
                 * @todo
                 * @todo         it('should modify the signal', function () {
                 * @todo             this.timeout(10000);
                 * @todo
                 * @todo             return renderer({
                 * @todo                 prepare ({ audioBufferSourceNode }) {
                 * @todo                     audioBufferSourceNode.offset.value = 0.5;
                 * @todo                 },
                 * @todo                 start (startTime, { audioBufferSourceNode }) {
                 * @todo                     audioBufferSourceNode.start(startTime);
                 * @todo                 }
                 * @todo             })
                 * @todo                 .then((channelData) => {
                 * @todo                     expect(Array.from(channelData)).to.deep.equal([ 0.5, 0.5, 0.5, 0.5, 0.5 ]);
                 * @todo                 });
                 * @todo         });
                 * @todo
                 * @todo     });
                 * @todo
                 * @todo     describe('with a call to setValueAtTime()', () => {
                 * @todo
                 * @todo         it('should modify the signal', function () {
                 * @todo             this.timeout(10000);
                 * @todo
                 * @todo             return renderer({
                 * @todo                 start (startTime, { audioBufferSourceNode }) {
                 * @todo                     audioBufferSourceNode.offset.setValueAtTime(0.5, roundToSamples(startTime, context.sampleRate, 2));
                 * @todo
                 * @todo                     audioBufferSourceNode.start(startTime);
                 * @todo                 }
                 * @todo             })
                 * @todo                 .then((channelData) => {
                 * @todo                     expect(Array.from(channelData)).to.deep.equal([ 1, 1, 0.5, 0.5, 0.5 ]);
                 * @todo                 });
                 * @todo         });
                 * @todo
                 * @todo     });
                 * @todo
                 * @todo     describe('with a call to setValueCurveAtTime()', () => {
                 * @todo
                 * @todo         it('should modify the signal', function () {
                 * @todo             this.timeout(10000);
                 * @todo
                 * @todo             return renderer({
                 * @todo                 start (startTime, { audioBufferSourceNode }) {
                 * @todo                     audioBufferSourceNode.offset.setValueCurveAtTime(new Float32Array([ 0, 0.25, 0.5, 0.75, 1 ]), startTime, 6 / context.sampleRate);
                 * @todo
                 * @todo                     audioBufferSourceNode.start(startTime);
                 * @todo                 }
                 * @todo             })
                 * @todo                 .then((channelData) => {
                 * @todo                     // @todo The implementation of Safari is different. Therefore this test only checks if the values have changed.
                 * @todo                     expect(Array.from(channelData)).to.not.deep.equal([ 1, 1, 1, 1, 1 ]);
                 * @todo                 });
                 * @todo         });
                 * @todo
                 * @todo     });
                 * @todo
                 * @todo     describe('with another AudioNode connected to the AudioParam', () => {
                 * @todo
                 * @todo         it('should modify the signal', function () {
                 * @todo             this.timeout(10000);
                 * @todo
                 * @todo             return renderer({
                 * @todo                 prepare ({ audioBufferSourceNode }) {
                 * @todo                     const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                 * @todo                     const audioBufferSourceNodeForAudioParam = new AudioBufferSourceNode(context);
                 * @todo
                 * @todo                     audioBuffer.copyToChannel(new Float32Array([ 0.5, 0.25, 0, -0.25, -0.5 ]), 0);
                 * @todo
                 * @todo                     audioBufferSourceNodeForAudioParam.buffer = audioBuffer;
                 * @todo
                 * @todo                     audioBufferSourceNode.offset.value = 0;
                 * @todo
                 * @todo                     audioBufferSourceNodeForAudioParam.connect(audioBufferSourceNode.offset);
                 * @todo
                 * @todo                     return { audioBufferSourceNodeForAudioParam };
                 * @todo                 },
                 * @todo                 start (startTime, { audioBufferSourceNodeForAudioParam, audioBufferSourceNode }) {
                 * @todo                     audioBufferSourceNodeForAudioParam.start(startTime);
                 * @todo                     audioBufferSourceNode.start(startTime);
                 * @todo                 }
                 * @todo             })
                 * @todo                 .then((channelData) => {
                 * @todo                     expect(Array.from(channelData)).to.deep.equal([ 0.5, 0.25, 0, -0.25, -0.5 ]);
                 * @todo                 });
                 * @todo         });
                 * @todo
                 * @todo     });
                 * @todo
                 * @todo     // @todo Test other automations as well.
                 * @todo
                 * @todo });
                 */
            });

            describe('loop', () => {
                // @todo
            });

            describe('loopEnd', () => {
                // @todo
            });

            describe('loopStart', () => {
                // @todo
            });

            describe('numberOfInputs', () => {
                let audioBufferSourceNode;

                beforeEach(() => {
                    audioBufferSourceNode = createAudioBufferSourceNode(context);
                });

                it('should be readonly', () => {
                    expect(() => {
                        audioBufferSourceNode.numberOfInputs = 2;
                    }).to.throw(TypeError);
                });
            });

            describe('numberOfOutputs', () => {
                let audioBufferSourceNode;

                beforeEach(() => {
                    audioBufferSourceNode = createAudioBufferSourceNode(context);
                });

                it('should be readonly', () => {
                    expect(() => {
                        audioBufferSourceNode.numberOfOutputs = 2;
                    }).to.throw(TypeError);
                });
            });

            describe('onended', () => {
                let audioBufferSourceNode;

                beforeEach(() => {
                    audioBufferSourceNode = createAudioBufferSourceNode(context, {
                        buffer: new AudioBuffer({ length: 5, sampleRate: context.sampleRate })
                    });
                });

                it('should be null', () => {
                    expect(audioBufferSourceNode.onended).to.be.null;
                });

                it('should be assignable to a function', () => {
                    const fn = () => {}; // eslint-disable-line unicorn/consistent-function-scoping
                    const onended = (audioBufferSourceNode.onended = fn); // eslint-disable-line no-multi-assign

                    expect(onended).to.equal(fn);
                    expect(audioBufferSourceNode.onended).to.equal(fn);
                });

                it('should be assignable to null', () => {
                    const onended = (audioBufferSourceNode.onended = null); // eslint-disable-line no-multi-assign

                    expect(onended).to.be.null;
                    expect(audioBufferSourceNode.onended).to.be.null;
                });

                it('should not be assignable to something else', () => {
                    const string = 'no function or null value';

                    audioBufferSourceNode.onended = () => {};

                    const onended = (audioBufferSourceNode.onended = string); // eslint-disable-line no-multi-assign

                    expect(onended).to.equal(string);
                    expect(audioBufferSourceNode.onended).to.be.null;
                });

                it('should register an independent event listener', () => {
                    const onended = spy();

                    audioBufferSourceNode.onended = onended;
                    audioBufferSourceNode.addEventListener('ended', onended);

                    audioBufferSourceNode.dispatchEvent(new Event('ended'));

                    expect(onended).to.have.been.calledTwice;
                });

                for (const withAConnection of [true, false]) {
                    describe(`${withAConnection ? 'with' : 'without'} a connection`, () => {
                        it('should fire an assigned ended event listener', (done) => {
                            audioBufferSourceNode.onended = function (event) {
                                expect(event).to.be.an.instanceOf(Event);
                                expect(event.currentTarget).to.equal(audioBufferSourceNode);
                                expect(event.target).to.equal(audioBufferSourceNode);
                                expect(event.type).to.equal('ended');

                                expect(this).to.equal(audioBufferSourceNode);

                                done();
                            };

                            if (withAConnection) {
                                audioBufferSourceNode.connect(context.destination);
                            }

                            audioBufferSourceNode.start();

                            context.startRendering?.();
                        });
                    });
                }
            });

            describe('playbackRate', () => {
                it('should return an implementation of the AudioParam interface', () => {
                    const audioBufferSourceNode = createAudioBufferSourceNode(context);

                    expect(audioBufferSourceNode.playbackRate.cancelAndHoldAtTime).to.be.a('function');
                    expect(audioBufferSourceNode.playbackRate.cancelScheduledValues).to.be.a('function');
                    expect(audioBufferSourceNode.playbackRate.defaultValue).to.equal(1);
                    expect(audioBufferSourceNode.playbackRate.exponentialRampToValueAtTime).to.be.a('function');
                    expect(audioBufferSourceNode.playbackRate.linearRampToValueAtTime).to.be.a('function');
                    expect(audioBufferSourceNode.playbackRate.maxValue).to.equal(3.4028234663852886e38);
                    expect(audioBufferSourceNode.playbackRate.minValue).to.equal(-3.4028234663852886e38);
                    expect(audioBufferSourceNode.playbackRate.setTargetAtTime).to.be.a('function');
                    expect(audioBufferSourceNode.playbackRate.setValueAtTime).to.be.a('function');
                    expect(audioBufferSourceNode.playbackRate.setValueCurveAtTime).to.be.a('function');
                    expect(audioBufferSourceNode.playbackRate.value).to.equal(1);
                });

                it('should be readonly', () => {
                    const audioBufferSourceNode = createAudioBufferSourceNode(context);

                    expect(() => {
                        audioBufferSourceNode.playbackRate = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelAndHoldAtTime()', () => {
                    let audioBufferSourceNode;

                    beforeEach(() => {
                        audioBufferSourceNode = createAudioBufferSourceNode(context);
                    });

                    it('should be chainable', () => {
                        expect(audioBufferSourceNode.playbackRate.cancelAndHoldAtTime(0)).to.equal(audioBufferSourceNode.playbackRate);
                    });
                });

                describe('cancelScheduledValues()', () => {
                    let audioBufferSourceNode;

                    beforeEach(() => {
                        audioBufferSourceNode = createAudioBufferSourceNode(context);
                    });

                    it('should be chainable', () => {
                        expect(audioBufferSourceNode.playbackRate.cancelScheduledValues(0)).to.equal(audioBufferSourceNode.playbackRate);
                    });
                });

                describe('exponentialRampToValueAtTime()', () => {
                    let audioBufferSourceNode;

                    beforeEach(() => {
                        audioBufferSourceNode = createAudioBufferSourceNode(context);
                    });

                    it('should be chainable', () => {
                        expect(audioBufferSourceNode.playbackRate.exponentialRampToValueAtTime(1, 0)).to.equal(
                            audioBufferSourceNode.playbackRate
                        );
                    });

                    it('should throw a RangeError', () => {
                        expect(() => {
                            audioBufferSourceNode.playbackRate.exponentialRampToValueAtTime(0, 1);
                        }).to.throw(RangeError);
                    });

                    it('should throw a RangeError', () => {
                        expect(() => {
                            audioBufferSourceNode.playbackRate.exponentialRampToValueAtTime(1, -1);
                        }).to.throw(RangeError);
                    });
                });

                describe('linearRampToValueAtTime()', () => {
                    let audioBufferSourceNode;

                    beforeEach(() => {
                        audioBufferSourceNode = createAudioBufferSourceNode(context);
                    });

                    it('should be chainable', () => {
                        expect(audioBufferSourceNode.playbackRate.linearRampToValueAtTime(1, 0)).to.equal(
                            audioBufferSourceNode.playbackRate
                        );
                    });
                });

                describe('setTargetAtTime()', () => {
                    let audioBufferSourceNode;

                    beforeEach(() => {
                        audioBufferSourceNode = createAudioBufferSourceNode(context);
                    });

                    it('should be chainable', () => {
                        expect(audioBufferSourceNode.playbackRate.setTargetAtTime(1, 0, 0.1)).to.equal(audioBufferSourceNode.playbackRate);
                    });
                });

                describe('setValueAtTime()', () => {
                    let audioBufferSourceNode;

                    beforeEach(() => {
                        audioBufferSourceNode = createAudioBufferSourceNode(context);
                    });

                    it('should be chainable', () => {
                        expect(audioBufferSourceNode.playbackRate.setValueAtTime(1, 0)).to.equal(audioBufferSourceNode.playbackRate);
                    });
                });

                describe('setValueCurveAtTime()', () => {
                    let audioBufferSourceNode;

                    beforeEach(() => {
                        audioBufferSourceNode = createAudioBufferSourceNode(context);
                    });

                    for (const [arrayType, values] of [
                        ['regular Array', [1, 0]],
                        ['Float32Array', new Float32Array([1, 0])]
                    ]) {
                        describe(`with a ${arrayType}`, () => {
                            it('should be chainable', () => {
                                expect(audioBufferSourceNode.playbackRate.setValueCurveAtTime(values, 0, 1)).to.equal(
                                    audioBufferSourceNode.playbackRate
                                );
                            });
                        });
                    }
                });

                describe('automation', () => {
                    for (const [withADirectConnection, withAnAppendedAudioWorklet] of description.includes('Offline')
                        ? [
                              [true, true],
                              [true, false],
                              [false, true]
                          ]
                        : [[true, false]]) {
                        describe(`${withADirectConnection ? 'with' : 'without'} a direct connection and ${
                            withAnAppendedAudioWorklet ? 'with' : 'without'
                        } an appended AudioWorklet`, () => {
                            let renderer;

                            beforeEach(async function () {
                                this.timeout(10000);

                                if (withAnAppendedAudioWorklet) {
                                    await addAudioWorkletModule(context, 'base/test/fixtures/gain-processor.js');
                                }

                                renderer = createRenderer({
                                    context,
                                    length: context.length === undefined ? 5 : undefined,
                                    prepare(destination) {
                                        const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });

                                        audioBuffer.copyToChannel(new Float32Array([1, 1, 0, 0, 0]), 0);

                                        const audioBufferSourceNode = createAudioBufferSourceNode(context, { buffer: audioBuffer });
                                        const audioWorkletNode = withAnAppendedAudioWorklet
                                            ? new AudioWorkletNode(context, 'gain-processor')
                                            : null;
                                        const masterGainNode = new GainNode(context, {
                                            gain: withADirectConnection && withAnAppendedAudioWorklet ? 0.5 : 1
                                        });

                                        if (withADirectConnection) {
                                            audioBufferSourceNode.connect(masterGainNode);
                                        }

                                        if (withAnAppendedAudioWorklet) {
                                            audioBufferSourceNode.connect(audioWorkletNode).connect(masterGainNode);
                                        }

                                        masterGainNode.connect(destination);

                                        return { audioBufferSourceNode };
                                    }
                                });
                            });

                            describe('without any automation', () => {
                                it('should not modify the signal', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        start(startTime, { audioBufferSourceNode }) {
                                            audioBufferSourceNode.start(startTime);
                                        }
                                    }).then((channelData) => {
                                        expect(Array.from(channelData)).to.deep.equal([1, 1, 0, 0, 0]);
                                    });
                                });
                            });

                            describe('with a modified value', () => {
                                it('should modify the signal', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        prepare({ audioBufferSourceNode }) {
                                            audioBufferSourceNode.playbackRate.value = 0.5;
                                        },
                                        start(startTime, { audioBufferSourceNode }) {
                                            audioBufferSourceNode.start(startTime);
                                        }
                                    }).then((channelData) => {
                                        expect(channelData[0]).to.be.closeTo(1, 0.1);
                                        expect(channelData[1]).to.be.closeTo(1, 0.2);
                                        expect(channelData[2]).to.be.closeTo(1, 0.1);
                                        expect(channelData[3]).to.be.closeTo(0.5, 0.1);
                                        expect(channelData[4]).to.be.closeTo(0, 0.1);
                                    });
                                });
                            });

                            describe('with a call to cancelAndHoldAtTime()', () => {
                                // @todo
                            });

                            describe('with a call to cancelScheduledValues()', () => {
                                it('should modify the signal', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        start(startTime, { audioBufferSourceNode }) {
                                            audioBufferSourceNode.playbackRate.setValueAtTime(0.5, startTime);
                                            audioBufferSourceNode.playbackRate.setValueAtTime(
                                                1,
                                                roundToSamples(startTime, context.sampleRate, 2)
                                            );
                                            audioBufferSourceNode.playbackRate.linearRampToValueAtTime(
                                                0,
                                                roundToSamples(startTime, context.sampleRate, 5)
                                            );
                                            audioBufferSourceNode.playbackRate.cancelScheduledValues(
                                                roundToSamples(startTime, context.sampleRate, 3)
                                            );

                                            audioBufferSourceNode.start(startTime);
                                        }
                                    }).then((channelData) => {
                                        expect(channelData[0]).to.be.closeTo(1, 0.1);
                                        expect(channelData[1]).to.be.closeTo(1, 0.2);
                                        expect(channelData[2]).to.be.closeTo(1, 0.1);
                                        expect(channelData[3]).to.be.closeTo(0.5, 0.1);
                                        expect(channelData[4]).to.be.closeTo(0, 0.1);
                                    });
                                });
                            });

                            describe('with a call to setValueAtTime()', () => {
                                it('should modify the signal', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        start(startTime, { audioBufferSourceNode }) {
                                            audioBufferSourceNode.playbackRate.setValueAtTime(0.5, startTime);

                                            audioBufferSourceNode.start(startTime);
                                        }
                                    }).then((channelData) => {
                                        expect(channelData[0]).to.be.closeTo(1, 0.1);
                                        expect(channelData[1]).to.be.closeTo(1, 0.2);
                                        expect(channelData[2]).to.be.closeTo(1, 0.1);
                                        expect(channelData[3]).to.be.closeTo(0.5, 0.1);
                                        expect(channelData[4]).to.be.closeTo(0, 0.1);
                                    });
                                });
                            });

                            describe('with a call to setValueCurveAtTime()', () => {
                                it('should modify the signal', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        start(startTime, { audioBufferSourceNode }) {
                                            audioBufferSourceNode.playbackRate.setValueCurveAtTime(
                                                new Float32Array([0.5, 0.375, 0.25, 0.125, 0]),
                                                startTime,
                                                6 / context.sampleRate
                                            );

                                            audioBufferSourceNode.start(startTime);
                                        }
                                    }).then((channelData) => {
                                        expect(channelData[0]).to.be.closeTo(1, 0.1);
                                        expect(channelData[1]).to.be.closeTo(1, 0.2);
                                        expect(channelData[2]).to.be.closeTo(1, 0.1);
                                        expect(channelData[3]).to.be.closeTo(0.5, 0.1);
                                        expect(channelData[4]).to.be.closeTo(0, 0.1);
                                    });
                                });
                            });

                            describe('with another AudioNode connected to the AudioParam', () => {
                                it('should modify the signal', function () {
                                    this.timeout(10000);

                                    return renderer({
                                        prepare({ audioBufferSourceNode }) {
                                            const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                                            const audioBufferSourceNodeForAudioParam = new AudioBufferSourceNode(context);

                                            audioBuffer.copyToChannel(new Float32Array([0.5, 0.5, 0.5, 0.5, 0.5]), 0);

                                            audioBufferSourceNodeForAudioParam.buffer = audioBuffer;

                                            audioBufferSourceNode.playbackRate.value = 0;

                                            audioBufferSourceNodeForAudioParam.connect(audioBufferSourceNode.playbackRate);

                                            return { audioBufferSourceNodeForAudioParam };
                                        },
                                        start(startTime, { audioBufferSourceNode, audioBufferSourceNodeForAudioParam }) {
                                            audioBufferSourceNode.start(startTime);
                                            audioBufferSourceNodeForAudioParam.start(startTime);
                                        }
                                    }).then((channelData) => {
                                        expect(channelData[0]).to.be.closeTo(1, 0.1);
                                        expect(channelData[1]).to.be.closeTo(1, 0.2);
                                        expect(channelData[2]).to.be.closeTo(1, 0.1);
                                        expect(channelData[3]).to.be.closeTo(0.5, 0.1);
                                        expect(channelData[4]).to.be.closeTo(0, 0.1);
                                    });
                                });
                            });

                            // @todo Test other automations as well.
                        });
                    }
                });
            });

            describe('addEventListener()', () => {
                let audioBufferSourceNode;

                beforeEach(() => {
                    audioBufferSourceNode = createAudioBufferSourceNode(context, {
                        buffer: new AudioBuffer({ length: 5, sampleRate: context.sampleRate })
                    });
                });

                it('should fire a registered ended event listener', (done) => {
                    audioBufferSourceNode.addEventListener('ended', function (event) {
                        expect(event).to.be.an.instanceOf(Event);
                        expect(event.currentTarget).to.equal(audioBufferSourceNode);
                        expect(event.target).to.equal(audioBufferSourceNode);
                        expect(event.type).to.equal('ended');

                        expect(this).to.equal(audioBufferSourceNode);

                        done();
                    });

                    audioBufferSourceNode.connect(context.destination);

                    audioBufferSourceNode.start();

                    context.startRendering?.();
                });
            });

            describe('connect()', () => {
                for (const type of ['AudioNode', 'AudioParam']) {
                    describe(`with an ${type}`, () => {
                        let audioBufferSourceNode;
                        let audioNodeOrAudioParam;

                        beforeEach(() => {
                            audioBufferSourceNode = createAudioBufferSourceNode(context);

                            const gainNode = new GainNode(context);

                            audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                        });

                        if (type === 'AudioNode') {
                            it('should be chainable', () => {
                                expect(audioBufferSourceNode.connect(audioNodeOrAudioParam)).to.equal(audioNodeOrAudioParam);
                            });
                        } else {
                            it('should not be chainable', () => {
                                expect(audioBufferSourceNode.connect(audioNodeOrAudioParam)).to.be.undefined;
                            });
                        }

                        it('should accept duplicate connections', () => {
                            audioBufferSourceNode.connect(audioNodeOrAudioParam);
                            audioBufferSourceNode.connect(audioNodeOrAudioParam);
                        });

                        it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                            try {
                                audioBufferSourceNode.connect(audioNodeOrAudioParam, -1);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                        if (type === 'AudioNode') {
                            it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                                try {
                                    audioBufferSourceNode.connect(audioNodeOrAudioParam, 0, -1);
                                } catch (err) {
                                    expect(err.code).to.equal(1);
                                    expect(err.name).to.equal('IndexSizeError');

                                    done();
                                }
                            });

                            it('should not throw an error if the connection creates a cycle by connecting to an AudioParam of the source', () => {
                                audioBufferSourceNode.connect(audioNodeOrAudioParam).connect(audioBufferSourceNode.playbackRate);
                            });
                        }
                    });

                    describe(`with an ${type} of another context`, () => {
                        let anotherContext;
                        let audioBufferSourceNode;
                        let audioNodeOrAudioParam;

                        afterEach(() => anotherContext.close?.());

                        beforeEach(() => {
                            anotherContext = createContext();

                            const gainNode = new GainNode(anotherContext);

                            audioBufferSourceNode = createAudioBufferSourceNode(context);
                            audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                        });

                        it('should throw an InvalidAccessError', (done) => {
                            try {
                                audioBufferSourceNode.connect(audioNodeOrAudioParam);
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });
                    });

                    describe(`with an ${type} of a native context`, () => {
                        let audioBufferSourceNode;
                        let nativeAudioNodeOrAudioParam;
                        let nativeContext;

                        afterEach(() => nativeContext.close?.());

                        beforeEach(() => {
                            audioBufferSourceNode = createAudioBufferSourceNode(context);
                            nativeContext = description.includes('Offline')
                                ? createNativeOfflineAudioContext()
                                : createNativeAudioContext();

                            const nativeGainNode = nativeContext.createGain();

                            nativeAudioNodeOrAudioParam = type === 'AudioNode' ? nativeGainNode : nativeGainNode.gain;
                        });

                        it('should throw an InvalidAccessError', (done) => {
                            try {
                                audioBufferSourceNode.connect(nativeAudioNodeOrAudioParam);
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });
                    });
                }

                describe('with a cycle', () => {
                    let renderer;

                    beforeEach(() => {
                        renderer = createRenderer({
                            context,
                            length: context.length === undefined ? 5 : undefined,
                            prepare(destination) {
                                const anotherGainNode = new GainNode(context);
                                const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                                const audioBufferSourceNode = createAudioBufferSourceNode(context);
                                const gainNode = new GainNode(context);

                                audioBuffer.copyToChannel(new Float32Array([1, 1, 1, 1, 1]), 0);

                                audioBufferSourceNode.buffer = audioBuffer;

                                audioBufferSourceNode.connect(gainNode).connect(destination);

                                gainNode.connect(anotherGainNode).connect(gainNode);

                                return { anotherGainNode, audioBufferSourceNode, gainNode };
                            }
                        });
                    });

                    it('should render silence', function () {
                        this.timeout(10000);

                        return renderer({
                            start(startTime, { audioBufferSourceNode }) {
                                audioBufferSourceNode.start(startTime);
                            }
                        }).then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                        });
                    });
                });
            });

            describe('disconnect()', () => {
                let createPredefinedRenderer;

                beforeEach(() => {
                    createPredefinedRenderer = (values) =>
                        createRenderer({
                            context,
                            length: context.length === undefined ? 5 : undefined,
                            prepare(destination) {
                                const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                                const audioBufferSourceNode = createAudioBufferSourceNode(context);
                                const firstDummyGainNode = new GainNode(context);
                                const secondDummyGainNode = new GainNode(context);

                                audioBuffer.copyToChannel(new Float32Array(values), 0);

                                audioBufferSourceNode.buffer = audioBuffer;

                                audioBufferSourceNode.connect(firstDummyGainNode).connect(destination);

                                audioBufferSourceNode.connect(secondDummyGainNode);

                                return { audioBufferSourceNode, firstDummyGainNode, secondDummyGainNode };
                            }
                        });
                });

                describe('without any parameters', () => {
                    let renderer;
                    let values;

                    beforeEach(function () {
                        this.timeout(10000);

                        values = [1, 1, 1, 1, 1];

                        renderer = createPredefinedRenderer(values);
                    });

                    it('should disconnect all destinations', function () {
                        this.timeout(10000);

                        return renderer({
                            prepare({ audioBufferSourceNode }) {
                                audioBufferSourceNode.disconnect();
                            },
                            start(startTime, { audioBufferSourceNode }) {
                                audioBufferSourceNode.start(startTime);
                            }
                        }).then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                        });
                    });
                });

                describe('with an output', () => {
                    describe('with a value which is out-of-bound', () => {
                        let audioBufferSourceNode;

                        beforeEach(() => {
                            audioBufferSourceNode = createAudioBufferSourceNode(context);
                        });

                        it('should throw an IndexSizeError', (done) => {
                            try {
                                audioBufferSourceNode.disconnect(-1);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });
                    });

                    describe('with a connection from the given output', () => {
                        let renderer;
                        let values;

                        beforeEach(function () {
                            this.timeout(10000);

                            values = [1, 1, 1, 1, 1];

                            renderer = createPredefinedRenderer(values);
                        });

                        it('should disconnect all destinations from the given output', function () {
                            this.timeout(10000);

                            return renderer({
                                prepare({ audioBufferSourceNode }) {
                                    audioBufferSourceNode.disconnect(0);
                                },
                                start(startTime, { audioBufferSourceNode }) {
                                    audioBufferSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                            });
                        });
                    });
                });

                describe('with a destination', () => {
                    describe('without a connection to the given destination', () => {
                        let audioBufferSourceNode;

                        beforeEach(() => {
                            audioBufferSourceNode = createAudioBufferSourceNode(context);
                        });

                        it('should throw an InvalidAccessError', (done) => {
                            try {
                                audioBufferSourceNode.disconnect(new GainNode(context));
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });
                    });

                    describe('with a connection to the given destination', () => {
                        let renderer;
                        let values;

                        beforeEach(function () {
                            this.timeout(10000);

                            values = [1, 1, 1, 1, 1];

                            renderer = createPredefinedRenderer(values);
                        });

                        it('should disconnect the destination', function () {
                            this.timeout(10000);

                            return renderer({
                                prepare({ audioBufferSourceNode, firstDummyGainNode }) {
                                    audioBufferSourceNode.disconnect(firstDummyGainNode);
                                },
                                start(startTime, { audioBufferSourceNode }) {
                                    audioBufferSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                            });
                        });

                        it('should disconnect another destination in isolation', function () {
                            this.timeout(10000);

                            return renderer({
                                prepare({ audioBufferSourceNode, secondDummyGainNode }) {
                                    audioBufferSourceNode.disconnect(secondDummyGainNode);
                                },
                                start(startTime, { audioBufferSourceNode }) {
                                    audioBufferSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal(values);
                            });
                        });
                    });
                });

                describe('with a destination and an output', () => {
                    let audioBufferSourceNode;

                    beforeEach(() => {
                        audioBufferSourceNode = createAudioBufferSourceNode(context);
                    });

                    it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                        try {
                            audioBufferSourceNode.disconnect(new GainNode(context), -1);
                        } catch (err) {
                            expect(err.code).to.equal(1);
                            expect(err.name).to.equal('IndexSizeError');

                            done();
                        }
                    });

                    it('should throw an InvalidAccessError if there is no similar connection', (done) => {
                        try {
                            audioBufferSourceNode.disconnect(new GainNode(context), 0);
                        } catch (err) {
                            expect(err.code).to.equal(15);
                            expect(err.name).to.equal('InvalidAccessError');

                            done();
                        }
                    });
                });

                describe('with a destination, an output and an input', () => {
                    let audioBufferSourceNode;

                    beforeEach(() => {
                        audioBufferSourceNode = createAudioBufferSourceNode(context);
                    });

                    it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                        try {
                            audioBufferSourceNode.disconnect(new GainNode(context), -1, 0);
                        } catch (err) {
                            expect(err.code).to.equal(1);
                            expect(err.name).to.equal('IndexSizeError');

                            done();
                        }
                    });

                    it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                        try {
                            audioBufferSourceNode.disconnect(new GainNode(context), 0, -1);
                        } catch (err) {
                            expect(err.code).to.equal(1);
                            expect(err.name).to.equal('IndexSizeError');

                            done();
                        }
                    });

                    it('should throw an InvalidAccessError if there is no similar connection', (done) => {
                        try {
                            audioBufferSourceNode.disconnect(new GainNode(context), 0, 0);
                        } catch (err) {
                            expect(err.code).to.equal(15);
                            expect(err.name).to.equal('InvalidAccessError');

                            done();
                        }
                    });
                });
            });

            describe('removeEventListener()', () => {
                let audioBufferSourceNode;

                beforeEach(() => {
                    audioBufferSourceNode = createAudioBufferSourceNode(context, {
                        buffer: new AudioBuffer({ length: 5, sampleRate: context.sampleRate })
                    });
                });

                it('should not fire a removed ended event listener', (done) => {
                    const listener = spy();

                    audioBufferSourceNode.addEventListener('ended', listener);
                    audioBufferSourceNode.removeEventListener('ended', listener);

                    audioBufferSourceNode.connect(context.destination);

                    audioBufferSourceNode.start();

                    setTimeout(() => {
                        expect(listener).to.have.not.been.called;

                        done();
                    }, 500);

                    context.startRendering?.();
                });
            });

            describe('start()', () => {
                describe('with a previous call to start()', () => {
                    let audioBufferSourceNode;

                    beforeEach(() => {
                        audioBufferSourceNode = createAudioBufferSourceNode(context);

                        audioBufferSourceNode.start();
                    });

                    it('should throw an InvalidStateError', (done) => {
                        try {
                            audioBufferSourceNode.start();
                        } catch (err) {
                            expect(err.code).to.equal(11);
                            expect(err.name).to.equal('InvalidStateError');

                            done();
                        }
                    });
                });

                describe('with a previous call to stop()', () => {
                    let audioBufferSourceNode;

                    beforeEach(() => {
                        audioBufferSourceNode = createAudioBufferSourceNode(context);

                        // @todo Safari needs a buffer to start() an AudioBufferSourceNode.
                        audioBufferSourceNode.buffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                        audioBufferSourceNode.start();
                        audioBufferSourceNode.stop();
                    });

                    it('should throw an InvalidStateError', (done) => {
                        try {
                            audioBufferSourceNode.start();
                        } catch (err) {
                            expect(err.code).to.equal(11);
                            expect(err.name).to.equal('InvalidStateError');

                            done();
                        }
                    });
                });

                describe('with a negative value as first parameter', () => {
                    let audioBufferSourceNode;

                    beforeEach(() => {
                        audioBufferSourceNode = createAudioBufferSourceNode(context);
                    });

                    it('should throw a RangeError', () => {
                        expect(() => {
                            audioBufferSourceNode.start(-1);
                        }).to.throw(RangeError);
                    });
                });

                describe('with a negative value as second parameter', () => {
                    let audioBufferSourceNode;

                    beforeEach(() => {
                        audioBufferSourceNode = createAudioBufferSourceNode(context);
                    });

                    it('should throw a RangeError', () => {
                        expect(() => {
                            audioBufferSourceNode.start(0, -1);
                        }).to.throw(RangeError);
                    });
                });

                describe('with a negative value as third parameter', () => {
                    let audioBufferSourceNode;

                    beforeEach(() => {
                        audioBufferSourceNode = createAudioBufferSourceNode(context);
                    });

                    it('should throw a RangeError', () => {
                        expect(() => {
                            audioBufferSourceNode.start(0, 0, -1);
                        }).to.throw(RangeError);
                    });
                });

                describe('with a set offset parameter', () => {
                    for (const [withADirectConnection, withAnAppendedAudioWorklet] of description.includes('Offline')
                        ? [
                              [true, true],
                              [true, false],
                              [false, true]
                          ]
                        : [[true, false]]) {
                        describe(`${withADirectConnection ? 'with' : 'without'} a direct connection and ${
                            withAnAppendedAudioWorklet ? 'with' : 'without'
                        } an appended AudioWorklet`, () => {
                            let renderer;

                            beforeEach(async function () {
                                this.timeout(10000);

                                if (withAnAppendedAudioWorklet) {
                                    await addAudioWorkletModule(context, 'base/test/fixtures/gain-processor.js');
                                }

                                renderer = createRenderer({
                                    context,
                                    length: context.length === undefined ? 5 : undefined,
                                    prepare(destination) {
                                        const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });

                                        audioBuffer.copyToChannel(new Float32Array([1, 1, 1, 1, 1]), 0);

                                        const audioBufferSourceNode = createAudioBufferSourceNode(context, { buffer: audioBuffer });
                                        const audioWorkletNode = withAnAppendedAudioWorklet
                                            ? new AudioWorkletNode(context, 'gain-processor')
                                            : null;
                                        const masterGainNode = new GainNode(context, {
                                            gain: withADirectConnection && withAnAppendedAudioWorklet ? 0.5 : 1
                                        });

                                        if (withADirectConnection) {
                                            audioBufferSourceNode.connect(masterGainNode);
                                        }

                                        if (withAnAppendedAudioWorklet) {
                                            audioBufferSourceNode.connect(audioWorkletNode).connect(masterGainNode);
                                        }

                                        masterGainNode.connect(destination);

                                        return { audioBufferSourceNode };
                                    }
                                });
                            });

                            it('should apply an offset', function () {
                                this.timeout(10000);

                                return renderer({
                                    start(startTime, { audioBufferSourceNode }) {
                                        audioBufferSourceNode.start(startTime, 2 / context.sampleRate);
                                    }
                                }).then((channelData) => {
                                    expect(Array.from(channelData)).to.deep.equal([1, 1, 1, 0, 0]);
                                });
                            });

                            it('should handle an offset which equals the duration', function () {
                                this.timeout(10000);

                                return renderer({
                                    start(startTime, { audioBufferSourceNode }) {
                                        audioBufferSourceNode.start(startTime, audioBufferSourceNode.buffer.duration);
                                    }
                                }).then((channelData) => {
                                    expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                                });
                            });

                            it('should clamp the given offset to the duration', function () {
                                this.timeout(10000);

                                return renderer({
                                    start(startTime, { audioBufferSourceNode }) {
                                        audioBufferSourceNode.start(startTime, audioBufferSourceNode.buffer.duration + 1);
                                    }
                                }).then((channelData) => {
                                    expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                                });
                            });
                        });
                    }
                });

                describe('with a set duration parameter', () => {
                    for (const [withADirectConnection, withAnAppendedAudioWorklet] of description.includes('Offline')
                        ? [
                              [true, true],
                              [true, false],
                              [false, true]
                          ]
                        : [[true, false]]) {
                        describe(`${withADirectConnection ? 'with' : 'without'} a direct connection and ${
                            withAnAppendedAudioWorklet ? 'with' : 'without'
                        } an appended AudioWorklet`, () => {
                            let renderer;

                            beforeEach(async function () {
                                this.timeout(10000);

                                if (withAnAppendedAudioWorklet) {
                                    await addAudioWorkletModule(context, 'base/test/fixtures/gain-processor.js');
                                }

                                renderer = createRenderer({
                                    context,
                                    length: context.length === undefined ? 5 : undefined,
                                    prepare(destination) {
                                        const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });

                                        audioBuffer.copyToChannel(new Float32Array([1, 1, 1, 1, 1]), 0);

                                        const audioBufferSourceNode = createAudioBufferSourceNode(context, { buffer: audioBuffer });
                                        const audioWorkletNode = withAnAppendedAudioWorklet
                                            ? new AudioWorkletNode(context, 'gain-processor')
                                            : null;
                                        const masterGainNode = new GainNode(context, {
                                            gain: withADirectConnection && withAnAppendedAudioWorklet ? 0.5 : 1
                                        });

                                        if (withADirectConnection) {
                                            audioBufferSourceNode.connect(masterGainNode);
                                        }

                                        if (withAnAppendedAudioWorklet) {
                                            audioBufferSourceNode.connect(audioWorkletNode).connect(masterGainNode);
                                        }

                                        masterGainNode.connect(destination);

                                        return { audioBufferSourceNode };
                                    }
                                });
                            });

                            it('should play the buffer only for the given duration', function () {
                                this.timeout(10000);

                                return renderer({
                                    start(startTime, { audioBufferSourceNode }) {
                                        audioBufferSourceNode.start(startTime, 0, 2 / context.sampleRate);
                                    }
                                }).then((channelData) => {
                                    expect(Array.from(channelData)).to.deep.equal([1, 1, 0, 0, 0]);
                                });
                            });

                            it('should compute the duration in buffer time', function () {
                                this.timeout(10000);

                                return renderer({
                                    prepare({ audioBufferSourceNode }) {
                                        audioBufferSourceNode.playbackRate.value = 0.5;
                                    },
                                    start(startTime, { audioBufferSourceNode }) {
                                        audioBufferSourceNode.start(startTime, 0, 2 / context.sampleRate);
                                    }
                                }).then((channelData) => {
                                    expect(channelData[0]).to.be.closeTo(1, 0.1);
                                    expect(channelData[1]).to.be.closeTo(1, 0.2);
                                    expect(channelData[2]).to.be.closeTo(1, 0.1);
                                    expect(channelData[3]).to.be.closeTo(0.5, 0.5);
                                    expect(channelData[4]).to.be.closeTo(0, 0.1);
                                });
                            });
                        });
                    }
                });
            });

            describe('stop()', () => {
                describe('without a previous call to start()', () => {
                    let audioBufferSourceNode;

                    beforeEach(() => {
                        audioBufferSourceNode = createAudioBufferSourceNode(context);
                    });

                    it('should throw an InvalidStateError', (done) => {
                        try {
                            audioBufferSourceNode.stop();
                        } catch (err) {
                            expect(err.code).to.equal(11);
                            expect(err.name).to.equal('InvalidStateError');

                            done();
                        }
                    });
                });

                describe('with a previous call to stop()', () => {
                    for (const [withADirectConnection, withAnAppendedAudioWorklet] of description.includes('Offline')
                        ? [
                              [true, true],
                              [true, false],
                              [false, true]
                          ]
                        : [[true, false]]) {
                        describe(`${withADirectConnection ? 'with' : 'without'} a direct connection and ${
                            withAnAppendedAudioWorklet ? 'with' : 'without'
                        } an appended AudioWorklet`, () => {
                            let renderer;

                            beforeEach(async function () {
                                this.timeout(10000);

                                if (withAnAppendedAudioWorklet) {
                                    await addAudioWorkletModule(context, 'base/test/fixtures/gain-processor.js');
                                }

                                renderer = createRenderer({
                                    context,
                                    length: context.length === undefined ? 5 : undefined,
                                    prepare(destination) {
                                        const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });

                                        audioBuffer.copyToChannel(new Float32Array([1, 1, 1, 1, 1]), 0);

                                        const audioBufferSourceNode = createAudioBufferSourceNode(context, { buffer: audioBuffer });
                                        const audioWorkletNode = withAnAppendedAudioWorklet
                                            ? new AudioWorkletNode(context, 'gain-processor')
                                            : null;
                                        const masterGainNode = new GainNode(context, {
                                            gain: withADirectConnection && withAnAppendedAudioWorklet ? 0.5 : 1
                                        });

                                        if (withADirectConnection) {
                                            audioBufferSourceNode.connect(masterGainNode);
                                        }

                                        if (withAnAppendedAudioWorklet) {
                                            audioBufferSourceNode.connect(audioWorkletNode).connect(masterGainNode);
                                        }

                                        masterGainNode.connect(destination);

                                        return { audioBufferSourceNode };
                                    }
                                });
                            });

                            it('should apply the values from the last invocation', function () {
                                this.timeout(10000);

                                return renderer({
                                    start(startTime, { audioBufferSourceNode }) {
                                        audioBufferSourceNode.start(startTime);
                                        audioBufferSourceNode.stop(roundToSamples(startTime, context.sampleRate, 5));
                                        audioBufferSourceNode.stop(roundToSamples(startTime, context.sampleRate, 3));
                                    }
                                }).then((channelData) => {
                                    expect(Array.from(channelData)).to.deep.equal([1, 1, 1, 0, 0]);
                                });
                            });
                        });
                    }
                });

                describe('with a stop time reached prior to the start time', () => {
                    for (const [withADirectConnection, withAnAppendedAudioWorklet] of description.includes('Offline')
                        ? [
                              [true, true],
                              [true, false],
                              [false, true]
                          ]
                        : [[true, false]]) {
                        describe(`${withADirectConnection ? 'with' : 'without'} a direct connection and ${
                            withAnAppendedAudioWorklet ? 'with' : 'without'
                        } an appended AudioWorklet`, () => {
                            let renderer;

                            beforeEach(async function () {
                                this.timeout(10000);

                                if (withAnAppendedAudioWorklet) {
                                    await addAudioWorkletModule(context, 'base/test/fixtures/gain-processor.js');
                                }

                                renderer = createRenderer({
                                    context,
                                    length: context.length === undefined ? 5 : undefined,
                                    prepare(destination) {
                                        const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });

                                        audioBuffer.copyToChannel(new Float32Array([1, 1, 1, 1, 1]), 0);

                                        const audioBufferSourceNode = createAudioBufferSourceNode(context, { buffer: audioBuffer });
                                        const audioWorkletNode = withAnAppendedAudioWorklet
                                            ? new AudioWorkletNode(context, 'gain-processor')
                                            : null;
                                        const masterGainNode = new GainNode(context, {
                                            gain: withADirectConnection && withAnAppendedAudioWorklet ? 0.5 : 1
                                        });

                                        if (withADirectConnection) {
                                            audioBufferSourceNode.connect(masterGainNode);
                                        }

                                        if (withAnAppendedAudioWorklet) {
                                            audioBufferSourceNode.connect(audioWorkletNode).connect(masterGainNode);
                                        }

                                        masterGainNode.connect(destination);

                                        return { audioBufferSourceNode };
                                    }
                                });
                            });

                            it('should not play anything', function () {
                                this.timeout(10000);

                                return renderer({
                                    start(startTime, { audioBufferSourceNode }) {
                                        audioBufferSourceNode.start(roundToSamples(startTime, context.sampleRate, 3));
                                        audioBufferSourceNode.stop(roundToSamples(startTime, context.sampleRate, 1));
                                    }
                                }).then((channelData) => {
                                    expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                                });
                            });
                        });
                    }
                });

                describe('with an emitted ended event', () => {
                    let audioBufferSourceNode;

                    beforeEach((done) => {
                        const audioBuffer = new AudioBuffer({ length: 1, sampleRate: context.sampleRate });

                        audioBufferSourceNode = createAudioBufferSourceNode(context, { buffer: audioBuffer });

                        audioBufferSourceNode.onended = () => done();

                        audioBufferSourceNode.connect(context.destination);

                        audioBufferSourceNode.start();
                        audioBufferSourceNode.stop();

                        context.startRendering?.();
                    });

                    it('should ignore calls to stop()', () => {
                        audioBufferSourceNode.stop();
                    });
                });

                describe('with a negative value as first parameter', () => {
                    let audioBufferSourceNode;

                    beforeEach(() => {
                        audioBufferSourceNode = createAudioBufferSourceNode(context);

                        audioBufferSourceNode.start();
                    });

                    it('should throw a RangeError', () => {
                        expect(() => {
                            audioBufferSourceNode.stop(-1);
                        }).to.throw(RangeError);
                    });
                });
            });
        });
    }
});
