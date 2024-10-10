import {
    AudioBuffer,
    AudioBufferSourceNode,
    AudioWorkletNode,
    ConstantSourceNode,
    GainNode,
    addAudioWorkletModule as ddDWrkltMdl
} from '../../../src/module';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
import { createNativeAudioContext } from '../../helper/create-native-audio-context';
import { createNativeOfflineAudioContext } from '../../helper/create-native-offline-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';
import { isSafari } from '../../helper/is-safari';
import { roundToSamples } from '../../helper/round-to-samples';
import { spy } from 'sinon';

const createAddAudioWorkletModuleWithAudioWorkletOfContext = (context) => {
    return context.audioWorklet.addModule;
};
const createAddAudioWorkletModuleWithGlobalAudioWorklet = (context) => {
    return ddDWrkltMdl.bind(null, context);
};
const createAudioWorkletNode = (context, filename, options = null) => {
    if (options === null) {
        return new AudioWorkletNode(context, filename);
    }

    return new AudioWorkletNode(context, filename, options);
};
const testCases = {
    'constructor of a MinimalAudioContext': {
        createAddAudioWorkletModule: createAddAudioWorkletModuleWithGlobalAudioWorklet,
        createContext: createMinimalAudioContext
    },
    'constructor of a MinimalOfflineAudioContext': {
        createAddAudioWorkletModule: createAddAudioWorkletModuleWithGlobalAudioWorklet,
        createContext: createMinimalOfflineAudioContext
    },
    'constructor of an AudioContext': {
        createAddAudioWorkletModule: createAddAudioWorkletModuleWithAudioWorkletOfContext,
        createContext: createAudioContext
    },
    'constructor of an OfflineAudioContext': {
        createAddAudioWorkletModule: createAddAudioWorkletModuleWithAudioWorkletOfContext,
        createContext: createOfflineAudioContext
    }
};

