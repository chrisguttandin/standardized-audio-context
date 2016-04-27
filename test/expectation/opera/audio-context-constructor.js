'use strict';

require('reflect-metadata');

var angular = require('angular2/core'),
    sinon = require('sinon'),
    unpatchedAudioContextConstructor = require('../../../src/unpatched-audio-context-constructor.js').unpatchedAudioContextConstructor,
    wndw = require('../../../src/window.js').window;

describe('audioContextConstructor', function () {

    var audioContext,
        AudioContext;

    beforeEach(function () {
        var injector = angular.ReflectiveInjector.resolveAndCreate([
                angular.provide(unpatchedAudioContextConstructor, { useFactory: unpatchedAudioContextConstructor }),
                angular.provide(wndw, { useValue: window })
            ]);

        AudioContext = injector.get(unpatchedAudioContextConstructor);

        audioContext = new AudioContext();
    });

    describe('decodeAudioData()', function () {

        // bug #3

        it('should reject the promise with a TypeError', function (done) {
            audioContext
                .decodeAudioData(null)
                .catch(function (err) {
                    expect(err).to.be.an.instanceOf(TypeError);

                    expect(err.message).to.equal("Failed to execute 'decodeAudioData' on 'AudioContext': parameter 1 is not of type 'ArrayBuffer'."); // jshint ignore:line

                    done();
                });
        });

        // bug #6

        it('should not call the errorCallback at all', function (done) {
            var errorCallback = sinon.spy();

            audioContext.decodeAudioData(null, function () {}, errorCallback);

            setTimeout(function () {
                expect(errorCallback).to.have.not.been.called;

                done();
            }, 1000);
        });

    });

});
