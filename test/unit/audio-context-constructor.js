'use strict';

require('reflect-metadata');

var angular = require('angular2/core'),
    AudioBufferWrapper = require('../../src/wrapper/audio-buffer.js').AudioBufferWrapper,
    audioContextConstructor = require('../../src/audio-context-constructor.js').audioContextConstructor,
    AudioNodeConnectMethodWrapper = require('../../src/wrapper/audio-node-connect-method.js').AudioNodeConnectMethodWrapper,
    AudioNodeDisconnectMethodWrapper = require('../../src/wrapper/audio-node-disconnect-method.js').AudioNodeDisconnectMethodWrapper,
    ChainingSupportTester = require('../../src/tester/chaining-support.js').ChainingSupportTester,
    ChannelMergerNodeWrapper = require('../../src/wrapper/channel-merger-node.js').ChannelMergerNodeWrapper,
    EncodingErrorFactory = require('../../src/factories/encoding-error').EncodingErrorFactory,
    IIRFilterNodeFaker = require('../../src/fakers/iir-filter-node').IIRFilterNodeFaker,
    InvalidStateErrorFactory = require( '../../src/factories/invalid-state-error').InvalidStateErrorFactory,
    loadFixture = require('../helper/load-fixture.js'),
    NotSupportedErrorFactory = require( '../../src/factories/not-supported-error').NotSupportedErrorFactory,
    PromiseSupportTester = require('../../src/tester/promise-support').PromiseSupportTester,
    sinon = require('sinon'),
    unpatchedAudioContextConstructor = require('../../src/unpatched-audio-context-constructor.js').unpatchedAudioContextConstructor,
    wndw = require('../../src/window.js').window;

