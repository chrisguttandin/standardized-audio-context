'use strict';

require('reflect-metadata');

var angular = require('@angular/core'),
    loadFixture = require('../../helper/load-fixture.js'),
    unpatchedAudioContextConstructor = require('../../../src/unpatched-audio-context-constructor.js').unpatchedAudioContextConstructor,
    wndw = require('../../../src/window.js').window;

describe('audioContextConstructor', function () {

    var audioContext,
        AudioContext;

    afterEach(function () {
        return audioContext.close();
    });

    beforeEach(function () {
        var injector = angular.ReflectiveInjector.resolveAndCreate([
                angular.provide(unpatchedAudioContextConstructor, { useFactory: unpatchedAudioContextConstructor }),
                angular.provide(wndw, { useValue: window })
            ]);

        AudioContext = injector.get(unpatchedAudioContextConstructor);

        audioContext = new AudioContext();
    });

    it('should not provide an unprefixed constructor', function () {
        expect(window.AudioContext).to.be.undefined;
    });

    describe('createBufferSource()', function () {

        // bug #11

        it('should not be chainable', function () {
            var audioBufferSourceNode = audioContext.createBufferSource(),
                gainNode = audioContext.createGain();

            expect(audioBufferSourceNode.connect(gainNode)).to.be.undefined;
        });

        // bug #18

        it('should not allow calls to stop() of an AudioBufferSourceNode scheduled for stopping', function () {
            var audioBuffer = audioContext.createBuffer(1, 100, 44100),
                audioBufferSourceNode = audioContext.createBufferSource();

            audioBufferSourceNode.buffer = audioBuffer;
            audioBufferSourceNode.connect(audioContext.destination);
            audioBufferSourceNode.start();
            audioBufferSourceNode.stop(audioContext.currentTime + 1);
            expect(function () {
                audioBufferSourceNode.stop();
            }).to.throw(Error);
        });

        // bug #19

        it('should not ignore calls to stop() of an already stopped AudioBufferSourceNode', function (done) {
            var audioBuffer = audioContext.createBuffer(1, 100, 44100),
                audioBufferSourceNode = audioContext.createBufferSource();

            audioBufferSourceNode.onended = function () {
                expect(function () {
                    audioBufferSourceNode.stop();
                }).to.throw(Error);

                done();
            };

            audioBufferSourceNode.buffer = audioBuffer;
            audioBufferSourceNode.connect(audioContext.destination);
            audioBufferSourceNode.start();
            audioBufferSourceNode.stop();
        });

    });

    describe('createChannelMerger()', function () {

        // bug #11

        it('should not be chainable', function () {
            var channelMergerNode = audioContext.createChannelMerger(),
                gainNode = audioContext.createGain();

            expect(channelMergerNode.connect(gainNode)).to.be.undefined;
        });

        // bug #15

        it('should have a wrong channelCount', function () {
            var channelMergerNode = audioContext.createChannelMerger();

            expect(channelMergerNode.channelCount).to.not.equal(1);
        });

        it('should have a wrong channelCountMode', function () {
            var channelMergerNode = audioContext.createChannelMerger();

            expect(channelMergerNode.channelCountMode).to.not.equal('explicit');
        });

        // bug #20

        it('should not handle unconnected channels as silence', function (done) {
            var audioBuffer,
                audioBufferSourceNode = audioContext.createBufferSource(),
                channelMergerNode = audioContext.createChannelMerger(),
                sampleRate,
                scriptProcessorNode = audioContext.createScriptProcessor(256, 2, 2),
                startTime;

            sampleRate = audioContext.sampleRate;
            // @todo Safari does not play 1 sample buffers.
            audioBuffer = audioContext.createBuffer(1, 2, sampleRate);

            // @todo Safari does not support copyToChannel().
            audioBuffer.getChannelData(0)[0] = 1;
            audioBuffer.getChannelData(0)[1] = 1;

            audioBufferSourceNode.buffer = audioBuffer;
            audioBufferSourceNode.loop = true;

            startTime = audioContext.currentTime;

            scriptProcessorNode.onaudioprocess = (event) => {
                var channelData = event.inputBuffer.getChannelData(1);

                for (let i = 0, length = channelData.length; i < length; i += 1) {
                    if (channelData[i] === 1) {
                        done();

                        return;
                    }
                }

                if (startTime + 1 / sampleRate < event.playbackTime) {
                    done(new Error('It should process a buffer containing a wrong sample within one second.'));
                }
            };

            audioBufferSourceNode.connect(channelMergerNode, 0, 0);
            channelMergerNode.connect(scriptProcessorNode);
            scriptProcessorNode.connect(audioContext.destination);

            audioBufferSourceNode.start(startTime);
        });

    });

    describe('createGain()', function () {

        // bug #11

        it('should not be chainable', function () {
            var gainNodeA = audioContext.createGain(),
                gainNodeB = audioContext.createGain();

            expect(gainNodeA.connect(gainNodeB)).to.be.undefined;
        });

        // bug #12

        it('should not allow to disconnect a specific destination', function (done) {
            var analyzer,
                candidate,
                channelData,
                dummy,
                ones,
                source;

            analyzer = audioContext.createScriptProcessor(256, 1, 1);
            candidate = audioContext.createGain();
            dummy = audioContext.createGain();

            // Safari does not play buffers which contain just one frame.
            ones = audioContext.createBuffer(1, 2, 44100);
            channelData = ones.getChannelData(0);
            channelData[0] = 1;
            channelData[1] = 1;

            source = audioContext.createBufferSource();
            source.buffer = ones;
            source.loop = true;

            source.connect(candidate);
            candidate.connect(analyzer);
            analyzer.connect(audioContext.destination);
            candidate.connect(dummy);
            candidate.disconnect(dummy);

            analyzer.onaudioprocess = function (event) {
                var channelData = event.inputBuffer.getChannelData(0);

                if (Array.prototype.some.call(channelData, (sample) => sample === 1)) {
                    done('should never happen');
                }
            };

            source.start();

            setTimeout(function () {
                source.stop();

                analyzer.onaudioprocess = null;

                source.disconnect(candidate);
                candidate.disconnect(analyzer);
                analyzer.disconnect(audioContext.destination);

                done();
            }, 500);
        });

    });

    describe('createIIRFilter()', function () {

        // bug #9

        it('should not be implemented', function () {
            expect(audioContext.createIIRFilter).to.be.undefined;
        });

    });

    describe('decodeAudioData()', function () {

        // bug #1

        it('should require the success callback function as a parameter', function (done) {
            loadFixture('1000-frames-of-noise.wav', function (err, arrayBuffer) {
                expect(err).to.be.null;

                expect(function () {
                    audioContext.decodeAudioData(arrayBuffer);
                }).to.throw(TypeError, 'Not enough arguments');

                done();
            });
        });

        // bug #2

        it('should throw a DOMException', function (done) {
            try {
                audioContext.decodeAudioData(null, function () {});
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

                audioContext.decodeAudioData(arrayBuffer, function () {}, function (err) {
                    expect(err).to.be.null;

                    done();
                });
            });
        });

        // bug #5

        it('should return an AudioBuffer without copyFromChannel() and copyToChannel() methods', function (done) {
            loadFixture('1000-frames-of-noise.wav', function (err, arrayBuffer) {
                expect(err).to.be.null;

                audioContext.decodeAudioData(arrayBuffer, function (audioBuffer) {
                    expect(audioBuffer.copyFromChannel).to.be.undefined;
                    expect(audioBuffer.copyToChannel).to.be.undefined;

                    done();
                });
            });
        });

    });

});
