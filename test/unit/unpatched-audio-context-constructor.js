'use strict';

require('reflect-metadata');

var angular = require('angular2/core'),
    unpatchedAudioContextConstructor = require('../../src/unpatched-audio-context-constructor.js').unpatchedAudioContextConstructor,
    wndw = require('../../src/window.js').window;

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

        injector = new angular.Injector.resolveAndCreate([
            angular.provide(unpatchedAudioContextConstructor, { useFactory: unpatchedAudioContextConstructor }),
            angular.provide(wndw, { useValue: fakeWindow })
        ]);

        expect(injector.get(unpatchedAudioContextConstructor)).to.equal(null);
    });

    it('should return the prefixed AudioContext', function () {
        var fakeWindow = {
                webkitAudioContext: webkitAudioContext
            };

        injector = new angular.Injector.resolveAndCreate([
            angular.provide(unpatchedAudioContextConstructor, { useFactory: unpatchedAudioContextConstructor }),
            angular.provide(window, { useValue: fakeWindow })
        ]);

        expect(injector.get(unpatchedAudioContextConstructor)).to.equal(webkitAudioContext);
    });

    it('should return the unprefixed AudioContext', function () {
        var fakeWindow = {
                AudioContext: AudioContext
            };

        injector = new angular.Injector.resolveAndCreate([
            angular.provide(unpatchedAudioContextConstructor, { useFactory: unpatchedAudioContextConstructor }),
            angular.provide(window, { useValue: fakeWindow })
        ]);

        expect(injector.get(unpatchedAudioContextConstructor)).to.equal(AudioContext);
    });

    it('should return the unprefixed AudioContext even if there is a prefixed version as well', function () {
        var fakeWindow = {
                AudioContext: AudioContext,
                webkitAudioContext: webkitAudioContext
            };

        injector = new angular.Injector.resolveAndCreate([
            angular.provide(unpatchedAudioContextConstructor, { useFactory: unpatchedAudioContextConstructor }),
            angular.provide(window, { useValue: fakeWindow })
        ]);

        expect(injector.get(unpatchedAudioContextConstructor)).to.equal(AudioContext);
    });

});
