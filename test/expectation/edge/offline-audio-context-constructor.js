'use strict';

require('reflect-metadata');

var angular = require('angular2/core'),
    unpatchedOfflineAudioContextConstructor = require('../../../src/unpatched-offline-audio-context-constructor.js').unpatchedOfflineAudioContextConstructor,
    wndw = require('../../../src/window.js').window;

describe('offlineAudioContextConstructor', function () {

    var offlineAudioContext,
        OfflineAudioContext;

    beforeEach(function () {
        var injector = angular.Injector.resolveAndCreate([
                angular.provide(unpatchedOfflineAudioContextConstructor, { useFactory: unpatchedOfflineAudioContextConstructor }),
                angular.provide(wndw, { useValue: window })
            ]);

        OfflineAudioContext = injector.get(unpatchedOfflineAudioContextConstructor);

        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    describe('createIIRFilter()', function () {

        // bug #9

        it('should not be implemented', function () {
            expect(offlineAudioContext.createIIRFilter).to.be.undefined;
        });

    });

});
