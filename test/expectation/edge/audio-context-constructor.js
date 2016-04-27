'use strict';

require('reflect-metadata');

var angular = require('angular2/core'),
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

    describe('close()', function () {

        // bug #10

        it('should not be implemented', function () {
            expect(audioContext.close).to.be.undefined;
        });

    });

    describe('createGain()', function () {

        // bug #11

        it('should not be chainable', function () {
            var gainNodeA = audioContext.createGain(),
                gainNodeB = audioContext.createGain();

            expect(gainNodeA.connect(gainNodeB)).to.be.undefined;
        });

    });

    describe('createIIRFilter()', function () {

        // bug #9

        it('should not be implemented', function () {
            expect(audioContext.createIIRFilter).to.be.undefined;
        });

    });

});
