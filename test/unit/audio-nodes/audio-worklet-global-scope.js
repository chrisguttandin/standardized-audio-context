import { AudioContext } from '../../../src/audio-contexts/audio-context';
import { AudioWorkletNode } from '../../../src/audio-nodes/audio-worklet-node';
import { MinimalAudioContext } from '../../../src/audio-contexts/minimal-audio-context';
import { MinimalOfflineAudioContext } from '../../../src/audio-contexts/minimal-offline-audio-context';
import { OfflineAudioContext } from '../../../src/audio-contexts/offline-audio-context';
import { addAudioWorkletModule } from '../../../src/add-audio-worklet-module';

describe('AudioWorkletGlobalScope', () => {

    // @todo leche seems to need a unique string as identifier as first argument.
    leche.withData([
        [
            'constructor with AudioContext',
            () => new AudioContext(),
            async (context) => {
                await context.audioWorklet.addModule('base/test/fixtures/inspector-processor.js');

                return new AudioWorkletNode(context, 'inspector-processor');
            }
        ], [
            'constructor with MinimalAudioContext',
            () => new MinimalAudioContext(),
            async (context) => {
                await addAudioWorkletModule(context, 'base/test/fixtures/inspector-processor.js');

                return new AudioWorkletNode(context, 'inspector-processor');
            }
        ], [
            'constructor with OfflineAudioContext',
            () => new OfflineAudioContext({ length: 5, sampleRate: 44100 }),
            async (context) => {
                await context.audioWorklet.addModule('base/test/fixtures/inspector-processor.js');

                return new AudioWorkletNode(context, 'inspector-processor');
            }
        ], [
            'constructor with MinimalOfflineAudioContext',
            () => new MinimalOfflineAudioContext({ length: 5, sampleRate: 44100 }),
            async (context) => {
                await addAudioWorkletModule(context, 'base/test/fixtures/inspector-processor.js');

                return new AudioWorkletNode(context, 'inspector-processor');
            }
        ]
    ], (_, createContext, createAudioWorkletNode) => {

        let audioWorkletNode;
        let context;

        afterEach(() => {
            if (context.close !== undefined) {
                return context.close();
            }
        });

        beforeEach(async () => {
            context = createContext();
            audioWorkletNode = await createAudioWorkletNode(context);
        });

        it('should expose the currentTime of the context', (done) => {
            audioWorkletNode.port.onmessage = ({ data }) => {
                expect(data.currentTime).to.be.a('number');

                done();
            };

            audioWorkletNode.port.postMessage(null);
        });

        it('should expose the sampleRate of the context', (done) => {
            audioWorkletNode.port.onmessage = ({ data }) => {
                expect(data.sampleRate).to.equal(context.sampleRate);

                done();
            };

            audioWorkletNode.port.postMessage(null);
        });


        it('should not expose a global object', (done) => {
            audioWorkletNode.port.onmessage = ({ data }) => {
                expect(data.typeOfGlobal).to.equal('undefined');

                done();
            };

            audioWorkletNode.port.postMessage(null);
        });


        it('should not expose a self object', (done) => {
            audioWorkletNode.port.onmessage = ({ data }) => {
                expect(data.typeOfSelf).to.equal('undefined');

                done();
            };

            audioWorkletNode.port.postMessage(null);
        });


        it('should not expose a window object', (done) => {
            audioWorkletNode.port.onmessage = ({ data }) => {
                expect(data.typeOfWindow).to.equal('undefined');

                done();
            };

            audioWorkletNode.port.postMessage(null);
        });

    });

});