describe('audioContextConstructor', function () {

    var audioContext,
        AudioContext;

    afterEach(function () {
        return audioContext.close();
    });

    beforeEach(function () {
        var injector = angular.ReflectiveInjector.resolveAndCreate([
                AudioBufferWrapper,
                AudioNodeConnectMethodWrapper,
                AudioNodeDisconnectMethodWrapper,
                ChainingSupportTester,
                ChannelMergerNodeWrapper,
                EncodingErrorFactory,
                IIRFilterNodeFaker,
                InvalidStateErrorFactory,
                NotSupportedErrorFactory,
                PromiseSupportTester,
                angular.provide(audioContextConstructor, { useFactory: audioContextConstructor }),
                angular.provide(unpatchedAudioContextConstructor, { useFactory: unpatchedAudioContextConstructor }),
                angular.provide(wndw, { useValue: window })
            ]);

        AudioContext = injector.get(audioContextConstructor);

        audioContext = new AudioContext();
    });

    describe('currentTime', function () {

        it('should be a number', function () {
            expect(audioContext.currentTime).to.be.a('number');
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
                }, 1000);
            };

            audioContext.createGain(); // kick off the audio context
        });

    });

    describe('destination', function () {

        it('should be an instance of the AudioDestinationNode interface', function () {
            var destination = audioContext.destination;

            expect(destination.channelCount).to.equal(2);
            expect(destination.channelCountMode).to.equal('explicit');
            expect(destination.channelInterpretation).to.equal('speakers');
            expect(destination.maxChannelCount).to.be.a('number');
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

            audioContext.createGain(); // kick off the audio context
        });

        // closed is tested below

    });

    describe('sampleRate', function () {

        it('should be a number', function () {
            expect(audioContext.sampleRate).to.be.a('number');
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

    describe('createAnalyser()', function () {

        it('should return an instance of the AnalyserNode interface', function () {
            var analyserNode = audioContext.createAnalyser();

            expect(analyserNode.channelCount).to.equal(1);
            expect(analyserNode.channelCountMode).to.equal('max');
            expect(analyserNode.channelInterpretation).to.equal('speakers');

            expect(analyserNode.fftSize).to.equal(2048);
            expect(analyserNode.frequencyBinCount).to.equal(1024);

            expect(analyserNode.getByteFrequencyData).to.be.a('function');
            expect(analyserNode.getByteTimeDomainData).to.be.a('function');

            expect(analyserNode.getFloatFrequencyData).to.be.a('function');
            expect(analyserNode.getFloatTimeDomainData).to.be.a('function');

            expect(analyserNode.maxDecibels).to.equal(-30);
            expect(analyserNode.minDecibels).to.equal(-100);

            expect(analyserNode.numberOfInputs).to.equal(1);
            expect(analyserNode.numberOfOutputs).to.equal(1);

            expect(analyserNode.smoothingTimeConstant).to.equal(0.8);
        });

        it('should throw an error if the AudioContext is closed', function (done) {
            audioContext
                .close()
                .then(function () {
                    audioContext.createAnalyser();
                })
                .catch(function (err) {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    audioContext = new AudioContext();

                    done();
                });
        });

        it('should be chainable', function () {
            var analyserNode = audioContext.createAnalyser(),
                gainNode = audioContext.createGain();

            expect(analyserNode.connect(gainNode)).to.equal(gainNode);
        });

        it('should be disconnectable', function (done) {
            var analyzer,
                candidate,
                dummy,
                ones,
                source;

            candidate = audioContext.createAnalyser();
            dummy = audioContext.createGain();

            // @todo remove this ugly hack
            analyzer = candidate.context.createScriptProcessor(256, 1, 1);

            // Safari does not play buffers which contain just one frame.
            ones = audioContext.createBuffer(1, 2, 44100);
            ones.getChannelData(0)[0] = 1;
            ones.getChannelData(0)[1] = 1;

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

                if (Array.from(channelData).indexOf(1) > -1) {
                    source.stop();

                    analyzer.onaudioprocess = null;

                    source.disconnect(candidate);
                    candidate.disconnect(analyzer);
                    analyzer.disconnect(audioContext.destination);

                    done();
                }
            };

            source.start();
        });

    });

    describe('createBiquadFilter()', function () {

        it('should return an instance of the BiquadFilterNode interface', function () {
            var biquadFilterNode = audioContext.createBiquadFilter();

            expect(biquadFilterNode.channelCountMode).to.equal('max');
            expect(biquadFilterNode.channelInterpretation).to.equal('speakers');

            expect(biquadFilterNode.detune.cancelScheduledValues).to.be.a('function');
            expect(biquadFilterNode.detune.defaultValue).to.equal(0);
            expect(biquadFilterNode.detune.exponentialRampToValueAtTime).to.be.a('function');
            expect(biquadFilterNode.detune.linearRampToValueAtTime).to.be.a('function');
            expect(biquadFilterNode.detune.setTargetAtTime).to.be.a('function');
            expect(biquadFilterNode.detune.setValueCurveAtTime).to.be.a('function');
            expect(biquadFilterNode.detune.value).to.equal(0);

            expect(biquadFilterNode.frequency.cancelScheduledValues).to.be.a('function');
            expect(biquadFilterNode.frequency.defaultValue).to.equal(350);
            expect(biquadFilterNode.frequency.exponentialRampToValueAtTime).to.be.a('function');
            expect(biquadFilterNode.frequency.linearRampToValueAtTime).to.be.a('function');
            expect(biquadFilterNode.frequency.setTargetAtTime).to.be.a('function');
            expect(biquadFilterNode.frequency.setValueCurveAtTime).to.be.a('function');
            expect(biquadFilterNode.frequency.value).to.equal(350);

            expect(biquadFilterNode.gain.cancelScheduledValues).to.be.a('function');
            expect(biquadFilterNode.gain.defaultValue).to.equal(0);
            expect(biquadFilterNode.gain.exponentialRampToValueAtTime).to.be.a('function');
            expect(biquadFilterNode.gain.linearRampToValueAtTime).to.be.a('function');
            expect(biquadFilterNode.gain.setTargetAtTime).to.be.a('function');
            expect(biquadFilterNode.gain.setValueCurveAtTime).to.be.a('function');
            expect(biquadFilterNode.gain.value).to.equal(0);

            expect(biquadFilterNode.getFrequencyResponse).to.be.a('function');
            expect(biquadFilterNode.numberOfInputs).to.equal(1);
            expect(biquadFilterNode.numberOfOutputs).to.equal(1);

            expect(biquadFilterNode.Q.cancelScheduledValues).to.be.a('function');
            expect(biquadFilterNode.Q.defaultValue).to.equal(1);
            expect(biquadFilterNode.Q.exponentialRampToValueAtTime).to.be.a('function');
            expect(biquadFilterNode.Q.linearRampToValueAtTime).to.be.a('function');
            expect(biquadFilterNode.Q.setTargetAtTime).to.be.a('function');
            expect(biquadFilterNode.Q.setValueCurveAtTime).to.be.a('function');
            expect(biquadFilterNode.Q.value).to.equal(1);

            expect(biquadFilterNode.type).to.be.a('string');
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

        it('should be chainable', function () {
            var biquadFilterNode = audioContext.createBiquadFilter(),
                gainNode = audioContext.createGain();

            expect(biquadFilterNode.connect(gainNode)).to.equal(gainNode);
        });

    });

    describe('createBuffer()', function () {

        it('should return an instance of the AudioBuffer interface', function () {
            var audioBuffer = audioContext.createBuffer(2, 10, 44100);

            expect(audioBuffer.duration).to.be.closeTo(10 / 44100, 0.001);
            expect(audioBuffer.length).to.equal(10);
            expect(audioBuffer.numberOfChannels).to.equal(2);
            expect(audioBuffer.sampleRate).to.equal(44100);
            expect(audioBuffer.getChannelData).to.be.a('function');
            expect(audioBuffer.copyFromChannel).to.be.a('function');
            expect(audioBuffer.copyToChannel).to.be.a('function');
        });

        it('should implement the copyFromChannel()/copyToChannel() methods', function () {
            var audioBuffer,
                destination,
                i,
                source;

            audioBuffer = audioContext.createBuffer(2, 10, 44100);
            destination = new Float32Array(10);
            source = new Float32Array(10);

            for (i = 0; i < 10; i += 1) {
                destination[i] = Math.random();
                source[i] = Math.random();
            }

            audioBuffer.copyToChannel(source, 0);
            audioBuffer.copyFromChannel(destination, 0);

            for (i = 0; i < 10; i += 1) {
                expect(destination[i]).to.equal(source[i]);
            }

            audioBuffer = audioContext.createBuffer(2, 100, 44100);
            destination = new Float32Array(10);
            source = new Float32Array(10);

            for (i = 0; i < 10; i += 1) {
                destination[i] = Math.random();
                source[i] = Math.random();
            }

            audioBuffer.copyToChannel(source, 0, 50);
            audioBuffer.copyFromChannel(destination, 0, 50);

            for (i = 0; i < 10; i += 1) {
                expect(destination[i]).to.equal(source[i]);
            }
        });

    });

    describe('createBufferSource()', function () {

        it('should return an instance of the AudioBufferSourceNode interface', function () {
            var audioBufferSourceNode = audioContext.createBufferSource();

            expect(audioBufferSourceNode.buffer).to.be.null;

            // expect(audioBufferSourceNode.detune.cancelScheduledValues).to.be.a('function');
            // expect(audioBufferSourceNode.detune.defaultValue).to.equal(0);
            // expect(audioBufferSourceNode.detune.exponentialRampToValueAtTime).to.be.a('function');
            // expect(audioBufferSourceNode.detune.linearRampToValueAtTime).to.be.a('function');
            // expect(audioBufferSourceNode.detune.setTargetAtTime).to.be.a('function');
            // expect(audioBufferSourceNode.detune.setValueCurveAtTime).to.be.a('function');
            // expect(audioBufferSourceNode.detune.value).to.equal(0);

            expect(audioBufferSourceNode.loop).to.be.false;
            expect(audioBufferSourceNode.loopEnd).to.equal(0);
            expect(audioBufferSourceNode.loopStart).to.equal(0);
            expect(audioBufferSourceNode.numberOfInputs).to.equal(0);
            expect(audioBufferSourceNode.numberOfOutputs).to.equal(1);
            expect(audioBufferSourceNode.onended).to.be.null;

            expect(audioBufferSourceNode.playbackRate.cancelScheduledValues).to.be.a('function');
            expect(audioBufferSourceNode.playbackRate.defaultValue).to.equal(1);
            expect(audioBufferSourceNode.playbackRate.exponentialRampToValueAtTime).to.be.a('function');
            expect(audioBufferSourceNode.playbackRate.linearRampToValueAtTime).to.be.a('function');
            expect(audioBufferSourceNode.playbackRate.setTargetAtTime).to.be.a('function');
            expect(audioBufferSourceNode.playbackRate.setValueCurveAtTime).to.be.a('function');
            expect(audioBufferSourceNode.playbackRate.value).to.equal(1);

            expect(audioBufferSourceNode.start).to.be.a('function');
            expect(audioBufferSourceNode.stop).to.be.a('function');
        });

        it('should be chainable', function () {
            var audioBufferSourceNode = audioContext.createBufferSource(),
                gainNode = audioContext.createGain();

            expect(audioBufferSourceNode.connect(gainNode)).to.equal(gainNode);
        });

    });

    describe('createChannelMerger()', function () {

        it('should return an instance of the ChannelMergerNode interface', function () {
            var channelMergerNode = audioContext.createChannelMerger();

            expect(channelMergerNode.channelCount).to.equal(1);
            expect(channelMergerNode.channelCountMode).to.equal('explicit');
            expect(channelMergerNode.channelInterpretation).to.equal('speakers');
            expect(channelMergerNode.numberOfInputs).to.equal(6);
            expect(channelMergerNode.numberOfOutputs).to.equal(1);
        });

        it('should return a channelMergerNode with the given parameters', function () {
            var channelMergerNode = audioContext.createChannelMerger(2);

            expect(channelMergerNode.numberOfInputs).to.equal(2);
        });

        it('should not allow to change the value of the channelCount property', function (done) {
            var channelMergerNode = audioContext.createChannelMerger(2);

            try {
                channelMergerNode.channelCount = 2;
            } catch (err) {
                expect(err.code).to.equal(11);
                expect(err.name).to.equal('InvalidStateError');

                done();
            }
        });

        it('should not allow to change the value of the channelCountMode property', function (done) {
            var channelMergerNode = audioContext.createChannelMerger(2);

            try {
                channelMergerNode.channelCountMode = 'max';
            } catch (err) {
                expect(err.code).to.equal(11);
                expect(err.name).to.equal('InvalidStateError');

                done();
            }
        });

        it('should throw an error if the AudioContext is closed', function (done) {
            audioContext
                .close()
                .then(function () {
                    audioContext.createChannelMerger();
                })
                .catch(function (err) {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    audioContext = new AudioContext();

                    done();
                });
        });

        it('should be connectable', function () {
            var channelMerger = audioContext.createChannelMerger(),
                gainNode = audioContext.createGain();

            channelMerger.connect(gainNode);
        });

        it('should be chainable', function () {
            var channelMerger = audioContext.createChannelMerger(),
                gainNode = audioContext.createGain();

            expect(channelMerger.connect(gainNode)).to.equal(gainNode);
        });

    });

    describe('createChannelSplitter()', function () {

        it('should return an instance of the ChannelSplitterNode interface', function () {
            var channelSplitterNode = audioContext.createChannelSplitter();

            expect(channelSplitterNode.channelCountMode).to.equal('max');
            expect(channelSplitterNode.channelInterpretation).to.equal('speakers');
            expect(channelSplitterNode.numberOfInputs).to.equal(1);
            expect(channelSplitterNode.numberOfOutputs).to.equal(6);
        });

        it('should return a channelSplitterNode with the given parameters', function () {
            var channelSplitterNode = audioContext.createChannelSplitter(2);

            expect(channelSplitterNode.numberOfOutputs).to.equal(2);
        });

        it('should throw an error if the AudioContext is closed', function (done) {
            audioContext
                .close()
                .then(function () {
                    audioContext.createChannelSplitter();
                })
                .catch(function (err) {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    audioContext = new AudioContext();

                    done();
                });
        });

        it('should be chainable', function () {
            var channelSplitterNode = audioContext.createChannelSplitter(),
                gainNode = audioContext.createGain();

            expect(channelSplitterNode.connect(gainNode)).to.equal(gainNode);
        });

    });

    describe('createGain()', function () {

        it('should return an instance of the GainNode interface', function () {
            var gainNode = audioContext.createGain();

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

        it('should be chainable', function () {
            var channelSplitterNode = audioContext.createChannelSplitter(),
                gainNode = audioContext.createGain();

            expect(gainNode.connect(channelSplitterNode)).to.equal(channelSplitterNode);
        });

        it('should be disconnectable', function (done) {
            var analyzer,
                candidate,
                dummy,
                ones,
                source;

            candidate = audioContext.createGain();
            dummy = audioContext.createGain();

            // @todo remove this ugly hack
            analyzer = candidate.context.createScriptProcessor(256, 1, 1);

            ones = audioContext.createBuffer(1, 2, 44100);
            ones.getChannelData(0)[0] = 1;
            ones.getChannelData(0)[1] = 1;

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

                if (Array.from(channelData).indexOf(1) > -1) {
                    source.stop();

                    analyzer.onaudioprocess = null;

                    source.disconnect(candidate);
                    candidate.disconnect(analyzer);
                    analyzer.disconnect(audioContext.destination);

                    done();
                }
            };

            source.start();
        });

    });

    describe('createIIRFilter()', function () {

        it('should return an instance of the IIRFilterNode interface', function () {
            var iIRFilterNode = audioContext.createIIRFilter([ 1 ], [ 1 ]);

            expect(iIRFilterNode.channelCountMode).to.equal('max');
            expect(iIRFilterNode.channelInterpretation).to.equal('speakers');

            expect(iIRFilterNode.getFrequencyResponse).to.be.a('function');

            expect(iIRFilterNode.numberOfInputs).to.equal(1);
            expect(iIRFilterNode.numberOfOutputs).to.equal(1);
        });

        it('should throw an InvalidStateError', function (done) {
            try {
                audioContext.createIIRFilter([ 0 ], [ 1 ]);
            } catch (err) {
                expect(err.code).to.equal(11);
                expect(err.name).to.equal('InvalidStateError');

                done();
            }
        });

        it('should throw an NotSupportedError', function (done) {
            try {
                audioContext.createIIRFilter([], [ 1 ]);
            } catch (err) {
                expect(err.code).to.equal(9);
                expect(err.name).to.equal('NotSupportedError');

                done();
            }
        });

        it('should throw an NotSupportedError', function (done) {
            try {
                audioContext.createIIRFilter([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21 ], [ 1 ]);
            } catch (err) {
                expect(err.code).to.equal(9);
                expect(err.name).to.equal('NotSupportedError');

                done();
            }
        });

        it('should throw an InvalidStateError', function (done) {
            try {
                audioContext.createIIRFilter([ 1 ], [ 0, 1 ]);
            } catch (err) {
                expect(err.code).to.equal(11);
                expect(err.name).to.equal('InvalidStateError');

                done();
            }
        });

        it('should throw an NotSupportedError', function (done) {
            try {
                audioContext.createIIRFilter([ 1 ], []);
            } catch (err) {
                expect(err.code).to.equal(9);
                expect(err.name).to.equal('NotSupportedError');

                done();
            }
        });

        it('should throw an NotSupportedError', function (done) {
            try {
                audioContext.createIIRFilter([ 1 ], [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21 ]);
            } catch (err) {
                expect(err.code).to.equal(9);
                expect(err.name).to.equal('NotSupportedError');

                done();
            }
        });

        it('should throw an error if the AudioContext is closed', function (done) {
            audioContext
                .close()
                .then(function () {
                    audioContext.createIIRFilter([ 1 ], [ 1 ]);
                })
                .catch(function (err) {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    audioContext = new AudioContext();

                    done();
                });
        });

        it('should filter the given input', function (done) {
            var audioBufferSourceNode,
                buffer,
                gainNode,
                iIRFilterNode,
                scriptProcessorNode,
                tested;

            this.timeout(10000);

            audioBufferSourceNode = audioContext.createBufferSource();
            buffer = audioContext.createBuffer(2, 3, 44100);
            gainNode = audioContext.createGain();
            iIRFilterNode = audioContext.createIIRFilter([ 1, -1 ], [ 1, -0.5 ]);
            // @todo remove this ugly hack
            scriptProcessorNode = audioBufferSourceNode.context.createScriptProcessor(256, 2, 2);

            tested = false;

            buffer.copyToChannel(new Float32Array([1, 0, 0]), 0);
            buffer.copyToChannel(new Float32Array([0, 1, 1]), 1);

            audioBufferSourceNode.buffer = buffer;

            gainNode.gain.value = 0;

            scriptProcessorNode.onaudioprocess = function (event) {
                var i,
                    leftChannelData = event.inputBuffer.getChannelData(0),
                    rightChannelData;

                for (i = 0; i < scriptProcessorNode.bufferSize; i += 1) {
                    if (leftChannelData[i] === 1 && tested === false) {
                        expect(leftChannelData[ i ]).to.equal(1);
                        expect(leftChannelData[ i + 1 ]).to.equal(-0.5);
                        expect(leftChannelData[ i + 2 ]).to.equal(-0.25);

                        rightChannelData = event.inputBuffer.getChannelData(1);

                        expect(rightChannelData[ i ]).to.equal(0);
                        expect(rightChannelData[ i + 1 ]).to.equal(1);
                        expect(rightChannelData[ i + 2 ]).to.equal(0.5);

                        scriptProcessorNode.onaudioprocess = null;
                        tested = true;

                        done();
                    }
                }
            };

            audioBufferSourceNode
                .connect(iIRFilterNode)
                .connect(scriptProcessorNode)
                .connect(gainNode);
            // @todo Chain the scriptProcessorNodeNode too once it supports chaining.
            gainNode
                .connect(audioContext.destination);

            audioBufferSourceNode.start(audioContext.currentTime + 0.1);
        });

        it('should be chainable', function () {
            var gainNode = audioContext.createGain(),
                iIRFilterNode = audioContext.createIIRFilter([ 1, -1 ], [ 1, -0.5 ]);

            expect(iIRFilterNode.connect(gainNode)).to.equal(gainNode);
        });

        describe('getFrequencyResponse()', function () {

            it('should throw an NotSupportedError', function (done) {
                var iIRFilterNode = audioContext.createIIRFilter([ 1 ], [ 1 ]);

                try {
                    iIRFilterNode.getFrequencyResponse(new Float32Array([ 1 ]), new Float32Array(0), new Float32Array(1));
                } catch (err) {
                    expect(err.code).to.equal(9);
                    expect(err.name).to.equal('NotSupportedError');

                    done();
                }
            });

            it('should throw an NotSupportedError', function (done) {
                var iIRFilterNode = audioContext.createIIRFilter([ 1 ], [ 1 ]);

                try {
                    iIRFilterNode.getFrequencyResponse(new Float32Array([ 1 ]), new Float32Array(1), new Float32Array(0));
                } catch (err) {
                    expect(err.code).to.equal(9);
                    expect(err.name).to.equal('NotSupportedError');

                    done();
                }
            });

            it('should fill the magResponse and phaseResponse arrays', function () {
                var iIRFilterNode = audioContext.createIIRFilter([ 1 ], [ 1 ]),
                    magResponse = new Float32Array(5),
                    phaseResponse = new Float32Array(5);

                iIRFilterNode.getFrequencyResponse(new Float32Array([ 200, 400, 800, 1600, 3200 ]), magResponse, phaseResponse);

                expect(Array.from(magResponse)).to.deep.equal([ 1, 1, 1, 1, 1 ]);
                expect(Array.from(phaseResponse)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
            });

            it('should fill the magResponse and phaseResponse arrays ... for some other values', function () {
                var iIRFilterNode = audioContext.createIIRFilter([ 1, -1 ], [ 1, -0.5 ]),
                    magResponse = new Float32Array(5),
                    phaseResponse = new Float32Array(5);

                iIRFilterNode.getFrequencyResponse(new Float32Array([ 200, 400, 800, 1600, 3200 ]), magResponse, phaseResponse);

                expect(Array.from(magResponse)).to.deep.equal([ 0.056942202150821686, 0.11359700560569763, 0.2249375581741333, 0.43307945132255554, 0.7616625428199768 ]);
                expect(Array.from(phaseResponse)).to.deep.equal([ 1.5280766487121582, 1.4854952096939087, 1.401282548904419, 1.2399859428405762, 0.9627721309661865 ]);
            });

        });

    });

    describe('createOscillator()', function () {

        it('should return an instance of the OscillatorNode interface', function () {
            var oscillatorNode = audioContext.createOscillator();

            // channelCount is not specified
            // channelCountMode is not specified
            // channelInterpretation is not specified

            expect(oscillatorNode.detune.cancelScheduledValues).to.be.a('function');
            expect(oscillatorNode.detune.defaultValue).to.equal(0);
            expect(oscillatorNode.detune.exponentialRampToValueAtTime).to.be.a('function');
            expect(oscillatorNode.detune.linearRampToValueAtTime).to.be.a('function');
            expect(oscillatorNode.detune.setTargetAtTime).to.be.a('function');
            expect(oscillatorNode.detune.setValueCurveAtTime).to.be.a('function');
            expect(oscillatorNode.detune.value).to.equal(0);

            expect(oscillatorNode.frequency.cancelScheduledValues).to.be.a('function');
            expect(oscillatorNode.frequency.defaultValue).to.equal(440);
            expect(oscillatorNode.frequency.exponentialRampToValueAtTime).to.be.a('function');
            expect(oscillatorNode.frequency.linearRampToValueAtTime).to.be.a('function');
            expect(oscillatorNode.frequency.setTargetAtTime).to.be.a('function');
            expect(oscillatorNode.frequency.setValueCurveAtTime).to.be.a('function');
            expect(oscillatorNode.frequency.value).to.equal(440);

            expect(oscillatorNode.numberOfInputs).to.equal(0);
            expect(oscillatorNode.numberOfOutputs).to.equal(1);
            expect(oscillatorNode.type).to.equal('sine');
            expect(oscillatorNode.setPeriodicWave).to.be.a('function');
            expect(oscillatorNode.start).to.be.a('function');
            expect(oscillatorNode.stop).to.be.a('function');
        });

        it('should throw an error if the AudioContext is closed', function (done) {
            audioContext
                .close()
                .then(function () {
                    audioContext.createOscillator();
                })
                .catch(function (err) {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    audioContext = new AudioContext();

                    done();
                });
        });

        it('should be chainable', function () {
            var gainNode = audioContext.createGain(),
                oscillatorNode = audioContext.createOscillator();

            expect(oscillatorNode.connect(gainNode)).to.equal(gainNode);
        });

    });

    describe('decodeAudioData()', function () {

        it('should return a promise', function () {
            expect(audioContext.decodeAudioData()).to.be.an.instanceOf(Promise);
        });

        describe('without a valid arrayBuffer', function () {

            it('should throw an error', function (done) {
                audioContext
                    .decodeAudioData(null)
                    .catch(function (err) {
                        expect(err.code).to.equal(9);
                        expect(err.name).to.equal('NotSupportedError');

                        done();
                    });
            });

            it('should call the errorCallback with an error', function (done) {
                audioContext.decodeAudioData(null, function () {}, function (err) {
                    expect(err.code).to.equal(9);
                    expect(err.name).to.equal('NotSupportedError');

                    done();
                });
            });

            // The promise is rejected before but the errorCallback gets called synchronously.
            it('should call the errorCallback before the promise gets rejected', function (done) {
                var errorCallback = sinon.spy();

                audioContext
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
                audioContext
                    .decodeAudioData(arrayBuffer)
                    .catch(function (err) {
                        expect(err.code).to.equal(0);
                        expect(err.name).to.equal('EncodingError');

                        done();
                    });
            });

            it('should call the errorCallback with an error', function (done) {
                audioContext.decodeAudioData(arrayBuffer, function () {}, function (err) {
                    expect(err.code).to.equal(0);
                    expect(err.name).to.equal('EncodingError');

                    done();
                });
            });

            // The promise is rejected before but the errorCallback gets called synchronously.
            it('should call the errorCallback before the promise gets rejected', function (done) {
                var errorCallback = sinon.spy();

                audioContext
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
                return audioContext
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
                audioContext.decodeAudioData(arrayBuffer, function (audioBuffer) {
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

                return audioContext
                    .decodeAudioData(arrayBuffer, successCallback)
                    .then(function () {
                        expect(successCallback).to.have.been.calledOnce;
                    });
            });

        });

    });

});
