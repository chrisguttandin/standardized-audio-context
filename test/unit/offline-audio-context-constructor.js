'use strict';

require('reflect-metadata');

var angular = require('angular2/core'),
    AudioBufferWrapper = require('../../src/wrapper/audio-buffer.js').AudioBufferWrapper,
    EncodingErrorFactory = require('../../src/factories/encoding-error').EncodingErrorFactory,
    loadFixture = require('../helper/load-fixture.js'),
    NotSupportedErrorFactory = require( '../../src/factories/not-supported-error').NotSupportedErrorFactory,
    offlineAudioContextConstructor = require('../../src/offline-audio-context-constructor.js').offlineAudioContextConstructor,
    PromiseSupportTester = require('../../src/tester/promise-support').PromiseSupportTester,
    unpatchedOfflineAudioContextConstructor = require('../../src/unpatched-offline-audio-context-constructor.js').unpatchedOfflineAudioContextConstructor,
    wndw = require('../../src/window.js').window;

describe('offlineAudioContextConstructor', function () {

    var offlineAudioContext,
        OfflineAudioContext;

    beforeEach(function () {
        var injector = angular.Injector.resolveAndCreate([
                AudioBufferWrapper,
                EncodingErrorFactory,
                NotSupportedErrorFactory,
                PromiseSupportTester,
                angular.provide(offlineAudioContextConstructor, { useFactory: offlineAudioContextConstructor }),
                angular.provide(unpatchedOfflineAudioContextConstructor, { useFactory: unpatchedOfflineAudioContextConstructor }),
                angular.provide(wndw, { useValue: window })
            ]);

        OfflineAudioContext = injector.get(offlineAudioContextConstructor);

        offlineAudioContext = new OfflineAudioContext(1, 1, 44100);
    });

    describe('decodeAudioData()', function () {

        it('should return a promise', function () {
            expect(offlineAudioContext.decodeAudioData()).to.be.an.instanceOf(Promise);
        });

        it('should throw an error when called without a valid arrayBuffer', function (done) {
            offlineAudioContext
                .decodeAudioData(null)
                .catch(function (err) {
                    expect(err.code).to.equal(9);
                    expect(err.name).to.equal('NotSupportedError');

                    done();
                });
        });

        it('should throw an error when asked to decode an unsupported file', function (done) {
            this.timeout(5000);

            // PNG files are not supported by any browser :-)
            loadFixture('one-pixel-of-transparency.png', function (err, arrayBuffer) {
                expect(err).to.be.null;

                offlineAudioContext
                    .decodeAudioData(arrayBuffer)
                    .catch(function (err) {
                        expect(err.code).to.equal(0);
                        expect(err.name).to.equal('EncodingError');

                        done();
                    });
            });
        });

        it('should decode an arrayBuffer and return an instance of the AudioBuffer interface', function (done) {
            loadFixture('1000-frames-of-noise.wav', function (err, arrayBuffer) {
                expect(err).to.be.null;

                offlineAudioContext
                    .decodeAudioData(arrayBuffer)
                    .then(function (audioBuffer) {
                        expect(audioBuffer.duration).to.be.closeTo(1000 / 44100, 0.001);
                        expect(audioBuffer.length).to.equal(1000);
                        expect(audioBuffer.numberOfChannels).to.equal(2);
                        expect(audioBuffer.sampleRate).to.equal(44100);

                        expect(audioBuffer.getChannelData).to.be.a('function');
                        expect(audioBuffer.copyFromChannel).to.be.a('function');
                        expect(audioBuffer.copyToChannel).to.be.a('function');

                        done();
                    })
                    .catch(done);
            });
        });

    });

});
