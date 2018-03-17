import { AudioContext } from '../../src/audio-contexts/audio-context';
import { AudioWorkletNode } from '../../src/audio-nodes/audio-worklet-node';
import { MinimalAudioContext } from '../../src/audio-contexts/minimal-audio-context';
import { MinimalOfflineAudioContext } from '../../src/audio-contexts/minimal-offline-audio-context';
import { OfflineAudioContext } from '../../src/audio-contexts/offline-audio-context';
import { addAudioWorkletModule } from '../../src/add-audio-worklet-module';

describe('audioWorklet.addModule() / addAudioWorkletModule()', () => {

    // @todo leche seems to need a unique string as identifier as first argument.
    leche.withData([
        [ 'addAudioWorkletModule() with MinimalAudioContext', () => new MinimalAudioContext(), (context) => addAudioWorkletModule.bind(null, context) ],
        [ 'audioWorklet.addModule() with AudioContext', () => new AudioContext(), (context) => context.audioWorklet.addModule ],
        [ 'addAudioWorkletModule() with MinimalOfflineAudioContext', () => new MinimalOfflineAudioContext({ length: 5, sampleRate: 44100 }), (context) => addAudioWorkletModule.bind(null, context) ],
        [ 'audioWorklet.addModule() with OfflineAudioContext', () => new OfflineAudioContext({ length: 5, sampleRate: 44100 }), (context) => context.audioWorklet.addModule ]
    ], (_, createContext, createAddAudioWorkletModule) => {

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

        describe('with a missing module', () => {

            it('should return a promise which rejects an AbortError', (done) => {
                addAudioWorkletModule('base/test/fixtures/missing-processor.js')
                    .catch((err) => {
                        expect(err.code).to.equal(20);
                        expect(err.name).to.equal('AbortError');

                        done();
                    });
            });

        });

        describe('with an unparsable module', () => {

            it('should return a promise which rejects an AbortError', (done) => {
                addAudioWorkletModule('base/test/fixtures/unparsable-processor.xs')
                    .catch((err) => {
                        expect(err.code).to.equal(20);
                        expect(err.name).to.equal('AbortError');

                        done();
                    });
            });

        });

        describe('with a previously unknown module', () => {

            it('should return a resolving promise', () => {
                return addAudioWorkletModule('base/test/fixtures/gain-processor.js');
            });

            it('should not be possible to create an AudioWorkletNode', (done) => {
                try {
                    new AudioWorkletNode(context, 'gain-processor');
                } catch (err) {
                    expect(err.code).to.equal(9);
                    expect(err.name).to.equal('NotSupportedError');

                    done();
                }
            });

        });

        describe('with a previously added module', () => {

            beforeEach(() => {
                return addAudioWorkletModule('base/test/fixtures/gain-processor.js');
            });

            it('should return a resolving promise', () => {
                return addAudioWorkletModule('base/test/fixtures/gain-processor.js');
            });

            it('should be possible to create an AudioWorkletNode', () => {
                new AudioWorkletNode(context, 'gain-processor');
            });

        });

    });

});
