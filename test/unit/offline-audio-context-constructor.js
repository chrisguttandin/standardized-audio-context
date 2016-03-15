'use strict';

require('reflect-metadata');

var angular = require('angular2/core'),
    AudioBufferWrapper = require('../../src/wrapper/audio-buffer.js').AudioBufferWrapper,
    AudioNodeConnectMethodWrapper = require('../../src/wrapper/audio-node-connect-method').AudioNodeConnectMethodWrapper,
    AudioNodeDisconnectMethodWrapper = require('../../src/wrapper/audio-node-disconnect-method').AudioNodeDisconnectMethodWrapper,
    ChainingSupportTester = require('../../src/tester/chaining-support.js').ChainingSupportTester,
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
                AudioNodeConnectMethodWrapper,
                AudioNodeDisconnectMethodWrapper,
                ChainingSupportTester,
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

    describe('destination', function () {

        it('should be an instance of the AudioDestinationNode interface', function () {
            var destination = offlineAudioContext.destination;

            // @todo expect(destination.channelCount).to.equal(2);
            // @todo expect(destination.channelCountMode).to.equal('explicit');
            expect(destination.channelInterpretation).to.equal('speakers');
            expect(destination.maxChannelCount).to.be.a('number');
            // @todo expect(destination.maxChannelCount).to.equal( number of channels );
            expect(destination.numberOfInputs).to.equal(1);
            expect(destination.numberOfOutputs).to.equal(0);
        });

        it('should be readonly', function () {
            expect(function () {
                offlineAudioContext.destination = 'a fake AudioDestinationNode';
            }).to.throw(TypeError);
        });

    });

    describe('sampleRate', function () {

        it('should be a number', function () {
            expect(offlineAudioContext.sampleRate).to.equal(44100);
        });

        it('should be readonly', function () {
            expect(function () {
                offlineAudioContext.sampleRate = 22050;
            }).to.throw(TypeError);
        });

    });

    describe('createGain()', function () {

        it('should return an instance of the GainNode interface', function () {
            var gainNode = offlineAudioContext.createGain();

            expect(gainNode.channelCountMode).to.equal('max');
            expect(gainNode.channelInterpretation).to.equal('speakers');

            expect(gainNode.gain.cancelScheduledValues).to.be.a('function');
            expect(gainNode.gain.defaultValue).to.equal(1);
            expect(gainNode.gain.exponentialRampToValueAtTime).to.be.a('function');
            expect(gainNode.gain.linearRampToValueAtTime).to.be.a('function');
            expect(gainNode.gain.setTargetAtTime).to.be.a('function');
            expect(gainNode.gain.setValueCurveAtTime).to.be.a('function');
            expect(gainNode.gain.value).to.equal(1);

            expect(gainNode.numberOfInputs).to.equal(1);
            expect(gainNode.numberOfOutputs).to.equal(1);
        });

        it('should be chainable', function () {
            var gainNodeA = offlineAudioContext.createGain(),
                gainNodeB = offlineAudioContext.createGain();

            expect(gainNodeA.connect(gainNodeB)).to.equal(gainNodeB);
        });

        it('should be disconnectable', function (done) {
            var candidate,
                dummy,
                ones,
                source;

            candidate = offlineAudioContext.createGain();
            dummy = offlineAudioContext.createGain();

            // @todo remove this ugly hack
            // Safari does not play buffers which contain just one frame.
            ones = candidate.context.createBuffer(1, 2, 44100);
            ones.getChannelData(0)[0] = 1;
            ones.getChannelData(0)[1] = 1;

            // @todo remove this ugly hack
            source = candidate.context.createBufferSource();
            source.buffer = ones;

            source.connect(candidate);
            candidate.connect(offlineAudioContext.destination);
            candidate.connect(dummy);
            candidate.disconnect(dummy);

            source.start(0);

            // @todo remove this ugly hack
            candidate.context.oncomplete = (event) => {
                var channelData = event.renderedBuffer.getChannelData(0);

                expect(channelData[0]).to.equal(1);

                source.disconnect(candidate);
                candidate.disconnect(offlineAudioContext.destination);

                done();
            };
            // @todo remove this ugly hack
            candidate.context.startRendering();
        });

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
