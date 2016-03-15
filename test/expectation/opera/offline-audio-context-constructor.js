'use strict';

require('reflect-metadata');

var angular = require('angular2/core'),
    loadFixture = require('../../helper/load-fixture.js'),
    sinon = require('sinon'),
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

    describe('createScriptProcessor()', function () {

        // bug #8

        it('should not fire onaudioprocess for every buffer', function (done) {
            var scriptProcessor = offlineAudioContext.createScriptProcessor(256, 1, 1);

            scriptProcessor.connect(offlineAudioContext.destination);
            scriptProcessor.onaudioprocess = sinon.stub();

            offlineAudioContext.oncomplete = () => {
                expect(scriptProcessor.onaudioprocess.callCount).to.be.below(1000);

                done();
            };
            offlineAudioContext.startRendering();
        });

        // bug #13

        it('should not have any output', function () {
            var channelData,
                scriptProcessor = offlineAudioContext.createScriptProcessor(256, 1, 1);

            channelData = new Float32Array(scriptProcessor.bufferSize);

            scriptProcessor.connect(offlineAudioContext.destination);
            scriptProcessor.onaudioprocess = function (event) {
                channelData.fill(1);

                event.outputBuffer.copyToChannel(channelData, 0);
            };

            return offlineAudioContext
                .startRendering()
                .then((buffer) => {
                    var channelData = new Float32Array(scriptProcessor.bufferSize * 100);

                    buffer.copyFromChannel(channelData, 0, 256);

                    expect(Array.from(channelData)).to.not.contain(1);
                });
        });

    });

    describe('decodeAudioData()', function () {

        // bug #1

        it('should require the success callback function as a parameter', function (done) {
            loadFixture('1000-frames-of-noise.wav', function (err, arrayBuffer) {
                expect(err).to.be.null;

                expect(function () {
                    offlineAudioContext.decodeAudioData(arrayBuffer);
                }).to.throw(TypeError, "Failed to execute 'decodeAudioData' on 'AudioContext': 2 arguments required, but only 1 present."); // jshint ignore:line

                done();
            });
        });

        // bug #2

        it('should throw a DOMException', function (done) {
            try {
                offlineAudioContext.decodeAudioData(null, function () {});
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

                offlineAudioContext.decodeAudioData(arrayBuffer, function () {}, function (err) {
                    expect(err).to.be.null;

                    done();
                });
            });
        });

    });

});
