'use strict';

require('reflect-metadata');

var angular = require('angular2/core'),
    AudioBufferWrapper = require('../../src/wrapper/audio-buffer.js').AudioBufferWrapper,
    EncodingErrorFactory = require('../../src/factories/encoding-error').EncodingErrorFactory,
    loadFixture = require('../helper/load-fixture.js'),
    NotSupportedErrorFactory = require( '../../src/factories/not-supported-error').NotSupportedErrorFactory,
    offlineAudioContextConstructor = require('../../src/offline-audio-context-constructor.js').offlineAudioContextConstructor,
    PromiseSupportTester = require('../../src/tester/promise-support').PromiseSupportTester,
    sinon = require('sinon'),
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

        describe('without a valid arrayBuffer', function () {

            it('should throw an error', function (done) {
                offlineAudioContext
                    .decodeAudioData(null)
                    .catch(function (err) {
                        expect(err.code).to.equal(9);
                        expect(err.name).to.equal('NotSupportedError');

                        done();
                    });
            });

            it('should call the errorCallback with an error', function (done) {
                offlineAudioContext.decodeAudioData(null, function () {}, function (err) {
                    expect(err.code).to.equal(9);
                    expect(err.name).to.equal('NotSupportedError');

                    done();
                });
            });

            // The promise is rejected before but the errorCallback gets called synchronously.
            it('should call the errorCallback before the promise gets rejected', function (done) {
                var errorCallback = sinon.spy();

                offlineAudioContext
                    .decodeAudioData(null, function () {}, errorCallback)
                    .catch(function () {
                        expect(errorCallback).to.have.been.calledOnce;

                        done();
                    });
            });

        });

        describe('with an arrayBuffer of an unsupported file', function () {

            var arrayBuffer;

            beforeEach(function (done) {
                this.timeout(5000);

                // PNG files are not supported by any browser :-)
                loadFixture('one-pixel-of-transparency.png', function (err, rrBffr) {
                    expect(err).to.be.null;

                    arrayBuffer = rrBffr;

                    done();
                });
            });

            it('should throw an error', function (done) {
                offlineAudioContext
                    .decodeAudioData(arrayBuffer)
                    .catch(function (err) {
                        expect(err.code).to.equal(0);
                        expect(err.name).to.equal('EncodingError');

                        done();
                    });
            });

            it('should call the errorCallback with an error', function (done) {
                offlineAudioContext.decodeAudioData(arrayBuffer, function () {}, function (err) {
                    expect(err.code).to.equal(0);
                    expect(err.name).to.equal('EncodingError');

                    done();
                });
            });

            // The promise is rejected before but the errorCallback gets called synchronously.
            it('should call the errorCallback before the promise gets rejected', function (done) {
                var errorCallback = sinon.spy();

                offlineAudioContext
                    .decodeAudioData(arrayBuffer, function () {}, errorCallback)
                    .catch(function () {
                        expect(errorCallback).to.have.been.calledOnce;

                        done();
                    });
            });

        });

        describe('with an arrayBuffer of a supported file', function () {

            var arrayBuffer;

            beforeEach(function (done) {
                this.timeout(5000);

                loadFixture('1000-frames-of-noise.wav', function (err, rrBffr) {
                    expect(err).to.be.null;

                    arrayBuffer = rrBffr;

                    done();
                });
            });

            it('should resolve to an instance of the AudioBuffer interface', function () {
                return offlineAudioContext
                    .decodeAudioData(arrayBuffer)
                    .then(function (audioBuffer) {
                        expect(audioBuffer.duration).to.be.closeTo(1000 / 44100, 0.001);
                        expect(audioBuffer.length).to.equal(1000);
                        expect(audioBuffer.numberOfChannels).to.equal(2);
                        expect(audioBuffer.sampleRate).to.equal(44100);

                        expect(audioBuffer.getChannelData).to.be.a('function');
                        expect(audioBuffer.copyFromChannel).to.be.a('function');
                        expect(audioBuffer.copyToChannel).to.be.a('function');
                    });
            });

            it('should call the successCallback with an instance of the AudioBuffer interface', function (done) {
                offlineAudioContext.decodeAudioData(arrayBuffer, function (audioBuffer) {
                    expect(audioBuffer.duration).to.be.closeTo(1000 / 44100, 0.001);
                    expect(audioBuffer.length).to.equal(1000);
                    expect(audioBuffer.numberOfChannels).to.equal(2);
                    expect(audioBuffer.sampleRate).to.equal(44100);

                    expect(audioBuffer.getChannelData).to.be.a('function');
                    expect(audioBuffer.copyFromChannel).to.be.a('function');
                    expect(audioBuffer.copyToChannel).to.be.a('function');

                    done();
                });
            });

            // The promise is resolved before but the successCallback gets called synchronously.
            it('should call the successCallback before the promise gets resolved', function () {
                var successCallback = sinon.spy();

                return offlineAudioContext
                    .decodeAudioData(arrayBuffer, successCallback)
                    .then(function () {
                        expect(successCallback).to.have.been.calledOnce;
                    });
            });

        });

    });

});
