import { OfflineAudioContext } from '../../../src/module';
import { spy } from 'sinon';

if (typeof window !== 'undefined') {
    describe('OfflineAudioContext', () => {
        describe('constructor()', () => {
            describe('with mininal options', () => {
                let offlineAudioContext;

                beforeEach(() => {
                    offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
                });

                it('should return an implementation of the EventTarget interface', () => {
                    expect(offlineAudioContext.addEventListener).to.be.a('function');
                    expect(offlineAudioContext.dispatchEvent).to.be.a('function');
                    expect(offlineAudioContext.removeEventListener).to.be.a('function');
                });

                // @todo it('should return an implementation of the IMinimalBaseAudioContext interface');

                // @todo it('should return an implementation of the IOfflineAudioContext interface');
            });

            describe('with valid options', () => {
                describe('with valid options', () => {
                    it('should return a OfflineAudioContext with the given length', () => {
                        const length = 250;
                        const offlineAudioContext = new OfflineAudioContext({ length, sampleRate: 44100 });

                        expect(offlineAudioContext.length).to.equal(length);
                    });

                    it('should return a OfflineAudioContext with the given numberOfChannels as maxChannelCount of its destination', () => {
                        const numberOfChannels = 32;
                        const offlineAudioContext = new OfflineAudioContext({ length: 1000, numberOfChannels, sampleRate: 44100 });

                        expect(offlineAudioContext.destination.maxChannelCount).to.equal(numberOfChannels);
                    });

                    it('should return a OfflineAudioContext with the given sampleRate of 8 kHz', () => {
                        const sampleRate = 8000;
                        const offlineAudioContext = new OfflineAudioContext({ length: 1000, sampleRate });

                        expect(offlineAudioContext.sampleRate).to.equal(sampleRate);
                    });

                    it('should return a OfflineAudioContext with the given sampleRate of 96 kHz', () => {
                        const sampleRate = 96000;
                        const offlineAudioContext = new OfflineAudioContext({ length: 1000, sampleRate });

                        expect(offlineAudioContext.sampleRate).to.equal(sampleRate);
                    });
                });
            });

            describe('with invalid options', () => {
                describe('with zero as the numberOfChannels', () => {
                    it('should throw a NotSupportedError', (done) => {
                        try {
                            new OfflineAudioContext({ length: 1000, numberOfChannels: 0, sampleRate: 44100 });
                        } catch (err) {
                            expect(err.code).to.equal(9);
                            expect(err.name).to.equal('NotSupportedError');

                            done();
                        }
                    });
                });

                describe('with a length of zero', () => {
                    it('should throw a NotSupportedError', (done) => {
                        try {
                            new OfflineAudioContext({ length: 0, sampleRate: 44100 });
                        } catch (err) {
                            expect(err.code).to.equal(9);
                            expect(err.name).to.equal('NotSupportedError');

                            done();
                        }
                    });
                });

                describe('with a sampleRate of zero', () => {
                    it('should throw a NotSupportedError', (done) => {
                        try {
                            new OfflineAudioContext({ length: 1000, sampleRate: 0 });
                        } catch (err) {
                            expect(err.code).to.equal(9);
                            expect(err.name).to.equal('NotSupportedError');

                            done();
                        }
                    });
                });
            });
        });

        describe('audioWorklet', () => {
            let offlineAudioContext;

            beforeEach(() => {
                offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
            });

            it('should be an implementation of the AudioWorklet interface', () => {
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

            it('should be an implementation of the AudioDestinationNode interface', () => {
                const offlineAudioContext = new OfflineAudioContext({ length, sampleRate });
                const destination = offlineAudioContext.destination;

                expect(destination.channelCount).to.equal(1);
                expect(destination.channelCountMode).to.equal('explicit');
                expect(destination.channelInterpretation).to.equal('speakers');
                expect(destination.maxChannelCount).to.equal(1);
                expect(destination.numberOfInputs).to.equal(1);
                expect(destination.numberOfOutputs).to.equal(1);
            });

            it('should be readonly', () => {
                const offlineAudioContext = new OfflineAudioContext({ length, sampleRate });

                expect(() => {
                    offlineAudioContext.destination = 'a fake AudioDestinationNode';
                }).to.throw(TypeError);
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

        describe('listener', () => {
            let offlineAudioContext;

            beforeEach(() => {
                offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
            });

            it('should be an implementation of the AudioListener interface', () => {
                const listener = offlineAudioContext.listener;

                expect(listener.positionX).not.to.be.undefined;
                expect(listener.positionY).not.to.be.undefined;
                expect(listener.positionZ).not.to.be.undefined;
                expect(listener.forwardX).not.to.be.undefined;
                expect(listener.forwardY).not.to.be.undefined;
                expect(listener.forwardZ).not.to.be.undefined;
                expect(listener.upX).not.to.be.undefined;
                expect(listener.upY).not.to.be.undefined;
                expect(listener.upZ).not.to.be.undefined;
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
                const fn = () => {}; // eslint-disable-line unicorn/consistent-function-scoping
                const onstatechange = (offlineAudioContext.onstatechange = fn); // eslint-disable-line no-multi-assign

                expect(onstatechange).to.equal(fn);
                expect(offlineAudioContext.onstatechange).to.equal(fn);
            });

            it('should be assignable to null', () => {
                const onstatechange = (offlineAudioContext.onstatechange = null); // eslint-disable-line no-multi-assign

                expect(onstatechange).to.be.null;
                expect(offlineAudioContext.onstatechange).to.be.null;
            });

            it('should not be assignable to something else', () => {
                const string = 'no function or null value';

                offlineAudioContext.onstatechange = () => {};

                const onstatechange = (offlineAudioContext.onstatechange = string); // eslint-disable-line no-multi-assign

                expect(onstatechange).to.equal(string);
                expect(offlineAudioContext.onstatechange).to.be.null;
            });

            it('should register an independent event listener', () => {
                const onstatechange = spy();

                offlineAudioContext.onstatechange = onstatechange;
                offlineAudioContext.addEventListener('statechange', onstatechange);

                offlineAudioContext.dispatchEvent(new Event('statechange'));

                expect(onstatechange).to.have.been.calledTwice;
            });

            it('should fire an assigned statechange event listener when starting to render', (done) => {
                offlineAudioContext.onstatechange = function (event) {
                    offlineAudioContext.onstatechange = null;

                    expect(event).to.be.an.instanceOf(Event);
                    expect(event.currentTarget).to.equal(offlineAudioContext);
                    expect(event.target).to.equal(offlineAudioContext);
                    expect(event.type).to.equal('statechange');

                    expect(this).to.equal(offlineAudioContext);

                    done();
                };

                offlineAudioContext.startRendering();
            });

            it('should fire an assigned statechange event listener when done with rendering', (done) => {
                offlineAudioContext.startRendering().then(() => {
                    offlineAudioContext.onstatechange = function (event) {
                        offlineAudioContext.onstatechange = null;

                        expect(event).to.be.an.instanceOf(Event);
                        expect(event.currentTarget).to.equal(offlineAudioContext);
                        expect(event.target).to.equal(offlineAudioContext);
                        expect(event.type).to.equal('statechange');

                        expect(this).to.equal(offlineAudioContext);

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
                return offlineAudioContext.startRendering().then(() => {
                    expect(offlineAudioContext.state).to.equal('closed');
                });
            });
        });

        describe('addEventListener()', () => {
            let offlineAudioContext;

            beforeEach(() => {
                offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
            });

            it('should fire a registered statechange event listener when starting to render', (done) => {
                function stateChangeListener(event) {
                    offlineAudioContext.removeEventListener('statechange', stateChangeListener);

                    expect(event).to.be.an.instanceOf(Event);
                    expect(event.currentTarget).to.equal(offlineAudioContext);
                    expect(event.target).to.equal(offlineAudioContext);
                    expect(event.type).to.equal('statechange');

                    expect(this).to.equal(offlineAudioContext);

                    done();
                }

                offlineAudioContext.addEventListener('statechange', stateChangeListener);
                offlineAudioContext.startRendering();
            });

            it('should fire a registered statechange event listener when done with rendering', (done) => {
                offlineAudioContext.startRendering().then(() => {
                    function stateChangeListener(event) {
                        offlineAudioContext.removeEventListener('statechange', stateChangeListener);

                        expect(event).to.be.an.instanceOf(Event);
                        expect(event.currentTarget).to.equal(offlineAudioContext);
                        expect(event.target).to.equal(offlineAudioContext);
                        expect(event.type).to.equal('statechange');

                        expect(this).to.equal(offlineAudioContext);

                        done();
                    }

                    offlineAudioContext.addEventListener('statechange', stateChangeListener);
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

        describe('createConvolver()', () => {
            let offlineAudioContext;

            beforeEach(() => {
                offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
            });

            it('should be a function', () => {
                expect(offlineAudioContext.createConvolver).to.be.a('function');
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

        describe('createDynamicsCompressor()', () => {
            let offlineAudioContext;

            beforeEach(() => {
                offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
            });

            it('should be a function', () => {
                expect(offlineAudioContext.createDynamicsCompressor).to.be.a('function');
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

        describe('createPanner()', () => {
            let offlineAudioContext;

            beforeEach(() => {
                offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
            });

            it('should be a function', () => {
                expect(offlineAudioContext.createPanner).to.be.a('function');
            });
        });

        describe('createPeriodicWave()', () => {
            let offlineAudioContext;

            beforeEach(() => {
                offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
            });

            it('should be a function', () => {
                expect(offlineAudioContext.createPeriodicWave).to.be.a('function');
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

            it('should be a function', () => {
                expect(offlineAudioContext.decodeAudioData).to.be.a('function');
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

                return offlineAudioContext.startRendering().then((renderedBuffer) => {
                    expect(renderedBuffer.length).to.equal(audioBuffer.length);

                    const channelData = renderedBuffer.getChannelData(0);

                    for (let i = 0; i < audioBuffer.length; i += 1) {
                        expect(channelData[i]).to.equal(i);
                    }
                });
            });

            it('should throw an InvalidStateError if it was invoked before', (done) => {
                offlineAudioContext.startRendering();

                offlineAudioContext.startRendering().catch((err) => {
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
}
