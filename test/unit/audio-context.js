'use strict';

var audioContextProvider = require('../../src/audio-context.js').provider,
    di = require('di'),
    loadFixture = require('../helper/load-fixture.js');

describe('AudioContext', function () {

    var audioContext,
        AudioContext;

    afterEach(function () {
        return audioContext.close();
    });

    beforeEach(function () {
        var injector = new di.Injector();

        AudioContext = injector.get(audioContextProvider);

        audioContext = new AudioContext();
    });

    describe('currentTime', function () {

        it('should be a number', function () {
            expect(audioContext.currentTime).to.be.a.number;
        });

        it('should be readonly', function () {
            expect(function () {
                audioContext.currentTime = 0;
            }).to.throw(TypeError);
        });

        it('should advance over time', function (done) {
            var now = audioContext.currentTime;

            audioContext.onstatechange = function () {
                audioContext.onstatechange = null; // to prevent consecutive calls

                setTimeout(function () {
                    expect(audioContext.currentTime).to.above(now);

                    done();
                }, 100);
            };
        });

    });

    describe('destination', function () {

        it('should be an instance of the AudioDestinationNode interface', function () {
            var destination = audioContext.destination;

            expect(destination.channelCount).to.equal(2);
            expect(destination.channelCountMode).to.equal('explicit');
            expect(destination.channelInterpretation).to.equal('speakers');
            expect(destination.maxChannelCount).to.be.a.number;
            expect(destination.numberOfInputs).to.equal(1);
            expect(destination.numberOfOutputs).to.equal(0);
        });

        it('should be readonly', function () {
            expect(function () {
                audioContext.destination = 'a fake AudioDestinationNode';
            }).to.throw(TypeError);
        });

    });

    describe('onstatechange', function () {

        it('should be null', function () {
            expect(audioContext.onstatechange).to.be.null;
        });

        it('should be assignable to a function', function () {
            var onstatechange;

            function fn() {}

            onstatechange = audioContext.onstatechange = fn;

            expect(onstatechange).to.equal(fn);
            expect(audioContext.onstatechange).to.equal(fn);
        });

        it('should be assignable to null', function () {
            var onstatechange = audioContext.onstatechange = null;

            expect(onstatechange).to.be.null;
            expect(audioContext.onstatechange).to.be.null;
        });

        it('should not be assignable to something else', function () {
            var onstatechange,
                string = 'no function or null value';

            audioContext.onstatechange = function () {};
            onstatechange = audioContext.onstatechange = string;

            expect(onstatechange).to.equal(string);
            expect(audioContext.onstatechange).to.be.null;
        });

    });

    describe('state', function () {

        it('should be suspended at the beginning', function () {
            expect(audioContext.state).to.equal('suspended');
        });

        it('should be readonly', function () {
            expect(function () {
                audioContext.state = 'closed';
            }).to.throw(TypeError);
        });

        it('should be transitioned to running', function (done) {
            audioContext.onstatechange = function () {
                expect(audioContext.state).to.equal('running');

                audioContext.onstatechange = null; // to prevent consecutive calls

                done();
            };
        });

        // closed is tested below

    });

    describe('sampleRate', function () {

        it('should be a number', function () {
            expect(audioContext.sampleRate).to.be.a.number;
        });

        it('should be readonly', function () {
            expect(function () {
                audioContext.sampleRate = 22050;
            }).to.throw(TypeError);
        });

    });

    describe('close()', function () {

        afterEach(function () {
            // create a closeable AudioContext to align the behaviour with other tests
            audioContext = new AudioContext();
        });

        it('should return a promise', function () {
            expect(audioContext.close()).to.be.an.instanceOf(Promise);
        });

        it('should set the state to closed', function (done) {
            audioContext
                .close()
                .then(function () {
                    expect(audioContext.state).to.equal('closed');

                    done();
                })
                .catch(done);
        });

        it('should throw an error on consecutive calls to closed', function (done) {
            audioContext
                .close()
                .then(function () {
                    return audioContext.close();
                })
                .catch(function (err) {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    done();
                });
        });

    });

    describe('createBiquadFilter()', function () {

        it('should return an instance of the BiquadFilterNode interface', function () {
            var biquadFilterNode = audioContext.createBiquadFilter();

            expect(biquadFilterNode.channelCountMode).to.equal('max');
            expect(biquadFilterNode.channelInterpretation).to.equal('speakers');

            expect(biquadFilterNode.detune.cancelScheduledValues).to.be.a.function;
            expect(biquadFilterNode.detune.defaultValue).to.equal(0);
            expect(biquadFilterNode.detune.exponentialRampToValueAtTime).to.be.a.function;
            expect(biquadFilterNode.detune.linearRampToValueAtTime).to.be.a.function;
            expect(biquadFilterNode.detune.setTargetAtTime).to.be.a.function;
            expect(biquadFilterNode.detune.setValueCurveAtTime).to.be.a.function;
            expect(biquadFilterNode.detune.value).to.equal(0);

            expect(biquadFilterNode.frequency.cancelScheduledValues).to.be.a.function;
            expect(biquadFilterNode.frequency.defaultValue).to.equal(350);
            expect(biquadFilterNode.frequency.exponentialRampToValueAtTime).to.be.a.function;
            expect(biquadFilterNode.frequency.linearRampToValueAtTime).to.be.a.function;
            expect(biquadFilterNode.frequency.setTargetAtTime).to.be.a.function;
            expect(biquadFilterNode.frequency.setValueCurveAtTime).to.be.a.function;
            expect(biquadFilterNode.frequency.value).to.equal(350);

            expect(biquadFilterNode.gain.cancelScheduledValues).to.be.a.function;
            expect(biquadFilterNode.gain.defaultValue).to.equal(0);
            expect(biquadFilterNode.gain.exponentialRampToValueAtTime).to.be.a.function;
            expect(biquadFilterNode.gain.linearRampToValueAtTime).to.be.a.function;
            expect(biquadFilterNode.gain.setTargetAtTime).to.be.a.function;
            expect(biquadFilterNode.gain.setValueCurveAtTime).to.be.a.function;
            expect(biquadFilterNode.gain.value).to.equal(0);

            expect(biquadFilterNode.getFrequencyResponse).to.be.a.function;
            expect(biquadFilterNode.numberOfInputs).to.equal(1);
            expect(biquadFilterNode.numberOfOutputs).to.equal(1);

            expect(biquadFilterNode.Q.cancelScheduledValues).to.be.a.function;
            expect(biquadFilterNode.Q.defaultValue).to.equal(1);
            expect(biquadFilterNode.Q.exponentialRampToValueAtTime).to.be.a.function;
            expect(biquadFilterNode.Q.linearRampToValueAtTime).to.be.a.function;
            expect(biquadFilterNode.Q.setTargetAtTime).to.be.a.function;
            expect(biquadFilterNode.Q.setValueCurveAtTime).to.be.a.function;
            expect(biquadFilterNode.Q.value).to.equal(1);

            expect(biquadFilterNode.type).to.be.a.string;
        });

        it('should throw an error if the AudioContext is closed', function (done) {
            audioContext
                .close()
                .then(function () {
                    audioContext.createBiquadFilter();
                })
                .catch(function (err) {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    audioContext = new AudioContext();

                    done();
                });
        });

    });

    describe('createBuffer()', function () {

        it('should return an instance of the AudioBuffer interface', function () {
            var audioBuffer = audioContext.createBuffer(2, 10, 44100);

            expect(audioBuffer.duration).to.be.closeTo(10 / 44100, 0.001);
            expect(audioBuffer.length).to.equal(10);
            expect(audioBuffer.numberOfChannels).to.equal(2);
            expect(audioBuffer.sampleRate).to.equal(44100);

            expect(audioBuffer.getChannelData).to.be.a.function;
            expect(audioBuffer.copyFromChannel).to.be.a.function;
            expect(audioBuffer.copyToChannel).to.be.a.function;
        });

    });

    describe('createBufferSource()', function () {

        it('should return an instance of the AudioBufferSourceNode interface', function () {
            var audioBufferSourceNode = audioContext.createBufferSource();

            expect(audioBufferSourceNode.buffer).to.be.null;

            // expect(audioBufferSourceNode.detune.cancelScheduledValues).to.be.a.function;
            // expect(audioBufferSourceNode.detune.defaultValue).to.equal(0);
            // expect(audioBufferSourceNode.detune.exponentialRampToValueAtTime).to.be.a.function;
            // expect(audioBufferSourceNode.detune.linearRampToValueAtTime).to.be.a.function;
            // expect(audioBufferSourceNode.detune.setTargetAtTime).to.be.a.function;
            // expect(audioBufferSourceNode.detune.setValueCurveAtTime).to.be.a.function;
            // expect(audioBufferSourceNode.detune.value).to.equal(0);

            expect(audioBufferSourceNode.loop).to.be.false;
            expect(audioBufferSourceNode.loopEnd).to.equal(0);
            expect(audioBufferSourceNode.loopStart).to.equal(0);
            expect(audioBufferSourceNode.numberOfInputs).to.equal(0);
            expect(audioBufferSourceNode.numberOfOutputs).to.equal(1);
            expect(audioBufferSourceNode.onended).to.be.null;

            expect(audioBufferSourceNode.playbackRate.cancelScheduledValues).to.be.a.function;
            expect(audioBufferSourceNode.playbackRate.defaultValue).to.equal(1);
            expect(audioBufferSourceNode.playbackRate.exponentialRampToValueAtTime).to.be.a.function;
            expect(audioBufferSourceNode.playbackRate.linearRampToValueAtTime).to.be.a.function;
            expect(audioBufferSourceNode.playbackRate.setTargetAtTime).to.be.a.function;
            expect(audioBufferSourceNode.playbackRate.setValueCurveAtTime).to.be.a.function;
            expect(audioBufferSourceNode.playbackRate.value).to.equal(1);

            expect(audioBufferSourceNode.start).to.be.a.function;
            expect(audioBufferSourceNode.stop).to.be.a.function;
        });

    });

    describe('createChannelMerger()', function () {

        it('should return an instance of the ChannelMergerNode interface', function () {
            var channelMergerNode = audioContext.createChannelMerger(2);

            expect(channelMergerNode.channelCount).to.equal(1);
            expect(channelMergerNode.channelCountMode).to.equal('explicit');
            expect(channelMergerNode.channelInterpretation).to.equal('speakers');
            expect(channelMergerNode.numberOfInputs).to.equal(2);
            expect(channelMergerNode.numberOfOutputs).to.equal(1);
        });

        it('should throw an error if the AudioContext is closed', function (done) {
            audioContext
                .close()
                .then(function () {
                    audioContext.createChannelMerger(2);
                })
                .catch(function (err) {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    audioContext = new AudioContext();

                    done();
                });
        });

    });

    describe('createChannelSplitter()', function () {

        it('should return an instance of the ChannelSplitterNode interface', function () {
            var channelSplitterNode = audioContext.createChannelSplitter(2);

            expect(channelSplitterNode.channelCountMode).to.equal('max');
            expect(channelSplitterNode.channelInterpretation).to.equal('speakers');
            expect(channelSplitterNode.numberOfInputs).to.equal(1);
            expect(channelSplitterNode.numberOfOutputs).to.equal(2);
        });

        it('should throw an error if the AudioContext is closed', function (done) {
            audioContext
                .close()
                .then(function () {
                    audioContext.createChannelSplitter(2);
                })
                .catch(function (err) {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    audioContext = new AudioContext();

                    done();
                });
        });

    });

    describe('createGain()', function () {

        it('should return an instance of the GainNode interface', function () {
            var gainNode = audioContext.createGain();

            expect(gainNode.channelCountMode).to.equal('max');
            expect(gainNode.channelInterpretation).to.equal('speakers');

            expect(gainNode.gain.cancelScheduledValues).to.be.a.function;
            expect(gainNode.gain.defaultValue).to.equal(1);
            expect(gainNode.gain.exponentialRampToValueAtTime).to.be.a.function;
            expect(gainNode.gain.linearRampToValueAtTime).to.be.a.function;
            expect(gainNode.gain.setTargetAtTime).to.be.a.function;
            expect(gainNode.gain.setValueCurveAtTime).to.be.a.function;
            expect(gainNode.gain.value).to.equal(1);

            expect(gainNode.numberOfInputs).to.equal(1);
            expect(gainNode.numberOfOutputs).to.equal(1);
        });

        it('should throw an error if the AudioContext is closed', function (done) {
            audioContext
                .close()
                .then(function () {
                    audioContext.createGain();
                })
                .catch(function (err) {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    audioContext = new AudioContext();

                    done();
                });
        });

    });

    describe('decodeAudioData()', function () {

        it('should return a promise', function () {
            expect(audioContext.decodeAudioData()).to.be.an.instanceOf(Promise);
        });

        it('should throw an error when called without a valid arrayBuffer', function (done) {
            audioContext
                .decodeAudioData(null)
                .catch(function (err) {
                    expect(err.code).to.equal(9);
                    expect(err.name).to.equal('NotSupportedError');

                    done();
                });
        });

        it('should throw an error when asked to decode an unsupported file', function (done) {
            this.timeout(5000);

            // AIFF files are not supported by any browser
            loadFixture('a-second-of-silence.aif', function (err, arrayBuffer) {
                expect(err).to.be.null;

                audioContext
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

                audioContext
                    .decodeAudioData(arrayBuffer)
                    .then(function (audioBuffer) {
                        expect(audioBuffer.duration).to.be.closeTo(1000 / 44100, 0.001);
                        expect(audioBuffer.length).to.equal(1000);
                        expect(audioBuffer.numberOfChannels).to.equal(2);
                        expect(audioBuffer.sampleRate).to.equal(44100);

                        expect(audioBuffer.getChannelData).to.be.a.function;
                        expect(audioBuffer.copyFromChannel).to.be.a.function;
                        expect(audioBuffer.copyToChannel).to.be.a.function;

                        done();
                    })
                    .catch(done);
            });
        });

    });

});
