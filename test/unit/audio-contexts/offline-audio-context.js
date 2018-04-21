import { OfflineAudioContext } from '../../../src/module';
import { createNativeOfflineAudioContextConstructor } from '../../../src/factories/native-offline-audio-context-constructor';
import { createWindow } from '../../../src/factories/window';
import { loadFixture } from '../../helper/load-fixture';
import { spy } from 'sinon';

describe('OfflineAudioContext', () => {

    describe('audioWorklet', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be an instance of the AudioWorklet interface', () => {
            const audioWorklet = offlineAudioContext.audioWorklet;

            expect(audioWorklet.addModule).to.be.a('function');
        });

    });

    describe('currentTime', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be a number', () => {
            expect(offlineAudioContext.currentTime).to.be.a('number');
        });

        it('should be readonly', () => {
            expect(() => {
                offlineAudioContext.currentTime = 0;
            }).to.throw(TypeError);
        });

    });

    describe('destination', () => {

        let length;
        let sampleRate;

        beforeEach(() => {
            length = 1;
            sampleRate = 44100;
        });

        it('should be an instance of the AudioDestinationNode interface', () => {
            const offlineAudioContext = new OfflineAudioContext({ length, sampleRate });
            const destination = offlineAudioContext.destination;

            expect(destination.channelCount).to.equal(1);
            expect(destination.channelCountMode).to.equal('explicit');
            expect(destination.channelInterpretation).to.equal('speakers');
            expect(destination.maxChannelCount).to.equal(1);
            expect(destination.numberOfInputs).to.equal(1);
            expect(destination.numberOfOutputs).to.equal(0);
        });

        it('should be readonly', () => {
            const offlineAudioContext = new OfflineAudioContext({ length, sampleRate });

            expect(() => {
                offlineAudioContext.destination = 'a fake AudioDestinationNode';
            }).to.throw(TypeError);
        });

        it('should have maxChannelCount which is at least the channelCount', () => {
            const offlineAudioContext = new OfflineAudioContext({ length, sampleRate });
            const destination = offlineAudioContext.destination;

            expect(destination.maxChannelCount).to.be.at.least(destination.channelCount);
        });

        it('should not allow to change the value of the channelCount property', (done) => {
            const offlineAudioContext = new OfflineAudioContext({ length, sampleRate });

            try {
                offlineAudioContext.destination.channelCount = 2;
            } catch (err) {
                expect(err.code).to.equal(11);
                expect(err.name).to.equal('InvalidStateError');

                done();
            }
        });

        it('should not allow to change the value of the channelCountMode property', (done) => {
            const offlineAudioContext = new OfflineAudioContext({ length, sampleRate });

            try {
                offlineAudioContext.destination.channelCountMode = 'max';
            } catch (err) {
                expect(err.code).to.equal(11);
                expect(err.name).to.equal('InvalidStateError');

                done();
            }
        });

        describe('with options as arguments', () => {

            let numberOfChannels;
            let offlineAudioContext;

            beforeEach(() => {
                numberOfChannels = 8;
                offlineAudioContext = new OfflineAudioContext(numberOfChannels, length, sampleRate);
            });

            it('should have a channelCount which equals the numberOfChannels', () => {
                expect(offlineAudioContext.destination.channelCount).to.equal(numberOfChannels);
            });

            it('should have a maxChannelCount which equals the numberOfChannels', () => {
                expect(offlineAudioContext.destination.maxChannelCount).to.equal(numberOfChannels);
            });

        });

        describe('with a contextOptions', () => {

            describe('without a specified value for numberOfChannels', () => {

                let offlineAudioContext;

                beforeEach(() => {
                    offlineAudioContext = new OfflineAudioContext({ length, sampleRate });
                });

                it('should have a channelCount of one', () => {
                    expect(offlineAudioContext.destination.channelCount).to.equal(1);
                });

                it('should have a maxChannelCount of one', () => {
                    expect(offlineAudioContext.destination.maxChannelCount).to.equal(1);
                });

            });

            describe('with a specified value for numberOfChannels', () => {

                let numberOfChannels;
                let offlineAudioContext;

                beforeEach(() => {
                    numberOfChannels = 8;
                    offlineAudioContext = new OfflineAudioContext({ length, numberOfChannels, sampleRate });
                });

                it('should have a channelCount which equals the numberOfChannels', () => {
                    expect(offlineAudioContext.destination.channelCount).to.equal(numberOfChannels);
                });

                it('should have a maxChannelCount which equals the numberOfChannels', () => {
                    expect(offlineAudioContext.destination.maxChannelCount).to.equal(numberOfChannels);
                });

            });

        });

    });

    describe('length', () => {

        let length;

        beforeEach(() => {
            length = 129;
        });

        it('should be readonly', () => {
            const offlineAudioContext = new OfflineAudioContext(1, length, 44100);

            expect(() => {
                offlineAudioContext.length = 128;
            }).to.throw(TypeError);
        });

        describe('with options as arguments', () => {

            let offlineAudioContext;

            beforeEach(() => {
                offlineAudioContext = new OfflineAudioContext(1, length, 44100);
            });

            it('should expose its length', () => {
                expect(offlineAudioContext.length).to.equal(length);
            });

        });

        describe('with a contextOptions', () => {

            let offlineAudioContext;

            beforeEach(() => {
                offlineAudioContext = new OfflineAudioContext({ length, sampleRate: 44100 });
            });

            it('should expose its length', () => {
                expect(offlineAudioContext.length).to.equal(length);
            });

        });

    });

    describe('oncomplete', () => {

        // @todo

    });

    describe('onstatechange', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be null', () => {
            expect(offlineAudioContext.onstatechange).to.be.null;
        });

        it('should be assignable to a function', () => {
            const fn = () => {};
            const onstatechange = offlineAudioContext.onstatechange = fn; // eslint-disable-line no-multi-assign

            expect(onstatechange).to.equal(fn);
            expect(offlineAudioContext.onstatechange).to.equal(fn);
        });

        it('should be assignable to null', () => {
            const onstatechange = offlineAudioContext.onstatechange = null; // eslint-disable-line no-multi-assign

            expect(onstatechange).to.be.null;
            expect(offlineAudioContext.onstatechange).to.be.null;
        });

        it('should not be assignable to something else', () => {
            const string = 'no function or null value';

            offlineAudioContext.onstatechange = () => {};

            const onstatechange = offlineAudioContext.onstatechange = string; // eslint-disable-line no-multi-assign

            expect(onstatechange).to.equal(string);
            expect(offlineAudioContext.onstatechange).to.be.null;
        });

        it('should fire an Event of type statechange when starting to render', (done) => {
            offlineAudioContext.onstatechange = (event) => {
                offlineAudioContext.onstatechange = null;

                expect(event.type).to.equal('statechange');

                done();
            };

            offlineAudioContext.startRendering();
        });

        it('should fire an Event of type statechange when done with rendering', (done) => {
            offlineAudioContext
                .startRendering()
                .then(() => {
                    offlineAudioContext.onstatechange = (event) => {
                        offlineAudioContext.onstatechange = null;

                        expect(event.type).to.equal('statechange');

                        done();
                    };
                });
        });

    });

    describe('sampleRate', () => {

        let sampleRate;

        beforeEach(() => {
            sampleRate = 44100;
        });

        it('should be readonly', () => {
            const offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate });

            expect(() => {
                offlineAudioContext.sampleRate = 22050;
            }).to.throw(TypeError);
        });

        describe('with options as arguments', () => {

            let offlineAudioContext;

            beforeEach(() => {
                offlineAudioContext = new OfflineAudioContext(1, 1, sampleRate);
            });

            it('should expose its sampleRate', () => {
                expect(offlineAudioContext.sampleRate).to.equal(sampleRate);
            });
        });

        describe('with a contextOptions', () => {

            let offlineAudioContext;

            beforeEach(() => {
                offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate });
            });

            it('should expose its sampleRate', () => {
                expect(offlineAudioContext.sampleRate).to.equal(sampleRate);
            });

        });

    });

    describe('state', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be suspended at the beginning', () => {
            expect(offlineAudioContext.state).to.equal('suspended');
        });

        it('should be readonly', () => {
            expect(() => {
                offlineAudioContext.state = 'closed';
            }).to.throw(TypeError);
        });

        it('should be running when starting to render', () => {
            offlineAudioContext.startRendering();

            expect(offlineAudioContext.state).to.equal('running');
        });

        it('should be closed after the buffer was rendered', () => {
            return offlineAudioContext
                .startRendering()
                .then(() => {
                    expect(offlineAudioContext.state).to.equal('closed');
                });
        });

    });

    describe('createAnalyser()', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be a function', () => {
            expect(offlineAudioContext.createAnalyser).to.be.a('function');
        });

    });

    describe('createBiquadFilter()', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be a function', () => {
            expect(offlineAudioContext.createBiquadFilter).to.be.a('function');
        });

    });

    describe('createBuffer()', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should return an instance of the AudioBuffer interface', () => {
            const audioBuffer = offlineAudioContext.createBuffer(2, 10, 44100);

            expect(audioBuffer.duration).to.be.closeTo(10 / 44100, 0.001);
            expect(audioBuffer.length).to.equal(10);
            expect(audioBuffer.numberOfChannels).to.equal(2);
            expect(audioBuffer.sampleRate).to.equal(44100);
            expect(audioBuffer.getChannelData).to.be.a('function');
            expect(audioBuffer.copyFromChannel).to.be.a('function');
            expect(audioBuffer.copyToChannel).to.be.a('function');
        });

        it('should return an AudioBuffer which can be used with a native AudioContext', () => {
            const audioBuffer = offlineAudioContext.createBuffer(2, 10, 44100);
            const window = createWindow();
            const nativeOfflineAudioContextConstructor = createNativeOfflineAudioContextConstructor(window);
            const nativeOfflineAudioContext = new nativeOfflineAudioContextConstructor(1, 1, 44100); // eslint-disable-line new-cap
            const nativeAudioBufferSourceNode = nativeOfflineAudioContext.createBufferSource();

            nativeAudioBufferSourceNode.buffer = audioBuffer;
        });

        describe('copyFromChannel()', () => {

            let audioBuffer;
            let destination;

            beforeEach(() => {
                audioBuffer = offlineAudioContext.createBuffer(2, 10, 44100);
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
                audioBuffer = offlineAudioContext.createBuffer(2, 10, 44100);
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
                audioBuffer = offlineAudioContext.createBuffer(2, 100, 44100);
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

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be a function', () => {
            expect(offlineAudioContext.createBufferSource).to.be.a('function');
        });

    });

    describe('createChannelMerger()', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be a function', () => {
            expect(offlineAudioContext.createChannelMerger).to.be.a('function');
        });

    });

    describe('createChannelSplitter()', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be a function', () => {
            expect(offlineAudioContext.createChannelSplitter).to.be.a('function');
        });

    });

    describe('createConstantSource()', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be a function', () => {
            expect(offlineAudioContext.createConstantSource).to.be.a('function');
        });

    });

    describe('createGain()', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be a function', () => {
            expect(offlineAudioContext.createGain).to.be.a('function');
        });

    });

    describe('createIIRFilter()', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be a function', () => {
            expect(offlineAudioContext.createIIRFilter).to.be.a('function');
        });

    });

    describe('createOscillator()', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be a function', () => {
            expect(offlineAudioContext.createOscillator).to.be.a('function');
        });

    });

    describe('decodeAudioData()', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should return a promise', () => {
            const promise = offlineAudioContext.decodeAudioData();

            promise.catch(() => { /* Ignore the error. */ });

            expect(promise).to.be.an.instanceOf(Promise);
        });

        describe('without a valid arrayBuffer', () => {

            it('should throw an error', (done) => {
                offlineAudioContext
                    .decodeAudioData(null)
                    .catch((err) => {
                        expect(err).to.be.an.instanceOf(TypeError);

                        done();
                    });
            });

            it('should call the errorCallback with a TypeError', (done) => {
                offlineAudioContext
                    .decodeAudioData(null, () => {}, (err) => {
                        expect(err).to.be.an.instanceOf(TypeError);

                        done();
                    })
                    .catch(() => { /* Ignore the error. */ });
            });

            // The promise is rejected before but the errorCallback gets called synchronously.
            it('should call the errorCallback before the promise gets rejected', (done) => {
                const errorCallback = spy();

                offlineAudioContext
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

            it('should throw an error', (done) => {
                offlineAudioContext
                    .decodeAudioData(arrayBuffer)
                    .catch((err) => {
                        expect(err.code).to.equal(0);
                        expect(err.name).to.equal('EncodingError');

                        done();
                    });
            });

            it('should call the errorCallback with an error', (done) => {
                offlineAudioContext
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

                offlineAudioContext
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

            it('should resolve to an instance of the AudioBuffer interface', () => {
                return offlineAudioContext
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
                offlineAudioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
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

                return offlineAudioContext
                    .decodeAudioData(arrayBuffer, successCallback)
                    .then(() => {
                        expect(successCallback).to.have.been.calledOnce;
                    });
            });

            it('should throw a DataCloneError', (done) => {
                offlineAudioContext
                    .decodeAudioData(arrayBuffer)
                    .then(() => offlineAudioContext.decodeAudioData(arrayBuffer))
                    .catch((err) => {
                        expect(err.code).to.equal(25);
                        expect(err.name).to.equal('DataCloneError');

                        done();
                    });
            });

            it('should neuter the arrayBuffer', (done) => {
                offlineAudioContext.decodeAudioData(arrayBuffer);

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
                return offlineAudioContext
                    .decodeAudioData(arrayBuffer)
                    .then((audioBuffer) => {
                        const audioBufferSourceNode = offlineAudioContext.createBufferSource();

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
                    .all(arrayBufferCopies.map((rrBffr) => offlineAudioContext.decodeAudioData(rrBffr)));
            });

        });

    });

    describe('startRendering()', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 10, sampleRate: 44100 });
        });

        it('should return a promise', () => {
            expect(offlineAudioContext.startRendering()).to.be.an.instanceOf(Promise);
        });

        it('should resolve with the renderedBuffer', () => {
            const audioBuffer = offlineAudioContext.createBuffer(1, 10, 44100);
            const buffer = new Float32Array(10);
            const bufferSourceNode = offlineAudioContext.createBufferSource(offlineAudioContext);

            for (let i = 0; i < buffer.length; i += 1) {
                buffer[i] = i;
            }

            audioBuffer.copyToChannel(buffer, 0, 0);

            bufferSourceNode.buffer = audioBuffer;

            bufferSourceNode.connect(offlineAudioContext.destination);

            bufferSourceNode.start(0);

            return offlineAudioContext
                .startRendering()
                .then((renderedBuffer) => {
                    expect(renderedBuffer.length).to.equal(audioBuffer.length);

                    // @todo Use copyFromChannel() when possible.
                    const channelData = renderedBuffer.getChannelData(0);

                    for (let i = 0; i < audioBuffer.length; i += 1) {
                        expect(channelData[i]).to.equal(i);
                    }
                });
        });

        it('should resolve to an instance of the AudioBuffer interface', () => {
            const audioBuffer = offlineAudioContext.createBuffer(1, 10, 44100);
            const buffer = new Float32Array(10);
            const bufferSourceNode = offlineAudioContext.createBufferSource(offlineAudioContext);

            for (let i = 0; i < buffer.length; i += 1) {
                buffer[i] = i;
            }

            audioBuffer.copyToChannel(buffer, 0, 0);

            bufferSourceNode.buffer = audioBuffer;

            bufferSourceNode.connect(offlineAudioContext.destination);

            bufferSourceNode.start(0);

            return offlineAudioContext
                .startRendering()
                .then((renderedBuffer) => {
                    expect(renderedBuffer.duration).to.be.closeTo(10 / 44100, 0.001);
                    expect(renderedBuffer.length).to.equal(10);
                    expect(renderedBuffer.numberOfChannels).to.equal(1);
                    expect(renderedBuffer.sampleRate).to.equal(44100);

                    expect(renderedBuffer.getChannelData).to.be.a('function');
                    expect(renderedBuffer.copyFromChannel).to.be.a('function');
                    expect(renderedBuffer.copyToChannel).to.be.a('function');
                });
        });

        it('should throw an InvalidStateError if it was invoked before', (done) => {
            offlineAudioContext.startRendering();

            offlineAudioContext
                .startRendering()
                .catch((err) => {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    done();
                });
        });

    });

    /*
     * describe('suspend()', () => {
     *
     *     it('should suspend the render process at the render quantum', (done) => {
     *         offlineAudioContext
     *             .suspend(Math.floor(Math.random() * 128) / offlineAudioContext.sampleRate)
     *             .then(() => {
     *                 expect(offlineAudioContext.currentTime).to.equal(0);
     *
     *                 offlineAudioContext.resume();
     *
     *                 done();
     *             });
     *
     *         offlineAudioContext.startRendering();
     *     });
     *
     *     it('should not allow to suspend the render process more than once at the render quantum', (done) => {
     *         offlineAudioContext
     *             .suspend(Math.floor(Math.random() * 128) / offlineAudioContext.sampleRate)
     *             .then(() => offlineAudioContext.resume());
     *
     *         offlineAudioContext
     *             .suspend(Math.floor(Math.random() * 128) / offlineAudioContext.sampleRate)
     *             .catch((err) => {
     *                 expect(err.code).to.equal(11);
     *                 expect(err.name).to.equal('InvalidStateError');
     *
     *                 done();
     *             });
     *
     *         offlineAudioContext.startRendering();
     *     });
     *
     * });
     */

});
