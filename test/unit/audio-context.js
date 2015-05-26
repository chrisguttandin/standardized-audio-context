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

        it('should be transitioned to running', function (done) {
            audioContext.onstatechange = function () {
                expect(audioContext.state).to.equal('running');

                audioContext.onstatechange = null; // to prevent consecutive calls

                done();
            };
        });

        // closed is tested below

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

    describe('createChannelMerger()', function () {

        it('should return an instance of the ChannelMergerNode interface', function () {
            var channelMergerNode = audioContext.createChannelMerger(2);

            expect(channelMergerNode.channelCount).to.equal(1);
            expect(channelMergerNode.channelCountMode).to.equal('explicit');
            expect(channelMergerNode.channelInterpretation).to.equal('speakers');
            expect(channelMergerNode.numberOfInputs).to.equal(2);
            expect(channelMergerNode.numberOfOutputs).to.equal(1);
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

    });

    describe('decodeAudioData()', function () {

        it('should return a promise', function () {
            expect(audioContext.decodeAudioData()).to.be.an.instanceOf(Promise);
        });

        it('should throw an error', function (done) {
            audioContext
                .decodeAudioData()
                .catch(function (err) {
                    expect(err).to.not.be.null;

                    done();
                })
                .catch(done);
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
