import 'reflect-metadata';
import { ReflectiveInjector } from '@angular/core';
import { unpatchedAudioContextConstructor } from '../../src/unpatched-audio-context-constructor';
import { window as wndw } from '../../src/window';

describe('unpatchedAudioContextConstructor', function () {

    var AudioContext,
        injector,
        webkitAudioContext;

    beforeEach(function () {
        AudioContext = 'a fake AudioContext';

        webkitAudioContext = 'a fake webkitAudioContext';
    });

    it('should return null if there is no AudioContext', function () {
        var fakeWindow = {};

        injector = ReflectiveInjector.resolveAndCreate([
            { provide: unpatchedAudioContextConstructor, useFactory: unpatchedAudioContextConstructor },
            { provide: wndw, useValue: fakeWindow }
        ]);

        expect(injector.get(unpatchedAudioContextConstructor)).to.equal(null);
    });

    it('should return the prefixed AudioContext', function () {
        /* eslint-disable indent */
        var fakeWindow = {
                webkitAudioContext
            };
        /* eslint-enable indent */

        injector = ReflectiveInjector.resolveAndCreate([
            { provide: unpatchedAudioContextConstructor, useFactory: unpatchedAudioContextConstructor },
            { provide: wndw, useValue: fakeWindow }
        ]);

        expect(injector.get(unpatchedAudioContextConstructor)).to.equal(webkitAudioContext);
    });

    it('should return the unprefixed AudioContext', function () {
        /* eslint-disable indent */
        var fakeWindow = {
                AudioContext
            };
        /* eslint-enable indent */

        injector = ReflectiveInjector.resolveAndCreate([
            { provide: unpatchedAudioContextConstructor, useFactory: unpatchedAudioContextConstructor },
            { provide: wndw, useValue: fakeWindow }
        ]);

        expect(injector.get(unpatchedAudioContextConstructor)).to.equal(AudioContext);
    });

    it('should return the unprefixed AudioContext even if there is a prefixed version as well', function () {
        /* eslint-disable indent */
        var fakeWindow = {
                AudioContext,
                webkitAudioContext
            };
        /* eslint-enable indent */

        injector = ReflectiveInjector.resolveAndCreate([
            { provide: unpatchedAudioContextConstructor, useFactory: unpatchedAudioContextConstructor },
            { provide: wndw, useValue: fakeWindow }
        ]);

        expect(injector.get(unpatchedAudioContextConstructor)).to.equal(AudioContext);
    });

});
