import 'core-js/es7/reflect';
import { UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER, unpatchedAudioContextConstructor } from '../../../src/providers/unpatched-audio-context-constructor';
import { ReflectiveInjector } from '@angular/core';
import { window } from '../../../src/providers/window';

describe('UnpatchedAudioContext', () => {

    let AudioContext,
        webkitAudioContext;

    beforeEach(() => {
        AudioContext = 'a fake AudioContext';

        webkitAudioContext = 'a fake webkitAudioContext';
    });

    it('should return null if there is no AudioContext', () => {
        const fakeWindow = {};
        const injector = ReflectiveInjector.resolveAndCreate([
            UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
            { provide: window, useValue: fakeWindow }
        ]);

        expect(injector.get(unpatchedAudioContextConstructor)).to.equal(null);
    });

    it('should return the prefixed AudioContext', () => {
        const fakeWindow = {
            webkitAudioContext
        };
        const injector = ReflectiveInjector.resolveAndCreate([
            UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
            { provide: window, useValue: fakeWindow }
        ]);

        expect(injector.get(unpatchedAudioContextConstructor)).to.equal(webkitAudioContext);
    });

    it('should return the unprefixed AudioContext', () => {
        const fakeWindow = {
            AudioContext
        };
        const injector = ReflectiveInjector.resolveAndCreate([
            UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
            { provide: window, useValue: fakeWindow }
        ]);

        expect(injector.get(unpatchedAudioContextConstructor)).to.equal(AudioContext);
    });

    it('should return the unprefixed AudioContext even if there is a prefixed version as well', () => {
        const fakeWindow = {
            AudioContext,
            webkitAudioContext
        };
        const injector = ReflectiveInjector.resolveAndCreate([
            UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
            { provide: window, useValue: fakeWindow }
        ]);

        expect(injector.get(unpatchedAudioContextConstructor)).to.equal(AudioContext);
    });

});
