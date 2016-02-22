'use strict';

require('reflect-metadata');

var angular = require('angular2/core'),
    unpatchedOfflineAudioContextConstructor = require('../../../../src/unpatched-offline-audio-context-constructor.js').unpatchedOfflineAudioContextConstructor,
    wndw = require('../../../../src/window.js').window;

describe.only('offlineAudioContextConstructor', function () {

    var offlineAudioContext,
        OfflineAudioContext;

    beforeEach(function () {
        var injector = angular.Injector.resolveAndCreate([
                angular.provide(unpatchedOfflineAudioContextConstructor, { useFactory: unpatchedOfflineAudioContextConstructor }),
                angular.provide(wndw, { useValue: window })
            ]);

        OfflineAudioContext = injector.get(unpatchedOfflineAudioContextConstructor);

        offlineAudioContext = new OfflineAudioContext(1, 1, 44100);
    });

    describe('decodeAudioData()', function () {

        // bug #3

        it('should reject the promise with a TypeError', function (done) {
            offlineAudioContext
                .decodeAudioData(null)
                .catch(function (err) {
                    expect(err).to.be.an.instanceOf(TypeError);

                    expect(err.message).to.equal('Argument 1 of AudioContext.decodeAudioData is not an object.');

                    done();
                });
        });

    });

});
