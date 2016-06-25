import 'reflect-metadata';
import { ReflectiveInjector } from '@angular/core';
import { unpatchedOfflineAudioContextConstructor } from '../../../../src/unpatched-offline-audio-context-constructor';
import { window as wndw } from '../../../../src/window';

describe('offlineAudioContextConstructor', function () {

    var offlineAudioContext,
        OfflineAudioContext;

    beforeEach(function () {
        /* eslint-disable indent */
        var injector = ReflectiveInjector.resolveAndCreate([
                { provide: unpatchedOfflineAudioContextConstructor, useFactory: unpatchedOfflineAudioContextConstructor },
                { provide: wndw, useValue: window }
            ]);
        /* eslint-enable indent */

        OfflineAudioContext = injector.get(unpatchedOfflineAudioContextConstructor);

        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    describe('length', function () {

        // bug #17

        it('should not expose its length', function () {
            expect(offlineAudioContext.length).to.be.undefined;
        });

    });

});
