import 'core-js/es7/reflect';
import { UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER, unpatchedAudioContextConstructor } from '../../../../src/providers/unpatched-audio-context-constructor';
import { ReflectiveInjector } from '@angular/core';
import { WINDOW_PROVIDER } from '../../../../src/providers/window';
import { loadFixture } from '../../../helper/load-fixture';

describe('audioContextConstructor', () => {

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

    describe('decodeAudioData()', () => {

        // bug #43

        it('should not throw a DataCloneError', (done) => {
            loadFixture('1000-frames-of-noise.wav', (err, arrayBuffer) => {
                expect(err).to.be.null;

                audioContext
                    .decodeAudioData(arrayBuffer)
                    .then(() => audioContext.decodeAudioData(arrayBuffer))
                    .catch((err) => {
                        expect(err.code).to.not.equal(25);
                        expect(err.name).to.not.equal('DataCloneError');

                        done();
                    });
            });
        });

    });

});
