import { AudioBuffer, AudioBufferSourceNode, AudioWorkletNode, GainNode } from '../../../src/module';
import { addAudioWorkletModule } from '../../../src/add-audio-worklet-module';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';

const createGainNodeWithConstructor = (context, options = null) => {
    if (options === null) {
        return new GainNode(context);
    }

    return new GainNode(context, options);
};
const createGainNodeWithFactoryFunction = (context, options = null) => {
    const gainNode = context.createGain();

    if (options !== null && options.channelCount !== undefined) {
        gainNode.channelCount = options.channelCount;
    }

    if (options !== null && options.channelCountMode !== undefined) {
        gainNode.channelCountMode = options.channelCountMode;
    }

    if (options !== null && options.channelInterpretation !== undefined) {
        gainNode.channelInterpretation = options.channelInterpretation;
    }

    if (options !== null && options.gain !== undefined) {
        gainNode.gain.value = options.gain;
    }

    return gainNode;
};
const testCases = {
    'constructor with AudioContext': {
        createContext: createAudioContext,
        createGainNode: createGainNodeWithConstructor
    },
    'constructor with MinimalAudioContext': {
        createContext: createMinimalAudioContext,
        createGainNode: createGainNodeWithConstructor
    },
    'constructor with MinimalOfflineAudioContext': {
        createContext: createMinimalOfflineAudioContext,
        createGainNode: createGainNodeWithConstructor
    },
    'constructor with OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createGainNode: createGainNodeWithConstructor
    },
    'factory function of AudioContext': {
        createContext: createAudioContext,
        createGainNode: createGainNodeWithFactoryFunction
    },
    'factory function of OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createGainNode: createGainNodeWithFactoryFunction
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

