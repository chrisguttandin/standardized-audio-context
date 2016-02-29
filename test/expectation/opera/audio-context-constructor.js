'use strict';

require('reflect-metadata');

var angular = require('angular2/core'),
    loadFixture = require('../../helper/load-fixture.js'),
    unpatchedAudioContextConstructor = require('../../../src/unpatched-audio-context-constructor.js').unpatchedAudioContextConstructor,
    wndw = require('../../../src/window.js').window;

describe('audioContextConstructor', function () {

    var audioContext,
        AudioContext;

    beforeEach(function () {
        var injector = angular.Injector.resolveAndCreate([
                angular.provide(unpatchedAudioContextConstructor, { useFactory: unpatchedAudioContextConstructor }),
                angular.provide(wndw, { useValue: window })
            ]);

        AudioContext = injector.get(unpatchedAudioContextConstructor);

        audioContext = new AudioContext();
    });

    describe('decodeAudioData()', function () {

        // bug #1

        it('should require the success callback function as a parameter', function (done) {
            loadFixture('1000-frames-of-noise.wav', function (err, arrayBuffer) {
                expect(err).to.be.null;

                expect(function () {
                    audioContext.decodeAudioData(arrayBuffer);
                }).to.throw(TypeError, "Failed to execute 'decodeAudioData' on 'AudioContext': 2 arguments required, but only 1 present."); // jshint ignore:line

                done();
            });
        });

        // bug #2

        it('should throw a DOMException', function (done) {
            try {
                audioContext.decodeAudioData(null, function () {});
            } catch (err) {
                expect(err).to.be.an.instanceOf(DOMException); // jshint ignore:line

                expect(err.message).to.equal("Failed to execute 'decodeAudioData' on 'AudioContext': invalid ArrayBuffer for audioData."); // jshint ignore:line

                done();
            }
        });

        // bug #4

        it('should throw null when asked to decode an unsupported file', function (done) {
            this.timeout(5000);

            // PNG files are not supported by any browser :-)
            loadFixture('one-pixel-of-transparency.png', function (err, arrayBuffer) {
                expect(err).to.be.null;

                audioContext.decodeAudioData(arrayBuffer, function () {}, function (err) {
                    expect(err).to.be.null;

                    done();
                });
            });
        });

    });

});
