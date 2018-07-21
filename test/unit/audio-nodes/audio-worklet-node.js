import { AudioBuffer, AudioBufferSourceNode, AudioWorkletNode, ConstantSourceNode, GainNode } from '../../../src/module';
import { addAudioWorkletModule } from '../../../src/add-audio-worklet-module';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';

const createAddAudioWorkletModuleWithAudioWorkletOfContext = (context) => {
    return context.audioWorklet.addModule;
};
const createAddAudioWorkletModuleWithGlobalAudioWorklet = (context) => {
    return addAudioWorkletModule.bind(null, context);
};
const createAudioWorkletNode = (context, filename, options = null) => {
    if (options === null) {
        return new AudioWorkletNode(context, filename);
    }

    return new AudioWorkletNode(context, filename, options);
};
const testCases = {
    'constructor with AudioContext': {
        createAddAudioWorkletModule: createAddAudioWorkletModuleWithAudioWorkletOfContext,
        createContext: createAudioContext
    },
    'constructor with MinimalAudioContext': {
        createAddAudioWorkletModule: createAddAudioWorkletModuleWithGlobalAudioWorklet,
        createContext: createMinimalAudioContext
    },
    'constructor with MinimalOfflineAudioContext': {
        createAddAudioWorkletModule: createAddAudioWorkletModuleWithGlobalAudioWorklet,
        createContext: createMinimalOfflineAudioContext
    },
    'constructor with OfflineAudioContext': {
        createAddAudioWorkletModule: createAddAudioWorkletModuleWithAudioWorkletOfContext,
        createContext: createOfflineAudioContext
    }
};

// @todo Skip about 50% of the test cases when running on Travis to prevent the browsers from crashing while running the tests.
if (process.env.TRAVIS) { // eslint-disable-line no-undef
    for (const description of Object.keys(testCases)) {
        if (Math.random() < 0.5) {
            delete testCases[ description ];
        }
    }
}

