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

        offlineAudioContext = new OfflineAudioContext(1, 25600, 44100);
    });

    it('should not provide an unprefixed constructor', function () {
        expect(window.OfflineAudioContext).to.be.undefined;
    });

    describe('createBufferSource()', function () {

        // bug #14

        it('should not resample an oversampled AudioBuffer', function (done) {
            var audioBuffer = offlineAudioContext.createBuffer(1, 8, 88200),
                bufferSourceNode = offlineAudioContext.createBufferSource(),
                eightRandomValues = [];

            for (let i = 0; i < 8; i += 1) {
                eightRandomValues[i] = (Math.random() * 2) - 1;

                // @todo Use AudioBuffer.prototype.copyToChannel() once it lands in Safari.
                audioBuffer.getChannelData(0)[i] = eightRandomValues[i];
            }

            bufferSourceNode.buffer = audioBuffer;
            bufferSourceNode.start(0);
            bufferSourceNode.connect(offlineAudioContext.destination);

            offlineAudioContext.oncomplete = (event) => {
                // @todo Use AudioBuffer.prototype.copyFromChannel() once it lands in Safari.
                var channelData = event.renderedBuffer.getChannelData(0);

                expect(channelData[0]).to.closeTo(eightRandomValues[0], 0.0000001);
                expect(channelData[1]).to.closeTo(eightRandomValues[2], 0.0000001);
                expect(channelData[2]).to.closeTo(eightRandomValues[4], 0.0000001);
                expect(channelData[3]).to.closeTo(eightRandomValues[6], 0.0000001);

                done();
            };
            offlineAudioContext.startRendering();
        });

    });

    describe('createGain()', function () {

        // bug #11

        it('should not be chainable', function () {
            var gainNodeA = offlineAudioContext.createGain(),
                gainNodeB = offlineAudioContext.createGain();

            expect(gainNodeA.connect(gainNodeB)).to.be.undefined;
        });

        // bug #12

        it('should not allow to disconnect a specific destination', function (done) {
            var candidate,
                dummy,
                ones,
                source;

            candidate = offlineAudioContext.createGain();
            dummy = offlineAudioContext.createGain();

            // Safari does not play buffers which contain just one frame.
            ones = offlineAudioContext.createBuffer(1, 2, 44100);
            ones.getChannelData(0)[0] = 1;
            ones.getChannelData(0)[1] = 1;

            source = offlineAudioContext.createBufferSource();
            source.buffer = ones;

            source.connect(candidate);
            candidate.connect(offlineAudioContext.destination);
            candidate.connect(dummy);
            candidate.disconnect(dummy);

            source.start();

            offlineAudioContext.oncomplete = (event) => {
                var channelData = event.renderedBuffer.getChannelData(0);

                expect(channelData[0]).to.equal(0);

                source.disconnect(candidate);
                candidate.disconnect(offlineAudioContext.destination);

                done();
            };
            offlineAudioContext.startRendering();
        });

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

        it('should not have any output', function (done) {
            var channelData,
                scriptProcessor = offlineAudioContext.createScriptProcessor(256, 1, 1);

            channelData = new Float32Array(scriptProcessor.bufferSize);

            scriptProcessor.connect(offlineAudioContext.destination);
            scriptProcessor.onaudioprocess = function (event) {
                // @todo Use AudioBuffer.prototype.copyToChannel() and TypedArray.prototype.fill()
                // once they land in Safari.
                var channelData = event.outputBuffer.getChannelData(0);

                Array.prototype.forEach.call(channelData, function (element, index) {
                    channelData[index] = 1;
                });
            };

            offlineAudioContext.oncomplete = function (event) {
                // @todo Use AudioBuffer.prototype.copyFromChannel() once it lands in Safari.
                var channelData = event.renderedBuffer.getChannelData(0);

                expect(Array.from(channelData)).to.not.contain(1);

                done();
            };
            offlineAudioContext.startRendering();
        });

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