describe('AudioWorkletNode', () => {
    for (const [description, { createAddAudioWorkletModule, createContext }] of Object.entries(testCases)) {
        describe(`with the ${description}`, () => {
            let addAudioWorkletModule;
            let context;

            afterEach(() => context.close?.());

            beforeEach(() => {
                context = createContext();
                addAudioWorkletModule = createAddAudioWorkletModule(context);
            });

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
                            beforeEach(function () {
                                this.timeout(10000);

                                return addAudioWorkletModule('base/test/fixtures/inspector-processor.js');
                            });

                            it('should pass on the default options to the AudioWorkletProcessor', () => {
                                const audioWorkletNode = createAudioWorkletNode(context, 'inspector-processor');

                                audioWorkletNode.port.onmessage = ({ data }) => {
                                    if ('options' in data) {
                                        audioWorkletNode.port.onmessage = null;

                                        expect(data.options).to.deep.equal({
                                            channelCount: 2,
                                            channelCountMode: 'explicit',
                                            channelInterpretation: 'speakers',
                                            numberOfInputs: 1,
                                            numberOfOutputs: 1,
                                            outputChannelCount: [2],
                                            parameterData: {},
                                            processorOptions: {}
                                        });
                                    }
                                };

                                audioWorkletNode.port.postMessage(null);
                            });

                            it('should return an instance of the AudioWorkletNode constructor', () => {
                                const audioWorkletNode = createAudioWorkletNode(context, 'inspector-processor');

                                expect(audioWorkletNode).to.be.an.instanceOf(AudioWorkletNode);
                            });

                            it('should return an implementation of the EventTarget interface', () => {
                                const audioWorkletNode = createAudioWorkletNode(context, 'inspector-processor');

                                expect(audioWorkletNode.addEventListener).to.be.a('function');
                                expect(audioWorkletNode.dispatchEvent).to.be.a('function');
                                expect(audioWorkletNode.removeEventListener).to.be.a('function');
                            });

                            it('should return an implementation of the AudioNode interface', () => {
                                const audioWorkletNode = createAudioWorkletNode(context, 'inspector-processor');

                                expect(audioWorkletNode.channelCount).to.equal(2);
                                // Bug #61: The channelCountMode should have a default value of 'max'.
                                expect(audioWorkletNode.channelCountMode).to.equal('explicit');
                                expect(audioWorkletNode.channelInterpretation).to.equal('speakers');
                                expect(audioWorkletNode.connect).to.be.a('function');
                                expect(audioWorkletNode.context).to.be.an.instanceOf(context.constructor);
                                expect(audioWorkletNode.disconnect).to.be.a('function');
                                expect(audioWorkletNode.numberOfInputs).to.equal(1);
                                expect(audioWorkletNode.numberOfOutputs).to.equal(1);
                            });

                            it('should return an implementation of the AudioWorkletNode interface', () => {
                                const audioWorkletNode = createAudioWorkletNode(context, 'inspector-processor');

                                expect(audioWorkletNode.onprocessorerror).to.be.null;
                                expect(audioWorkletNode.parameters).not.to.be.undefined;
                                expect(audioWorkletNode.port).to.be.an.instanceOf(MessagePort);
                            });
                        });

                        describe('with valid options', () => {
                            it('should return an instance with the given channelCount', async function () {
                                this.timeout(10000);

                                await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                                const channelCount = 4;
                                const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor', { channelCount });

                                expect(audioWorkletNode.channelCount).to.equal(channelCount);
                            });

                            // Bug #61: Specifying a different channelCountMode is currently forbidden.

                            it('should return an instance with the given channelInterpretation', async function () {
                                this.timeout(10000);

                                await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                                const channelInterpretation = 'discrete';
                                const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor', { channelInterpretation });

                                expect(audioWorkletNode.channelInterpretation).to.equal(channelInterpretation);
                            });

                            it('should return an instance with the given numberOfInputs', async function () {
                                this.timeout(10000);

                                await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                                const numberOfInputs = 2;
                                const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor', { numberOfInputs });

                                expect(audioWorkletNode.numberOfInputs).to.equal(numberOfInputs);
                            });

                            it('should return an instance with the given numberOfOutputs', async function () {
                                this.timeout(10000);

                                await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                                const numberOfOutputs = 0;
                                const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor', { numberOfOutputs });

                                expect(audioWorkletNode.numberOfOutputs).to.equal(numberOfOutputs);
                            });

                            it('should pass on the parameterData to the AudioWorkletProcessor', function (done) {
                                this.timeout(10000);

                                addAudioWorkletModule('base/test/fixtures/inspector-processor.js').then(() => {
                                    const parameterData = { gain: 12 };
                                    const audioWorkletNode = createAudioWorkletNode(context, 'inspector-processor', { parameterData });

                                    audioWorkletNode.port.onmessage = ({ data }) => {
                                        if ('options' in data) {
                                            audioWorkletNode.port.onmessage = null;

                                            expect(data.options.parameterData).to.deep.equal(parameterData);

                                            done();
                                        }
                                    };

                                    audioWorkletNode.port.postMessage(null);
                                });
                            });

                            it('should return an instance with a parameter initialized to the given value', async function () {
                                this.timeout(10000);

                                await addAudioWorkletModule('base/test/fixtures/inspector-processor.js');

                                const parameterData = { gain: 12 };
                                const audioWorkletNode = createAudioWorkletNode(context, 'inspector-processor', { parameterData });

                                expect(audioWorkletNode.parameters.get('gain').value).to.equal(parameterData.gain);
                            });

                            it('should pass on the processorOptions to the AudioWorkletProcessor', function (done) {
                                this.timeout(10000);

                                addAudioWorkletModule('base/test/fixtures/inspector-processor.js').then(() => {
                                    const processorOptions = { an: 'arbitrary', object: ['with', 'some', 'values'] };
                                    const audioWorkletNode = createAudioWorkletNode(context, 'inspector-processor', { processorOptions });

                                    audioWorkletNode.port.onmessage = ({ data }) => {
                                        if ('options' in data) {
                                            audioWorkletNode.port.onmessage = null;

                                            expect(data.options.processorOptions).to.deep.equal(processorOptions);

                                            done();
                                        }
                                    };

                                    audioWorkletNode.port.postMessage(null);
                                });
                            });

                            it('should pass on the default processorOptions to the AudioWorkletProcessor', function (done) {
                                this.timeout(10000);

                                addAudioWorkletModule('base/test/fixtures/inspector-processor.js').then(() => {
                                    const audioWorkletNode = createAudioWorkletNode(context, 'inspector-processor');

                                    audioWorkletNode.port.onmessage = ({ data }) => {
                                        if ('options' in data) {
                                            audioWorkletNode.port.onmessage = null;

                                            expect(data.options.processorOptions).to.deep.equal({});

                                            done();
                                        }
                                    };

                                    audioWorkletNode.port.postMessage(null);
                                });
                            });
                        });

                        describe('with invalid options', () => {
                            beforeEach(function () {
                                this.timeout(10000);

                                return addAudioWorkletModule('base/test/fixtures/inspector-processor.js');
                            });

                            describe('with numberOfInputs and numberOfOutputs both set to zero', () => {
                                it('should throw a NotSupportedError', (done) => {
                                    try {
                                        createAudioWorkletNode(context, 'inspector-processor', { numberOfInputs: 0, numberOfOutputs: 0 });
                                    } catch (err) {
                                        expect(err.code).to.equal(9);
                                        expect(err.name).to.equal('NotSupportedError');

                                        done();
                                    }
                                });
                            });

                            describe('without enough outputs specified in outputChannelCount', () => {
                                it('should throw an IndexSizeError', (done) => {
                                    try {
                                        createAudioWorkletNode(context, 'inspector-processor', { outputChannelCount: [] });
                                    } catch (err) {
                                        expect(err.code).to.equal(1);
                                        expect(err.name).to.equal('IndexSizeError');

                                        done();
                                    }
                                });
                            });

                            describe('with too many outputs specified in outputChannelCount', () => {
                                it('should throw an IndexSizeError', (done) => {
                                    try {
                                        createAudioWorkletNode(context, 'inspector-processor', { outputChannelCount: [4, 2] });
                                    } catch (err) {
                                        expect(err.code).to.equal(1);
                                        expect(err.name).to.equal('IndexSizeError');

                                        done();
                                    }
                                });
                            });

                            describe('with an invalid value for one of the outputs specified in outputChannelCount', () => {
                                it('should throw a NotSupportedError', (done) => {
                                    try {
                                        createAudioWorkletNode(context, 'inspector-processor', { outputChannelCount: [0] });
                                    } catch (err) {
                                        expect(err.code).to.equal(9);
                                        expect(err.name).to.equal('NotSupportedError');

                                        done();
                                    }
                                });
                            });

                            describe('with an entry for an unknown AudioParam', () => {
                                let audioWorkletNode;
                                let parameterData;

                                beforeEach(() => {
                                    parameterData = { level: 2 };
                                    audioWorkletNode = createAudioWorkletNode(context, 'inspector-processor', { parameterData });
                                });

                                it('should ignore the entry', (done) => {
                                    audioWorkletNode.port.onmessage = ({ data }) => {
                                        if ('options' in data) {
                                            audioWorkletNode.port.onmessage = null;

                                            expect(data.options.parameterData).to.deep.equal(parameterData);

                                            done();
                                        }
                                    };

                                    audioWorkletNode.port.postMessage(null);
                                });
                            });

                            describe('with the name of an unknown processor', () => {
                                it('should throw a NotSupportedError', (done) => {
                                    try {
                                        createAudioWorkletNode(context, 'unknown-processor');
                                    } catch (err) {
                                        expect(err.code).to.equal(9);
                                        expect(err.name).to.equal('NotSupportedError');

                                        done();
                                    }
                                });
                            });

                            describe('with processorOptions with an unclonable value', () => {
                                it('should throw a DataCloneError', function (done) {
                                    this.timeout(10000);

                                    addAudioWorkletModule('base/test/fixtures/inspector-processor.js')
                                        .then(() =>
                                            createAudioWorkletNode(context, 'inspector-processor', { processorOptions: { fn: () => {} } })
                                        )
                                        .catch((err) => {
                                            expect(err.code).to.equal(25);
                                            expect(err.name).to.equal('DataCloneError');

                                            done();
                                        });
                                });
                            });
                        });
                    });
                }
            });

            describe('channelCount', () => {
                let audioWorkletNode;

                beforeEach(async function () {
                    this.timeout(10000);

                    await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                    audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                });

                it('should not be assignable to another value', (done) => {
                    const channelCount = 6;

                    try {
                        audioWorkletNode.channelCount = channelCount;
                    } catch (err) {
                        expect(err.code).to.equal(11);
                        expect(err.name).to.equal('InvalidStateError');

                        done();
                    }
                });
            });

            describe('channelCountMode', () => {
                let audioWorkletNode;

                beforeEach(async function () {
                    this.timeout(10000);

                    await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                    audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                });

                it('should not be assignable to another value', (done) => {
                    const channelCountMode = 'max';

                    try {
                        audioWorkletNode.channelCountMode = channelCountMode;
                    } catch (err) {
                        expect(err.code).to.equal(11);
                        expect(err.name).to.equal('InvalidStateError');

                        done();
                    }
                });
            });

            describe('channelInterpretation', () => {
                let audioWorkletNode;

                beforeEach(async function () {
                    this.timeout(10000);

                    await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                    audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                });

                it('should be assignable to another value', () => {
                    const channelInterpretation = 'discrete';

                    audioWorkletNode.channelInterpretation = channelInterpretation;

                    expect(audioWorkletNode.channelInterpretation).to.equal(channelInterpretation);
                });
            });

            describe('numberOfInputs', () => {
                let audioWorkletNode;

                beforeEach(async function () {
                    this.timeout(10000);

                    await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                    audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                });

                it('should be readonly', () => {
                    expect(() => {
                        audioWorkletNode.numberOfInputs = 2;
                    }).to.throw(TypeError);
                });
            });

            describe('numberOfOutputs', () => {
                let audioWorkletNode;

                beforeEach(async function () {
                    this.timeout(10000);

                    await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                    audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                });

                it('should be readonly', () => {
                    expect(() => {
                        audioWorkletNode.numberOfOutputs = 2;
                    }).to.throw(TypeError);
                });
            });

            describe('onprocessorerror', () => {
                it('should be null', async function () {
                    this.timeout(10000);

                    await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                    const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');

                    expect(audioWorkletNode.onprocessorerror).to.be.null;
                });

                it('should be assignable to a function', async function () {
                    this.timeout(10000);

                    await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                    const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                    const fn = () => {}; // eslint-disable-line unicorn/consistent-function-scoping
                    const onprocessorerror = (audioWorkletNode.onprocessorerror = fn); // eslint-disable-line no-multi-assign

                    expect(onprocessorerror).to.equal(fn);
                    expect(audioWorkletNode.onprocessorerror).to.equal(fn);
                });

                it('should be assignable to null', async function () {
                    this.timeout(10000);

                    await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                    const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                    const onprocessorerror = (audioWorkletNode.onprocessorerror = null); // eslint-disable-line no-multi-assign

                    expect(onprocessorerror).to.be.null;
                    expect(audioWorkletNode.onprocessorerror).to.be.null;
                });

                it('should not be assignable to something else', async function () {
                    this.timeout(10000);

                    await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                    const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                    const string = 'no function or null value';

                    audioWorkletNode.onprocessorerror = () => {};

                    const onprocessorerror = (audioWorkletNode.onprocessorerror = string); // eslint-disable-line no-multi-assign

                    expect(onprocessorerror).to.equal(string);
                    expect(audioWorkletNode.onprocessorerror).to.be.null;
                });

                it('should register an independent event listener', async function () {
                    this.timeout(10000);

                    await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                    const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                    const onprocessorerror = spy();

                    audioWorkletNode.onprocessorerror = onprocessorerror;
                    audioWorkletNode.addEventListener('processorerror', onprocessorerror);

                    audioWorkletNode.dispatchEvent(new Event('processorerror'));

                    expect(onprocessorerror).to.have.been.calledTwice;
                });

                describe('with a processor without a process function', () => {
                    let audioWorkletNode;

                    beforeEach(async function () {
                        this.timeout(10000);

                        await addAudioWorkletModule('base/test/fixtures/processless-processor.js');

                        audioWorkletNode = createAudioWorkletNode(context, 'processless-processor');
                    });

                    it('should fire an assigned processorerror event listener', function (done) {
                        this.timeout(10000);

                        audioWorkletNode.onprocessorerror = function (event) {
                            expect(event).to.be.an.instanceOf(ErrorEvent);
                            expect(event.colno).to.be.a('number');
                            expect(event.currentTarget).to.equal(audioWorkletNode);
                            expect(event.error).to.be.undefined;
                            expect(event.filename).to.be.a('string');
                            expect(event.lineno).to.be.a('number');
                            expect(event.message).to.be.a('string');
                            expect(event.target).to.equal(audioWorkletNode);
                            expect(event.type).to.equal('processorerror');

                            expect(this).to.equal(audioWorkletNode);

                            done();
                        };

                        audioWorkletNode.connect(context.destination);

                        context.startRendering?.();
                    });
                });

                describe('with a failing processor', () => {
                    let audioWorkletNode;

                    beforeEach(async function () {
                        this.timeout(10000);

                        await addAudioWorkletModule('base/test/fixtures/failing-processor.js');

                        audioWorkletNode = createAudioWorkletNode(context, 'failing-processor');
                    });

                    it('should fire an assigned processorerror event listener', function (done) {
                        this.timeout(10000);

                        audioWorkletNode.onprocessorerror = function (event) {
                            expect(event).to.be.an.instanceOf(ErrorEvent);
                            expect(event.colno).to.be.a('number');
                            expect(event.currentTarget).to.equal(audioWorkletNode);
                            expect(event.error).to.be.undefined;
                            expect(event.filename).to.be.a('string');
                            expect(event.lineno).to.be.a('number');
                            expect(event.message).to.be.a('string');
                            expect(event.target).to.equal(audioWorkletNode);
                            expect(event.type).to.equal('processorerror');

                            expect(this).to.equal(audioWorkletNode);

                            done();
                        };

                        audioWorkletNode.connect(context.destination);

                        context.startRendering?.();
                    });
                });
            });

            describe('parameters', () => {
                it('should return an implementation of the AudioParamMap interface', async function () {
                    this.timeout(10000);

                    await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                    const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');

                    expect(audioWorkletNode.parameters.entries).to.be.a('function');
                    expect(audioWorkletNode.parameters.forEach).to.be.a('function');
                    expect(audioWorkletNode.parameters.get).to.be.a('function');
                    expect(audioWorkletNode.parameters.has).to.be.a('function');
                    expect(audioWorkletNode.parameters.keys).to.be.a('function');
                    expect(audioWorkletNode.parameters.values).to.be.a('function');
                    // @todo expect(audioWorkletNode.parameters[ Symbol.iterator ]).to.be.a('function');
                });

                describe('size', () => {
                    // @todo
                });

                describe('entries()', () => {
                    let entries;
                    let parameters;

                    beforeEach(async function () {
                        this.timeout(10000);

                        await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                        const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');

                        parameters = audioWorkletNode.parameters;
                        entries = parameters.entries();
                    });

                    it('should return an implementation of the Iterator interface', () => {
                        expect(entries.next).to.be.a('function');
                    });

                    it('should iterate over all entries', () => {
                        expect(Array.from(entries)).to.deep.equal([['gain', parameters.get('gain')]]);
                    });
                });

                describe('forEach()', () => {
                    let parameters;

                    beforeEach(async function () {
                        this.timeout(10000);

                        await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                        const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');

                        parameters = audioWorkletNode.parameters;
                    });

                    it('should iterate over all parameters', () => {
                        const args = [];

                        parameters.forEach((value, key, map) => {
                            args.push({ key, map, value });
                        });

                        expect(args).to.deep.equal([
                            {
                                key: 'gain',
                                map: parameters,
                                value: parameters.get('gain')
                            }
                        ]);
                    });
                });

                describe('get()', () => {
                    let parameters;

                    beforeEach(async function () {
                        this.timeout(10000);

                        await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                        const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');

                        parameters = audioWorkletNode.parameters;
                    });

                    describe('with an unexisting parameter', () => {
                        it('should return undefined', () => {
                            expect(parameters.get('unknown')).to.be.undefined;
                        });
                    });

                    describe('with an existing parameter', () => {
                        let gain;

                        beforeEach(() => {
                            gain = parameters.get('gain');
                        });

                        it('should return an implementation of the AudioParam interface', () => {
                            expect(gain.cancelAndHoldAtTime).to.be.a('function');
                            expect(gain.cancelScheduledValues).to.be.a('function');
                            expect(gain.defaultValue).to.equal(1);
                            expect(gain.exponentialRampToValueAtTime).to.be.a('function');
                            expect(gain.linearRampToValueAtTime).to.be.a('function');
                            expect(gain.maxValue).to.equal(3.4028234663852886e38);
                            expect(gain.minValue).to.equal(-3.4028234663852886e38);
                            expect(gain.setTargetAtTime).to.be.a('function');
                            expect(gain.setValueAtTime).to.be.a('function');
                            expect(gain.setValueCurveAtTime).to.be.a('function');
                            expect(gain.value).to.equal(1);
                        });

                        describe('cancelAndHoldAtTime()', () => {
                            it('should be chainable', () => {
                                expect(gain.cancelAndHoldAtTime(0)).to.equal(gain);
                            });
                        });

                        describe('cancelScheduledValues()', () => {
                            it('should be chainable', () => {
                                expect(gain.cancelScheduledValues(0)).to.equal(gain);
                            });
                        });

                        describe('exponentialRampToValueAtTime()', () => {
                            it('should be chainable', () => {
                                expect(gain.exponentialRampToValueAtTime(1, 0)).to.equal(gain);
                            });

                            it('should throw a RangeError', () => {
                                expect(() => {
                                    gain.exponentialRampToValueAtTime(0, 1);
                                }).to.throw(RangeError);
                            });

                            it('should throw a RangeError', () => {
                                expect(() => {
                                    gain.exponentialRampToValueAtTime(1, -1);
                                }).to.throw(RangeError);
                            });
                        });

                        describe('linearRampToValueAtTime()', () => {
                            it('should be chainable', () => {
                                expect(gain.linearRampToValueAtTime(1, 0)).to.equal(gain);
                            });
                        });

                        describe('setTargetAtTime()', () => {
                            it('should be chainable', () => {
                                expect(gain.setTargetAtTime(1, 0, 0.1)).to.equal(gain);
                            });
                        });

                        describe('setValueAtTime()', () => {
                            it('should be chainable', () => {
                                expect(gain.setValueAtTime(1, 0)).to.equal(gain);
                            });
                        });

                        describe('setValueCurveAtTime()', () => {
                            for (const [arrayType, values] of [
                                ['regular Array', [1, 0]],
                                ['Float32Array', new Float32Array([1, 0])]
                            ]) {
                                describe(`with a ${arrayType}`, () => {
                                    it('should be chainable', () => {
                                        expect(gain.setValueCurveAtTime(values, 0, 1)).to.equal(gain);
                                    });
                                });
                            }
                        });
                    });
                });

                describe('has()', () => {
                    let parameters;

                    beforeEach(async function () {
                        this.timeout(10000);

                        await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                        const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');

                        parameters = audioWorkletNode.parameters;
                    });

                    describe('with an unexisting parameter', () => {
                        it('should return false', () => {
                            expect(parameters.has('unknown')).to.be.false;
                        });
                    });

                    describe('with an existing parameter', () => {
                        it('should return true', () => {
                            expect(parameters.has('gain')).to.be.true;
                        });
                    });
                });

                describe('keys()', () => {
                    let keys;

                    beforeEach(async function () {
                        this.timeout(10000);

                        await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                        const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');

                        keys = audioWorkletNode.parameters.keys();
                    });

                    it('should return an implementation of the Iterator interface', () => {
                        expect(keys.next).to.be.a('function');
                    });

                    it('should iterate over all keys', () => {
                        expect(Array.from(keys)).to.deep.equal(['gain']);
                    });
                });

                describe('values()', () => {
                    let values;
                    let parameters;

                    beforeEach(async function () {
                        this.timeout(10000);

                        await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                        const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');

                        parameters = audioWorkletNode.parameters;
                        values = parameters.values();
                    });

                    it('should return an implementation of the Iterator interface', () => {
                        expect(values.next).to.be.a('function');
                    });

                    it('should iterate over all values', () => {
                        expect(Array.from(values)).to.deep.equal([parameters.get('gain')]);
                    });
                });

                // @todo Symbol.iterator

                describe('automation', () => {
                    let renderer;
                    let values;

                    beforeEach(async function () {
                        this.timeout(10000);

                        values = [1, 0.5, 0, -0.5, -1];

                        await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                        renderer = createRenderer({
                            context,
                            length: context.length === undefined ? 5 : undefined,
                            prepare(destination) {
                                const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                                const audioBufferSourceNode = new AudioBufferSourceNode(context);
                                const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');

                                audioBuffer.copyToChannel(new Float32Array(values), 0);

                                audioBufferSourceNode.buffer = audioBuffer;

                                audioBufferSourceNode.connect(audioWorkletNode).connect(destination);

                                return { audioBufferSourceNode, audioWorkletNode };
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
                                expect(channelData[0]).to.equal(1);
                                expect(channelData[1]).to.equal(0.5);
                                expect(channelData[2]).to.be.closeTo(0, 0.000000000001);
                                expect(channelData[3]).to.equal(-0.5);
                                expect(channelData[4]).to.equal(-1);
                            });
                        });
                    });

                    describe('with a modified value', () => {
                        it('should modify the signal', function () {
                            this.timeout(10000);

                            return renderer({
                                prepare({ audioWorkletNode }) {
                                    audioWorkletNode.parameters.get('gain').value = 0.5;
                                },
                                start(startTime, { audioBufferSourceNode }) {
                                    audioBufferSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(channelData[0]).to.equal(0.5);
                                expect(channelData[1]).to.equal(0.25);
                                expect(channelData[2]).to.be.closeTo(0, 0.000000000001);
                                expect(channelData[3]).to.equal(-0.25);
                                expect(channelData[4]).to.equal(-0.5);
                            });
                        });
                    });

                    describe('with a call to cancelAndHoldAtTime()', () => {
                        it('should modify the signal', function () {
                            this.timeout(10000);

                            return renderer({
                                // @todo For some reason tests run more reliably in Safari when each iteration starts at the same fraction of a second.
                                blockSize: isSafari(navigator) ? context.sampleRate : 128,
                                start(startTime, { audioBufferSourceNode, audioWorkletNode }) {
                                    const gain = audioWorkletNode.parameters.get('gain');

                                    gain.setValueAtTime(1, roundToSamples(startTime, context.sampleRate));
                                    gain.linearRampToValueAtTime(0, roundToSamples(startTime, context.sampleRate, 4));
                                    gain.cancelAndHoldAtTime(roundToSamples(startTime, context.sampleRate, 3));

                                    audioBufferSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(channelData[0]).to.equal(1);
                                expect(channelData[1]).to.equal(0.375);
                                expect(channelData[2]).to.be.closeTo(0, 0.0000000001);
                                expect(channelData[3]).to.equal(-0.125);
                                expect(channelData[4]).to.equal(-0.25);
                            });
                        });
                    });

                    describe('with a call to cancelScheduledValues()', () => {
                        it('should modify the signal', function () {
                            this.timeout(10000);

                            return renderer({
                                start(startTime, { audioBufferSourceNode, audioWorkletNode }) {
                                    const gain = audioWorkletNode.parameters.get('gain');

                                    gain.setValueAtTime(0.5, startTime);
                                    gain.setValueAtTime(1, roundToSamples(startTime, context.sampleRate, 2));
                                    gain.linearRampToValueAtTime(0, roundToSamples(startTime, context.sampleRate, 5));
                                    gain.cancelScheduledValues(roundToSamples(startTime, context.sampleRate, 3));

                                    audioBufferSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(channelData[0]).to.equal(0.5);
                                expect(channelData[1]).to.equal(0.25);
                                expect(channelData[2]).to.be.closeTo(0, 0.00000000001);
                                expect(channelData[3]).to.equal(-0.5);
                                expect(channelData[4]).to.equal(-1);
                            });
                        });
                    });

                    describe('with a call to exponentialRampToValueAtTime()', () => {
                        it('should modify the signal', function () {
                            this.timeout(10000);

                            return renderer({
                                start(startTime, { audioBufferSourceNode, audioWorkletNode }) {
                                    const gain = audioWorkletNode.parameters.get('gain');

                                    gain.exponentialRampToValueAtTime(0.5, roundToSamples(startTime, context.sampleRate, 5));

                                    audioBufferSourceNode.start(startTime);
                                },
                                verifyChannelData: false
                            }).then((channelData) => {
                                expect(channelData[0]).to.be.at.most(1);
                                expect(channelData[1]).to.be.below(0.5);
                                expect(channelData[2]).to.be.closeTo(0, 0.000000000001);
                                expect(channelData[3]).to.be.above(-0.5);
                                expect(channelData[4]).to.be.above(-1);
                            });
                        });
                    });

                    describe('with a call to linearRampToValueAtTime()', () => {
                        it('should modify the signal', function () {
                            this.timeout(10000);

                            return renderer({
                                start(startTime, { audioBufferSourceNode, audioWorkletNode }) {
                                    const gain = audioWorkletNode.parameters.get('gain');

                                    gain.linearRampToValueAtTime(0, roundToSamples(startTime, context.sampleRate, 5));

                                    audioBufferSourceNode.start(startTime);
                                },
                                verifyChannelData: false
                            }).then((channelData) => {
                                expect(channelData[0]).to.be.at.most(1);
                                expect(channelData[1]).to.be.below(0.5);
                                expect(channelData[2]).to.be.closeTo(0, 0.000000000001);
                                expect(channelData[3]).to.be.above(-0.5);
                                expect(channelData[4]).to.be.above(-1);
                            });
                        });
                    });

                    describe('with a call to setValueAtTime()', () => {
                        it('should modify the signal', function () {
                            this.timeout(10000);

                            return renderer({
                                start(startTime, { audioBufferSourceNode, audioWorkletNode }) {
                                    audioWorkletNode.parameters
                                        .get('gain')
                                        .setValueAtTime(0.5, roundToSamples(startTime, context.sampleRate, 2));

                                    audioBufferSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(channelData[0]).to.equal(1);
                                expect(channelData[1]).to.equal(0.5);
                                expect(channelData[2]).to.be.closeTo(0, 0.000000000001);
                                expect(channelData[3]).to.equal(-0.25);
                                expect(channelData[4]).to.equal(-0.5);
                            });
                        });
                    });

                    describe('with a call to setValueCurveAtTime()', () => {
                        it('should modify the signal', function () {
                            this.timeout(10000);

                            return renderer({
                                start(startTime, { audioBufferSourceNode, audioWorkletNode }) {
                                    audioWorkletNode.parameters
                                        .get('gain')
                                        .setValueCurveAtTime(
                                            new Float32Array([0, 0.25, 0.5, 0.75, 1]),
                                            roundToSamples(startTime, context.sampleRate),
                                            6 / context.sampleRate
                                        );

                                    audioBufferSourceNode.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(channelData[0]).to.equal(0);
                                expect(channelData[1]).to.equal(0.0833333358168602);
                                expect(channelData[2]).to.be.closeTo(0, 0.000000000001);
                                expect(channelData[3]).to.equal(-0.25);
                                expect(channelData[4]).to.equal(-0.6666666865348816);
                            });
                        });
                    });

                    describe('with another AudioNode connected to the AudioParam', () => {
                        it('should modify the signal', function () {
                            this.timeout(10000);

                            return renderer({
                                prepare({ audioWorkletNode }) {
                                    const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                                    const audioBufferSourceNodeForAudioParam = new AudioBufferSourceNode(context);

                                    audioBuffer.copyToChannel(new Float32Array([0.5, 0.5, 0.5, 0.5, 0.5]), 0);

                                    audioBufferSourceNodeForAudioParam.buffer = audioBuffer;

                                    audioWorkletNode.parameters.get('gain').value = 0;

                                    audioBufferSourceNodeForAudioParam.connect(audioWorkletNode.parameters.get('gain'));

                                    return { audioBufferSourceNodeForAudioParam };
                                },
                                start(startTime, { audioBufferSourceNode, audioBufferSourceNodeForAudioParam }) {
                                    audioBufferSourceNode.start(startTime);
                                    audioBufferSourceNodeForAudioParam.start(startTime);
                                }
                            }).then((channelData) => {
                                expect(channelData[0]).to.equal(0.5);
                                expect(channelData[1]).to.equal(0.25);
                                expect(channelData[2]).to.be.closeTo(0, 0.000000000001);
                                expect(channelData[3]).to.equal(-0.25);
                                expect(channelData[4]).to.equal(-0.5);
                            });
                        });
                    });

                    // @todo Test other automations as well.
                });
            });

            describe('port', () => {
                let audioWorkletNode;

                beforeEach(async function () {
                    this.timeout(10000);

                    await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                    audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                });

                it('should echo any message when using addEventListener', (done) => {
                    const message = { a: 'simple', test: 'message' };
                    const listener = ({ data }) => {
                        audioWorkletNode.port.removeEventListener('message', listener);

                        expect(data).to.deep.equal(message);

                        done();
                    };

                    audioWorkletNode.port.addEventListener('message', listener);
                    audioWorkletNode.port.start();
                    audioWorkletNode.port.postMessage(message);
                });

                it('should echo any message when using onmessage', (done) => {
                    const message = { a: 'simple', test: 'message' };

                    audioWorkletNode.port.onmessage = ({ data }) => {
                        audioWorkletNode.port.onmessage = null;

                        expect(data).to.deep.equal(message);

                        done();
                    };

                    audioWorkletNode.port.postMessage(message);
                });
            });

            describe('addEventListener()', () => {
                it('should fire a registered processorerror event listener', function (done) {
                    this.timeout(10000);

                    addAudioWorkletModule('base/test/fixtures/failing-processor.js').then(() => {
                        const audioWorkletNode = createAudioWorkletNode(context, 'failing-processor');

                        audioWorkletNode.addEventListener('processorerror', function (event) {
                            expect(event).to.be.an.instanceOf(ErrorEvent);
                            expect(event.colno).to.be.a('number');
                            expect(event.currentTarget).to.equal(audioWorkletNode);
                            expect(event.error).to.be.undefined;
                            expect(event.filename).to.be.a('string');
                            expect(event.lineno).to.be.a('number');
                            expect(event.message).to.be.a('string');
                            expect(event.target).to.equal(audioWorkletNode);
                            expect(event.type).to.equal('processorerror');

                            expect(this).to.equal(audioWorkletNode);

                            done();
                        });

                        audioWorkletNode.connect(context.destination);

                        context.startRendering?.();
                    });
                });
            });

            describe('connect()', () => {
                beforeEach(async function () {
                    this.timeout(10000);

                    await addAudioWorkletModule('base/test/fixtures/gain-processor.js');
                });

                for (const type of ['AudioNode', 'AudioParam']) {
                    describe(`with an ${type}`, () => {
                        let audioNodeOrAudioParam;
                        let audioWorkletNode;

                        beforeEach(() => {
                            const gainNode = new GainNode(context);

                            audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                            audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                        });

                        if (type === 'AudioNode') {
                            it('should be chainable', () => {
                                expect(audioWorkletNode.connect(audioNodeOrAudioParam)).to.equal(audioNodeOrAudioParam);
                            });
                        } else {
                            it('should not be chainable', () => {
                                expect(audioWorkletNode.connect(audioNodeOrAudioParam)).to.be.undefined;
                            });
                        }

                        it('should accept duplicate connections', () => {
                            audioWorkletNode.connect(audioNodeOrAudioParam);
                            audioWorkletNode.connect(audioNodeOrAudioParam);
                        });

                        it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                            try {
                                audioWorkletNode.connect(audioNodeOrAudioParam, -1);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                        if (type === 'AudioNode') {
                            it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                                try {
                                    audioWorkletNode.connect(audioNodeOrAudioParam, 0, -1);
                                } catch (err) {
                                    expect(err.code).to.equal(1);
                                    expect(err.name).to.equal('IndexSizeError');

                                    done();
                                }
                            });

                            it('should not throw an error if the connection creates a cycle by connecting to the source', () => {
                                audioNodeOrAudioParam.connect(audioWorkletNode).connect(audioNodeOrAudioParam);
                            });

                            it('should not throw an error if the connection creates a cycle by connecting to an AudioParam of the source', () => {
                                audioNodeOrAudioParam.connect(audioWorkletNode).connect(audioNodeOrAudioParam.gain);
                            });
                        }
                    });

                    describe(`with an ${type} of another context`, () => {
                        let anotherContext;
                        let audioNodeOrAudioParam;
                        let audioWorkletNode;

                        afterEach(() => anotherContext.close?.());

                        beforeEach(() => {
                            anotherContext = createContext();

                            const gainNode = new GainNode(anotherContext);

                            audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                            audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                        });

                        it('should throw an InvalidAccessError', (done) => {
                            try {
                                audioWorkletNode.connect(audioNodeOrAudioParam);
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });
                    });

                    describe(`with an ${type} of a native context`, () => {
                        let audioWorkletNode;
                        let nativeAudioNodeOrAudioParam;
                        let nativeContext;

                        afterEach(() => nativeContext.close?.());

                        beforeEach(() => {
                            audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                            nativeContext = description.includes('Offline')
                                ? createNativeOfflineAudioContext()
                                : createNativeAudioContext();

                            const nativeGainNode = nativeContext.createGain();

                            nativeAudioNodeOrAudioParam = type === 'AudioNode' ? nativeGainNode : nativeGainNode.gain;
                        });

                        it('should throw an InvalidAccessError', (done) => {
                            try {
                                audioWorkletNode.connect(nativeAudioNodeOrAudioParam);
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
                                const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                                const constantSourceNode = new ConstantSourceNode(context);
                                const gainNode = new GainNode(context);

                                constantSourceNode.connect(audioWorkletNode).connect(destination);

                                audioWorkletNode.connect(gainNode).connect(audioWorkletNode);

                                return { audioWorkletNode, constantSourceNode, gainNode };
                            }
                        });
                    });

                    it('should render silence', function () {
                        this.timeout(10000);

                        return renderer({
                            start(startTime, { constantSourceNode }) {
                                constantSourceNode.start(startTime);
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
                                const audioBufferSourceNode = new AudioBufferSourceNode(context);
                                const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                                const firstDummyGainNode = new GainNode(context);
                                const secondDummyGainNode = new GainNode(context);

                                audioBuffer.copyToChannel(new Float32Array(values), 0);

                                audioBufferSourceNode.buffer = audioBuffer;

                                audioBufferSourceNode.connect(audioWorkletNode).connect(firstDummyGainNode).connect(destination);

                                audioWorkletNode.connect(secondDummyGainNode);

                                return { audioBufferSourceNode, audioWorkletNode, firstDummyGainNode, secondDummyGainNode };
                            }
                        });
                });

                describe('without any parameters', () => {
                    let renderer;
                    let values;

                    beforeEach(async function () {
                        this.timeout(10000);

                        values = [1, 1, 1, 1, 1];

                        await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                        renderer = createPredefinedRenderer(values);
                    });

                    it('should disconnect all destinations', function () {
                        this.timeout(10000);

                        return renderer({
                            prepare({ audioWorkletNode }) {
                                audioWorkletNode.disconnect();
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
                        let audioWorkletNode;

                        beforeEach(async function () {
                            this.timeout(10000);

                            await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                            audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                        });

                        it('should throw an IndexSizeError', (done) => {
                            try {
                                audioWorkletNode.disconnect(-1);
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

                        beforeEach(async function () {
                            this.timeout(10000);

                            values = [1, 1, 1, 1, 1];

                            await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                            renderer = createPredefinedRenderer(values);
                        });

                        it('should disconnect all destinations from the given output', function () {
                            this.timeout(10000);

                            return renderer({
                                prepare({ audioWorkletNode }) {
                                    audioWorkletNode.disconnect(0);
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
                        let audioWorkletNode;

                        beforeEach(async function () {
                            this.timeout(10000);

                            await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                            audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                        });

                        it('should throw an InvalidAccessError', (done) => {
                            try {
                                audioWorkletNode.disconnect(new GainNode(context));
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

                        beforeEach(async function () {
                            this.timeout(10000);

                            values = [1, 1, 1, 1, 1];

                            await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                            renderer = createPredefinedRenderer(values);
                        });

                        it('should disconnect the destination', function () {
                            this.timeout(10000);

                            return renderer({
                                prepare({ audioWorkletNode, firstDummyGainNode }) {
                                    audioWorkletNode.disconnect(firstDummyGainNode);
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
                                prepare({ audioWorkletNode, secondDummyGainNode }) {
                                    audioWorkletNode.disconnect(secondDummyGainNode);
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
                    let audioWorkletNode;

                    beforeEach(async function () {
                        this.timeout(10000);

                        await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                        audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                    });

                    it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                        try {
                            audioWorkletNode.disconnect(new GainNode(context), -1);
                        } catch (err) {
                            expect(err.code).to.equal(1);
                            expect(err.name).to.equal('IndexSizeError');

                            done();
                        }
                    });

                    it('should throw an InvalidAccessError if there is no similar connection', (done) => {
                        try {
                            audioWorkletNode.disconnect(new GainNode(context), 0);
                        } catch (err) {
                            expect(err.code).to.equal(15);
                            expect(err.name).to.equal('InvalidAccessError');

                            done();
                        }
                    });
                });

                describe('with a destination, an output and an input', () => {
                    let audioWorkletNode;

                    beforeEach(async function () {
                        this.timeout(10000);

                        await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                        audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                    });

                    it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                        try {
                            audioWorkletNode.disconnect(new GainNode(context), -1, 0);
                        } catch (err) {
                            expect(err.code).to.equal(1);
                            expect(err.name).to.equal('IndexSizeError');

                            done();
                        }
                    });

                    it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                        try {
                            audioWorkletNode.disconnect(new GainNode(context), 0, -1);
                        } catch (err) {
                            expect(err.code).to.equal(1);
                            expect(err.name).to.equal('IndexSizeError');

                            done();
                        }
                    });

                    it('should throw an InvalidAccessError if there is no similar connection', (done) => {
                        try {
                            audioWorkletNode.disconnect(new GainNode(context), 0, 0);
                        } catch (err) {
                            expect(err.code).to.equal(15);
                            expect(err.name).to.equal('InvalidAccessError');

                            done();
                        }
                    });
                });
            });
        });
    }
});
