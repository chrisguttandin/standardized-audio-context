import { AudioWorkletNode } from '../../src/audio-nodes/audio-worklet-node';
import { addAudioWorkletModule } from '../../src/add-audio-worklet-module';
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
