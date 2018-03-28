import 'core-js/es7/reflect';
import {
    UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    unpatchedAudioContextConstructor as nptchdDCntxtCnstrctr
} from '../../../src/providers/unpatched-audio-context-constructor';
import { AudioContext } from '../../../src/audio-contexts/audio-context';
import { ReflectiveInjector } from '@angular/core';
import { WINDOW_PROVIDER } from '../../../src/providers/window';
import { createScriptProcessor } from '../../helper/create-script-processor';
import { loadFixture } from '../../helper/load-fixture';
import { spy } from 'sinon';

describe('AudioContext', () => {

    let audioContext;

    afterEach(() => {
        return audioContext.close();
    });

    describe('without a constructed AudioContext', () => {

        it('should allow to set the latencyHint to balanced', () => {
            audioContext = new AudioContext({ latencyHint: 'balanced' });
        });

        it('should allow to set the latencyHint to interactive', () => {
            audioContext = new AudioContext({ latencyHint: 'interactive' });
        });

        it('should allow to set the latencyHint to playback', () => {
            audioContext = new AudioContext({ latencyHint: 'playback' });
        });

        it('should allow to set the latencyHint to a number', () => {
            audioContext = new AudioContext({ latencyHint: 0.5 });
        });

        it('should not allow to set the latencyHint to an unsupported value', () => {
            expect(() => {
                audioContext = new AudioContext({ latencyHint: 'negative' });
            }).to.throw(TypeError, "The provided value 'negative' is not a valid enum value of type AudioContextLatencyCategory.");

            // Create a new AudioContext to ensure the afterEach hooks keeps working.
            audioContext = new AudioContext();
        });

    });

    describe('with a constructed AudioContext', () => {

        beforeEach(() => {
            audioContext = new AudioContext();
        });

        describe('audioWorklet', () => {

            it('should be an instance of the AudioWorklet interface', () => {
                const audioWorklet = audioContext.audioWorklet;

                expect(audioWorklet.addModule).to.be.a('function');
            });

        });

        describe('currentTime', () => {

            it('should be a number', () => {
                expect(audioContext.currentTime).to.be.a('number');
            });

            it('should be readonly', () => {
                expect(() => {
                    audioContext.currentTime = 0;
                }).to.throw(TypeError);
            });

            it('should advance over time', (done) => {
                const now = audioContext.currentTime;

                audioContext.onstatechange = () => {
                    // Prevent consecutive calls.
                    audioContext.onstatechange = null;

                    setTimeout(() => {
                        expect(audioContext.currentTime).to.above(now);

                        done();
                    }, 1000);
                };

                // Kick off the audioContext.
                audioContext.createGain();
            });

        });

        describe('destination', () => {

            it('should be an instance of the AudioDestinationNode interface', () => {
                const destination = audioContext.destination;

                expect(destination.channelCount).to.equal(2);
                expect(destination.channelCountMode).to.equal('explicit');
                expect(destination.channelInterpretation).to.equal('speakers');
                expect(destination.maxChannelCount).to.be.a('number');
                expect(destination.numberOfInputs).to.equal(1);
                expect(destination.numberOfOutputs).to.equal(0);
            });

            it('should be readonly', () => {
                expect(() => {
                    audioContext.destination = 'a fake AudioDestinationNode';
                }).to.throw(TypeError);
            });

            it('should have maxChannelCount which is at least the channelCount', () => {
                const destination = audioContext.destination;

                expect(destination.maxChannelCount).to.be.at.least(destination.channelCount);
            });

            it('should not allow to change the value of the channelCount property to a value above the maxChannelCount', (done) => {
                const destination = audioContext.destination;

                try {
                    destination.channelCount = destination.maxChannelCount + 1;
                } catch (err) {
                    expect(err.code).to.equal(1);
                    expect(err.name).to.equal('IndexSizeError');

                    done();
                }
            });

        });

        describe('onstatechange', () => {

            it('should be null', () => {
                expect(audioContext.onstatechange).to.be.null;
            });

            it('should be assignable to a function', () => {
                const fn = () => {};
                const onstatechange = audioContext.onstatechange = fn; // eslint-disable-line no-multi-assign

                expect(onstatechange).to.equal(fn);
                expect(audioContext.onstatechange).to.equal(fn);
            });

            it('should be assignable to null', () => {
                const onstatechange = audioContext.onstatechange = null; // eslint-disable-line no-multi-assign

                expect(onstatechange).to.be.null;
                expect(audioContext.onstatechange).to.be.null;
            });

            it('should not be assignable to something else', () => {
                const string = 'no function or null value';

                audioContext.onstatechange = () => {};

                const onstatechange = audioContext.onstatechange = string; // eslint-disable-line no-multi-assign

                expect(onstatechange).to.equal(string);
                expect(audioContext.onstatechange).to.be.null;
            });

        });

        describe('sampleRate', () => {

            it('should be a number', () => {
                expect(audioContext.sampleRate).to.be.a('number');
            });

            it('should be readonly', () => {
                expect(() => {
                    audioContext.sampleRate = 22050;
                }).to.throw(TypeError);
            });

        });

        describe('state', () => {

            it('should be suspended at the beginning', () => {
                expect(audioContext.state).to.equal('suspended');
            });

            it('should be readonly', () => {
                expect(() => {
                    audioContext.state = 'closed';
                }).to.throw(TypeError);
            });

            it('should be transitioned to running', (done) => {
                audioContext.onstatechange = () => {
                    expect(audioContext.state).to.equal('running');

                    // Prevent consecutive calls.
                    audioContext.onstatechange = null;

                    done();
                };

                // Kick off the audioContext.
                audioContext.createGain();
            });

            // closed is tested below

        });

        describe('close()', () => {

            afterEach(() => {
                // Create a closeable AudioContext to align the behaviour with other tests.
                audioContext = new AudioContext();
            });

            it('should return a promise', () => {
                expect(audioContext.close()).to.be.an.instanceOf(Promise);
            });

            it('should set the state to closed', (done) => {
                audioContext
                    .close()
                    .then(() => {
                        // According to the spec the context state is changed to 'closed' after the promise gets resolved.
                        setTimeout(() => {
                            expect(audioContext.state).to.equal('closed');

                            done();
                        });
                    })
                    .catch(done);
            });

            describe('with a closed AudioContext', () => {

                beforeEach(() => audioContext.close());

                it('should throw an error', (done) => {
                    audioContext
                        .close()
                        .catch((err) => {
                            expect(err.code).to.equal(11);
                            expect(err.name).to.equal('InvalidStateError');

                            done();
                        });
                });

            });

        });

        describe('createAnalyser()', () => {

            it('should return an instance of the AnalyserNode interface', () => {
                const analyserNode = audioContext.createAnalyser();

                expect(analyserNode.channelCount).to.equal(2);
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

                expect(analyserNode.smoothingTimeConstant).to.closeTo(0.8, 0.0000001);
            });

            it('should throw an error if the AudioContext is closed', (done) => {
                audioContext
                    .close()
                    .then(() => {
                        audioContext.createAnalyser();
                    })
                    .catch((err) => {
                        expect(err.code).to.equal(11);
                        expect(err.name).to.equal('InvalidStateError');

                        audioContext = new AudioContext();

                        done();
                    });
            });

            it('should be chainable', () => {
                const analyserNode = audioContext.createAnalyser();
                const gainNode = audioContext.createGain();

                expect(analyserNode.connect(gainNode)).to.equal(gainNode);
            });

            it('should be disconnectable', (done) => {
                const candidate = audioContext.createAnalyser();
                const dummy = audioContext.createGain();
                const analyzer = createScriptProcessor(audioContext, 256, 1, 1);
                // Safari does not play buffers which contain just one frame.
                const ones = audioContext.createBuffer(1, 2, 44100);

                ones.copyToChannel(new Float32Array([ 1, 1 ]), 0);

                const source = audioContext.createBufferSource();

                source.buffer = ones;
                source.loop = true;

                source.connect(candidate);
                candidate.connect(analyzer);
                analyzer.connect(audioContext.destination);
                candidate.connect(dummy);
                candidate.disconnect(dummy);

                analyzer.onaudioprocess = (event) => {
                    const channelData = event.inputBuffer.getChannelData(0);

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

            it('should not be connectable to a node of another AudioContext', (done) => {
                const analyserNode = audioContext.createAnalyser();
                const anotherAudioContext = new AudioContext();

                try {
                    analyserNode.connect(anotherAudioContext.destination);
                } catch (err) {
                    expect(err.code).to.equal(15);
                    expect(err.name).to.equal('InvalidAccessError');

                    done();
                } finally {
                    anotherAudioContext.close();
                }
            });

            describe('getFloatTimeDomainData()', () => {

                it('should return time-domain data', () => {
                    const analyserNode = audioContext.createAnalyser();
                    const data = new Float32Array(analyserNode.fftSize);

                    analyserNode.getFloatTimeDomainData(data);

                    expect(data[0]).to.equal(0);
                });

            });

        });

        describe('createBiquadFilter()', () => {

            it('should be a function', () => {
                expect(audioContext.createBiquadFilter).to.be.a('function');
            });

        });

        describe('createBuffer()', () => {

            it('should return an instance of the AudioBuffer interface', () => {
                const audioBuffer = audioContext.createBuffer(2, 10, 44100);

                expect(audioBuffer.duration).to.be.closeTo(10 / 44100, 0.001);
                expect(audioBuffer.length).to.equal(10);
                expect(audioBuffer.numberOfChannels).to.equal(2);
                expect(audioBuffer.sampleRate).to.equal(44100);
                expect(audioBuffer.getChannelData).to.be.a('function');
                expect(audioBuffer.copyFromChannel).to.be.a('function');
                expect(audioBuffer.copyToChannel).to.be.a('function');
            });

            it('should return an AudioBuffer which can be used with an unpatched AudioContext', () => {
                const audioBuffer = audioContext.createBuffer(2, 10, 44100);
                const injector = ReflectiveInjector.resolveAndCreate([
                    UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
                    WINDOW_PROVIDER
                ]);
                const UnpatchedAudioContext = injector.get(nptchdDCntxtCnstrctr);
                const unpatchedAudioContext = new UnpatchedAudioContext();
                const unpatchedAudioBufferSourceNode = unpatchedAudioContext.createBufferSource();

                unpatchedAudioBufferSourceNode.buffer = audioBuffer;
            });

            describe('copyFromChannel()', () => {

                let audioBuffer;
                let destination;

                beforeEach(() => {
                    audioBuffer = audioContext.createBuffer(2, 10, 44100);
                    destination = new Float32Array(10);
                });

                it('should not allow to copy a channel with a number greater or equal than the number of channels', (done) => {
                    try {
                        audioBuffer.copyFromChannel(destination, 2);
                    } catch (err) {
                        expect(err.code).to.equal(1);
                        expect(err.name).to.equal('IndexSizeError');

                        done();
                    }
                });

                it('should not allow to copy values with an offset greater than the length', (done) => {
                    try {
                        audioBuffer.copyFromChannel(destination, 0, 10);
                    } catch (err) {
                        expect(err.code).to.equal(1);
                        expect(err.name).to.equal('IndexSizeError');

                        done();
                    }
                });

            });

            describe('copyToChannel()', () => {

                let audioBuffer;
                let source;

                beforeEach(() => {
                    audioBuffer = audioContext.createBuffer(2, 10, 44100);
                    source = new Float32Array(10);
                });

                it('should not allow to copy a channel with a number greater or equal than the number of channels', (done) => {
                    try {
                        audioBuffer.copyToChannel(source, 2);
                    } catch (err) {
                        expect(err.code).to.equal(1);
                        expect(err.name).to.equal('IndexSizeError');

                        done();
                    }
                });

                it('should not allow to copy values with an offset greater than the length', (done) => {
                    try {
                        audioBuffer.copyToChannel(source, 0, 10);
                    } catch (err) {
                        expect(err.code).to.equal(1);
                        expect(err.name).to.equal('IndexSizeError');

                        done();
                    }
                });

            });

            describe('copyFromChannel()/copyToChannel()', () => {

                let audioBuffer;
                let destination;
                let source;

                beforeEach(() => {
                    audioBuffer = audioContext.createBuffer(2, 100, 44100);
                    destination = new Float32Array(10);
                    source = new Float32Array(10);

                    for (let i = 0; i < 10; i += 1) {
                        destination[i] = Math.random();
                        source[i] = Math.random();
                    }
                });

                it('should copy values with an offset of 0', () => {
                    audioBuffer.copyToChannel(source, 0);
                    audioBuffer.copyFromChannel(destination, 0);

                    for (let i = 0; i < 10; i += 1) {
                        expect(destination[i]).to.equal(source[i]);
                    }
                });

                it('should copy values with an offset of 50', () => {
                    audioBuffer.copyToChannel(source, 0, 50);
                    audioBuffer.copyFromChannel(destination, 0, 50);

                    for (let i = 0; i < 10; i += 1) {
                        expect(destination[i]).to.equal(source[i]);
                    }
                });

                it('should copy values with an offset large enough to leave a part of the destination untouched', () => {
                    const destinationCopy = Array.from(destination);

                    audioBuffer.copyToChannel(source, 0, 95);
                    audioBuffer.copyFromChannel(destination, 0, 95);

                    for (let i = 0; i < 5; i += 1) {
                        expect(destination[i]).to.equal(source[i]);
                    }

                    for (let i = 5; i < 10; i += 1) {
                        expect(destination[i]).to.equal(destinationCopy[i]);
                    }
                });

                it('should copy values with an offset low enough to leave a part of the buffer untouched', () => {
                    audioBuffer.copyToChannel(source, 0, 35);
                    audioBuffer.copyToChannel(source, 0, 25);
                    audioBuffer.copyFromChannel(destination, 0, 35);

                    for (let i = 0; i < 10; i += 1) {
                        expect(destination[i]).to.equal(source[i]);
                    }
                });

            });

        });

        describe('createBufferSource()', () => {

            it('should be a function', () => {
                expect(audioContext.createBufferSource).to.be.a('function');
            });

        });

        describe('createChannelMerger()', () => {

            it('should return an instance of the ChannelMergerNode interface', () => {
                const channelMergerNode = audioContext.createChannelMerger();

                expect(channelMergerNode.channelCount).to.equal(1);
                expect(channelMergerNode.channelCountMode).to.equal('explicit');
                expect(channelMergerNode.channelInterpretation).to.equal('speakers');
                expect(channelMergerNode.numberOfInputs).to.equal(6);
                expect(channelMergerNode.numberOfOutputs).to.equal(1);
            });

            it('should return a channelMergerNode with the given parameters', () => {
                const channelMergerNode = audioContext.createChannelMerger(2);

                expect(channelMergerNode.numberOfInputs).to.equal(2);
            });

            it('should not allow to change the value of the channelCount property', (done) => {
                const channelMergerNode = audioContext.createChannelMerger(2);

                try {
                    channelMergerNode.channelCount = 2;
                } catch (err) {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    done();
                }
            });

            it('should not allow to change the value of the channelCountMode property', (done) => {
                const channelMergerNode = audioContext.createChannelMerger(2);

                try {
                    channelMergerNode.channelCountMode = 'max';
                } catch (err) {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    done();
                }
            });

            it('should throw an error if the AudioContext is closed', (done) => {
                audioContext
                    .close()
                    .then(() => {
                        audioContext.createChannelMerger();
                    })
                    .catch((err) => {
                        expect(err.code).to.equal(11);
                        expect(err.name).to.equal('InvalidStateError');

                        audioContext = new AudioContext();

                        done();
                    });
            });

            it('should be connectable', () => {
                const channelMergerNode = audioContext.createChannelMerger();
                const gainNode = audioContext.createGain();

                channelMergerNode.connect(gainNode);
            });

            it('should be chainable', () => {
                const channelMergerNode = audioContext.createChannelMerger();
                const gainNode = audioContext.createGain();

                expect(channelMergerNode.connect(gainNode)).to.equal(gainNode);
            });

            it('should not be connectable to a node of another AudioContext', (done) => {
                const anotherAudioContext = new AudioContext();
                const channelMergerNode = audioContext.createChannelMerger();

                try {
                    channelMergerNode.connect(anotherAudioContext.destination);
                } catch (err) {
                    expect(err.code).to.equal(15);
                    expect(err.name).to.equal('InvalidAccessError');

                    done();
                } finally {
                    anotherAudioContext.close();
                }
            });

            it('should handle unconnected channels as silence', (done) => {
                const audioBufferSourceNode = audioContext.createBufferSource();
                const channelMergerNode = audioContext.createChannelMerger(2);
                const sampleRate = audioContext.sampleRate;
                const audioBuffer = audioContext.createBuffer(1, 2, sampleRate);
                const scriptProcessorNode = createScriptProcessor(audioContext, 256, 2, 2);

                // @todo Safari does not play/loop 1 sample buffers. This should be patched.
                audioBuffer.copyToChannel(new Float32Array([ 1, 1 ]), 0);

                audioBufferSourceNode.buffer = audioBuffer;
                audioBufferSourceNode.loop = true;

                const startTime = audioContext.currentTime;

                scriptProcessorNode.onaudioprocess = (event) => {
                    const channelData = event.inputBuffer.getChannelData(1);

                    for (let i = 0, length = channelData.length; i < length; i += 1) {
                        if (channelData[i] === 1) {
                            done(new Error('This channel should be silent.'));

                            return;
                        }
                    }

                    if (startTime + (1 / sampleRate) < event.playbackTime) {
                        done();
                    }
                };

                audioBufferSourceNode
                    .connect(channelMergerNode, 0, 0)
                    .connect(scriptProcessorNode)
                    .connect(audioContext.destination);

                audioBufferSourceNode.start(startTime);
            });

        });

        describe('createChannelSplitter()', () => {

            it('should return an instance of the ChannelSplitterNode interface', () => {
                const channelSplitterNode = audioContext.createChannelSplitter();

                expect(channelSplitterNode.channelCount).to.equal(6);
                expect(channelSplitterNode.channelCountMode).to.equal('explicit');
                expect(channelSplitterNode.channelInterpretation).to.equal('discrete');
                expect(channelSplitterNode.numberOfInputs).to.equal(1);
                expect(channelSplitterNode.numberOfOutputs).to.equal(6);
            });

            it('should return a channelSplitterNode with the given parameters', () => {
                const channelSplitterNode = audioContext.createChannelSplitter(2);

                expect(channelSplitterNode.numberOfOutputs).to.equal(2);
            });

            it('should not allow to change the value of the channelCount property', (done) => {
                const channelSplitterNode = audioContext.createChannelSplitter(2);

                try {
                    channelSplitterNode.channelCount = 4;
                } catch (err) {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    done();
                }
            });

            it('should not allow to change the value of the channelCountMode property', (done) => {
                const channelSplitterNode = audioContext.createChannelSplitter(2);

                try {
                    channelSplitterNode.channelCountMode = 'max';
                } catch (err) {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    done();
                }
            });

            it('should not allow to change the value of the channelInterpretation property', (done) => {
                const channelSplitterNode = audioContext.createChannelSplitter(2);

                try {
                    channelSplitterNode.channelInterpretation = 'speakers';
                } catch (err) {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    done();
                }
            });

            it('should throw an error if the AudioContext is closed', (done) => {
                audioContext
                    .close()
                    .then(() => {
                        audioContext.createChannelSplitter();
                    })
                    .catch((err) => {
                        expect(err.code).to.equal(11);
                        expect(err.name).to.equal('InvalidStateError');

                        audioContext = new AudioContext();

                        done();
                    });
            });

            it('should be chainable', () => {
                const channelSplitterNode = audioContext.createChannelSplitter();
                const gainNode = audioContext.createGain();

                expect(channelSplitterNode.connect(gainNode)).to.equal(gainNode);
            });

            it('should not be connectable to a node of another AudioContext', (done) => {
                const anotherAudioContext = new AudioContext();
                const channelSplitterNode = audioContext.createChannelSplitter();

                try {
                    channelSplitterNode.connect(anotherAudioContext.destination);
                } catch (err) {
                    expect(err.code).to.equal(15);
                    expect(err.name).to.equal('InvalidAccessError');

                    done();
                } finally {
                    anotherAudioContext.close();
                }
            });

        });

        describe('createConstantSource()', () => {

            it('should be a function', () => {
                expect(audioContext.createConstantSource).to.be.a('function');
            });

        });

        describe('createGain()', () => {

            it('should be a function', () => {
                expect(audioContext.createGain).to.be.a('function');
            });

        });

        describe('createIIRFilter()', () => {

            it('should be a function', () => {
                expect(audioContext.createIIRFilter).to.be.a('function');
            });

        });

        describe('createMediaElementSource()', () => {

            it('should be a function', () => {
                expect(audioContext.createMediaElementSource).to.be.a('function');
            });

        });

        describe('createMediaStreamSource()', () => {

            it('should be a function', () => {
                expect(audioContext.createMediaStreamSource).to.be.a('function');
            });

        });

        describe('createOscillator()', () => {

            it('should be a function', () => {
                expect(audioContext.createOscillator).to.be.a('function');
            });

        });

        describe('decodeAudioData()', () => {

            it('should return a promise', () => {
                const promise = audioContext.decodeAudioData();

                promise.catch(() => { /* Ignore the error. */ });

                expect(promise).to.be.an.instanceOf(Promise);
            });

            describe('without a valid arrayBuffer', () => {

                it('should throw an error', (done) => {
                    audioContext
                        .decodeAudioData(null)
                        .catch((err) => {
                            expect(err).to.be.an.instanceOf(TypeError);

                            done();
                        });
                });

                it('should call the errorCallback with a TypeError', (done) => {
                    audioContext
                        .decodeAudioData(null, () => {}, (err) => {
                            expect(err).to.be.an.instanceOf(TypeError);

                            done();
                        })
                        .catch(() => { /* Ignore the error. */ });
                });

                // The promise is rejected before but the errorCallback gets called synchronously.
                it('should call the errorCallback before the promise gets rejected', (done) => {
                    const errorCallback = spy();

                    audioContext
                        .decodeAudioData(null, () => {}, errorCallback)
                        .catch(() => {
                            expect(errorCallback).to.have.been.calledOnce;

                            done();
                        });
                });

            });

            describe('with an arrayBuffer of an unsupported file', () => {

                let arrayBuffer;

                beforeEach(function (done) {
                    this.timeout(5000);

                    // PNG files are not supported by any browser :-)
                    loadFixture('one-pixel-of-transparency.png', (err, rrBffr) => {
                        expect(err).to.be.null;

                        arrayBuffer = rrBffr;

                        done();
                    });
                });

                it('should throw an error', (done) => {
                    audioContext
                        .decodeAudioData(arrayBuffer)
                        .catch((err) => {
                            expect(err.code).to.equal(0);
                            expect(err.name).to.equal('EncodingError');

                            done();
                        });
                });

                it('should call the errorCallback with an error', (done) => {
                    audioContext
                        .decodeAudioData(arrayBuffer, () => {}, (err) => {
                            expect(err.code).to.equal(0);
                            expect(err.name).to.equal('EncodingError');

                            done();
                        })
                        .catch(() => { /* Ignore the error. */ });
                });

                // The promise is rejected before but the errorCallback gets called synchronously.
                it('should call the errorCallback before the promise gets rejected', (done) => {
                    const errorCallback = spy();

                    audioContext
                        .decodeAudioData(arrayBuffer, () => {}, errorCallback)
                        .catch(() => {
                            expect(errorCallback).to.have.been.calledOnce;

                            done();
                        });
                });

            });

            describe('with an arrayBuffer of a supported file', function () {

                let arrayBuffer;

                beforeEach((done) => {
                    this.timeout(5000);

                    loadFixture('1000-frames-of-noise.wav', (err, rrBffr) => {
                        expect(err).to.be.null;

                        arrayBuffer = rrBffr;

                        done();
                    });
                });

                it('should resolve to an instance of the AudioBuffer interface', () => {
                    return audioContext
                        .decodeAudioData(arrayBuffer)
                        .then((audioBuffer) => {
                            expect(audioBuffer.duration).to.be.closeTo(1000 / 44100, 0.001);
                            expect(audioBuffer.length).to.equal(1000);
                            expect(audioBuffer.numberOfChannels).to.equal(2);
                            expect(audioBuffer.sampleRate).to.equal(44100);

                            expect(audioBuffer.getChannelData).to.be.a('function');
                            expect(audioBuffer.copyFromChannel).to.be.a('function');
                            expect(audioBuffer.copyToChannel).to.be.a('function');
                        });
                });

                it('should call the successCallback with an instance of the AudioBuffer interface', (done) => {
                    audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
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
                it('should call the successCallback before the promise gets resolved', () => {
                    const successCallback = spy();

                    return audioContext
                        .decodeAudioData(arrayBuffer, successCallback)
                        .then(() => {
                            expect(successCallback).to.have.been.calledOnce;
                        });
                });

                it('should throw a DataCloneError', (done) => {
                    audioContext
                        .decodeAudioData(arrayBuffer)
                        .then(() => audioContext.decodeAudioData(arrayBuffer))
                        .catch((err) => {
                            expect(err.code).to.equal(25);
                            expect(err.name).to.equal('DataCloneError');

                            done();
                        });
                });

                it('should neuter the arrayBuffer', (done) => {
                    audioContext.decodeAudioData(arrayBuffer);

                    setTimeout(() => {
                        expect(() => {
                            // Firefox will throw an error when using a neutered ArrayBuffer.
                            const uint8Array = new Uint8Array(arrayBuffer);

                            // Chrome, Opera and Safari will throw an error when trying to convert a typed array with a neutered ArrayBuffer.
                            Array.from(uint8Array);
                        }).to.throw(Error);

                        done();
                    });
                });

                it('should resolve with a assignable AudioBuffer', () => {
                    return audioContext
                        .decodeAudioData(arrayBuffer)
                        .then((audioBuffer) => {
                            const audioBufferSourceNode = audioContext.createBufferSource();

                            audioBufferSourceNode.buffer = audioBuffer;
                        });
                });

                it('should allow to encode in parallel', function () {
                    this.timeout(10000);

                    const arrayBufferCopies = [];

                    for (let i = 1; i < 100; i += 1) {
                        arrayBufferCopies.push(arrayBuffer.slice(0));
                    }

                    return Promise
                        .all(arrayBufferCopies.map((rrBffr) => audioContext.decodeAudioData(rrBffr)));
                });

            });

        });

        describe('resume()', () => {

            it('should return a promise', () => {
                expect(audioContext.resume()).to.be.an.instanceOf(Promise);
            });

            it('should set the state to running', (done) => {
                audioContext
                    .resume()
                    .then(() => {
                        // According to the spec the context state is changed to 'running' after the promise gets resolved.
                        setTimeout(() => {
                            expect(audioContext.state).to.equal('running');

                            done();
                        });
                    })
                    .catch(done);
            });

            describe('with a closed AudioContext', () => {

                afterEach(() => {
                    // Create a closeable AudioContext to align the behaviour with other tests.
                    audioContext = new AudioContext();
                });

                beforeEach(() => audioContext.close());

                it('should throw an error', (done) => {
                    audioContext
                        .resume()
                        .catch((err) => {
                            expect(err.code).to.equal(11);
                            expect(err.name).to.equal('InvalidStateError');

                            done();
                        });
                });

            });

            describe('with a running AudioContext', () => {

                beforeEach(() => audioContext.resume());

                it('should ignore consecutive calls', () => {
                    return audioContext.resume();
                });

            });

        });

        describe('suspend()', () => {

            it('should return a promise', () => {
                expect(audioContext.suspend()).to.be.an.instanceOf(Promise);
            });

            it('should set the state to suspended', (done) => {
                audioContext
                    .suspend()
                    .then(() => {
                        // According to the spec the context state is changed to 'suspended' after the promise gets resolved.
                        setTimeout(() => {
                            expect(audioContext.state).to.equal('suspended');

                            done();
                        });
                    })
                    .catch(done);
            });

            describe('with a closed AudioContext', () => {

                afterEach(() => {
                    // Create a closeable AudioContext to align the behaviour with other tests.
                    audioContext = new AudioContext();
                });

                beforeEach(() => audioContext.close());

                it('should throw an error', (done) => {
                    audioContext
                        .suspend()
                        .catch((err) => {
                            expect(err.code).to.equal(11);
                            expect(err.name).to.equal('InvalidStateError');

                            done();
                        });
                });

            });

            describe('with a suspended AudioContext', () => {

                beforeEach(() => audioContext.suspend());

                it('should ignore consecutive calls', () => {
                    return audioContext.suspend();
                });

            });

        });

    });

});
