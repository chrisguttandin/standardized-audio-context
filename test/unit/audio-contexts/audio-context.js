import { AudioContext } from '../../../src/module';
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
            }).to.throw(TypeError);

            // Create a new AudioContext to ensure the afterEach hooks keeps working.
            audioContext = new AudioContext();
        });

        it('should allow to set the sampleRate to 8 kHz', () => {
            const sampleRate = 8000;

            audioContext = new AudioContext({ sampleRate });

            expect(audioContext.sampleRate).to.equal(sampleRate);
        });

        it('should allow to set the sampleRate to 96 kHz', () => {
            const sampleRate = 96000;

            audioContext = new AudioContext({ sampleRate });

            expect(audioContext.sampleRate).to.equal(sampleRate);
        });

        it('should not allow to set the sampleRate to zero', (done) => {
            try {
                audioContext = new AudioContext({ sampleRate: 0 });
            } catch (err) {
                expect(err.code).to.equal(9);
                expect(err.name).to.equal('NotSupportedError');

                // Create a new AudioContext to ensure the afterEach hooks keeps working.
                audioContext = new AudioContext();

                done();
            }
        });
    });

    describe('with a constructed AudioContext', () => {
        beforeEach(() => {
            audioContext = new AudioContext();
        });

        describe('audioWorklet', () => {
            it('should be an implementation of the AudioWorklet interface', () => {
                const audioWorklet = audioContext.audioWorklet;

                expect(audioWorklet.addModule).to.be.a('function');
            });
        });

        describe('baseLatency', () => {
            it('should be a number', () => {
                expect(audioContext.baseLatency).to.be.a('number');
            });

            it('should be readonly', () => {
                expect(() => {
                    audioContext.baseLatency = 0;
                }).to.throw(TypeError);
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

            it('should advance over time', function (done) {
                this.timeout(10000);

                const now = audioContext.currentTime;

                audioContext.onstatechange = () => {
                    audioContext.onstatechange = null;

                    setTimeout(() => {
                        expect(audioContext.currentTime).to.above(now);

                        done();
                    }, 5000);
                };

                // Kick off the audioContext.
                audioContext.createGain();
            });
        });

        describe('destination', () => {
            it('should be an implementation of the AudioDestinationNode interface', () => {
                const destination = audioContext.destination;

                expect(destination.channelCount).to.equal(2);
                expect(destination.channelCountMode).to.equal('explicit');
                expect(destination.channelInterpretation).to.equal('speakers');
                expect(destination.maxChannelCount).to.be.a('number');
                expect(destination.numberOfInputs).to.equal(1);
                expect(destination.numberOfOutputs).to.equal(1);
            });

            it('should be readonly', () => {
                expect(() => {
                    audioContext.destination = 'a fake AudioDestinationNode';
                }).to.throw(TypeError);
            });
        });

        describe('listener', () => {
            it('should be an implementation of the AudioListener interface', () => {
                const listener = audioContext.listener;

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

        describe('onstatechange', () => {
            it('should be null', () => {
                expect(audioContext.onstatechange).to.be.null;
            });

            it('should be assignable to a function', () => {
                const fn = () => {}; // eslint-disable-line unicorn/consistent-function-scoping
                const onstatechange = (audioContext.onstatechange = fn); // eslint-disable-line no-multi-assign

                expect(onstatechange).to.equal(fn);
                expect(audioContext.onstatechange).to.equal(fn);
            });

            it('should be assignable to null', () => {
                const onstatechange = (audioContext.onstatechange = null); // eslint-disable-line no-multi-assign

                expect(onstatechange).to.be.null;
                expect(audioContext.onstatechange).to.be.null;
            });

            it('should not be assignable to something else', () => {
                const string = 'no function or null value';

                audioContext.onstatechange = () => {};

                const onstatechange = (audioContext.onstatechange = string); // eslint-disable-line no-multi-assign

                expect(onstatechange).to.equal(string);
                expect(audioContext.onstatechange).to.be.null;
            });

            it('should register an independent event listener', () => {
                const onstatechange = spy();

                audioContext.onstatechange = onstatechange;
                audioContext.addEventListener('statechange', onstatechange);

                audioContext.dispatchEvent(new Event('statechange'));

                expect(onstatechange).to.have.been.calledTwice;
            });

            it('should fire an assigned statechange event listener', (done) => {
                audioContext.onstatechange = function (event) {
                    audioContext.onstatechange = null;

                    expect(event).to.be.an.instanceOf(Event);
                    expect(event.currentTarget).to.equal(audioContext);
                    expect(event.target).to.equal(audioContext);
                    expect(event.type).to.equal('statechange');

                    expect(this).to.equal(audioContext);

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

        describe('addEventListener()', () => {
            it('should fire a registered statechange event listener', (done) => {
                function stateChangeListener(event) {
                    audioContext.removeEventListener('statechange', stateChangeListener);

                    expect(event).to.be.an.instanceOf(Event);
                    expect(event.currentTarget).to.equal(audioContext);
                    expect(event.target).to.equal(audioContext);
                    expect(event.type).to.equal('statechange');

                    expect(this).to.equal(audioContext);

                    done();
                }

                audioContext.addEventListener('statechange', stateChangeListener);

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
                    audioContext.close().catch((err) => {
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
            it('should be a function', () => {
                expect(audioContext.createBuffer).to.be.a('function');
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

        describe('createConvolver()', () => {
            it('should be a function', () => {
                expect(audioContext.createConvolver).to.be.a('function');
            });
        });

        describe('createDelay()', () => {
            it('should be a function', () => {
                expect(audioContext.createDelay).to.be.a('function');
            });
        });

        describe('createDynamicsCompressor()', () => {
            it('should be a function', () => {
                expect(audioContext.createDynamicsCompressor).to.be.a('function');
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

        describe('createMediaStreamDestination()', () => {
            it('should be a function', () => {
                expect(audioContext.createMediaStreamDestination).to.be.a('function');
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

        describe('createPanner()', () => {
            it('should be a function', () => {
                expect(audioContext.createPanner).to.be.a('function');
            });
        });

        describe('createPeriodicWave()', () => {
            it('should be a function', () => {
                expect(audioContext.createPeriodicWave).to.be.a('function');
            });
        });

        describe('createStereoPanner()', () => {
            it('should be a function', () => {
                expect(audioContext.createStereoPanner).to.be.a('function');
            });
        });

        describe('createWaveShaper()', () => {
            it('should be a function', () => {
                expect(audioContext.createWaveShaper).to.be.a('function');
            });
        });

        describe('decodeAudioData()', () => {
            it('should be a function', () => {
                expect(audioContext.decodeAudioData).to.be.a('function');
            });
        });

        describe('getOutputTimestamp()', () => {
            it('should return an AudioTimestamp', () => {
                const audioTimestamp = audioContext.getOutputTimestamp();

                expect(audioTimestamp.contextTime).to.be.a('number');
                expect(audioTimestamp.performanceTime).to.be.a('number');
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
                    audioContext.resume().catch((err) => {
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
                    audioContext.suspend().catch((err) => {
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
