import { AudioWorkletNode, GainNode, OscillatorNode } from '../../../src/module';
import { addAudioWorkletModule } from '../../../src/add-audio-worklet-module';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';
import { spy } from 'sinon';

const createOscillatorNodeWithConstructor = (context, options = null) => {
    if (options === null) {
        return new OscillatorNode(context);
    }

    return new OscillatorNode(context, options);
};
const createOscillatorNodeWithFactoryFunction = (context, options = null) => {
    const oscillatorNode = context.createOscillator();

    if (options !== null && options.channelCount !== undefined) {
        oscillatorNode.channelCount = options.channelCount;
    }

    if (options !== null && options.channelCountMode !== undefined) {
        oscillatorNode.channelCountMode = options.channelCountMode;
    }

    if (options !== null && options.channelInterpretation !== undefined) {
        oscillatorNode.channelInterpretation = options.channelInterpretation;
    }

    if (options !== null && options.detune !== undefined) {
        oscillatorNode.detune.value = options.detune;
    }

    if (options !== null && options.frequency !== undefined) {
        oscillatorNode.frequency.value = options.frequency;
    }

    if (options !== null && options.type !== undefined) {
        oscillatorNode.type = options.type;
    }

    return oscillatorNode;
};
const testCases = {
    'constructor with AudioContext': {
        createContext: createAudioContext,
        createOscillatorNode: createOscillatorNodeWithConstructor
    },
    'constructor with MinimalAudioContext': {
        createContext: createMinimalAudioContext,
        createOscillatorNode: createOscillatorNodeWithConstructor
    },
    'constructor with MinimalOfflineAudioContext': {
        createContext: createMinimalOfflineAudioContext,
        createOscillatorNode: createOscillatorNodeWithConstructor
    },
    'constructor with OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createOscillatorNode: createOscillatorNodeWithConstructor
    },
    'factory function of AudioContext': {
        createContext: createAudioContext,
        createOscillatorNode: createOscillatorNodeWithFactoryFunction
    },
    'factory function of OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createOscillatorNode: createOscillatorNodeWithFactoryFunction
    }
};

// @todo Skip about 50% of the test cases in Firefox and Safari to prevent the browsers from crashing while running the tests.
if ((!/Chrome/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent)) || /Firefox/.test(navigator.userAgent)) {
    for (const description of Object.keys(testCases)) {
        if (Math.random() < 0.5) {
            delete testCases[ description ];
        }
    }
}

