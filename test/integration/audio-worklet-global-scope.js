import { AudioWorkletNode, ConstantSourceNode, GainNode, addAudioWorkletModule as ddDWrkltMdl } from '../../src/module';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createAudioContext } from '../helper/create-audio-context';
import { createMinimalAudioContext } from '../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../helper/create-minimal-offline-audio-context';
import { createOfflineAudioContext } from '../helper/create-offline-audio-context';

const addAudioWorkletModuleWithAudioWorkletOfContext = (context, filename) => {
    return context.audioWorklet.addModule(`test/fixtures/${filename}.js`);
};
const addAudioWorkletModuleWithGlobalAudioWorklet = (context, filename) => {
    return ddDWrkltMdl(context, `test/fixtures/${filename}.js`);
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

describe('AudioWorkletGlobalScope', { skip: typeof window === 'undefined' }, () => {
    describe.for(Object.entries(testCases))('with the %s', ([, { addAudioWorkletModule, createContext }]) => {
        let context;

        afterEach(() => context.close?.());

        beforeEach(() => (context = createContext()));

        describe('currentFrame', () => {
            let audioWorkletNode;

            beforeEach(async () => {
                await addAudioWorkletModule(context, 'inspector-processor');

                audioWorkletNode = new AudioWorkletNode(context, 'inspector-processor');
            });

            it('should expose the currentFrame of the context in a callback', () => {
                const { promise, resolve } = Promise.withResolvers();

                audioWorkletNode.port.onmessage = ({ data }) => {
                    if ('currentFrame' in data && 'options' in data) {
                        audioWorkletNode.port.onmessage = null;

                        expect(data.currentFrame).to.be.a('number');

                        resolve();
                    }
                };

                audioWorkletNode.port.postMessage(null);

                return promise;
            });

            it('should expose the currentFrame of the context in the process() function', () => {
                const { promise, resolve } = Promise.withResolvers();

                audioWorkletNode.port.onmessage = ({ data }) => {
                    if ('currentFrame' in data && 'inputs' in data) {
                        audioWorkletNode.port.onmessage = null;

                        expect(data.currentFrame).to.be.a('number');

                        resolve();
                    }
                };

                context.startRendering?.();

                return promise;
            });

            it('should advance over time in a callback', () => {
                const { promise, resolve } = Promise.withResolvers();

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

                        resolve();
                    }
                };

                audioWorkletNode.port.postMessage(null);

                return promise;
            });

            it('should advance over time in the process() function', () => {
                const { promise, resolve } = Promise.withResolvers();

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

                        resolve();
                    }
                };

                context.startRendering?.();

                return promise;
            });
        });

        describe('currentTime', () => {
            let audioWorkletNode;

            beforeEach(async () => {
                await addAudioWorkletModule(context, 'inspector-processor');

                audioWorkletNode = new AudioWorkletNode(context, 'inspector-processor');
            });

            it('should expose the currentTime of the context in a callback', () => {
                const { promise, resolve } = Promise.withResolvers();

                audioWorkletNode.port.onmessage = ({ data }) => {
                    if ('currentTime' in data && 'options' in data) {
                        audioWorkletNode.port.onmessage = null;

                        expect(data.currentTime).to.be.a('number');

                        resolve();
                    }
                };

                audioWorkletNode.port.postMessage(null);

                return promise;
            });

            it('should expose the currentTime of the context in the process() function', () => {
                const { promise, resolve } = Promise.withResolvers();

                audioWorkletNode.port.onmessage = ({ data }) => {
                    if ('currentTime' in data && 'inputs' in data) {
                        audioWorkletNode.port.onmessage = null;

                        expect(data.currentTime).to.be.a('number');

                        resolve();
                    }
                };

                context.startRendering?.();

                return promise;
            });

            it('should advance over time in a callback', () => {
                const { promise, resolve } = Promise.withResolvers();

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

                        resolve();
                    }
                };

                audioWorkletNode.port.postMessage(null);

                return promise;
            });

            it('should advance over time in the process() function', () => {
                const { promise, resolve } = Promise.withResolvers();

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

                        resolve();
                    }
                };

                context.startRendering?.();

                return promise;
            });
        });

        describe('global', () => {
            let audioWorkletNode;

            beforeEach(async () => {
                await addAudioWorkletModule(context, 'inspector-processor');

                audioWorkletNode = new AudioWorkletNode(context, 'inspector-processor');
            });

            it('should not expose a global object', () => {
                const { promise, resolve } = Promise.withResolvers();

                audioWorkletNode.port.onmessage = ({ data }) => {
                    if ('typeOfGlobal' in data) {
                        audioWorkletNode.port.onmessage = null;

                        expect(data.typeOfGlobal).to.equal('undefined');

                        resolve();
                    }
                };

                audioWorkletNode.port.postMessage(null);

                return promise;
            });
        });

        describe('sampleRate', () => {
            let audioWorkletNode;

            beforeEach(async () => {
                await addAudioWorkletModule(context, 'inspector-processor');

                audioWorkletNode = new AudioWorkletNode(context, 'inspector-processor');
            });

            it('should expose the sampleRate of the context', () => {
                const { promise, resolve } = Promise.withResolvers();

                audioWorkletNode.port.onmessage = ({ data }) => {
                    if ('sampleRate' in data) {
                        audioWorkletNode.port.onmessage = null;

                        expect(data.sampleRate).to.equal(context.sampleRate);

                        resolve();
                    }
                };

                audioWorkletNode.port.postMessage(null);

                return promise;
            });
        });

        describe('self', () => {
            let audioWorkletNode;

            beforeEach(async () => {
                await addAudioWorkletModule(context, 'inspector-processor');

                audioWorkletNode = new AudioWorkletNode(context, 'inspector-processor');
            });

            it('should not expose a self object', () => {
                const { promise, resolve } = Promise.withResolvers();

                audioWorkletNode.port.onmessage = ({ data }) => {
                    if ('typeOfSelf' in data) {
                        audioWorkletNode.port.onmessage = null;

                        expect(data.typeOfSelf).to.equal('undefined');

                        resolve();
                    }
                };

                audioWorkletNode.port.postMessage(null);

                return promise;
            });
        });

        describe('window', () => {
            let audioWorkletNode;

            beforeEach(async () => {
                await addAudioWorkletModule(context, 'inspector-processor');

                audioWorkletNode = new AudioWorkletNode(context, 'inspector-processor');
            });

            it('should not expose a window object', () => {
                const { promise, resolve } = Promise.withResolvers();

                audioWorkletNode.port.onmessage = ({ data }) => {
                    if ('typeOfWindow' in data) {
                        audioWorkletNode.port.onmessage = null;

                        expect(data.typeOfWindow).to.equal('undefined');

                        resolve();
                    }
                };

                audioWorkletNode.port.postMessage(null);

                return promise;
            });
        });

        describe('AudioWorkletProcessor', () => {
            describe('process()', () => {
                describe('with a processor which transfers the arguments', () => {
                    let audioWorkletNode;

                    beforeEach(async () => {
                        await addAudioWorkletModule(context, 'transferring-processor');

                        audioWorkletNode = new AudioWorkletNode(context, 'transferring-processor');
                    });

                    it('should recover and continue calling process()', () => {
                        const { promise, resolve } = Promise.withResolvers();

                        let callCount = 0;

                        audioWorkletNode.port.onmessage = () => {
                            callCount += 1;

                            if (callCount > 3) {
                                audioWorkletNode.port.onmessage = null;

                                resolve();
                            }
                        };

                        context.startRendering?.();

                        return promise;
                    });
                });

                describe('with a processor which does not transfer the arguments', () => {
                    for (const numberOfOutputs of [0, 1]) {
                        describe(numberOfOutputs === 0 ? 'with no outputs' : 'with one output', () => {
                            let audioWorkletNode;

                            beforeEach(async () => {
                                await addAudioWorkletModule(context, 'inspector-processor');

                                audioWorkletNode = new AudioWorkletNode(context, 'inspector-processor', {
                                    channelCount: 1,
                                    numberOfOutputs
                                });
                            });

                            describe('inputs', () => {
                                describe('without any connection', () => {
                                    it('should call process() with an empty array for each input', () => {
                                        const { promise, resolve } = Promise.withResolvers();

                                        audioWorkletNode.port.onmessage = ({ data }) => {
                                            audioWorkletNode.port.onmessage = null;

                                            expect(data.inputs.length).to.equal(1);
                                            expect(data.inputs[0].length).to.equal(0);

                                            resolve();
                                        };

                                        context.startRendering?.();

                                        return promise;
                                    });
                                });

                                describe('with an active input connection', () => {
                                    let constantSourceNode;

                                    beforeEach(() => {
                                        constantSourceNode = new ConstantSourceNode(context);

                                        constantSourceNode.connect(audioWorkletNode);
                                    });

                                    it('should call process() with the current inputs', () => {
                                        const { promise, resolve } = Promise.withResolvers();

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

                                            resolve();
                                        };

                                        context.startRendering?.();

                                        return promise;
                                    });
                                });

                                describe('with an inactive input connection', () => {
                                    beforeEach(() => {
                                        new GainNode(context).connect(audioWorkletNode);
                                    });

                                    it('should call process() with the current inputs', () => {
                                        const { promise, resolve } = Promise.withResolvers();

                                        audioWorkletNode.port.onmessage = ({ data }) => {
                                            if (context.startRendering === undefined && data.currentTime < 0.1) {
                                                return;
                                            }

                                            audioWorkletNode.port.onmessage = null;

                                            expect(data.inputs.length).to.equal(1);
                                            expect(data.inputs[0].length).to.equal(0);

                                            resolve();
                                        };

                                        context.startRendering?.();

                                        return promise;
                                    });
                                });

                                describe(
                                    'with an output connection',
                                    { skip: typeof window === 'undefined' || numberOfOutputs === 0 },
                                    () => {
                                        beforeEach(() => {
                                            audioWorkletNode.connect(context.destination);
                                        });

                                        it('should call process() with an empty array for each input', () => {
                                            const { promise, resolve } = Promise.withResolvers();

                                            audioWorkletNode.port.onmessage = ({ data }) => {
                                                audioWorkletNode.port.onmessage = null;

                                                expect(data.inputs.length).to.equal(1);
                                                expect(data.inputs[0].length).to.equal(0);

                                                resolve();
                                            };

                                            context.startRendering?.();

                                            return promise;
                                        });
                                    }
                                );
                            });

                            describe('outputs', () => {
                                let zeros;

                                beforeEach(() => {
                                    zeros = Array.from({ length: 128 });

                                    zeros.fill(0);
                                });

                                describe('without any connection', () => {
                                    it('should call process() with the current outputs', () => {
                                        const { promise, resolve } = Promise.withResolvers();

                                        audioWorkletNode.port.onmessage = ({ data }) => {
                                            audioWorkletNode.port.onmessage = null;

                                            expect(data.outputs.length).to.equal(numberOfOutputs);

                                            for (let i = 0; i < numberOfOutputs; i += 1) {
                                                expect(data.outputs[i].length).to.equal(1);
                                                expect(Array.from(data.outputs[i][0])).to.deep.equal(zeros);
                                            }

                                            resolve();
                                        };

                                        context.startRendering?.();

                                        return promise;
                                    });
                                });

                                describe('with an input connection', () => {
                                    beforeEach(() => {
                                        new GainNode(context).connect(audioWorkletNode);
                                    });

                                    it('should call process() with the current outputs', () => {
                                        const { promise, resolve } = Promise.withResolvers();

                                        audioWorkletNode.port.onmessage = ({ data }) => {
                                            audioWorkletNode.port.onmessage = null;

                                            expect(data.outputs.length).to.equal(numberOfOutputs);

                                            for (let i = 0; i < numberOfOutputs; i += 1) {
                                                expect(data.outputs[i].length).to.equal(1);
                                                expect(Array.from(data.outputs[i][0])).to.deep.equal(zeros);
                                            }

                                            resolve();
                                        };

                                        context.startRendering?.();

                                        return promise;
                                    });
                                });

                                describe(
                                    'with an output connection',
                                    { skip: typeof window === 'undefined' || numberOfOutputs === 0 },
                                    () => {
                                        beforeEach(() => {
                                            audioWorkletNode.connect(context.destination);
                                        });

                                        it('should call process() with the current outputs', () => {
                                            const { promise, resolve } = Promise.withResolvers();

                                            audioWorkletNode.port.onmessage = ({ data }) => {
                                                audioWorkletNode.port.onmessage = null;

                                                expect(data.outputs.length).to.equal(numberOfOutputs);

                                                for (let i = 0; i < numberOfOutputs; i += 1) {
                                                    expect(data.outputs[i].length).to.equal(1);
                                                    expect(Array.from(data.outputs[i][0])).to.deep.equal(zeros);
                                                }

                                                resolve();
                                            };

                                            context.startRendering?.();

                                            return promise;
                                        });
                                    }
                                );
                            });

                            describe('parameters', () => {
                                let values;

                                beforeEach(() => {
                                    values = Array.from({ length: 128 });

                                    values.fill(1);
                                });

                                describe('without a parameter value change', () => {
                                    it('should call process() with the full array of values or a single value array for each parameter', () => {
                                        const { promise, resolve } = Promise.withResolvers();

                                        audioWorkletNode.port.onmessage = ({ data }) => {
                                            audioWorkletNode.port.onmessage = null;

                                            if (data.parameters.gain.length === 1) {
                                                expect(Array.from(data.parameters.gain)).to.deep.equal([values[0]]);
                                            } else {
                                                expect(Array.from(data.parameters.gain)).to.deep.equal(values);
                                            }

                                            resolve();
                                        };

                                        context.startRendering?.();

                                        return promise;
                                    });
                                });

                                describe('with a parameter value change in the current render quantum', () => {
                                    it('should call process() with the full array of values for each parameter', () => {
                                        const { promise, resolve } = Promise.withResolvers();

                                        values[0] = 0;

                                        audioWorkletNode.port.onmessage = ({ data }) => {
                                            if (data.parameters.gain[0] === 0) {
                                                audioWorkletNode.port.onmessage = null;

                                                expect(Array.from(data.parameters.gain)).to.deep.equal(values);

                                                resolve();
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

                                        return promise;
                                    });
                                });
                            });
                        });
                    }
                });
            });
        });

        describe('registerProcessor()', () => {
            // Bug #134: Chrome has the only native implementation so far and throws the expected error.
            describe(
                'with an empty string as name',
                { skip: typeof window === 'undefined' || window.AudioWorkletNode !== undefined },
                () => {
                    it('should throw an error', () => {
                        return addAudioWorkletModule(context, 'empty-string-processor').then(
                            () => {
                                // throw new Error('This should never be called.');
                            },
                            (err) => {
                                expect(err.code).to.equal(9);
                                expect(err.name).to.equal('NotSupportedError');
                            }
                        );
                    });
                }
            );

            // Bug #135: Chrome has the only native implementation so far and throws the expected error.
            describe('with a duplicate name', { skip: typeof window === 'undefined' || window.AudioWorkletNode !== undefined }, () => {
                beforeEach(async () => {
                    await addAudioWorkletModule(context, 'gain-processor');
                });

                it('should throw an error', () => {
                    return addAudioWorkletModule(context, 'duplicate-gain-processor').then(
                        () => {
                            // throw new Error('This should never be called.');
                        },
                        (err) => {
                            expect(err.code).to.equal(9);
                            expect(err.name).to.equal('NotSupportedError');
                        }
                    );
                });
            });

            describe('with a unique name', () => {
                // Bug #136: Chrome has the only native implementation so far and throws the expected error.
                describe(
                    'with a processor without a valid constructor',
                    { skip: typeof window === 'undefined' || window.AudioWorkletNode !== undefined },
                    () => {
                        it('should throw an error', () => {
                            return addAudioWorkletModule(context, 'unconstructible-processor').then(
                                () => {
                                    // throw new Error('This should never be called.');
                                },
                                (err) => {
                                    expect(err).to.be.an.instanceOf(TypeError);
                                }
                            );
                        });
                    }
                );

                // Bug #137: Chrome has the only native implementation so far and throws the expected error.
                describe(
                    'with a processor without a prototype',
                    { skip: typeof window === 'undefined' || window.AudioWorkletNode !== undefined },
                    () => {
                        it('should throw an error', () => {
                            return addAudioWorkletModule(context, 'prototypeless-processor').then(
                                () => {
                                    // throw new Error('This should never be called.');
                                },
                                (err) => {
                                    expect(err).to.be.an.instanceOf(TypeError);
                                }
                            );
                        });
                    }
                );

                describe('with a processor without a process function', () => {
                    it('should return a promise', () => {
                        return addAudioWorkletModule(context, 'processless-processor');
                    });
                });

                // Bug #139: Chrome has the only native implementation so far and throws the expected error.
                describe(
                    'with a processor with an invalid parameterDescriptors property',
                    { skip: typeof window === 'undefined' || window.AudioWorkletNode !== undefined },
                    () => {
                        it('should throw an error', () => {
                            return addAudioWorkletModule(context, 'invalid-parameter-descriptors-property-processor').then(
                                () => {
                                    throw new Error('This should never be called.');
                                },
                                (err) => {
                                    expect(err).to.be.an.instanceOf(TypeError);
                                }
                            );
                        });
                    }
                );

                describe('with a valid processor', () => {
                    it('should return a promise', () => {
                        return addAudioWorkletModule(context, 'gain-processor');
                    });
                });
            });
        });
    });
});
