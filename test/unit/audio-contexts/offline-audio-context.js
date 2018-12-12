import '../../helper/play-silence';
import { OfflineAudioContext } from '../../../src/module';
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

        it('should be a function', () => {
            expect(offlineAudioContext.createBuffer).to.be.a('function');
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

    describe('createDelay()', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be a function', () => {
            expect(offlineAudioContext.createDelay).to.be.a('function');
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

    describe('createStereoPanner()', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be a function', () => {
            expect(offlineAudioContext.createStereoPanner).to.be.a('function');
        });

    });

    describe('createWaveShaper()', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be a function', () => {
            expect(offlineAudioContext.createWaveShaper).to.be.a('function');
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

            it('should throw an error', function (done) {
                this.timeout(10000);

                offlineAudioContext
                    .decodeAudioData(null)
                    .catch((err) => {
                        expect(err).to.be.an.instanceOf(TypeError);

                        done();
                    });
            });

            it('should call the errorCallback with a TypeError', function (done) {
                this.timeout(10000);

                offlineAudioContext
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

            it('should throw an error', function (done) {
                this.timeout(10000);

                offlineAudioContext
                    .decodeAudioData(arrayBuffer)
                    .catch((err) => {
                        expect(err.code).to.equal(0);
                        expect(err.name).to.equal('EncodingError');

                        done();
                    });
            });

            it('should call the errorCallback with an error', function (done) {
                this.timeout(10000);

                offlineAudioContext
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

            it('should resolve to the promise', function () {
                this.timeout(10000);

                return offlineAudioContext
                    .decodeAudioData(arrayBuffer);
            });

            it('should call the successCallback', function (done) {
                this.timeout(10000);

                offlineAudioContext.decodeAudioData(arrayBuffer, () => {
                    done();
                });
            });

            // The promise is resolved before but the successCallback gets called synchronously.
            it('should call the successCallback before the promise gets resolved', function () {
                this.timeout(10000);

                const successCallback = spy();

                return offlineAudioContext
                    .decodeAudioData(arrayBuffer, successCallback)
                    .then(() => {
                        expect(successCallback).to.have.been.calledOnce;
                    });
            });

            it('should throw a DataCloneError', function (done) {
                this.timeout(10000);

                offlineAudioContext
                    .decodeAudioData(arrayBuffer)
                    .then(() => offlineAudioContext.decodeAudioData(arrayBuffer))
                    .catch((err) => {
                        expect(err.code).to.equal(25);
                        expect(err.name).to.equal('DataCloneError');

                        done();
                    });
            });

            it('should neuter the arrayBuffer', function (done) {
                this.timeout(10000);

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
            const audioBufferSourceNode = offlineAudioContext.createBufferSource(offlineAudioContext);
            const buffer = new Float32Array(10);

            for (let i = 0; i < buffer.length; i += 1) {
                buffer[i] = i;
            }

            audioBuffer.copyToChannel(buffer, 0, 0);

            audioBufferSourceNode.buffer = audioBuffer;

            audioBufferSourceNode.connect(offlineAudioContext.destination);

            audioBufferSourceNode.start(0);

            return offlineAudioContext
                .startRendering()
                .then((renderedBuffer) => {
                    expect(renderedBuffer.length).to.equal(audioBuffer.length);

                    // Bug #5: Safari does not support copyFromChannel().
                    const channelData = renderedBuffer.getChannelData(0);

                    for (let i = 0; i < audioBuffer.length; i += 1) {
                        expect(channelData[i]).to.equal(i);
                    }
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