describe('OscillatorNode', () => {

    for (const [ description, { createOscillatorNode, createContext } ] of Object.entries(testCases)) {

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

                    let oscillatorNode;

                    beforeEach(() => {
                        oscillatorNode = createOscillatorNode(context);
                    });

                    it('should return an instance of the EventTarget interface', () => {
                        expect(oscillatorNode.addEventListener).to.be.a('function');
                        expect(oscillatorNode.dispatchEvent).to.be.a('function');
                        expect(oscillatorNode.removeEventListener).to.be.a('function');
                    });

                    it('should return an instance of the AudioNode interface', () => {
                        expect(oscillatorNode.channelCount).to.equal(2);
                        expect(oscillatorNode.channelCountMode).to.equal('max');
                        expect(oscillatorNode.channelInterpretation).to.equal('speakers');
                        expect(oscillatorNode.connect).to.be.a('function');
                        expect(oscillatorNode.context).to.be.an.instanceOf(context.constructor);
                        expect(oscillatorNode.disconnect).to.be.a('function');
                        expect(oscillatorNode.numberOfInputs).to.equal(0);
                        expect(oscillatorNode.numberOfOutputs).to.equal(1);
                    });

                    it('should return an instance of the AudioScheduledSourceNode interface', () => {
                        expect(oscillatorNode.onended).to.be.null;
                        expect(oscillatorNode.start).to.be.a('function');
                        expect(oscillatorNode.stop).to.be.a('function');
                    });

                    it('should return an instance of the ConstantSourceNode interface', () => {
                        expect(oscillatorNode.detune).not.to.be.undefined;
                        expect(oscillatorNode.frequency).not.to.be.undefined;
                        expect(oscillatorNode.setPeriodicWave).to.be.a('function');
                        expect(oscillatorNode.type).to.equal('sine');
                    });

                    it('should throw an error if the AudioContext is closed', (done) => {
                        ((context.close === undefined) ? context.startRendering() : context.close())
                            .then(() => createOscillatorNode(context))
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
                        const oscillatorNode = createOscillatorNode(context, { channelCount });

                        expect(oscillatorNode.channelCount).to.equal(channelCount);
                    });

                    it('should return an instance with the given channelCountMode', () => {
                        const channelCountMode = 'explicit';
                        const oscillatorNode = createOscillatorNode(context, { channelCountMode });

                        expect(oscillatorNode.channelCountMode).to.equal(channelCountMode);
                    });

                    it('should return an instance with the given channelInterpretation', () => {
                        const channelInterpretation = 'discrete';
                        const oscillatorNode = createOscillatorNode(context, { channelInterpretation });

                        expect(oscillatorNode.channelInterpretation).to.equal(channelInterpretation);
                    });

                    it('should return an instance with the given initial value for detune', () => {
                        const detune = 0.5;
                        const oscillatorNode = createOscillatorNode(context, { detune });

                        expect(oscillatorNode.detune.value).to.equal(detune);
                    });

                    it('should return an instance with the given initial value for frequency', () => {
                        const frequency = 500;
                        const oscillatorNode = createOscillatorNode(context, { frequency });

                        expect(oscillatorNode.frequency.value).to.equal(frequency);
                    });

                    it('should return an instance with the given periodicWave', () => {

                        // @todo

                    });

                    it('should return an instance with the given type', () => {
                        const type = 'triangle';
                        const oscillatorNode = createOscillatorNode(context, { type });

                        expect(oscillatorNode.type).to.equal(type);
                    });

                });

            });

            describe('channelCount', () => {

                let oscillatorNode;

                beforeEach(() => {
                    oscillatorNode = createOscillatorNode(context);
                });

                it('should be assignable to another value', () => {
                    const channelCount = 4;

                    oscillatorNode.channelCount = channelCount;

                    expect(oscillatorNode.channelCount).to.equal(channelCount);
                });

            });

            describe('channelCountMode', () => {

                let oscillatorNode;

                beforeEach(() => {
                    oscillatorNode = createOscillatorNode(context);
                });

                it('should be assignable to another value', () => {
                    const channelCountMode = 'explicit';

                    oscillatorNode.channelCountMode = channelCountMode;

                    expect(oscillatorNode.channelCountMode).to.equal(channelCountMode);
                });

            });

            describe('channelInterpretation', () => {

                let oscillatorNode;

                beforeEach(() => {
                    oscillatorNode = createOscillatorNode(context);
                });

                it('should be assignable to another value', () => {
                    const channelInterpretation = 'discrete';

                    oscillatorNode.channelInterpretation = channelInterpretation;

                    expect(oscillatorNode.channelInterpretation).to.equal(channelInterpretation);
                });

            });

            describe('detune', () => {

                let oscillatorNode;

                beforeEach(() => {
                    oscillatorNode = createOscillatorNode(context);
                });

                it('should return an instance of the AudioParam interface', () => {
                    expect(oscillatorNode.detune.cancelScheduledValues).to.be.a('function');
                    expect(oscillatorNode.detune.defaultValue).to.equal(0);
                    expect(oscillatorNode.detune.exponentialRampToValueAtTime).to.be.a('function');
                    expect(oscillatorNode.detune.linearRampToValueAtTime).to.be.a('function');
                    expect(oscillatorNode.detune.maxValue).to.equal(3.4028234663852886e38);
                    expect(oscillatorNode.detune.minValue).to.equal(-3.4028234663852886e38);
                    expect(oscillatorNode.detune.setTargetAtTime).to.be.a('function');
                    expect(oscillatorNode.detune.setValueAtTime).to.be.a('function');
                    expect(oscillatorNode.detune.setValueCurveAtTime).to.be.a('function');
                    expect(oscillatorNode.detune.value).to.equal(0);
                });

                it('should be readonly', () => {
                    expect(() => {
                        oscillatorNode.detune = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelScheduledValues()', () => {

                    it('should be chainable', () => {
                        expect(oscillatorNode.detune.cancelScheduledValues(0)).to.equal(oscillatorNode.detune);
                    });

                });

                describe('exponentialRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        // @todo Firefox can't schedule an exponential ramp when the value is 0.
                        oscillatorNode.detune.value = 1;

                        expect(oscillatorNode.detune.exponentialRampToValueAtTime(1, 0)).to.equal(oscillatorNode.detune);
                    });

                });

                describe('linearRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(oscillatorNode.detune.linearRampToValueAtTime(1, 0)).to.equal(oscillatorNode.detune);
                    });

                });

                describe('setTargetAtTime()', () => {

                    it('should be chainable', () => {
                        expect(oscillatorNode.detune.setTargetAtTime(1, 0, 0.1)).to.equal(oscillatorNode.detune);
                    });

                });

                describe('setValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(oscillatorNode.detune.setValueAtTime(1, 0)).to.equal(oscillatorNode.detune);
                    });

                });

                describe('setValueCurveAtTime()', () => {

                    it('should be chainable', () => {
                        expect(oscillatorNode.detune.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(oscillatorNode.detune);
                    });

                });

                // @todo automation

            });

            describe('frequency', () => {

                let oscillatorNode;

                beforeEach(() => {
                    oscillatorNode = createOscillatorNode(context);
                });

                it('should return an instance of the AudioParam interface', () => {
                    expect(oscillatorNode.frequency.cancelScheduledValues).to.be.a('function');
                    expect(oscillatorNode.frequency.defaultValue).to.equal(440);
                    expect(oscillatorNode.frequency.exponentialRampToValueAtTime).to.be.a('function');
                    expect(oscillatorNode.frequency.linearRampToValueAtTime).to.be.a('function');
                    expect(oscillatorNode.frequency.maxValue).to.equal(context.sampleRate / 2);
                    expect(oscillatorNode.frequency.minValue).to.equal(-(context.sampleRate / 2));
                    expect(oscillatorNode.frequency.setTargetAtTime).to.be.a('function');
                    expect(oscillatorNode.frequency.setValueAtTime).to.be.a('function');
                    expect(oscillatorNode.frequency.setValueCurveAtTime).to.be.a('function');
                    expect(oscillatorNode.frequency.value).to.equal(440);
                });

                it('should be readonly', () => {
                    expect(() => {
                        oscillatorNode.frequency = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelScheduledValues()', () => {

                    it('should be chainable', () => {
                        expect(oscillatorNode.frequency.cancelScheduledValues(0)).to.equal(oscillatorNode.frequency);
                    });

                });

                describe('exponentialRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(oscillatorNode.frequency.exponentialRampToValueAtTime(1, 0)).to.equal(oscillatorNode.frequency);
                    });

                });

                describe('linearRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(oscillatorNode.frequency.linearRampToValueAtTime(1, 0)).to.equal(oscillatorNode.frequency);
                    });

                });

                describe('setTargetAtTime()', () => {

                    it('should be chainable', () => {
                        expect(oscillatorNode.frequency.setTargetAtTime(1, 0, 0.1)).to.equal(oscillatorNode.frequency);
                    });

                });

                describe('setValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(oscillatorNode.frequency.setValueAtTime(1, 0)).to.equal(oscillatorNode.frequency);
                    });

                });

                describe('setValueCurveAtTime()', () => {

                    it('should be chainable', () => {
                        expect(oscillatorNode.frequency.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(oscillatorNode.frequency);
                    });

                });

                // @todo automation

            });

            describe('onended', () => {

                let oscillatorNode;

                beforeEach(() => {
                    oscillatorNode = createOscillatorNode(context);
                });

                it('should fire an assigned ended event listener', (done) => {
                    oscillatorNode.onended = (event) => {
                        expect(event).to.be.an.instanceOf(Event);
                        expect(event.type).to.equal('ended');

                        done();
                    };

                    oscillatorNode.connect(context.destination);

                    oscillatorNode.start();
                    oscillatorNode.stop();

                    if (context.startRendering !== undefined) {
                        context.startRendering();
                    }
                });

            });

            describe('type', () => {

                let oscillatorNode;

                beforeEach(() => {
                    oscillatorNode = createOscillatorNode(context);
                });

                it("should be assignable to another type but 'custom'", () => {
                    const type = oscillatorNode.type = 'square'; // eslint-disable-line no-multi-assign

                    expect(type).to.equal('square');
                    expect(oscillatorNode.type).to.equal('square');
                });

                it("should not be assignable to the type 'custom'", (done) => {
                    try {
                        oscillatorNode.type = 'custom';
                    } catch (err) {
                        expect(err.code).to.equal(11);
                        expect(err.name).to.equal('InvalidStateError');

                        done();
                    }
                });

                it('should not be assignable to something else', () => {
                    const string = 'none of the accepted types';
                    const type = oscillatorNode.type = string; // eslint-disable-line no-multi-assign

                    expect(type).to.equal(string);
                    expect(oscillatorNode.type).to.equal('sine');
                });

            });

            describe('addEventListener()', () => {

                let oscillatorNode;

                beforeEach(() => {
                    oscillatorNode = createOscillatorNode(context);
                });

                it('should fire a registered ended event listener', (done) => {
                    oscillatorNode.addEventListener('ended', (event) => {
                        expect(event).to.be.an.instanceOf(Event);
                        expect(event.type).to.equal('ended');

                        done();
                    });

                    oscillatorNode.connect(context.destination);

                    oscillatorNode.start();
                    oscillatorNode.stop();

                    if (context.startRendering !== undefined) {
                        context.startRendering();
                    }
                });

            });

            describe('connect()', () => {

                let oscillatorNode;

                beforeEach(() => {
                    oscillatorNode = createOscillatorNode(context);
                });

                it('should be chainable', () => {
                    const gainNode = new GainNode(context);

                    expect(oscillatorNode.connect(gainNode)).to.equal(gainNode);
                });

                it('should not be connectable to an AudioNode of another AudioContext', (done) => {
                    const anotherContext = createContext();

                    try {
                        oscillatorNode.connect(anotherContext.destination);
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
                        oscillatorNode.connect(gainNode.gain);
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
                        oscillatorNode.connect(gainNode.gain, -1);
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
                            const firstDummyGainNode = new GainNode(context);
                            const oscillatorNode = createOscillatorNode(context, { frequency: 11025 });
                            const secondDummyGainNode = new GainNode(context);

                            oscillatorNode
                                .connect(firstDummyGainNode)
                                .connect(destination);

                            oscillatorNode.connect(secondDummyGainNode);

                            return { firstDummyGainNode, oscillatorNode, secondDummyGainNode };
                        }
                    });
                });

                it('should be possible to disconnect a destination', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ firstDummyGainNode, oscillatorNode }) {
                            oscillatorNode.disconnect(firstDummyGainNode);
                        },
                        start (startTime, { oscillatorNode }) {
                            oscillatorNode.start(startTime);
                        }
                    })
                        .then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                        });
                });

                it('should be possible to disconnect another destination in isolation', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ oscillatorNode, secondDummyGainNode }) {
                            oscillatorNode.disconnect(secondDummyGainNode);
                        },
                        start (startTime, { oscillatorNode }) {
                            oscillatorNode.start(startTime);
                        }
                    })
                        .then((channelData) => {
                            expect(channelData[0]).to.equal(0);
                            expect(channelData[1]).to.equal(1);
                            expect(channelData[2]).to.be.closeTo(0, 0.000001);
                            expect(channelData[3]).to.equal(-1);
                            expect(channelData[4]).to.be.closeTo(0, 0.000001);
                        });
                });

                it('should be possible to disconnect all destinations', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ oscillatorNode }) {
                            oscillatorNode.disconnect();
                        },
                        start (startTime, { oscillatorNode }) {
                            oscillatorNode.start(startTime);
                        }
                    })
                        .then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                        });
                });

            });

            describe('removeEventListener()', () => {

                let oscillatorNode;

                beforeEach(() => {
                    oscillatorNode = createOscillatorNode(context);
                });

                it('should not fire a removed ended event listener', (done) => {
                    const listener = spy();

                    oscillatorNode.addEventListener('ended', listener);
                    oscillatorNode.removeEventListener('ended', listener);

                    oscillatorNode.connect(context.destination);

                    oscillatorNode.start();
                    oscillatorNode.stop();

                    setTimeout(() => {
                        expect(listener).to.have.not.been.called;

                        done();
                    }, 500);

                    if (context.startRendering !== undefined) {
                        context.startRendering();
                    }
                });

            });

            describe('setPeriodicWave()', () => {

                // @todo

            });

            describe('start()', () => {

                let oscillatorNode;

                beforeEach(() => {
                    oscillatorNode = createOscillatorNode(context);
                });

                describe('with a previous call to start()', () => {

                    beforeEach(() => {
                        oscillatorNode.start();
                    });

                    it('should throw an InvalidStateError', (done) => {
                        try {
                            oscillatorNode.start();
                        } catch (err) {
                            expect(err.code).to.equal(11);
                            expect(err.name).to.equal('InvalidStateError');

                            done();
                        }
                    });

                });

                describe('with a previous call to stop()', () => {

                    beforeEach(() => {
                        oscillatorNode.start();
                        oscillatorNode.stop();
                    });

                    it('should throw an InvalidStateError', (done) => {
                        try {
                            oscillatorNode.start();
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
                            oscillatorNode.start(-1);
                        }).to.throw(RangeError);
                    });

                });

            });

            describe('stop()', () => {

                describe('without a previous call to start()', () => {

                    let oscillatorNode;

                    beforeEach(() => {
                        oscillatorNode = createOscillatorNode(context);
                    });

                    it('should throw an InvalidStateError', (done) => {
                        try {
                            oscillatorNode.stop();
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

                            beforeEach(async () => {
                                if (withAnAppendedAudioWorklet) {
                                    await addAudioWorkletModule(context, 'base/test/fixtures/gain-processor.js');
                                }

                                renderer = createRenderer({
                                    context,
                                    length: (context.length === undefined) ? 5 : undefined,
                                    prepare (destination) {
                                        const audioWorkletNode = (withAnAppendedAudioWorklet) ? new AudioWorkletNode(context, 'gain-processor') : null;
                                        const oscillatorNode = createOscillatorNode(context, { frequency: 11025 });

                                        if (withAnAppendedAudioWorklet) {
                                            oscillatorNode
                                                .connect(audioWorkletNode)
                                                .connect(destination);
                                        } else {
                                            oscillatorNode.connect(destination);
                                        }

                                        return { oscillatorNode };
                                    }
                                });
                            });

                            it('should apply the values from the last invocation', function () {
                                this.timeout(10000);

                                return renderer({
                                    start (startTime, { oscillatorNode }) {
                                        oscillatorNode.start(startTime);
                                        oscillatorNode.stop(startTime + (5 / context.sampleRate));
                                        oscillatorNode.stop(startTime + (3 / context.sampleRate));
                                    }
                                })
                                    .then((channelData) => {
                                        expect(channelData[0]).to.equal(0);
                                        expect(channelData[1]).to.equal(1);
                                        expect(channelData[2]).to.be.closeTo(0, 0.000001);
                                        expect(channelData[3]).to.equal(0);
                                        expect(channelData[4]).to.equal(0);
                                    });
                            });

                        });

                    }

                });

                describe('with a stop time reached prior to the start time', () => {

                    for (const withAnAppendedAudioWorklet of (description.includes('Offline') ? [ true, false ] : [ false ])) {

                        describe(`${ withAnAppendedAudioWorklet ? 'with' : 'without' } an appended AudioWorklet`, () => {

                            let renderer;

                            beforeEach(async () => {
                                if (withAnAppendedAudioWorklet) {
                                    await addAudioWorkletModule(context, 'base/test/fixtures/gain-processor.js');
                                }

                                renderer = createRenderer({
                                    context,
                                    length: (context.length === undefined) ? 5 : undefined,
                                    prepare (destination) {
                                        const audioWorkletNode = (withAnAppendedAudioWorklet) ? new AudioWorkletNode(context, 'gain-processor') : null;
                                        const oscillatorNode = createOscillatorNode(context);

                                        if (withAnAppendedAudioWorklet) {
                                            oscillatorNode
                                                .connect(audioWorkletNode)
                                                .connect(destination);
                                        } else {
                                            oscillatorNode.connect(destination);
                                        }

                                        return { oscillatorNode };
                                    }
                                });
                            });

                            it('should not play anything', function () {
                                this.timeout(10000);

                                return renderer({
                                    start (startTime, { oscillatorNode }) {
                                        oscillatorNode.start(startTime + (3 / context.sampleRate));
                                        oscillatorNode.stop(startTime + (1 / context.sampleRate));
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

                    let oscillatorNode;

                    beforeEach((done) => {
                        oscillatorNode = createOscillatorNode(context);

                        oscillatorNode.onended = () => done();

                        oscillatorNode.connect(context.destination);

                        oscillatorNode.start();
                        oscillatorNode.stop();

                        if (context.startRendering !== undefined) {
                            context.startRendering();
                        }
                    });

                    it('should ignore calls to stop()', () => {
                        oscillatorNode.stop();
                    });

                });

                describe('with a negative value as first parameter', () => {

                    let oscillatorNode;

                    beforeEach(() => {
                        oscillatorNode = createOscillatorNode(context);

                        oscillatorNode.start();
                    });

                    it('should throw an RangeError', () => {
                        expect(() => {
                            oscillatorNode.stop(-1);
                        }).to.throw(RangeError);
                    });

                });

            });

        });

    }

});
