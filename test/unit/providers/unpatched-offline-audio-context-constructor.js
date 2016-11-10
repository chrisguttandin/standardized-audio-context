import 'core-js/es7/reflect';
import { UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER, unpatchedOfflineAudioContextConstructor } from '../../../src/providers/unpatched-offline-audio-context-constructor';
import { ReflectiveInjector } from '@angular/core';
import { Window } from '../../../src/providers/window';

describe('UnpatchedOfflineAudioContext', () => {

    let OfflineAudioContext,
        webkitOfflineAudioContext;

    beforeEach(() => {
        OfflineAudioContext = 'a fake OfflineAudioContext';

        webkitOfflineAudioContext = 'a fake webkitOfflineAudioContext';
    });

    it('should return null if there is no OfflineAudioContext', () => {
        const fakeWindow = {};

        const injector = ReflectiveInjector.resolveAndCreate([
            UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
            { provide: Window, useValue: fakeWindow }
        ]);

        expect(injector.get(unpatchedOfflineAudioContextConstructor)).to.equal(null);
    });

    it('should return the prefixed OfflineAudioContext', () => {
        const fakeWindow = {
            webkitOfflineAudioContext
        };

        const injector = ReflectiveInjector.resolveAndCreate([
            UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
            { provide: Window, useValue: fakeWindow }
        ]);

        expect(injector.get(unpatchedOfflineAudioContextConstructor)).to.equal(webkitOfflineAudioContext);
    });

    it('should return the unprefixed OfflineAudioContext', () => {
        const fakeWindow = {
            OfflineAudioContext
        };

        const injector = ReflectiveInjector.resolveAndCreate([
            UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
            { provide: Window, useValue: fakeWindow }
        ]);

        expect(injector.get(unpatchedOfflineAudioContextConstructor)).to.equal(OfflineAudioContext);
    });

    it('should return the unprefixed OfflineAudioContext even if there is a prefixed version as well', () => {
        const fakeWindow = {
            OfflineAudioContext,
            webkitOfflineAudioContext
        };

        const injector = ReflectiveInjector.resolveAndCreate([
            UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
            { provide: Window, useValue: fakeWindow }
        ]);

        expect(injector.get(unpatchedOfflineAudioContextConstructor)).to.equal(OfflineAudioContext);
    });

});
