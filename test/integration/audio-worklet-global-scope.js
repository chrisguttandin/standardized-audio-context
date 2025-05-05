import { AudioWorkletNode, ConstantSourceNode, GainNode, addAudioWorkletModule as ddDWrkltMdl } from '../../src/module';
import { createAudioContext } from '../helper/create-audio-context';
import { createMinimalAudioContext } from '../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../helper/create-minimal-offline-audio-context';
import { createOfflineAudioContext } from '../helper/create-offline-audio-context';

const addAudioWorkletModuleWithAudioWorkletOfContext = (context, filename) => {
    return context.audioWorklet.addModule(`base/test/fixtures/${filename}.js`);
};
const addAudioWorkletModuleWithGlobalAudioWorklet = (context, filename) => {
    return ddDWrkltMdl(context, `base/test/fixtures/${filename}.js`);
};
const testCases = {
    'addAudioWorkletModule() with a MinimalAudioContext': {
        addAudioWorkletModule: addAudioWorkletModuleWithGlobalAudioWorklet,
        createContext: createMinimalAudioContext
    },
    'addAudioWorkletModule() with a MinimalOfflineAudioContext': {
        addAudioWorkletModule: addAudioWorkletModuleWithGlobalAudioWorklet,
        createContext: () => createMinimalOfflineAudioContext({ length: 512 })
    },
    'audioWorklet.addModule() with an AudioContext': {
        addAudioWorkletModule: addAudioWorkletModuleWithAudioWorkletOfContext,
        createContext: createAudioContext
    },
    'audioWorklet.addModule() with an OfflineAudioContext': {
        addAudioWorkletModule: addAudioWorkletModuleWithAudioWorkletOfContext,
        createContext: () => createOfflineAudioContext({ length: 512 })
    }
};

