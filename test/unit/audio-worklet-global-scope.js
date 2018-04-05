import { AudioWorkletNode, GainNode, addAudioWorkletModule } from '../../src/module';
import { createAudioContext } from '../helper/create-audio-context';
import { createMinimalAudioContext } from '../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../helper/create-minimal-offline-audio-context';
import { createOfflineAudioContext } from '../helper/create-offline-audio-context';

const addAudioWorkletModuleWithAudioWorkletOfContext = (context, filename) => {
    return context.audioWorklet.addModule(`base/test/fixtures/${ filename }.js`);
};
const addAudioWorkletModuleWithGlobalAudioWorklet = (context, filename) => {
    return addAudioWorkletModule(context, `base/test/fixtures/${ filename }.js`);
};
const testCases = {
    'addAudioWorkletModule() with MinimalAudioContext': {
        addAudioWorkletModule: addAudioWorkletModuleWithGlobalAudioWorklet,
        createContext: createMinimalAudioContext
    },
    'addAudioWorkletModule() with MinimalOfflineAudioContext': {
        addAudioWorkletModule: addAudioWorkletModuleWithGlobalAudioWorklet,
        createContext: createMinimalOfflineAudioContext
    },
    'audioWorklet.addModule() with AudioContext': {
        addAudioWorkletModule: addAudioWorkletModuleWithAudioWorkletOfContext,
        createContext: createAudioContext
    },
    'audioWorklet.addModule() with OfflineAudioContext': {
        addAudioWorkletModule: addAudioWorkletModuleWithAudioWorkletOfContext,
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

describe('AudioWorkletGlobalScope', () => {

    for (const [ description, { addAudioWorkletModule, createContext } ] of Object.entries(testCases)) {

        describe(`with the ${ description }`, () => {

            let context;

            afterEach(() => {
                if (context.close !== undefined) {
                    return context.close();
                }
            });

            beforeEach(() => {
                context = createContext();
            });

            describe('currentTime', () => {

                let audioWorkletNode;

                beforeEach(async () => {
                    await addAudioWorkletModule(context, 'inspector-processor');

                    audioWorkletNode = new AudioWorkletNode(context, 'inspector-processor');
                });

                it('should expose the currentTime of the context', (done) => {
                    audioWorkletNode.port.onmessage = ({ data }) => {
                        expect(data.currentTime).to.be.a('number');

                        done();
                    };

                    audioWorkletNode.port.postMessage(null);
                });

            });

            describe('global', () => {

                let audioWorkletNode;

                beforeEach(async () => {
                    await addAudioWorkletModule(context, 'inspector-processor');

                    audioWorkletNode = new AudioWorkletNode(context, 'inspector-processor');
                });

                it('should not expose a global object', (done) => {
                    audioWorkletNode.port.onmessage = ({ data }) => {
                        expect(data.typeOfGlobal).to.equal('undefined');

                        done();
                    };

                    audioWorkletNode.port.postMessage(null);
                });

            });

            describe('sampleRate', () => {

                let audioWorkletNode;

                beforeEach(async () => {
                    await addAudioWorkletModule(context, 'inspector-processor');

                    audioWorkletNode = new AudioWorkletNode(context, 'inspector-processor');
                });

                it('should expose the sampleRate of the context', (done) => {
                    audioWorkletNode.port.onmessage = ({ data }) => {
                        expect(data.sampleRate).to.equal(context.sampleRate);

                        done();
                    };

                    audioWorkletNode.port.postMessage(null);
                });

            });

            describe('self', () => {

                let audioWorkletNode;

                beforeEach(async () => {
                    await addAudioWorkletModule(context, 'inspector-processor');

                    audioWorkletNode = new AudioWorkletNode(context, 'inspector-processor');
                });

                it('should not expose a self object', (done) => {
                    audioWorkletNode.port.onmessage = ({ data }) => {
                        expect(data.typeOfSelf).to.equal('undefined');

                        done();
                    };

                    audioWorkletNode.port.postMessage(null);
                });

            });

            describe('window', () => {

                let audioWorkletNode;

                beforeEach(async () => {
                    await addAudioWorkletModule(context, 'inspector-processor');

                    audioWorkletNode = new AudioWorkletNode(context, 'inspector-processor');
                });

                it('should not expose a window object', (done) => {
                    audioWorkletNode.port.onmessage = ({ data }) => {
                        expect(data.typeOfWindow).to.equal('undefined');

                        done();
                    };

                    audioWorkletNode.port.postMessage(null);
                });

            });

            describe('AudioWorkletProcessor', () => {

                let audioWorkletNode;

                beforeEach(async () => {
                    await addAudioWorkletModule(context, 'inspector-processor');

                    audioWorkletNode = new AudioWorkletNode(context, 'inspector-processor', {
                        channelCount: 1
                    });
                });

                describe('process()', () => {

                    describe('inputs', () => {

                        describe('without any connected input', () => {

                            it('should call process() with an empty array for each input', (done) => {
                                audioWorkletNode.port.onmessage = ({ data }) => {
                                    expect(data.inputs.length).to.equal(1);
                                    expect(data.inputs[0].length).to.equal(1);
                                    expect(data.inputs[0][0].length).to.equal(0);

                                    audioWorkletNode.port.onmessage = null;

                                    done();
                                };

                                audioWorkletNode.connect(context.destination);

                                if (context.startRendering !== undefined) {
                                    context.startRendering();
                                }
                            });

                        });

                        describe('with a connected input', () => {

                            it('should call process() with the current inputs', (done) => {
                                const gainNode = new GainNode(context);

                                audioWorkletNode.port.onmessage = ({ data }) => {
                                    expect(data.inputs.length).to.equal(1);
                                    expect(data.inputs[0].length).to.equal(1);
                                    expect(data.inputs[0][0].length).to.equal(128);

                                    audioWorkletNode.port.onmessage = null;

                                    done();
                                };

                                gainNode
                                    .connect(audioWorkletNode)
                                    .connect(context.destination);

                                if (context.startRendering !== undefined) {
                                    context.startRendering();
                                }
                            });

                        });

                    });

                    describe('outputs', () => {

                        it('should call process() with the current outputs', (done) => {
                            audioWorkletNode.port.onmessage = ({ data }) => {
                                expect(data.outputs.length).to.equal(1);
                                expect(data.outputs[0].length).to.equal(1);
                                expect(data.outputs[0][0].length).to.equal(128);

                                audioWorkletNode.port.onmessage = null;

                                done();
                            };

                            audioWorkletNode.connect(context.destination);

                            if (context.startRendering !== undefined) {
                                context.startRendering();
                            }
                        });

                    });

                    describe('parameters', () => {

                        it('should call process() with the full array of values for each parameter', (done) => {
                            const values = new Array(128);

                            values.fill(1);

                            audioWorkletNode.port.onmessage = ({ data }) => {
                                expect(Array.from(data.parameters.gain)).to.deep.equal(values);

                                audioWorkletNode.port.onmessage = null;

                                done();
                            };

                            audioWorkletNode.connect(context.destination);

                            if (context.startRendering !== undefined) {
                                context.startRendering();
                            }
                        });

                    });

                });

            });

            describe('registerProcessor()', () => {

                describe('with an empty string as name', () => {

                    // @todo Chrome Canary has the only native implementation so far and it doesn't throw the expected error.
                    if (window.AudioWorkletNode === undefined) {

                        it('should throw an error', (done) => {
                            addAudioWorkletModule(context, 'empty-string-processor')
                                .catch((err) => {
                                    expect(err.code).to.equal(9);
                                    expect(err.name).to.equal('NotSupportedError');

                                    done();
                                });
                        });

                    }

                });

                describe('with a duplicate name', () => {

                    beforeEach(async () => {
                        await addAudioWorkletModule(context, 'gain-processor');
                    });

                    // @todo Chrome Canary has the only native implementation so far and it doesn't throw the expected error.
                    if (window.AudioWorkletNode === undefined) {

                        it('should throw an error', (done) => {
                            addAudioWorkletModule(context, 'duplicate-gain-processor')
                                .catch((err) => {
                                    expect(err.code).to.equal(9);
                                    expect(err.name).to.equal('NotSupportedError');

                                    done();
                                });
                        });

                    }

                });

                describe('with a processor without a valid constructor', () => {

                    // @todo Chrome Canary has the only native implementation so far and it doesn't throw the expected error.
                    if (window.AudioWorkletNode === undefined) {

                        it('should throw an error', (done) => {
                            addAudioWorkletModule(context, 'unconstructible-processor')
                                .catch((err) => {
                                    expect(err).to.be.an.instanceOf(TypeError);

                                    done();
                                });
                        });

                    }

                });

                describe('with a processor without a prototype', () => {

                    // @todo Chrome Canary has the only native implementation so far and it doesn't throw the expected error.
                    if (window.AudioWorkletNode === undefined) {

                        it('should throw an error', (done) => {
                            addAudioWorkletModule(context, 'prototypeless-processor')
                                .catch((err) => {
                                    expect(err).to.be.an.instanceOf(TypeError);

                                    done();
                                });
                        });

                    }

                });

                describe('with a processor without a process function', () => {

                    // @todo Chrome Canary has the only native implementation so far and it doesn't throw the expected error.
                    if (window.AudioWorkletNode === undefined) {

                        it('should throw an error', (done) => {
                            addAudioWorkletModule(context, 'processless-processor')
                                .catch((err) => {
                                    expect(err).to.be.an.instanceOf(TypeError);

                                    done();
                                });
                        });

                    }

                });

                describe('with a processor without parameterDescriptors', () => {

                    // @todo Chrome Canary has the only native implementation so far and it doesn't throw the expected error.
                    if (window.AudioWorkletNode === undefined) {

                        it('should throw an error', (done) => {
                            addAudioWorkletModule(context, 'paramless-processor')
                                .catch((err) => {
                                    expect(err).to.be.an.instanceOf(TypeError);

                                    done();
                                });
                        });

                    }

                });

            });

        });

    }

});
