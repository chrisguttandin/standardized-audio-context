import { AudioContext } from '../../src/audio-contexts/audio-context';
import { AudioWorkletNode } from '../../src/audio-nodes/audio-worklet-node';
import { MinimalAudioContext } from '../../src/audio-contexts/minimal-audio-context';
import { MinimalOfflineAudioContext } from '../../src/audio-contexts/minimal-offline-audio-context';
import { OfflineAudioContext } from '../../src/audio-contexts/offline-audio-context';
import { addAudioWorkletModule } from '../../src/add-audio-worklet-module';

describe('AudioWorkletGlobalScope', () => {

    // @todo leche seems to need a unique string as identifier as first argument.
    leche.withData([
        [
            'constructor with AudioContext',
            () => new AudioContext(),
            (context, filename) => context.audioWorklet.addModule(`base/test/fixtures/${ filename }.js`)
        ], [
            'constructor with MinimalAudioContext',
            () => new MinimalAudioContext(),
            (context, filename) => addAudioWorkletModule(context, `base/test/fixtures/${ filename }.js`)
        ], [
            'constructor with OfflineAudioContext',
            () => new OfflineAudioContext({ length: 5, sampleRate: 44100 }),
            (context, filename) => context.audioWorklet.addModule(`base/test/fixtures/${ filename }.js`)
        ], [
            'constructor with MinimalOfflineAudioContext',
            () => new MinimalOfflineAudioContext({ length: 5, sampleRate: 44100 }),
            (context, filename) => addAudioWorkletModule(context, `base/test/fixtures/${ filename }.js`)
        ]
    ], (_, createContext, addAudioWorkletModule) => {

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

});