describe('GainNode', () => {

    for (const [ description, { createGainNode, createContext } ] of Object.entries(testCases)) {

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

                    let gainNode;

                    beforeEach(() => {
                        gainNode = createGainNode(context);
                    });

                    it('should be an instance of the EventTarget interface', () => {
                        expect(gainNode.addEventListener).to.be.a('function');
                        expect(gainNode.dispatchEvent).to.be.a('function');
                        expect(gainNode.removeEventListener).to.be.a('function');
                    });

                    it('should be an instance of the AudioNode interface', () => {
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

                });

                describe('with valid options', () => {

                    it('should return an instance with the given channelCount', () => {
                        const channelCount = 4;
                        const gainNode = createGainNode(context, { channelCount });

                        expect(gainNode.channelCount).to.equal(channelCount);
                    });

                    it('should return an instance with the given channelCountMode', () => {
                        const channelCountMode = 'explicit';
                        const gainNode = createGainNode(context, { channelCountMode });

                        expect(gainNode.channelCountMode).to.equal(channelCountMode);
                    });

                    it('should return an instance with the given channelInterpretation', () => {
                        const channelInterpretation = 'discrete';
                        const gainNode = createGainNode(context, { channelInterpretation });

                        expect(gainNode.channelInterpretation).to.equal(channelInterpretation);
                    });

                    it('should return an instance with the given initial value for gain', () => {
                        const gain = 0.5;
                        const gainNode = createGainNode(context, { gain });

                        expect(gainNode.gain.value).to.equal(gain);
                    });

                });

            });

            describe('channelCount', () => {

                let gainNode;

                beforeEach(() => {
                    gainNode = createGainNode(context);
                });

                it('should be assignable to another value', () => {
                    const channelCount = 4;

                    gainNode.channelCount = channelCount;

                    expect(gainNode.channelCount).to.equal(channelCount);
                });

            });

            describe('channelCountMode', () => {

                let gainNode;

                beforeEach(() => {
                    gainNode = createGainNode(context);
                });

                it('should be assignable to another value', () => {
                    const channelCountMode = 'explicit';

                    gainNode.channelCountMode = channelCountMode;

                    expect(gainNode.channelCountMode).to.equal(channelCountMode);
                });

            });

            describe('channelInterpretation', () => {

                let gainNode;

                beforeEach(() => {
                    gainNode = createGainNode(context);
                });

                it('should be assignable to another value', () => {
                    const channelInterpretation = 'discrete';

                    gainNode.channelInterpretation = channelInterpretation;

                    expect(gainNode.channelInterpretation).to.equal(channelInterpretation);
                });

            });

            describe('gain', () => {

                let gainNode;

                beforeEach(() => {
                    gainNode = createGainNode(context);
                });

                it('should return an instance of the AudioParam interface', () => {
                    expect(gainNode.gain.cancelScheduledValues).to.be.a('function');
                    expect(gainNode.gain.defaultValue).to.equal(1);
                    expect(gainNode.gain.exponentialRampToValueAtTime).to.be.a('function');
                    expect(gainNode.gain.linearRampToValueAtTime).to.be.a('function');
                    expect(gainNode.gain.maxValue).to.equal(3.4028234663852886e38);
                    expect(gainNode.gain.minValue).to.equal(-3.4028234663852886e38);
                    expect(gainNode.gain.setTargetAtTime).to.be.a('function');
                    expect(gainNode.gain.setValueAtTime).to.be.a('function');
                    expect(gainNode.gain.setValueCurveAtTime).to.be.a('function');
                    expect(gainNode.gain.value).to.equal(1);
                });

                it('should be readonly', () => {
                    expect(() => {
                        gainNode.gain = 'anything';
                    }).to.throw(TypeError);
                });

                describe('cancelScheduledValues()', () => {

                    it('should be chainable', () => {
                        expect(gainNode.gain.cancelScheduledValues(0)).to.equal(gainNode.gain);
                    });

                });

                describe('exponentialRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(gainNode.gain.exponentialRampToValueAtTime(1, 0)).to.equal(gainNode.gain);
                    });

                });

                describe('linearRampToValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(gainNode.gain.linearRampToValueAtTime(1, 0)).to.equal(gainNode.gain);
                    });

                });

                describe('setTargetAtTime()', () => {

                    it('should be chainable', () => {
                        expect(gainNode.gain.setTargetAtTime(1, 0, 0.1)).to.equal(gainNode.gain);
                    });

                });

                describe('setValueAtTime()', () => {

                    it('should be chainable', () => {
                        expect(gainNode.gain.setValueAtTime(1, 0)).to.equal(gainNode.gain);
                    });

                });

                describe('setValueCurveAtTime()', () => {

                    it('should be chainable', () => {
                        expect(gainNode.gain.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(gainNode.gain);
                    });

                });

                describe('automation', () => {

                    for (const withAnAppendedAudioWorklet of (description.includes('Offline') ? [ true, false ] : [ false ])) {

                        describe(`${ withAnAppendedAudioWorklet ? 'with' : 'without' } an appended AudioWorklet`, () => {

                            let renderer;
                            let values;

                            beforeEach(() => {
                                values = [ 1, 0.5, 0, -0.5, -1 ];

                                renderer = createRenderer({
                                    context,
                                    length: (context.length === undefined) ? 5 : undefined,
                                    prepare: async (destination) => {
                                        if (withAnAppendedAudioWorklet) {
                                            await addAudioWorkletModule(context, 'base/test/fixtures/gain-processor.js');
                                        }

                                        const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                                        const audioBufferSourceNode = new AudioBufferSourceNode(context);
                                        const audioWorkletNode = (withAnAppendedAudioWorklet) ? new AudioWorkletNode(context, 'gain-processor') : null;
                                        const gainNode = createGainNode(context);

                                        audioBuffer.copyToChannel(new Float32Array(values), 0);

                                        audioBufferSourceNode.buffer = audioBuffer;

                                        if (withAnAppendedAudioWorklet) {
                                            audioBufferSourceNode
                                                .connect(gainNode)
                                                .connect(audioWorkletNode)
                                                .connect(destination);
                                        } else {
                                            audioBufferSourceNode
                                                .connect(gainNode)
                                                .connect(destination);
                                        }

                                        return { audioBufferSourceNode, gainNode };
                                    }
                                });
                            });

                            describe('without any automation', () => {

                                it('should not modify the signal', function () {
                                    this.timeout(5000);

                                    return renderer({
                                        start (startTime, { audioBufferSourceNode }) {
                                            audioBufferSourceNode.start(startTime);
                                        }
                                    })
                                        .then((channelData) => {
                                            expect(Array.from(channelData)).to.deep.equal(values);
                                        });
                                });

                            });

                            describe('with a modified value', () => {

                                it('should modify the signal', function () {
                                    this.timeout(5000);

                                    return renderer({
                                        prepare ({ gainNode }) {
                                            gainNode.gain.value = 0.5;
                                        },
                                        start (startTime, { audioBufferSourceNode }) {
                                            audioBufferSourceNode.start(startTime);
                                        }
                                    })
                                        .then((channelData) => {
                                            expect(Array.from(channelData)).to.deep.equal([ 0.5, 0.25, 0, -0.25, -0.5 ]);
                                        });
                                });

                            });

                            describe('with a call to setValueAtTime()', () => {

                                it('should modify the signal', function () {
                                    this.timeout(5000);

                                    return renderer({
                                        start (startTime, { audioBufferSourceNode, gainNode }) {
                                            gainNode.gain.setValueAtTime(0.5, startTime + (2 / context.sampleRate));

                                            audioBufferSourceNode.start(startTime);
                                        }
                                    })
                                        .then((channelData) => {
                                            expect(Array.from(channelData)).to.deep.equal([ 1, 0.5, 0, -0.25, -0.5 ]);
                                        });
                                });

                            });

                            describe('with a call to setValueCurveAtTime()', () => {

                                it('should modify the signal', function () {
                                    this.timeout(5000);

                                    return renderer({
                                        start (startTime, { audioBufferSourceNode, gainNode }) {
                                            gainNode.gain.setValueCurveAtTime(new Float32Array([ 0, 0.25, 0.5, 0.75, 1 ]), startTime, startTime + (5 / context.sampleRate));

                                            audioBufferSourceNode.start(startTime);
                                        }
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

                                    return renderer({
                                        prepare ({ gainNode }) {
                                            const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                                            const audioBufferSourceNodeForAudioParam = new AudioBufferSourceNode(context);

                                            audioBuffer.copyToChannel(new Float32Array([ 0.5, 0.5, 0.5, 0.5, 0.5 ]), 0);

                                            audioBufferSourceNodeForAudioParam.buffer = audioBuffer;

                                            gainNode.gain.value = 0;

                                            audioBufferSourceNodeForAudioParam.connect(gainNode.gain);

                                            return { audioBufferSourceNodeForAudioParam };
                                        },
                                        start (startTime, { audioBufferSourceNode, audioBufferSourceNodeForAudioParam }) {
                                            audioBufferSourceNode.start(startTime);
                                            audioBufferSourceNodeForAudioParam.start(startTime);
                                        }
                                    })
                                        .then((channelData) => {
                                            expect(Array.from(channelData)).to.deep.equal([ 0.5, 0.25, 0, -0.25, -0.5 ]);
                                        });
                                });

                            });

                            // @todo Test other automations as well.

                        });

                    }

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
                            const firstDummyGainNode = new GainNode(context);
                            const gainNode = createGainNode(context);
                            const secondDummyGainNode = new GainNode(context);

                            audioBuffer.copyToChannel(new Float32Array(values), 0);

                            audioBufferSourceNode.buffer = audioBuffer;

                            audioBufferSourceNode
                                .connect(gainNode)
                                .connect(firstDummyGainNode)
                                .connect(destination);

                            gainNode.connect(secondDummyGainNode);

                            return { audioBufferSourceNode, firstDummyGainNode, gainNode, secondDummyGainNode };
                        }
                    });
                });

                it('should be possible to disconnect a destination', function () {
                    this.timeout(5000);

                    return renderer({
                        prepare ({ firstDummyGainNode, gainNode }) {
                            gainNode.disconnect(firstDummyGainNode);
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
                        prepare ({ gainNode, secondDummyGainNode }) {
                            gainNode.disconnect(secondDummyGainNode);
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
                        prepare ({ gainNode }) {
                            gainNode.disconnect();
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

        });

    }

});