if (typeof window !== 'undefined') {
    describe('AudioWorkletGlobalScope', () => {
        for (const [description, { addAudioWorkletModule, createContext }] of Object.entries(testCases)) {
            describe(`with the ${description}`, () => {
                let context;

                afterEach(() => context.close?.());

                beforeEach(() => (context = createContext()));

                describe('currentFrame', () => {
                    let audioWorkletNode;

                    beforeEach(async function () {
                        this.timeout(10000);

                        await addAudioWorkletModule(context, 'inspector-processor');

                        audioWorkletNode = new AudioWorkletNode(context, 'inspector-processor');
                    });

                    it('should expose the currentFrame of the context in a callback', (done) => {
                        audioWorkletNode.port.onmessage = ({ data }) => {
                            if ('currentFrame' in data && 'options' in data) {
                                audioWorkletNode.port.onmessage = null;

                                expect(data.currentFrame).to.be.a('number');

                                done();
                            }
                        };

                        audioWorkletNode.port.postMessage(null);
                    });

                    it('should expose the currentFrame of the context in the process() function', (done) => {
                        audioWorkletNode.port.onmessage = ({ data }) => {
                            if ('currentFrame' in data && 'inputs' in data) {
                                audioWorkletNode.port.onmessage = null;

                                expect(data.currentFrame).to.be.a('number');

                                done();
                            }
                        };

                        context.startRendering?.();
                    });

                    it('should advance over time in a callback', (done) => {
                        let firstValue = null;

                        audioWorkletNode.port.onmessage = ({ data }) => {
                            if (data.currentFrame === undefined || data.options === undefined) {
                                return;
                            }

                            if (firstValue === null) {
                                firstValue = data.currentFrame;

                                setTimeout(() => audioWorkletNode.port.postMessage(null), 1000);

                                context.startRendering?.();
                            } else {
                                audioWorkletNode.port.onmessage = null;

                                expect(data.currentFrame).to.above(firstValue);

                                done();
                            }
                        };

                        audioWorkletNode.port.postMessage(null);
                    });

                    it('should advance over time in the process() function', (done) => {
                        let firstValue = null;

                        audioWorkletNode.port.onmessage = ({ data }) => {
                            if (data.currentFrame === undefined || data.inputs === undefined) {
                                return;
                            }

                            if (firstValue === null) {
                                firstValue = data.currentFrame;
                            } else {
                                audioWorkletNode.port.onmessage = null;

                                expect(data.currentFrame).to.above(firstValue);

                                done();
                            }
                        };

                        context.startRendering?.();
                    });
                });

                describe('currentTime', () => {
                    let audioWorkletNode;

                    beforeEach(async function () {
                        this.timeout(10000);

                        await addAudioWorkletModule(context, 'inspector-processor');

                        audioWorkletNode = new AudioWorkletNode(context, 'inspector-processor');
                    });

                    it('should expose the currentTime of the context in a callback', (done) => {
                        audioWorkletNode.port.onmessage = ({ data }) => {
                            if ('currentTime' in data && 'options' in data) {
                                audioWorkletNode.port.onmessage = null;

                                expect(data.currentTime).to.be.a('number');

                                done();
                            }
                        };

                        audioWorkletNode.port.postMessage(null);
                    });

                    it('should expose the currentTime of the context in the process() function', (done) => {
                        audioWorkletNode.port.onmessage = ({ data }) => {
                            if ('currentTime' in data && 'inputs' in data) {
                                audioWorkletNode.port.onmessage = null;

                                expect(data.currentTime).to.be.a('number');

                                done();
                            }
                        };

                        context.startRendering?.();
                    });

                    it('should advance over time in a callback', (done) => {
                        let firstValue = null;

                        audioWorkletNode.port.onmessage = ({ data }) => {
                            if (data.currentTime === undefined || data.options === undefined) {
                                return;
                            }

                            if (firstValue === null) {
                                firstValue = data.currentTime;

                                setTimeout(() => audioWorkletNode.port.postMessage(null), 1000);

                                context.startRendering?.();
                            } else {
                                audioWorkletNode.port.onmessage = null;

                                expect(data.currentTime).to.above(firstValue);

                                done();
                            }
                        };

                        audioWorkletNode.port.postMessage(null);
                    });

                    it('should advance over time in the process() function', (done) => {
                        let firstValue = null;

                        audioWorkletNode.port.onmessage = ({ data }) => {
                            if (data.currentTime === undefined || data.inputs === undefined) {
                                return;
                            }

                            if (firstValue === null) {
                                firstValue = data.currentTime;
                            } else {
                                audioWorkletNode.port.onmessage = null;

                                expect(data.currentTime).to.above(firstValue);

                                done();
                            }
                        };

                        context.startRendering?.();
                    });
                });

                describe('global', () => {
                    let audioWorkletNode;

                    beforeEach(async function () {
                        this.timeout(10000);

                        await addAudioWorkletModule(context, 'inspector-processor');

                        audioWorkletNode = new AudioWorkletNode(context, 'inspector-processor');
                    });

                    it('should not expose a global object', (done) => {
                        audioWorkletNode.port.onmessage = ({ data }) => {
                            if ('typeOfGlobal' in data) {
                                audioWorkletNode.port.onmessage = null;

                                expect(data.typeOfGlobal).to.equal('undefined');

                                done();
                            }
                        };

                        audioWorkletNode.port.postMessage(null);
                    });
                });

                describe('sampleRate', () => {
                    let audioWorkletNode;

                    beforeEach(async function () {
                        this.timeout(10000);

                        await addAudioWorkletModule(context, 'inspector-processor');

                        audioWorkletNode = new AudioWorkletNode(context, 'inspector-processor');
                    });

                    it('should expose the sampleRate of the context', (done) => {
                        audioWorkletNode.port.onmessage = ({ data }) => {
                            if ('sampleRate' in data) {
                                audioWorkletNode.port.onmessage = null;

                                expect(data.sampleRate).to.equal(context.sampleRate);

                                done();
                            }
                        };

                        audioWorkletNode.port.postMessage(null);
                    });
                });

                describe('self', () => {
                    let audioWorkletNode;

                    beforeEach(async function () {
                        this.timeout(10000);

                        await addAudioWorkletModule(context, 'inspector-processor');

                        audioWorkletNode = new AudioWorkletNode(context, 'inspector-processor');
                    });

                    it('should not expose a self object', (done) => {
                        audioWorkletNode.port.onmessage = ({ data }) => {
                            if ('typeOfSelf' in data) {
                                audioWorkletNode.port.onmessage = null;

                                expect(data.typeOfSelf).to.equal('undefined');

                                done();
                            }
                        };

                        audioWorkletNode.port.postMessage(null);
                    });
                });

                describe('window', () => {
                    let audioWorkletNode;

                    beforeEach(async function () {
                        this.timeout(10000);

                        await addAudioWorkletModule(context, 'inspector-processor');

                        audioWorkletNode = new AudioWorkletNode(context, 'inspector-processor');
                    });

                    it('should not expose a window object', (done) => {
                        audioWorkletNode.port.onmessage = ({ data }) => {
                            if ('typeOfWindow' in data) {
                                audioWorkletNode.port.onmessage = null;

                                expect(data.typeOfWindow).to.equal('undefined');

                                done();
                            }
                        };

                        audioWorkletNode.port.postMessage(null);
                    });
                });

                describe('AudioWorkletProcessor', () => {
                    describe('process()', () => {
                        describe('with a processor which transfers the arguments', () => {
                            let audioWorkletNode;

                            beforeEach(async function () {
                                this.timeout(10000);

                                await addAudioWorkletModule(context, 'transferring-processor');

                                audioWorkletNode = new AudioWorkletNode(context, 'transferring-processor');
                            });

                            it('should recover and continue calling process()', function (done) {
                                this.timeout(10000);

                                let callCount = 0;

                                audioWorkletNode.port.onmessage = () => {
                                    callCount += 1;

                                    if (callCount > 3) {
                                        audioWorkletNode.port.onmessage = null;

                                        done();
                                    }
                                };

                                context.startRendering?.();
                            });
                        });

                        describe('with a processor which does not transfer the arguments', () => {
                            for (const numberOfOutputs of [0, 1]) {
                                describe(numberOfOutputs === 0 ? 'with no outputs' : 'with one output', () => {
                                    let audioWorkletNode;

                                    beforeEach(async function () {
                                        this.timeout(10000);

                                        await addAudioWorkletModule(context, 'inspector-processor');

                                        audioWorkletNode = new AudioWorkletNode(context, 'inspector-processor', {
                                            channelCount: 1,
                                            numberOfOutputs
                                        });
                                    });

                                    describe('inputs', () => {
                                        describe('without any connection', () => {
                                            it('should call process() with an empty array for each input', (done) => {
                                                audioWorkletNode.port.onmessage = ({ data }) => {
                                                    audioWorkletNode.port.onmessage = null;

                                                    expect(data.inputs.length).to.equal(1);
                                                    expect(data.inputs[0].length).to.equal(0);

                                                    done();
                                                };

                                                context.startRendering?.();
                                            });
                                        });

                                        describe('with an active input connection', () => {
                                            let constantSourceNode;

                                            beforeEach(() => {
                                                constantSourceNode = new ConstantSourceNode(context);

                                                constantSourceNode.connect(audioWorkletNode);
                                            });

                                            it('should call process() with the current inputs', (done) => {
                                                constantSourceNode.start();

                                                audioWorkletNode.port.onmessage = ({ data }) => {
                                                    if (context.startRendering === undefined && data.currentTime < 0.1) {
                                                        return;
                                                    }

                                                    audioWorkletNode.port.onmessage = null;

                                                    constantSourceNode.stop();
                                                    constantSourceNode.disconnect(audioWorkletNode);

                                                    expect(data.inputs.length).to.equal(1);
                                                    expect(data.inputs[0].length).to.equal(1);
                                                    expect(data.inputs[0][0].length).to.equal(128);

                                                    done();
                                                };

                                                context.startRendering?.();
                                            });
                                        });

                                        describe('with an inactive input connection', () => {
                                            beforeEach(() => {
                                                new GainNode(context).connect(audioWorkletNode);
                                            });

                                            it('should call process() with the current inputs', (done) => {
                                                audioWorkletNode.port.onmessage = ({ data }) => {
                                                    if (context.startRendering === undefined && data.currentTime < 0.1) {
                                                        return;
                                                    }

                                                    audioWorkletNode.port.onmessage = null;

                                                    expect(data.inputs.length).to.equal(1);
                                                    expect(data.inputs[0].length).to.equal(0);

                                                    done();
                                                };

                                                context.startRendering?.();
                                            });
                                        });

                                        if (numberOfOutputs > 0) {
                                            describe('with an output connection', () => {
                                                beforeEach(() => {
                                                    audioWorkletNode.connect(context.destination);
                                                });

                                                it('should call process() with an empty array for each input', (done) => {
                                                    audioWorkletNode.port.onmessage = ({ data }) => {
                                                        audioWorkletNode.port.onmessage = null;

                                                        expect(data.inputs.length).to.equal(1);
                                                        expect(data.inputs[0].length).to.equal(0);

                                                        done();
                                                    };

                                                    context.startRendering?.();
                                                });
                                            });
                                        }
                                    });

                                    describe('outputs', () => {
                                        let zeros;

                                        beforeEach(() => {
                                            zeros = Array.from({ length: 128 });

                                            zeros.fill(0);
                                        });

                                        describe('without any connection', () => {
                                            it('should call process() with the current outputs', (done) => {
                                                audioWorkletNode.port.onmessage = ({ data }) => {
                                                    audioWorkletNode.port.onmessage = null;

                                                    expect(data.outputs.length).to.equal(numberOfOutputs);

                                                    for (let i = 0; i < numberOfOutputs; i += 1) {
                                                        expect(data.outputs[i].length).to.equal(1);
                                                        expect(Array.from(data.outputs[i][0])).to.deep.equal(zeros);
                                                    }

                                                    done();
                                                };

                                                context.startRendering?.();
                                            });
                                        });

                                        describe('with an input connection', () => {
                                            beforeEach(() => {
                                                new GainNode(context).connect(audioWorkletNode);
                                            });

                                            it('should call process() with the current outputs', (done) => {
                                                audioWorkletNode.port.onmessage = ({ data }) => {
                                                    audioWorkletNode.port.onmessage = null;

                                                    expect(data.outputs.length).to.equal(numberOfOutputs);

                                                    for (let i = 0; i < numberOfOutputs; i += 1) {
                                                        expect(data.outputs[i].length).to.equal(1);
                                                        expect(Array.from(data.outputs[i][0])).to.deep.equal(zeros);
                                                    }

                                                    done();
                                                };

                                                context.startRendering?.();
                                            });
                                        });

                                        if (numberOfOutputs > 0) {
                                            describe('with an output connection', () => {
                                                beforeEach(() => {
                                                    audioWorkletNode.connect(context.destination);
                                                });

                                                it('should call process() with the current outputs', (done) => {
                                                    audioWorkletNode.port.onmessage = ({ data }) => {
                                                        audioWorkletNode.port.onmessage = null;

                                                        expect(data.outputs.length).to.equal(numberOfOutputs);

                                                        for (let i = 0; i < numberOfOutputs; i += 1) {
                                                            expect(data.outputs[i].length).to.equal(1);
                                                            expect(Array.from(data.outputs[i][0])).to.deep.equal(zeros);
                                                        }

                                                        done();
                                                    };

                                                    context.startRendering?.();
                                                });
                                            });
                                        }
                                    });

                                    describe('parameters', () => {
                                        let values;

                                        beforeEach(() => {
                                            values = Array.from({ length: 128 });

                                            values.fill(1);
                                        });

                                        describe('without a parameter value change', () => {
                                            it('should call process() with the full array of values or a single value array for each parameter', (done) => {
                                                audioWorkletNode.port.onmessage = ({ data }) => {
                                                    audioWorkletNode.port.onmessage = null;

                                                    if (data.parameters.gain.length === 1) {
                                                        expect(Array.from(data.parameters.gain)).to.deep.equal([values[0]]);
                                                    } else {
                                                        expect(Array.from(data.parameters.gain)).to.deep.equal(values);
                                                    }

                                                    done();
                                                };

                                                context.startRendering?.();
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

                                                const renderQuantum = 128 / context.sampleRate;
                                                const currentTime = Math.ceil(context.currentTime / renderQuantum) * renderQuantum;
                                                const sample = 0.9 / context.sampleRate;
                                                const gain = audioWorkletNode.parameters.get('gain');

                                                for (let i = 0; i < 50; i += 1) {
                                                    gain.setValueAtTime(0, currentTime + renderQuantum * i);
                                                    gain.setValueAtTime(1, currentTime + renderQuantum * i + sample);
                                                }

                                                context.startRendering?.();
                                            });
                                        });
                                    });
                                });
                            }
                        });
                    });
                });

                describe('registerProcessor()', () => {
                    describe('with an empty string as name', () => {
                        // Bug #134: Chrome has the only native implementation so far and throws the expected error.
                        if (window.AudioWorkletNode === undefined) {
                            it('should throw an error', function (done) {
                                this.timeout(10000);

                                addAudioWorkletModule(context, 'empty-string-processor').catch((err) => {
                                    expect(err.code).to.equal(9);
                                    expect(err.name).to.equal('NotSupportedError');

                                    done();
                                });
                            });
                        }
                    });

                    describe('with a duplicate name', () => {
                        beforeEach(async function () {
                            this.timeout(10000);

                            await addAudioWorkletModule(context, 'gain-processor');
                        });

                        // Bug #135: Chrome has the only native implementation so far and throws the expected error.
                        if (window.AudioWorkletNode === undefined) {
                            it('should throw an error', function (done) {
                                this.timeout(10000);

                                addAudioWorkletModule(context, 'duplicate-gain-processor').catch((err) => {
                                    expect(err.code).to.equal(9);
                                    expect(err.name).to.equal('NotSupportedError');

                                    done();
                                });
                            });
                        }
                    });

                    describe('with a unique name', () => {
                        describe('with a processor without a valid constructor', () => {
                            // Bug #136: Chrome has the only native implementation so far and throws the expected error.
                            if (window.AudioWorkletNode === undefined) {
                                it('should throw an error', function (done) {
                                    this.timeout(10000);

                                    addAudioWorkletModule(context, 'unconstructible-processor').catch((err) => {
                                        expect(err).to.be.an.instanceOf(TypeError);

                                        done();
                                    });
                                });
                            }
                        });

                        describe('with a processor without a prototype', () => {
                            // Bug #137: Chrome has the only native implementation so far and throws the expected error.
                            if (window.AudioWorkletNode === undefined) {
                                it('should throw an error', function (done) {
                                    this.timeout(10000);

                                    addAudioWorkletModule(context, 'prototypeless-processor').catch((err) => {
                                        expect(err).to.be.an.instanceOf(TypeError);

                                        done();
                                    });
                                });
                            }
                        });

                        describe('with a processor without a process function', () => {
                            it('should return a promise', function () {
                                this.timeout(10000);

                                return addAudioWorkletModule(context, 'processless-processor');
                            });
                        });

                        describe('with a processor with an invalid parameterDescriptors property', () => {
                            // Bug #139: Chrome has the only native implementation so far and throws the expected error.
                            if (window.AudioWorkletNode === undefined) {
                                it('should throw an error', function (done) {
                                    this.timeout(10000);

                                    addAudioWorkletModule(context, 'invalid-parameter-descriptors-property-processor').catch((err) => {
                                        expect(err).to.be.an.instanceOf(TypeError);

                                        done();
                                    });
                                });
                            }
                        });

                        describe('with a valid processor', () => {
                            it('should return a promise', function () {
                                this.timeout(10000);

                                return addAudioWorkletModule(context, 'gain-processor');
                            });
                        });
                    });
                });
            });
        }
    });
}
