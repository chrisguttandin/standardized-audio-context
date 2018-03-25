import { UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER, unpatchedAudioContextConstructor } from '../../../../src/providers/unpatched-audio-context-constructor';
import { ReflectiveInjector } from '@angular/core';
import { WINDOW_PROVIDER } from '../../../../src/providers/window';

describe('AudioWorklet', () => {

    let audioContext;
    let AudioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        const injector = ReflectiveInjector.resolveAndCreate([
            UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
            WINDOW_PROVIDER
        ]);

        AudioContext = injector.get(unpatchedAudioContextConstructor);

        audioContext = new AudioContext();
    });

    describe('with an unknown module', () => {

        // bug #60

        it('should throw an InvalidStateError', (done) => {
            try {
                new AudioWorkletNode(audioContext, 'unknown-processor'); // eslint-disable-line no-undef
            } catch (err) {
                expect(err.code).to.equal(11);
                expect(err.name).to.equal('InvalidStateError');

                done();
            }
        });

    });

    describe('with processorOptions set to null', () => {

        // bug #66

        it('should throw a TypeError', async () => {
            await audioContext.audioWorklet.addModule('base/test/fixtures/gain-processor.js');

            expect(() => {
                new AudioWorkletNode(audioContext, 'gain-processor', { processorOptions: null }); // eslint-disable-line no-undef
            }).to.throw(TypeError, "Failed to construct 'AudioWorkletNode': member processorOptions is not an object.");
        });

    });

});
