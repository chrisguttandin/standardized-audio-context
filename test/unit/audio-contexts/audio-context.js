import '../../helper/play-silence';
import { AudioContext } from '../../../src/module';
import { createNativeAudioContextConstructor } from '../../../src/factories/native-audio-context-constructor';
import { createWindow } from '../../../src/factories/window';
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

            it('should fire an Event of type statechange', (done) => {
                audioContext.onstatechange = (event) => {
                    audioContext.onstatechange = null;

                    expect(event.type).to.equal('statechange');

                    done();
                };

                // Kick off the audioContext.
                audioContext.createGain();
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
                    audioContext.onstatechange = null;

                    expect(audioContext.state).to.equal('running');

                    done();
                };

                // Kick off the audioContext.
                audioContext.createGain();
            });

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

            it('should be a function', () => {
                expect(audioContext.createAnalyser).to.be.a('function');
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

            it('should return an AudioBuffer which can be used with a native AudioContext', () => {
                const audioBuffer = audioContext.createBuffer(2, 10, 44100);
                const window = createWindow();
                const nativeAudioContextConstructor = createNativeAudioContextConstructor(window);
                const nativeAudioContext = new nativeAudioContextConstructor(); // eslint-disable-line new-cap
                const nativeAudioBufferSourceNode = nativeAudioContext.createBufferSource();

                nativeAudioBufferSourceNode.buffer = audioBuffer;
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

            it('should be a function', () => {
                expect(audioContext.createChannelMerger).to.be.a('function');
            });

        });

        describe('createChannelSplitter()', () => {

            it('should be a function', () => {
                expect(audioContext.createChannelSplitter).to.be.a('function');
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

                it('should throw an error', function (done) {
                    this.timeout(10000);

                    audioContext
                        .decodeAudioData(null)
                        .catch((err) => {
                            expect(err).to.be.an.instanceOf(TypeError);

                            done();
                        });
                });

                it('should call the errorCallback with a TypeError', function (done) {
                    this.timeout(10000);

                    audioContext
                        .decodeAudioData(null, () => {}, (err) => {
                            expect(err).to.be.an.instanceOf(TypeError);

                            done();
                        })
                        .catch(() => { /* Ignore the error. */ });
                });

                // The promise is rejected before but the errorCallback gets called synchronously.
                it('should call the errorCallback before the promise gets rejected', function (done) {
                    this.timeout(10000);

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
                    this.timeout(10000);

                    // PNG files are not supported by any browser :-)
                    loadFixture('one-pixel-of-transparency.png', (err, rrBffr) => {
                        expect(err).to.be.null;

                        arrayBuffer = rrBffr;

                        done();
                    });
                });

                it('should throw an error', function (done) {
                    this.timeout(10000);

                    audioContext
                        .decodeAudioData(arrayBuffer)
                        .catch((err) => {
                            expect(err.code).to.equal(0);
                            expect(err.name).to.equal('EncodingError');

                            done();
                        });
                });

                it('should call the errorCallback with an error', function (done) {
                    this.timeout(10000);

                    audioContext
                        .decodeAudioData(arrayBuffer, () => {}, (err) => {
                            expect(err.code).to.equal(0);
                            expect(err.name).to.equal('EncodingError');

                            done();
                        })
                        .catch(() => { /* Ignore the error. */ });
                });

                // The promise is rejected before but the errorCallback gets called synchronously.
                it('should call the errorCallback before the promise gets rejected', function (done) {
                    this.timeout(10000);

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
                    this.timeout(10000);

                    loadFixture('1000-frames-of-noise.wav', (err, rrBffr) => {
                        expect(err).to.be.null;

                        arrayBuffer = rrBffr;

                        done();
                    });
                });

                it('should resolve to an instance of the AudioBuffer interface', function () {
                    this.timeout(10000);

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

                it('should call the successCallback with an instance of the AudioBuffer interface', function (done) {
                    this.timeout(10000);

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
                it('should call the successCallback before the promise gets resolved', function () {
                    this.timeout(10000);

                    const successCallback = spy();

                    return audioContext
                        .decodeAudioData(arrayBuffer, successCallback)
                        .then(() => {
                            expect(successCallback).to.have.been.calledOnce;
                        });
                });

                it('should throw a DataCloneError', function (done) {
                    this.timeout(10000);

                    audioContext
                        .decodeAudioData(arrayBuffer)
                        .then(() => audioContext.decodeAudioData(arrayBuffer))
                        .catch((err) => {
                            expect(err.code).to.equal(25);
                            expect(err.name).to.equal('DataCloneError');

                            done();
                        });
                });

                it('should neuter the arrayBuffer', function (done) {
                    this.timeout(10000);

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

                it('should resolve with a assignable AudioBuffer', function () {
                    this.timeout(10000);

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
