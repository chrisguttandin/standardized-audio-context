'use strict';

require('reflect-metadata');

var angular = require('angular2/core'),
    loadFixture = require('../../helper/load-fixture.js'),
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

        offlineAudioContext = new OfflineAudioContext(1, 25600, 44100);
    });

    describe('decodeAudioData()', function () {

        // bug #1

        it('should require the success callback function as a parameter', function (done) {
            loadFixture('1000-frames-of-noise.wav', function (err, arrayBuffer) {
                expect(err).to.be.null;

                expect(function () {
                    offlineAudioContext.decodeAudioData(arrayBuffer);
                }).to.throw(TypeError, 'Not enough arguments');

                done();
            });
        });

        // bug #2

        it('should throw a DOMException', function (done) {
            try {
                offlineAudioContext.decodeAudioData(null, function () {});
            } catch (err) {
                expect(err).to.be.an.instanceOf(DOMException); // jshint ignore:line

                expect(err.message).to.equal('SyntaxError: DOM Exception 12');

                done();
            }
        });

        // bug #5

        it('should return an AudioBuffer without copyFromChannel() and copyToChannel() methods', function (done) {
            loadFixture('1000-frames-of-noise.wav', function (err, arrayBuffer) {
                expect(err).to.be.null;

                offlineAudioContext.decodeAudioData(arrayBuffer, function (audioBuffer) {
                    expect(audioBuffer.copyFromChannel).to.be.undefined;
                    expect(audioBuffer.copyToChannel).to.be.undefined;

                    done();
                });
            });
        });

    });

});
