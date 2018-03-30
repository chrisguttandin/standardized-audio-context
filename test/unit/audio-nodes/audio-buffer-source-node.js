import { AudioBuffer } from '../../../src/audio-buffer';
import { AudioBufferSourceNode } from '../../../src/audio-nodes/audio-buffer-source-node';
import { AudioWorkletNode } from '../../../src/audio-nodes/audio-worklet-node';
import { GainNode } from '../../../src/audio-nodes/gain-node';
import { addAudioWorkletModule } from '../../../src/add-audio-worklet-module';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';
import { spy } from 'sinon';

const createAudioBufferSourceNodeWithConstructor = (context, options = null) => {
    if (options === null) {
        return new AudioBufferSourceNode(context);
    }

    return new AudioBufferSourceNode(context, options);
};
const createAudioBufferSourceNodeWithFactoryFunction = (context, options = null) => {
    const audioBufferSourceNode = context.createBufferSource();

    if (options !== null && options.channelCount !== undefined) {
        audioBufferSourceNode.channelCount = options.channelCount;
    }

    if (options !== null && options.channelCountMode !== undefined) {
        audioBufferSourceNode.channelCountMode = options.channelCountMode;
    }

    if (options !== null && options.channelInterpretation !== undefined) {
        audioBufferSourceNode.channelInterpretation = options.channelInterpretation;
    }

    if (options !== null && options.buffer !== undefined) {
        audioBufferSourceNode.buffer = options.buffer;
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
    'constructor with AudioContext': {
        createAudioBufferSourceNode: createAudioBufferSourceNodeWithConstructor,
        createContext: createAudioContext
    },
    'constructor with MinimalAudioContext': {
        createAudioBufferSourceNode: createAudioBufferSourceNodeWithConstructor,
        createContext: createMinimalAudioContext
    },
    'constructor with MinimalOfflineAudioContext': {
        createAudioBufferSourceNode: createAudioBufferSourceNodeWithConstructor,
        createContext: createMinimalOfflineAudioContext
    },
    'constructor with OfflineAudioContext': {
        createAudioBufferSourceNode: createAudioBufferSourceNodeWithConstructor,
        createContext: createOfflineAudioContext
    },
    'factory function of AudioContext': {
        createAudioBufferSourceNode: createAudioBufferSourceNodeWithFactoryFunction,
        createContext: createAudioContext
    },
    'factory function of OfflineAudioContext': {
        createAudioBufferSourceNode: createAudioBufferSourceNodeWithFactoryFunction,
        createContext: createOfflineAudioContext
    }
};

describe('AudioBufferSourceNode', () => {

    for (const [ description, { createAudioBufferSourceNode, createContext } ] of Object.entries(testCases)) {

        describe(`with the ${ description }`, () => {

            let context;

            afterEach(() => {
                if (context.close !== undefined) {
                    return context.close();
                }
            });

            beforeEach(() => context = createContext());

            describe('constructor()', () => {

                describe('without any options', () => {

                    let audioBufferSourceNode;

                    beforeEach(() => {
                        audioBufferSourceNode = createAudioBufferSourceNode(context);
                    });

                    it('should be an instance of the EventTarget interface', () => {
                        expect(audioBufferSourceNode.addEventListener).to.be.a('function');
                        expect(audioBufferSourceNode.dispatchEvent).to.be.a('function');
                        expect(audioBufferSourceNode.removeEventListener).to.be.a('function');
                    });

                    it('should be an instance of the AudioNode interface', () => {
                        expect(audioBufferSourceNode.channelCount).to.equal(2);
                        expect(audioBufferSourceNode.channelCountMode).to.equal('max');
                        expect(audioBufferSourceNode.channelInterpretation).to.equal('speakers');
                        expect(audioBufferSourceNode.connect).to.be.a('function');
                        expect(audioBufferSourceNode.context).to.be.an.instanceOf(context.constructor);
                        expect(audioBufferSourceNode.disconnect).to.be.a('function');
                        expect(audioBufferSourceNode.numberOfInputs).to.equal(0);
                        expect(audioBufferSourceNode.numberOfOutputs).to.equal(1);
                    });

                    it('should return an instance of the AudioScheduledSourceNode interface', () => {
                        expect(audioBufferSourceNode.onended).to.be.null;
                        expect(audioBufferSourceNode.start).to.be.a('function');
                        expect(audioBufferSourceNode.stop).to.be.a('function');
                    });

                    it('should return an instance of the AudioBufferSourceNode interface', () => {
                        expect(audioBufferSourceNode.buffer).to.be.null;
                        // expect(audioBufferSourceNode.detune).not.to.be.undefined;
                        expect(audioBufferSourceNode.loop).to.be.false;
                        expect(audioBufferSourceNode.loopEnd).to.equal(0);
                        expect(audioBufferSourceNode.loopStart).to.equal(0);
                        expect(audioBufferSourceNode.playbackRate).not.to.be.undefined;
                    });

                    it('should throw an error if the AudioContext is closed', (done) => {
                        ((context.close === undefined) ? context.startRendering() : context.close())
                            .then(() => createAudioBufferSourceNode(context))
                            .catch((err) => {
                                expect(err.code).to.equal(11);
                                expect(err.name).to.equal('InvalidStateError');

                                context.close = undefined;

                                done();
                            });
                    });

                });

                describe('with valid options', () => {

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

                    it('should return an instance with the given buffer', () => {
                        const audioBuffer = new AudioBuffer({ length: 1, sampleRate: context.sampleRate });
                        const audioBufferSourceNode = createAudioBufferSourceNode(context, { buffer: audioBuffer });

                        expect(audioBufferSourceNode.buffer).to.equal(audioBuffer);
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

                        expect(audioBufferSourceNode.playbackRate.value).to.equal(playbackRate);
                    });

                });

            });

            describe('buffer', () => {

                let audioBufferSourceNode;

                beforeEach(() => {
                    audioBufferSourceNode = createAudioBufferSourceNode(context);
                });

                describe('without a previously assigned AudioBuffer', () => {

                    it('should be assignable to an AudioBuffer', () => {
                        const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });

                        audioBufferSourceNode.buffer = audioBuffer;

                        expect(audioBufferSourceNode.buffer).to.equal(audioBuffer);
                    });

                });

                describe('with a previously assigned AudioBuffer', () => {

                    beforeEach(() => {
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
                 * @todo it('should return an instance of the AudioParam interface', () => {
                 * @todo     // @todo cancelAndHoldAtTime
                 * @todo     expect(audioBufferSourceNode.detune.cancelScheduledValues).to.be.a('function');
                 * @todo     expect(audioBufferSourceNode.detune.defaultValue).to.equal(0);
                 * @todo     expect(audioBufferSourceNode.detune.exponentialRampToValueAtTime).to.be.a('function');
                 * @todo     expect(audioBufferSourceNode.detune.linearRampToValueAtTime).to.be.a('function');
                 * @todo     expect(audioBufferSourceNode.detune.maxValue).to.equal(3.4028234663852886e38);
                 * @todo     expect(audioBufferSourceNode.detune.minValue).to.equal(-3.4028234663852886e38);
                 * @todo     expect(audioBufferSourceNode.detune.setTargetAtTime).to.be.a('function');
                 * @todo     // @todo setValueAtTime
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
                 * @todo describe('automation', () => {
                 * @todo
                 * @todo     let renderer;
                 * @todo
                 * @todo     beforeEach(() => {
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
                 * @todo             this.timeout(5000);
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
                 * @todo             this.timeout(5000);
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
                 * @todo             this.timeout(5000);
                 * @todo
                 * @todo             return renderer({
                 * @todo                 start (startTime, { audioBufferSourceNode }) {
                 * @todo                     audioBufferSourceNode.offset.setValueAtTime(0.5, startTime + (2 / context.sampleRate));
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
                 * @todo             this.timeout(5000);
                 * @todo
                 * @todo             return renderer({
                 * @todo                 start (startTime, { audioBufferSourceNode }) {
                 * @todo                     audioBufferSourceNode.offset.setValueCurveAtTime(new Float32Array([ 0, 0.25, 0.5, 0.75, 1 ]), startTime, startTime + (5 / context.sampleRate));
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
                 * @todo             this.timeout(5000);
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

            describe('onended', () => {

                let audioBufferSourceNode;

                beforeEach(() => {
                    audioBufferSourceNode = createAudioBufferSourceNode(context, {
                        buffer: new AudioBuffer({ length: 5, sampleRate: context.sampleRate })
                    });
                });

                it('should fire an assigned ended event listener', (done) => {
                    audioBufferSourceNode.onended = (event) => {
                        expect(event).to.be.an.instanceOf(Event);
                        expect(event.type).to.equal('ended');

                        done();
                    };

                    audioBufferSourceNode.connect(context.destination);

                    audioBufferSourceNode.start();

                    if (context.startRendering !== undefined) {
                        context.startRendering();
                    }
                });

            });

            describe('playbackRate', () => {

                let audioBufferSourceNode;

                beforeEach(() => {
                    audioBufferSourceNode = createAudioBufferSourceNode(context);
                });

                it('should return an instance of the AudioParam interface', () => {
                    // @todo cancelAndHoldAtTime
                    expect(audioBufferSourceNode.playbackRate.cancelScheduledValues).to.be.a('function');
                    expect(audioBufferSourceNode.playbackRate.defaultValue).to.equal(1);
                    expect(audioBufferSourceNode.playbackRate.exponentialRampToValueAtTime).to.be.a('function');
                    expect(audioBufferSourceNode.playbackRate.linearRampToValueAtTime).to.be.a('function');
                    expect(audioBufferSourceNode.playbackRate.maxValue).to.equal(3.4028234663852886e38);
                    expect(audioBufferSourceNode.playbackRate.minValue).to.equal(-3.4028234663852886e38);
                    expect(audioBufferSourceNode.playbackRate.setTargetAtTime).to.be.a('function');
                    // @todo setValueAtTime
                    expect(audioBufferSourceNode.playbackRate.setValueCurveAtTime).to.be.a('function');
                    expect(audioBufferSourceNode.playbackRate.value).to.equal(1);
                });

                it('should be readonly', () => {
                    expect(() => {
                        audioBufferSourceNode.playbackRate = 'anything';
                    }).to.throw(TypeError);
                });

                // @todo animation

            });

            describe('addEventListener()', () => {

                let audioBufferSourceNode;

                beforeEach(() => {
                    audioBufferSourceNode = createAudioBufferSourceNode(context, {
                        buffer: new AudioBuffer({ length: 5, sampleRate: context.sampleRate })
                    });
                });

                it('should fire a registered ended event listener', (done) => {
                    audioBufferSourceNode.addEventListener('ended', (event) => {
                        expect(event).to.be.an.instanceOf(Event);
                        expect(event.type).to.equal('ended');

                        done();
                    });

                    audioBufferSourceNode.connect(context.destination);

                    audioBufferSourceNode.start();

                    if (context.startRendering !== undefined) {
                        context.startRendering();
                    }
                });

            });

            describe('connect()', () => {

                let audioBufferSourceNode;

                beforeEach(() => {
                    audioBufferSourceNode = createAudioBufferSourceNode(context);
                });

                it('should be chainable', () => {
                    const gainNode = new GainNode(context);

                    expect(audioBufferSourceNode.connect(gainNode)).to.equal(gainNode);
                });

                it('should not be connectable to an AudioNode of another AudioContext', (done) => {
                    const anotherContext = createContext();

                    try {
                        audioBufferSourceNode.connect(anotherContext.destination);
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
                        audioBufferSourceNode.connect(gainNode.gain);
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
                        audioBufferSourceNode.connect(gainNode.gain, -1);
                    } catch (err) {
                        expect(err.code).to.equal(1);
                        expect(err.name).to.equal('IndexSizeError');

                        done();
                    }
                });

            });

            describe('disconnect()', () => {

                let renderer;
                let values;

                beforeEach(() => {
                    values = [ 1, 1, 1, 1, 1 ];

                    renderer = createRenderer({
                        context,
                        length: (context.length === undefined) ? 5 : undefined,
                        prepare (destination) {
                            const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                            const audioBufferSourceNode = createAudioBufferSourceNode(context);
                            const firstDummyGainNode = new GainNode(context);
                            const secondDummyGainNode = new GainNode(context);

                            audioBuffer.copyToChannel(new Float32Array(values), 0);

                            audioBufferSourceNode.buffer = audioBuffer;

                            audioBufferSourceNode
                                .connect(firstDummyGainNode)
                                .connect(destination);

                            audioBufferSourceNode.connect(secondDummyGainNode);

                            return { audioBufferSourceNode, firstDummyGainNode, secondDummyGainNode };
                        }
                    });
                });

                it('should be possible to disconnect a destination', function () {
                    this.timeout(5000);

                    return renderer({
                        prepare ({ audioBufferSourceNode, firstDummyGainNode }) {
                            audioBufferSourceNode.disconnect(firstDummyGainNode);
                        },
                        start (startTime, { audioBufferSourceNode }) {
                            audioBufferSourceNode.start(startTime);
                        }
                    })
                        .then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                        });
                });

                it('should be possible to disconnect another destination in isolation', function () {
                    this.timeout(5000);

                    return renderer({
                        prepare ({ audioBufferSourceNode, secondDummyGainNode }) {
                            audioBufferSourceNode.disconnect(secondDummyGainNode);
                        },
                        start (startTime, { audioBufferSourceNode }) {
                            audioBufferSourceNode.start(startTime);
                        }
                    })
                        .then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal(values);
                        });
                });

                it('should be possible to disconnect all destinations', function () {
                    this.timeout(5000);

                    return renderer({
                        prepare ({ audioBufferSourceNode }) {
                            audioBufferSourceNode.disconnect();
                        },
                        start (startTime, { audioBufferSourceNode }) {
                            audioBufferSourceNode.start(startTime);
                        }
                    })
                        .then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
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

                    if (context.startRendering !== undefined) {
                        context.startRendering();
                    }
                });

            });

            describe('start()', () => {

                let audioBufferSourceNode;

                beforeEach(() => {
                    audioBufferSourceNode = createAudioBufferSourceNode(context);
                });

                describe('with a previous call to start()', () => {

                    beforeEach(() => {
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

                    beforeEach(() => {
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

                    it('should throw an RangeError', () => {
                        expect(() => {
                            audioBufferSourceNode.start(-1);
                        }).to.throw(RangeError);
                    });

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

                    for (const withAnAppendedAudioWorklet of (description.includes('Offline') ? [ true, false ] : [ false ])) {

                        describe(`${ withAnAppendedAudioWorklet ? 'with' : 'without' } an appended AudioWorklet`, () => {

                            let renderer;

                            beforeEach(() => {
                                renderer = createRenderer({
                                    context,
                                    length: (context.length === undefined) ? 5 : undefined,
                                    prepare: async (destination) => {
                                        if (withAnAppendedAudioWorklet) {
                                            await addAudioWorkletModule(context, 'base/test/fixtures/gain-processor.js');
                                        }

                                        const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });

                                        audioBuffer.copyToChannel(new Float32Array([ 1, 1, 1, 1, 1 ]), 0);

                                        const audioBufferSourceNode = createAudioBufferSourceNode(context, { buffer: audioBuffer });
                                        const audioWorkletNode = (withAnAppendedAudioWorklet) ? new AudioWorkletNode(context, 'gain-processor') : null;

                                        if (withAnAppendedAudioWorklet) {
                                            audioBufferSourceNode
                                                .connect(audioWorkletNode)
                                                .connect(destination);
                                        } else {
                                            audioBufferSourceNode.connect(destination);
                                        }

                                        return { audioBufferSourceNode };
                                    }
                                });
                            });

                            it('should apply the values from the last invocation', function () {
                                this.timeout(5000);

                                return renderer({
                                    start (startTime, { audioBufferSourceNode }) {
                                        audioBufferSourceNode.start(startTime);
                                        audioBufferSourceNode.stop(startTime + (5 / context.sampleRate));
                                        audioBufferSourceNode.stop(startTime + (3 / context.sampleRate));
                                    }
                                })
                                    .then((channelData) => {
                                        expect(Array.from(channelData)).to.deep.equal([ 1, 1, 1, 0, 0 ]);
                                    });
                            });

                        });

                    }

                });

                describe('with a stop time reached prior to the start time', () => {

                    for (const withAnAppendedAudioWorklet of (description.includes('Offline') ? [ true, false ] : [ false ])) {

                        describe(`${ withAnAppendedAudioWorklet ? 'with' : 'without' } an appended AudioWorklet`, () => {

                            let renderer;

                            beforeEach(() => {
                                renderer = createRenderer({
                                    context,
                                    length: (context.length === undefined) ? 5 : undefined,
                                    prepare: async (destination) => {
                                        if (withAnAppendedAudioWorklet) {
                                            await addAudioWorkletModule(context, 'base/test/fixtures/gain-processor.js');
                                        }

                                        const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });

                                        audioBuffer.copyToChannel(new Float32Array([ 1, 1, 1, 1, 1 ]), 0);

                                        const audioBufferSourceNode = createAudioBufferSourceNode(context, { buffer: audioBuffer });
                                        const audioWorkletNode = (withAnAppendedAudioWorklet) ? new AudioWorkletNode(context, 'gain-processor') : null;

                                        if (withAnAppendedAudioWorklet) {
                                            audioBufferSourceNode
                                                .connect(audioWorkletNode)
                                                .connect(destination);
                                        } else {
                                            audioBufferSourceNode.connect(destination);
                                        }

                                        return { audioBufferSourceNode };
                                    }
                                });
                            });

                            it('should not play anything', function () {
                                this.timeout(5000);

                                return renderer({
                                    start (startTime, { audioBufferSourceNode }) {
                                        audioBufferSourceNode.start(startTime + (3 / context.sampleRate));
                                        audioBufferSourceNode.stop(startTime + (1 / context.sampleRate));
                                    }
                                })
                                    .then((channelData) => {
                                        expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
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

                        if (context.startRendering !== undefined) {
                            context.startRendering();
                        }
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

                    it('should throw an RangeError', () => {
                        expect(() => {
                            audioBufferSourceNode.stop(-1);
                        }).to.throw(RangeError);
                    });

                });

            });

        });

    }

});