describe('AudioWorkletNode', () => {

    for (const [ description, { createAddAudioWorkletModule, createContext } ] of Object.entries(testCases)) {

        describe(`with the ${ description }`, () => {

            let addAudioWorkletModule;
            let context;

            afterEach(() => {
                if (context.close !== undefined) {
                    return context.close();
                }
            });

            beforeEach(() => {
                context = createContext();
                addAudioWorkletModule = createAddAudioWorkletModule(context);
            });

            describe('constructor()', () => {

                describe('without any options', () => {

                    beforeEach(() => addAudioWorkletModule('base/test/fixtures/inspector-processor.js'));

                    it('should pass on the default options to the AudioWorkletProcessor', (done) => {
                        const audioWorkletNode = createAudioWorkletNode(context, 'inspector-processor');

                        audioWorkletNode.port.onmessage = ({ data }) => {
                            audioWorkletNode.port.onmessage = null;

                            expect(data.options).to.deep.equal({
                                channelCount: 2,
                                channelCountMode: 'explicit',
                                channelInterpretation: 'speakers',
                                numberOfInputs: 1,
                                numberOfOutputs: 1,
                                outputChannelCount: [ 2 ],
                                parameterData: { },
                                processorOptions: { }
                            });

                            done();
                        };

                        audioWorkletNode.port.postMessage(null);
                    });

                    it('should return an instance of the EventTarget interface', () => {
                        const audioWorkletNode = createAudioWorkletNode(context, 'inspector-processor');

                        expect(audioWorkletNode.addEventListener).to.be.a('function');
                        expect(audioWorkletNode.dispatchEvent).to.be.a('function');
                        expect(audioWorkletNode.removeEventListener).to.be.a('function');
                    });

                    it('should return an instance of the AudioNode interface', () => {
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

                    it('should return an instance of the AudioWorkletNode interface', () => {
                        const audioWorkletNode = createAudioWorkletNode(context, 'inspector-processor');

                        expect(audioWorkletNode.onprocessorerror).to.be.null;
                        expect(audioWorkletNode.parameters).not.to.be.undefined;
                        expect(audioWorkletNode.port).to.be.an.instanceOf(MessagePort);
                    });

                    it('should throw an error if the AudioContext is closed', (done) => {
                        ((context.close === undefined) ? context.startRendering() : context.close())
                            .then(() => createAudioWorkletNode(context, 'inspector-processor'))
                            .catch((err) => {
                                expect(err.code).to.equal(11);
                                expect(err.name).to.equal('InvalidStateError');

                                context.close = undefined;

                                done();
                            });
                    });

                });

                describe('with invalid options', () => {

                    beforeEach(() => addAudioWorkletModule('base/test/fixtures/inspector-processor.js'));

                    describe('with numberOfInputs and numberOfOutputs both set to zero', () => {

                        it('should throw an NotSupportedError', (done) => {
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
                                createAudioWorkletNode(context, 'inspector-processor', { outputChannelCount: [ ] });
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
                                createAudioWorkletNode(context, 'inspector-processor', { outputChannelCount: [ 4, 2 ] });
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                    });

                    describe('with an invalid value for one of the outputs specified in outputChannelCount', () => {

                        it('should throw an NotSupportedError', (done) => {
                            try {
                                createAudioWorkletNode(context, 'inspector-processor', { outputChannelCount: [ 0 ] });
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
                                audioWorkletNode.port.onmessage = null;

                                expect(data.options.parameterData).to.deep.equal(parameterData);

                                done();
                            };

                            audioWorkletNode.port.postMessage(null);
                        });

                    });

                });

                describe('with valid options', () => {

                    it('should return an instance with the given channelCount', async () => {
                        await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                        const channelCount = 4;
                        const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor', { channelCount });

                        expect(audioWorkletNode.channelCount).to.equal(channelCount);
                    });

                    // Bug #61: Specifying a different channelCountMode is currently forbidden.

                    it('should return an instance with the given channelInterpretation', async () => {
                        await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                        const channelInterpretation = 'discrete';
                        const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor', { channelInterpretation });

                        expect(audioWorkletNode.channelInterpretation).to.equal(channelInterpretation);
                    });

                    it('should return an instance with the given numberOfInputs', async () => {
                        await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                        const numberOfInputs = 2;
                        const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor', { numberOfInputs });

                        expect(audioWorkletNode.numberOfInputs).to.equal(numberOfInputs);
                    });

                    it('should return an instance with the given numberOfOutputs', async () => {
                        await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                        const numberOfOutputs = 0;
                        const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor', { numberOfOutputs });

                        expect(audioWorkletNode.numberOfOutputs).to.equal(numberOfOutputs);
                    });

                    it('should pass on the parameterData to the AudioWorkletProcessor', (done) => {
                        addAudioWorkletModule('base/test/fixtures/inspector-processor.js')
                            .then(() => {
                                const parameterData = { gain: 12 };
                                const audioWorkletNode = createAudioWorkletNode(context, 'inspector-processor', { parameterData });

                                audioWorkletNode.port.onmessage = ({ data }) => {
                                    audioWorkletNode.port.onmessage = null;

                                    expect(data.options.parameterData).to.deep.equal(parameterData);

                                    done();
                                };

                                audioWorkletNode.port.postMessage(null);
                            });
                    });

                    it('should throw a DataCloneError when provided with an unclonable value', (done) => {
                        addAudioWorkletModule('base/test/fixtures/inspector-processor.js')
                            .then(() => createAudioWorkletNode(context, 'inspector-processor', { processorOptions: { fn: () => { } } }))
                            .catch((err) => {
                                expect(err.code).to.equal(25);
                                expect(err.name).to.equal('DataCloneError');

                                done();
                            });
                    });

                    it('should pass on the processorOptions to the AudioWorkletProcessor', (done) => {
                        addAudioWorkletModule('base/test/fixtures/inspector-processor.js')
                            .then(() => {
                                const processorOptions = { an: 'arbitrary', object: [ 'with', 'some', 'values' ] };
                                const audioWorkletNode = createAudioWorkletNode(context, 'inspector-processor', { processorOptions });

                                audioWorkletNode.port.onmessage = ({ data }) => {
                                    audioWorkletNode.port.onmessage = null;

                                    expect(data.options.processorOptions).to.deep.equal(processorOptions);

                                    done();
                                };

                                audioWorkletNode.port.postMessage(null);
                            });
                    });

                });

            });

            describe('channelCount', () => {

                let audioWorkletNode;

                beforeEach(async () => {
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

                beforeEach(async () => {
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

                beforeEach(async () => {
                    await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                    audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                });

                it('should be assignable to another value', () => {
                    const channelInterpretation = 'discrete';

                    audioWorkletNode.channelInterpretation = channelInterpretation;

                    expect(audioWorkletNode.channelInterpretation).to.equal(channelInterpretation);
                });

            });

            describe('numberOfOutputs', () => {

                let audioWorkletNode;

                beforeEach(async () => {
                    await addAudioWorkletModule('base/test/fixtures/inspector-processor.js');

                    audioWorkletNode = createAudioWorkletNode(context, 'inspector-processor', {
                        numberOfOutputs: 0
                    });
                });

                it('should call process() even without any output', (done) => {
                    audioWorkletNode.port.onmessage = ({ data: { inputs, outputs } }) => {
                        if (inputs !== undefined) {
                            audioWorkletNode.port.onmessage = null;

                            expect(inputs.length).to.equal(1);
                            // @todo Test the number of inputs.
                            expect(inputs[0][0].length).to.equal(128);

                            expect(outputs.length).to.equal(0);

                            done();
                        }
                    };

                    const constantSourceNode = new ConstantSourceNode(context);

                    constantSourceNode.connect(audioWorkletNode);
                    constantSourceNode.start();

                    if (context.startRendering !== undefined) {
                        context.startRendering();
                    }
                });

            });

            describe('onprocessorerror', () => {

                it('should be null', async () => {
                    await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                    const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');

                    expect(audioWorkletNode.onprocessorerror).to.be.null;
                });

                it('should be assignable to a function', async () => {
                    await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                    const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                    const fn = () => {};
                    const onprocessorerror = audioWorkletNode.onprocessorerror = fn; // eslint-disable-line no-multi-assign

                    expect(onprocessorerror).to.equal(fn);
                    expect(audioWorkletNode.onprocessorerror).to.equal(fn);
                });

                it('should be assignable to null', async () => {
                    await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                    const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                    const onprocessorerror = audioWorkletNode.onprocessorerror = null; // eslint-disable-line no-multi-assign

                    expect(onprocessorerror).to.be.null;
                    expect(audioWorkletNode.onprocessorerror).to.be.null;
                });

                it('should not be assignable to something else', async () => {
                    await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                    const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                    const string = 'no function or null value';

                    audioWorkletNode.onprocessorerror = () => {};

                    const onprocessorerror = audioWorkletNode.onprocessorerror = string; // eslint-disable-line no-multi-assign

                    expect(onprocessorerror).to.equal(string);
                    expect(audioWorkletNode.onprocessorerror).to.be.null;
                });

                it('should fire an assigned processorerror event listener', (done) => {
                    addAudioWorkletModule('base/test/fixtures/failing-processor.js')
                        .then(() => {
                            const audioWorkletNode = createAudioWorkletNode(context, 'failing-processor');

                            audioWorkletNode.onprocessorerror = (event) => {
                                expect(event).to.be.an.instanceOf(Event);
                                expect(event.type).to.equal('processorerror');

                                done();
                            };

                            audioWorkletNode.connect(context.destination);

                            if (context.startRendering !== undefined) {
                                context.startRendering();
                            }
                        });
                });

            });

            describe('parameters', () => {

                it('should return an instance of the AudioParamMap interface', async () => {
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

                    beforeEach(async () => {
                        await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                        const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');

                        parameters = audioWorkletNode.parameters;
                        entries = parameters.entries();
                    });

                    it('should return an instance of the Iterator interface', () => {
                        expect(entries.next).to.be.a('function');
                    });

                    it('should iterate over all entries', () => {
                        expect(Array.from(entries)).to.deep.equal([ [ 'gain', parameters.get('gain') ] ]);
                    });

                });

                describe('forEach()', () => {

                    let parameters;

                    beforeEach(async () => {
                        await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                        const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');

                        parameters = audioWorkletNode.parameters;
                    });

                    it('should iterate over all parameters', () => {
                        const args = [ ];

                        parameters.forEach((value, key, map) => {
                            args.push({ key, map, value });
                        });

                        expect(args).to.deep.equal([ {
                            key: 'gain',
                            map: parameters,
                            value: parameters.get('gain')
                        } ]);
                    });

                });

                describe('get()', () => {

                    let parameters;

                    beforeEach(async () => {
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

                        it('should return an instance of the AudioParam interface', () => {
                            expect(gain.cancelScheduledValues).to.be.a('function');
                            expect(gain.defaultValue).to.equal(1);
                            expect(gain.exponentialRampToValueAtTime).to.be.a('function');
                            expect(gain.linearRampToValueAtTime).to.be.a('function');
                            // Bug #82: Chrome's native implementation is a little different from other AudioParams.
                            expect(gain.maxValue).to.be.at.least(3.402820018375656e+38);
                            expect(gain.minValue).to.be.at.most(-3.402820018375656e+38);
                            expect(gain.setTargetAtTime).to.be.a('function');
                            expect(gain.setValueAtTime).to.be.a('function');
                            expect(gain.setValueCurveAtTime).to.be.a('function');
                            expect(gain.value).to.equal(1);
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

                            it('should be chainable', () => {
                                expect(gain.setValueAtTime(new Float32Array([ 1 ]), 0, 0)).to.equal(gain);
                            });

                        });

                    });

                });

                describe('has()', () => {

                    let parameters;

                    beforeEach(async () => {
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

                    beforeEach(async () => {
                        await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                        const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');

                        keys = audioWorkletNode.parameters.keys();
                    });

                    it('should return an instance of the Iterator interface', () => {
                        expect(keys.next).to.be.a('function');
                    });

                    it('should iterate over all keys', () => {
                        expect(Array.from(keys)).to.deep.equal([ 'gain' ]);
                    });

                });

                describe('values()', () => {

                    let values;
                    let parameters;

                    beforeEach(async () => {
                        await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                        const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');

                        parameters = audioWorkletNode.parameters;
                        values = parameters.values();
                    });

                    it('should return an instance of the Iterator interface', () => {
                        expect(values.next).to.be.a('function');
                    });

                    it('should iterate over all values', () => {
                        expect(Array.from(values)).to.deep.equal([ parameters.get('gain') ]);
                    });

                });

                // @todo Symbol.iterator

                describe('automation', () => {

                    let renderer;
                    let values;

                    beforeEach(async function () {
                        this.timeout(10000);

                        values = [ 1, 0.5, 0, -0.5, -1 ];

                        await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                        renderer = createRenderer({
                            context,
                            length: (context.length === undefined) ? 5 : undefined,
                            prepare (destination) {
                                const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                                const audioBufferSourceNode = new AudioBufferSourceNode(context);
                                const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');

                                audioBuffer.copyToChannel(new Float32Array(values), 0);

                                audioBufferSourceNode.buffer = audioBuffer;

                                audioBufferSourceNode
                                    .connect(audioWorkletNode)
                                    .connect(destination);

                                return { audioBufferSourceNode, audioWorkletNode };
                            }
                        });
                    });

                    describe('without any automation', () => {

                        it('should not modify the signal', function () {
                            this.timeout(10000);

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
                            this.timeout(10000);

                            return renderer({
                                prepare ({ audioWorkletNode }) {
                                    audioWorkletNode.parameters.get('gain').value = 0.5;
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
                            this.timeout(10000);

                            return renderer({
                                start (startTime, { audioBufferSourceNode, audioWorkletNode }) {
                                    audioWorkletNode.parameters.get('gain').setValueAtTime(0.5, startTime + (2 / context.sampleRate));

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
                            this.timeout(10000);

                            return renderer({
                                start (startTime, { audioBufferSourceNode, audioWorkletNode }) {
                                    audioWorkletNode.parameters.get('gain').setValueCurveAtTime(new Float32Array([ 0, 0.25, 0.5, 0.75, 1 ]), startTime, (6 / context.sampleRate));

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
                            this.timeout(10000);

                            return renderer({
                                prepare ({ audioWorkletNode }) {
                                    const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                                    const audioBufferSourceNodeForAudioParam = new AudioBufferSourceNode(context);

                                    audioBuffer.copyToChannel(new Float32Array([ 0.5, 0.5, 0.5, 0.5, 0.5 ]), 0);

                                    audioBufferSourceNodeForAudioParam.buffer = audioBuffer;

                                    audioWorkletNode.parameters.get('gain').value = 0;

                                    audioBufferSourceNodeForAudioParam.connect(audioWorkletNode.parameters.get('gain'));

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

            });

            describe('port', () => {

                let audioWorkletNode;

                beforeEach(async () => {
                    await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                    audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                });

                it('should echo any message', (done) => {
                    const message = { a: 'simple', test: 'message' };

                    audioWorkletNode.port.onmessage = ({ data }) => {
                        audioWorkletNode.port.onmessage = null;

                        expect(data).to.deep.equal(message);

                        done();
                    };

                    audioWorkletNode.port.postMessage(message);
                });

            });

            describe('connect()', () => {

                let audioWorkletNode;

                beforeEach(async () => {
                    await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                    audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                });

                it('should be chainable', () => {
                    const gainNode = new GainNode(context);

                    expect(audioWorkletNode.connect(gainNode)).to.equal(gainNode);
                });

                it('should not be connectable to an AudioNode of another AudioContext', (done) => {
                    const anotherContext = createContext();

                    try {
                        audioWorkletNode.connect(anotherContext.destination);
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
                        audioWorkletNode.connect(gainNode.gain);
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
                        audioWorkletNode.connect(gainNode.gain, -1);
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

                beforeEach(async function () {
                    this.timeout(10000);

                    values = [ 1, 1, 1, 1, 1 ];

                    await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                    renderer = createRenderer({
                        context,
                        length: (context.length === undefined) ? 5 : undefined,
                        prepare (destination) {
                            const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                            const audioBufferSourceNode = new AudioBufferSourceNode(context);
                            const audioWorkletNode = createAudioWorkletNode(context, 'gain-processor');
                            const firstDummyGainNode = new GainNode(context);
                            const secondDummyGainNode = new GainNode(context);

                            audioBuffer.copyToChannel(new Float32Array(values), 0);

                            audioBufferSourceNode.buffer = audioBuffer;

                            audioBufferSourceNode
                                .connect(audioWorkletNode)
                                .connect(firstDummyGainNode)
                                .connect(destination);

                            audioWorkletNode.connect(secondDummyGainNode);

                            return { audioBufferSourceNode, audioWorkletNode, firstDummyGainNode, secondDummyGainNode };
                        }
                    });
                });

                it('should be possible to disconnect a destination', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ audioWorkletNode, firstDummyGainNode }) {
                            audioWorkletNode.disconnect(firstDummyGainNode);
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
                        prepare ({ audioWorkletNode, secondDummyGainNode }) {
                            audioWorkletNode.disconnect(secondDummyGainNode);
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
                        prepare ({ audioWorkletNode }) {
                            audioWorkletNode.disconnect();
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
