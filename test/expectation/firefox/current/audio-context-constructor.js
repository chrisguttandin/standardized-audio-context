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

        // bug #7

        it('should call the errorCallback with undefined', (done) => {
            loadFixture('one-pixel-of-transparency.png', (err, arrayBuffer) => {
                expect(err).to.be.null;

                audioContext.decodeAudioData(arrayBuffer, () => {}, (err) => {
                    expect(err).to.be.undefined;

                    done();
                });
            });
        });

    });

});
