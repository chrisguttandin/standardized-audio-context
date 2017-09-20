import 'core-js/es7/reflect';
import { UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER, unpatchedOfflineAudioContextConstructor } from '../../../../src/providers/unpatched-offline-audio-context-constructor';
import { ReflectiveInjector } from '@angular/core';
import { WINDOW_PROVIDER } from '../../../../src/providers/window';

describe('offlineAudioContextConstructor', () => {

    let OfflineAudioContext;

    beforeEach(() => {
        const injector = ReflectiveInjector.resolveAndCreate([
            UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
            WINDOW_PROVIDER
        ]);

        OfflineAudioContext = injector.get(unpatchedOfflineAudioContextConstructor);
    });

    describe('constructor()', () => {

        // bug #46

        it('should throw a TypeError', () => {
            expect(() => {
                new OfflineAudioContext({ length: 1, numberOfChannels: 1, sampleRate: 44100 });
            }).to.throw(TypeError);
        });

    });

});
