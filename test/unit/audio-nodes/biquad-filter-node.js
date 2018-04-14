import { AudioBuffer, AudioBufferSourceNode, BiquadFilterNode, GainNode } from '../../../src/module';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';

const createBiquadFilterNodeWithConstructor = (context, options = null) => {
    if (options === null) {
        return new BiquadFilterNode(context);
    }

    return new BiquadFilterNode(context, options);
};
const createBiquadFilterNodeWithFactoryFunction = (context, options = null) => {
    const biquadFilterNode = context.createBiquadFilter();

    if (options !== null && options.channelCount !== undefined) {
        biquadFilterNode.channelCount = options.channelCount;
    }

    if (options !== null && options.channelCountMode !== undefined) {
        biquadFilterNode.channelCountMode = options.channelCountMode;
    }

    if (options !== null && options.channelInterpretation !== undefined) {
        biquadFilterNode.channelInterpretation = options.channelInterpretation;
    }

    if (options !== null && options.detune !== undefined) {
        biquadFilterNode.detune.value = options.detune;
    }

    if (options !== null && options.frequency !== undefined) {
        biquadFilterNode.frequency.value = options.frequency;
    }

    if (options !== null && options.gain !== undefined) {
        biquadFilterNode.gain.value = options.gain;
    }

    if (options !== null && options.type !== undefined) {
        biquadFilterNode.type = options.type;
    }

    if (options !== null && options.Q !== undefined) {
        biquadFilterNode.Q.value = options.Q;
    }

    return biquadFilterNode;
};
const testCases = {
    'constructor with AudioContext': {
        createBiquadFilterNode: createBiquadFilterNodeWithConstructor,
        createContext: createAudioContext
    },
    'constructor with MinimalAudioContext': {
        createBiquadFilterNode: createBiquadFilterNodeWithConstructor,
        createContext: createMinimalAudioContext
    },
    'constructor with MinimalOfflineAudioContext': {
        createBiquadFilterNode: createBiquadFilterNodeWithConstructor,
        createContext: createMinimalOfflineAudioContext
    },
    'constructor with OfflineAudioContext': {
        createBiquadFilterNode: createBiquadFilterNodeWithConstructor,
        createContext: createOfflineAudioContext
    },
    'factory function of AudioContext': {
        createBiquadFilterNode: createBiquadFilterNodeWithFactoryFunction,
        createContext: createAudioContext
    },
    'factory function of OfflineAudioContext': {
        createBiquadFilterNode: createBiquadFilterNodeWithFactoryFunction,
        createContext: createOfflineAudioContext
    }
};

// @todo Skip about 50% of the test cases in Safari to prevent the browser from crashing while running the tests.
if (!/Chrome/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent)) {
    for (const description of Object.keys(testCases)) {
        if (Math.random() < 0.5) {
            delete testCases[ description ];
        }
    }
}

