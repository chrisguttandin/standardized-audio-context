import '../helper/play-silence';
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
    'addAudioWorkletModule() with a MinimalAudioContext': {
        addAudioWorkletModule: addAudioWorkletModuleWithGlobalAudioWorklet,
        createContext: createMinimalAudioContext
    },
    'addAudioWorkletModule() with a MinimalOfflineAudioContext': {
        addAudioWorkletModule: addAudioWorkletModuleWithGlobalAudioWorklet,
        createContext: createMinimalOfflineAudioContext
    },
    'audioWorklet.addModule() with an AudioContext': {
        addAudioWorkletModule: addAudioWorkletModuleWithAudioWorkletOfContext,
        createContext: createAudioContext
    },
    'audioWorklet.addModule() with an OfflineAudioContext': {
        addAudioWorkletModule: addAudioWorkletModuleWithAudioWorkletOfContext,
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

            describe('currentFrame', () => {

                let audioWorkletNode;

                beforeEach(async () => {
                    await addAudioWorkletModule(context, 'inspector-processor');

                    audioWorkletNode = new AudioWorkletNode(context, 'inspector-processor');
                });

                it('should expose the currentFrame of the context', (done) => {
                    audioWorkletNode.port.onmessage = ({ data }) => {
                        if (data.currentFrame === undefined) {
                            return;
                        }

                        audioWorkletNode.port.onmessage = null;

                        expect(data.currentFrame).to.be.a('number');

                        done();
                    };

                    audioWorkletNode.port.postMessage(null);
                });

            });

            describe('currentTime', () => {

                let audioWorkletNode;

                beforeEach(async () => {
                    await addAudioWorkletModule(context, 'inspector-processor');

                    audioWorkletNode = new AudioWorkletNode(context, 'inspector-processor');
                });

                it('should expose the currentTime of the context', (done) => {
                    audioWorkletNode.port.onmessage = ({ data }) => {
                        if (data.currentTime === undefined) {
                            return;
                        }

                        audioWorkletNode.port.onmessage = null;

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
                        if (data.typeOfGlobal === undefined) {
                            return;
                        }

                        audioWorkletNode.port.onmessage = null;

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
                        if (data.sampleRate === undefined) {
                            return;
                        }

                        audioWorkletNode.port.onmessage = null;

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
                        if (data.typeOfSelf === undefined) {
                            return;
                        }

                        audioWorkletNode.port.onmessage = null;

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
                        if (data.typeOfWindow === undefined) {
                            return;
                        }

                        audioWorkletNode.port.onmessage = null;

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

                            // Bug #88: Chrome doesn't correctly handle that edge case.
                            if (window.AudioWorkletNode === undefined) {

                                it('should call process() with an empty array for each input', (done) => {
                                    audioWorkletNode.port.onmessage = ({ data }) => {
                                        audioWorkletNode.port.onmessage = null;

                                        expect(data.inputs.length).to.equal(1);
                                        expect(data.inputs[0].length).to.equal(0);

                                        done();
                                    };

                                    audioWorkletNode.connect(context.destination);

                                    if (context.startRendering !== undefined) {
                                        context.startRendering();
                                    }
                                });

                            }

                        });

                        describe('with a connected input', () => {

                            it('should call process() with the current inputs', (done) => {
                                const gainNode = new GainNode(context);

                                audioWorkletNode.port.onmessage = ({ data }) => {
                                    audioWorkletNode.port.onmessage = null;

                                    expect(data.inputs.length).to.equal(1);
                                    expect(data.inputs[0].length).to.equal(1);
                                    expect(data.inputs[0][0].length).to.equal(128);

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
                            const zeros = new Array(128);

                            zeros.fill(0);

                            audioWorkletNode.port.onmessage = ({ data }) => {
                                audioWorkletNode.port.onmessage = null;

                                expect(data.outputs.length).to.equal(1);
                                expect(data.outputs[0].length).to.equal(1);
                                expect(Array.from(data.outputs[0][0])).to.deep.equal(zeros);

                                done();
                            };

                            audioWorkletNode.connect(context.destination);

                            if (context.startRendering !== undefined) {
                                context.startRendering();
                            }
                        });

                    });

                    describe('parameters', () => {

                        let values;

                        beforeEach(() => {
                            values = new Array(128);

                            values.fill(1);
                        });

                        describe('without a parameter value change', () => {

                            it('should call process() with the full array of values or a single value array for each parameter', (done) => {
                                audioWorkletNode.port.onmessage = ({ data }) => {
                                    audioWorkletNode.port.onmessage = null;

                                    if (data.parameters.gain.length === 1) {
                                        expect(Array.from(data.parameters.gain)).to.deep.equal([ values[0] ]);
                                    } else {
                                        expect(Array.from(data.parameters.gain)).to.deep.equal(values);
                                    }

                                    done();
                                };

                                audioWorkletNode.connect(context.destination);

                                if (context.startRendering !== undefined) {
                                    context.startRendering();
                                }
                            });

                        });

                        describe('with a parameter value change in the current render quantum', () => {

                            it('should call process() with the full array of values for each parameter', (done) => {
                                values[0] = 0;

                                audioWorkletNode.port.onmessage = ({ data }) => {
                                    if (data.parameters.gain[0] === 0) {
                                        audioWorkletNode.port.onmessage = null;

                                        expect(Array.from(data.parameters.gain)).to.deep.equal(values);

                                        done();
                                    }
                                };

                                const currentTime = context.currentTime;
                                const renderQuantum = 128 / context.sampleRate;
                                const sample = 1 / context.sampleRate;
                                const gain = audioWorkletNode.parameters.get('gain');

                                for (let i = 0; i < 50; i += 1) {
                                    gain.setValueAtTime(0, currentTime + (renderQuantum * i));
                                    gain.setValueAtTime(1, currentTime + (renderQuantum * i) + sample);
                                }

                                audioWorkletNode.connect(context.destination);

                                if (context.startRendering !== undefined) {
                                    context.startRendering();
                                }
                            });

                        });

                    });

                });

            });

            describe('registerProcessor()', () => {

                describe('with an empty string as name', () => {

                    // @todo Chrome has the only native implementation so far and it doesn't throw the expected error.
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

                    // @todo Chrome has the only native implementation so far and it doesn't throw the expected error.
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

                    // @todo Chrome has the only native implementation so far and it doesn't throw the expected error.
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

                    // @todo Chrome has the only native implementation so far and it doesn't throw the expected error.
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

                    // @todo Chrome has the only native implementation so far and it doesn't throw the expected error.
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

                describe('with a processor with an invalid parameterDescriptors property', () => {

                    // @todo Chrome has the only native implementation so far and it doesn't throw the expected error.
                    if (window.AudioWorkletNode === undefined) {

                        it('should throw an error', (done) => {
                            addAudioWorkletModule(context, 'invalid-parameter-descriptors-property-processor')
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