describe('BiquadFilterNode', () => {

    for (const [ description, { createBiquadFilterNode, createContext } ] of Object.entries(testCases)) {

        describe(`with ${ description }`, () => {

            let context;

            afterEach(() => {
                if (context.close !== undefined) {
                    return context.close();
                }
            });

            beforeEach(() => {
                context = createContext();
            });

            describe('constructor()', () => {

                describe('without any options', () => {

                    let biquadFilterNode;

                    beforeEach(() => {
                        biquadFilterNode = createBiquadFilterNode(context);
                    });

                    it('should return an instance of the EventTarget interface', () => {
                        expect(biquadFilterNode.addEventListener).to.be.a('function');
                        expect(biquadFilterNode.dispatchEvent).to.be.a('function');
                        expect(biquadFilterNode.removeEventListener).to.be.a('function');
                    });

                    it('should be an instance of the AudioNode interface', () => {
                        expect(biquadFilterNode.channelCount).to.equal(2);
                        expect(biquadFilterNode.channelCountMode).to.equal('max');
                        expect(biquadFilterNode.channelInterpretation).to.equal('speakers');
                        expect(biquadFilterNode.connect).to.be.a('function');
                        expect(biquadFilterNode.context).to.be.an.instanceOf(context.constructor);
                        expect(biquadFilterNode.disconnect).to.be.a('function');
                        expect(biquadFilterNode.numberOfInputs).to.equal(1);
                        expect(biquadFilterNode.numberOfOutputs).to.equal(1);
                    });

                    it('should return an instance of the BiquadFilterNode interface', () => {
                        expect(biquadFilterNode.detune).not.to.be.undefined;
                        expect(biquadFilterNode.frequency).not.to.be.undefined;
                        expect(biquadFilterNode.gain).not.to.be.undefined;
                        expect(biquadFilterNode.getFrequencyResponse).to.be.a('function');
                        expect(biquadFilterNode.Q).not.to.be.undefined;
                        expect(biquadFilterNode.type).to.be.a('string');
                    });

                    it('should throw an error if the AudioContext is closed', (done) => {
                        ((context.close === undefined) ? context.startRendering() : context.close())
                            .then(() => createBiquadFilterNode(context))
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
                        const biquadFilterNode = createBiquadFilterNode(context, { channelCount });

                        expect(biquadFilterNode.channelCount).to.equal(channelCount);
                    });

                    it('should return an instance with the given channelCountMode', () => {
                        const channelCountMode = 'explicit';
                        const biquadFilterNode = createBiquadFilterNode(context, { channelCountMode });

                        expect(biquadFilterNode.channelCountMode).to.equal(channelCountMode);
                    });

                    it('should return an instance with the given channelInterpretation', () => {
                        const channelInterpretation = 'discrete';
                        const biquadFilterNode = createBiquadFilterNode(context, { channelInterpretation });

                        expect(biquadFilterNode.channelInterpretation).to.equal(channelInterpretation);
                    });

                    it('should return an instance with the given initial value for detune', () => {
                        const detune = 0.5;
                        const biquadFilterNode = createBiquadFilterNode(context, { detune });

                        expect(biquadFilterNode.detune.value).to.equal(detune);
                    });

                    it('should return an instance with the given initial value for frequency', () => {
                        const frequency = 1000;
                        const biquadFilterNode = createBiquadFilterNode(context, { frequency });

                        expect(biquadFilterNode.frequency.value).to.equal(frequency);
                    });

                    it('should return an instance with the given initial value for gain', () => {
                        const gain = 0.5;
                        const biquadFilterNode = createBiquadFilterNode(context, { gain });

                        expect(biquadFilterNode.gain.value).to.equal(gain);
                    });

                    it('should return an instance with the given type', () => {
                        const type = 'peaking';
                        const biquadFilterNode = createBiquadFilterNode(context, { type });

                        expect(biquadFilterNode.type).to.equal(type);
                    });

                    it('should return an instance with the given initial value for Q', () => {
                        const Q = 2;
                        const biquadFilterNode = createBiquadFilterNode(context, { Q });

                        expect(biquadFilterNode.Q.value).to.equal(Q);
                    });

                });

            });

            describe('channelCount', () => {

                let biquadFilterNode;

                beforeEach(() => {
                    biquadFilterNode = createBiquadFilterNode(context);
                });

                it('should be assignable to another value', () => {
                    const channelCount = 4;

                    biquadFilterNode.channelCount = channelCount;

                    expect(biquadFilterNode.channelCount).to.equal(channelCount);
                });

            });

            describe('channelCountMode', () => {

                let biquadFilterNode;

                beforeEach(() => {
                    biquadFilterNode = createBiquadFilterNode(context);
                });

                it('should be assignable to another value', () => {
                    const channelCountMode = 'explicit';

                    biquadFilterNode.channelCountMode = channelCountMode;

                    expect(biquadFilterNode.channelCountMode).to.equal(channelCountMode);
                });

            });

            describe('channelInterpretation', () => {

                let biquadFilterNode;

                beforeEach(() => {
                    biquadFilterNode = createBiquadFilterNode(context);
                });

                it('should be assignable to another value', () => {
                    const channelInterpretation = 'discrete';

                    biquadFilterNode.channelInterpretation = channelInterpretation;

                    expect(biquadFilterNode.channelInterpretation).to.equal(channelInterpretation);
                });

            });

            describe('detune', () => {

                let biquadFilterNode;

                beforeEach(() => {
                    biquadFilterNode = createBiquadFilterNode(context);
                });

                it('should return an instance of the AudioParam interface', () => {
                    expect(biquadFilterNode.detune.cancelScheduledValues).to.be.a('function');
                    expect(biquadFilterNode.detune.defaultValue).to.equal(0);
                    expect(biquadFilterNode.detune.exponentialRampToValueAtTime).to.be.a('function');
                    expect(biquadFilterNode.detune.linearRampToValueAtTime).to.be.a('function');
                    expect(biquadFilterNode.detune.maxValue).to.equal(3.4028234663852886e38);
                    expect(biquadFilterNode.detune.minValue).to.equal(-3.4028234663852886e38);
                    expect(biquadFilterNode.detune.setTargetAtTime).to.be.a('function');
                    expect(biquadFilterNode.detune.setValueAtTime).to.be.a('function');
                    expect(biquadFilterNode.detune.setValueCurveAtTime).to.be.a('function');
                    expect(biquadFilterNode.detune.value).to.equal(0);
                });

                it('should be readonly', () => {
                    expect(() => {
                        biquadFilterNode.detune = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelScheduledValues()', () => {

                    it('should be chainable', () => {
                        expect(biquadFilterNode.detune.cancelScheduledValues(0)).to.equal(biquadFilterNode.detune);
                    });

                });

                describe('exponentialRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        // @todo Firefox can't schedule an exponential ramp when the value is 0.
                        biquadFilterNode.detune.value = 1;

                        expect(biquadFilterNode.detune.exponentialRampToValueAtTime(1, 0)).to.equal(biquadFilterNode.detune);
                    });

                });

                describe('linearRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(biquadFilterNode.detune.linearRampToValueAtTime(1, 0)).to.equal(biquadFilterNode.detune);
                    });

                });

                describe('setTargetAtTime()', () => {

                    it('should be chainable', () => {
                        expect(biquadFilterNode.detune.setTargetAtTime(1, 0, 0.1)).to.equal(biquadFilterNode.detune);
                    });

                });

                describe('setValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(biquadFilterNode.detune.setValueAtTime(1, 0)).to.equal(biquadFilterNode.detune);
                    });

                });

                describe('setValueCurveAtTime()', () => {

                    it('should be chainable', () => {
                        expect(biquadFilterNode.detune.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(biquadFilterNode.detune);
                    });

                });

                // @todo automation

            });

            describe('frequency', () => {

                let biquadFilterNode;

                beforeEach(() => {
                    biquadFilterNode = createBiquadFilterNode(context);
                });

                it('should return an instance of the AudioParam interface', () => {
                    expect(biquadFilterNode.frequency.cancelScheduledValues).to.be.a('function');
                    expect(biquadFilterNode.frequency.defaultValue).to.equal(350);
                    expect(biquadFilterNode.frequency.exponentialRampToValueAtTime).to.be.a('function');
                    expect(biquadFilterNode.frequency.linearRampToValueAtTime).to.be.a('function');
                    expect(biquadFilterNode.frequency.maxValue).to.equal(3.4028234663852886e38);
                    expect(biquadFilterNode.frequency.minValue).to.equal(-3.4028234663852886e38);
                    expect(biquadFilterNode.frequency.setTargetAtTime).to.be.a('function');
                    expect(biquadFilterNode.frequency.setValueAtTime).to.be.a('function');
                    expect(biquadFilterNode.frequency.setValueCurveAtTime).to.be.a('function');
                    expect(biquadFilterNode.frequency.value).to.equal(350);
                });

                it('should be readonly', () => {
                    expect(() => {
                        biquadFilterNode.frequency = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelScheduledValues()', () => {

                    it('should be chainable', () => {
                        expect(biquadFilterNode.frequency.cancelScheduledValues(0)).to.equal(biquadFilterNode.frequency);
                    });

                });

                describe('exponentialRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(biquadFilterNode.frequency.exponentialRampToValueAtTime(1, 0)).to.equal(biquadFilterNode.frequency);
                    });

                });

                describe('linearRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(biquadFilterNode.frequency.linearRampToValueAtTime(1, 0)).to.equal(biquadFilterNode.frequency);
                    });

                });

                describe('setTargetAtTime()', () => {

                    it('should be chainable', () => {
                        expect(biquadFilterNode.frequency.setTargetAtTime(1, 0, 0.1)).to.equal(biquadFilterNode.frequency);
                    });

                });

                describe('setValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(biquadFilterNode.frequency.setValueAtTime(1, 0)).to.equal(biquadFilterNode.frequency);
                    });

                });

                describe('setValueCurveAtTime()', () => {

                    it('should be chainable', () => {
                        expect(biquadFilterNode.frequency.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(biquadFilterNode.frequency);
                    });

                });

                // @todo automation

            });

            describe('gain', () => {

                let biquadFilterNode;

                beforeEach(() => {
                    biquadFilterNode = createBiquadFilterNode(context);
                });

                it('should return an instance of the AudioParam interface', () => {
                    expect(biquadFilterNode.gain.cancelScheduledValues).to.be.a('function');
                    expect(biquadFilterNode.gain.defaultValue).to.equal(0);
                    expect(biquadFilterNode.gain.exponentialRampToValueAtTime).to.be.a('function');
                    expect(biquadFilterNode.gain.linearRampToValueAtTime).to.be.a('function');
                    expect(biquadFilterNode.gain.maxValue).to.equal(3.4028234663852886e38);
                    expect(biquadFilterNode.gain.minValue).to.equal(-3.4028234663852886e38);
                    expect(biquadFilterNode.gain.setTargetAtTime).to.be.a('function');
                    expect(biquadFilterNode.gain.setValueAtTime).to.be.a('function');
                    expect(biquadFilterNode.gain.setValueCurveAtTime).to.be.a('function');
                    expect(biquadFilterNode.gain.value).to.equal(0);
                });

                it('should be readonly', () => {
                    expect(() => {
                        biquadFilterNode.gain = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelScheduledValues()', () => {

                    it('should be chainable', () => {
                        expect(biquadFilterNode.gain.cancelScheduledValues(0)).to.equal(biquadFilterNode.gain);
                    });

                });

                describe('exponentialRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        // @todo Firefox can't schedule an exponential ramp when the value is 0.
                        biquadFilterNode.gain.value = 1;

                        expect(biquadFilterNode.gain.exponentialRampToValueAtTime(1, 0)).to.equal(biquadFilterNode.gain);
                    });

                });

                describe('linearRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(biquadFilterNode.gain.linearRampToValueAtTime(1, 0)).to.equal(biquadFilterNode.gain);
                    });

                });

                describe('setTargetAtTime()', () => {

                    it('should be chainable', () => {
                        expect(biquadFilterNode.gain.setTargetAtTime(1, 0, 0.1)).to.equal(biquadFilterNode.gain);
                    });

                });

                describe('setValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(biquadFilterNode.gain.setValueAtTime(1, 0)).to.equal(biquadFilterNode.gain);
                    });

                });

                describe('setValueCurveAtTime()', () => {

                    it('should be chainable', () => {
                        expect(biquadFilterNode.gain.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(biquadFilterNode.gain);
                    });

                });

                // @todo automation

            });

            describe('type', () => {

                let biquadFilterNode;

                beforeEach(() => {
                    biquadFilterNode = createBiquadFilterNode(context);
                });

                it('should be assignable to another type', () => {
                    const type = biquadFilterNode.type = 'allpass'; // eslint-disable-line no-multi-assign

                    expect(type).to.equal('allpass');
                    expect(biquadFilterNode.type).to.equal('allpass');
                });

                it('should not be assignable to something else', () => {
                    const string = 'none of the accepted types';
                    const type = biquadFilterNode.type = string; // eslint-disable-line no-multi-assign

                    expect(type).to.equal(string);
                    expect(biquadFilterNode.type).to.equal('lowpass');
                });

            });

            describe('Q', () => {

                let biquadFilterNode;

                beforeEach(() => {
                    biquadFilterNode = createBiquadFilterNode(context);
                });

                it('should return an instance of the AudioParam interface', () => {
                    expect(biquadFilterNode.Q.cancelScheduledValues).to.be.a('function');
                    expect(biquadFilterNode.Q.defaultValue).to.equal(1);
                    expect(biquadFilterNode.Q.exponentialRampToValueAtTime).to.be.a('function');
                    expect(biquadFilterNode.Q.linearRampToValueAtTime).to.be.a('function');
                    expect(biquadFilterNode.Q.maxValue).to.equal(3.4028234663852886e38);
                    expect(biquadFilterNode.Q.minValue).to.equal(-3.4028234663852886e38);
                    expect(biquadFilterNode.Q.setTargetAtTime).to.be.a('function');
                    expect(biquadFilterNode.Q.setValueAtTime).to.be.a('function');
                    expect(biquadFilterNode.Q.setValueCurveAtTime).to.be.a('function');
                    expect(biquadFilterNode.Q.value).to.equal(1);
                });

                it('should be readonly', () => {
                    expect(() => {
                        biquadFilterNode.Q = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelScheduledValues()', () => {

                    it('should be chainable', () => {
                        expect(biquadFilterNode.Q.cancelScheduledValues(0)).to.equal(biquadFilterNode.Q);
                    });

                });

                describe('exponentialRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(biquadFilterNode.Q.exponentialRampToValueAtTime(1, 0)).to.equal(biquadFilterNode.Q);
                    });

                });

                describe('linearRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(biquadFilterNode.Q.linearRampToValueAtTime(1, 0)).to.equal(biquadFilterNode.Q);
                    });

                });

                describe('setTargetAtTime()', () => {

                    it('should be chainable', () => {
                        expect(biquadFilterNode.Q.setTargetAtTime(1, 0, 0.1)).to.equal(biquadFilterNode.Q);
                    });

                });

                describe('setValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(biquadFilterNode.Q.setValueAtTime(1, 0)).to.equal(biquadFilterNode.Q);
                    });

                });

                describe('setValueCurveAtTime()', () => {

                    it('should be chainable', () => {
                        expect(biquadFilterNode.frequency.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(biquadFilterNode.frequency);
                    });

                });

                // @todo automation

            });

            describe('connect()', () => {

                let biquadFilterNode;

                beforeEach(() => {
                    biquadFilterNode = createBiquadFilterNode(context);
                });

                it('should be chainable', () => {
                    const gainNode = new GainNode(context);

                    expect(biquadFilterNode.connect(gainNode)).to.equal(gainNode);
                });

                it('should not be connectable to an AudioNode of another AudioContext', (done) => {
                    const anotherContext = createContext();

                    try {
                        biquadFilterNode.connect(anotherContext.destination);
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
                        biquadFilterNode.connect(gainNode.gain);
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
                        biquadFilterNode.connect(gainNode.gain, -1);
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
                            const audioBufferSourceNode = new AudioBufferSourceNode(context);
                            const biquadFilterNode = createBiquadFilterNode(context, { frequency: context.sampleRate });
                            const firstDummyGainNode = new GainNode(context);
                            const secondDummyGainNode = new GainNode(context);

                            audioBuffer.copyToChannel(new Float32Array(values), 0);

                            audioBufferSourceNode.buffer = audioBuffer;

                            audioBufferSourceNode
                                .connect(biquadFilterNode)
                                .connect(firstDummyGainNode)
                                .connect(destination);

                            biquadFilterNode.connect(secondDummyGainNode);

                            return { audioBufferSourceNode, biquadFilterNode, firstDummyGainNode, secondDummyGainNode };
                        }
                    });
                });

                it('should be possible to disconnect a destination', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ biquadFilterNode, firstDummyGainNode }) {
                            biquadFilterNode.disconnect(firstDummyGainNode);
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
                    this.timeout(10000);

                    return renderer({
                        prepare ({ biquadFilterNode, secondDummyGainNode }) {
                            biquadFilterNode.disconnect(secondDummyGainNode);
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
                    this.timeout(10000);

                    return renderer({
                        prepare ({ biquadFilterNode }) {
                            biquadFilterNode.disconnect();
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

            describe('getFrequencyResponse()', () => {

                describe('with a frequencyHz parameter smaller as the others', () => {

                    it('should throw an InvalidAccessError', (done) => {
                        const biquadFilterNode = createBiquadFilterNode(context);

                        try {
                            biquadFilterNode.getFrequencyResponse(new Float32Array(), new Float32Array(1), new Float32Array(1));
                        } catch (err) {
                            expect(err.code).to.equal(15);
                            expect(err.name).to.equal('InvalidAccessError');

                            done();
                        }
                    });

                });

                describe('with a magResponse parameter smaller as the others', () => {

                    it('should throw an InvalidAccessError', (done) => {
                        const biquadFilterNode = createBiquadFilterNode(context);

                        try {
                            biquadFilterNode.getFrequencyResponse(new Float32Array([ 1 ]), new Float32Array(0), new Float32Array(1));
                        } catch (err) {
                            expect(err.code).to.equal(15);
                            expect(err.name).to.equal('InvalidAccessError');

                            done();
                        }
                    });

                });

                describe('with a phaseResponse parameter smaller as the others', () => {

                    it('should throw an InvalidAccessError', (done) => {
                        const biquadFilterNode = createBiquadFilterNode(context);

                        try {
                            biquadFilterNode.getFrequencyResponse(new Float32Array([ 1 ]), new Float32Array(1), new Float32Array(0));
                        } catch (err) {
                            expect(err.code).to.equal(15);
                            expect(err.name).to.equal('InvalidAccessError');

                            done();
                        }
                    });

                });

                describe('with valid parameters', () => {

                    // bug #22 This is not yet implemented in Edge and Safari.

                    /*
                     * it('should fill the magResponse and phaseResponse arrays', () => {
                     *     const biquadFilterNode = audioContext.createBiquadFilter();
                     *     const magResponse = new Float32Array(5);
                     *     const phaseResponse = new Float32Array(5);
                     *
                     *     biquadFilterNode.getFrequencyResponse(new Float32Array([ 200, 400, 800, 1600, 3200 ]), magResponse, phaseResponse);
                     *
                     *     expect(Array.from(magResponse)).to.deep.equal([ 1.184295654296875, 0.9401244521141052, 0.2128090262413025, 0.048817940056324005, 0.011635963805019855 ]);
                     *     expect(Array.from(phaseResponse)).to.deep.equal([ -0.6473332643508911, -1.862880825996399, -2.692772388458252, -2.9405176639556885, -3.044968605041504 ]);
                     * });
                     */

                });

            });

        });

    }

});
