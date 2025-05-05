import { GainNode, MinimalAudioContext } from '../../../src/module';
import { spy } from 'sinon';

if (typeof window !== 'undefined') {
    describe('MinimalAudioContext', () => {
        let minimalAudioContext;

        afterEach(() => {
            return minimalAudioContext.close();
        });

        describe('without a constructed MinimalAudioContext', () => {
            it('should allow to set the latencyHint to balanced', () => {
                minimalAudioContext = new MinimalAudioContext({ latencyHint: 'balanced' });
            });

            it('should allow to set the latencyHint to interactive', () => {
                minimalAudioContext = new MinimalAudioContext({ latencyHint: 'interactive' });
            });

            it('should allow to set the latencyHint to playback', () => {
                minimalAudioContext = new MinimalAudioContext({ latencyHint: 'playback' });
            });

            it('should allow to set the latencyHint to a number', () => {
                minimalAudioContext = new MinimalAudioContext({ latencyHint: 0.5 });
            });

            it('should not allow to set the latencyHint to an unsupported value', () => {
                expect(() => {
                    minimalAudioContext = new MinimalAudioContext({ latencyHint: 'negative' });
                }).to.throw(TypeError);

                // Create a new AudioContext to ensure the afterEach hooks keeps working.
                minimalAudioContext = new MinimalAudioContext();
            });

            it('should allow to set the sampleRate to 8 kHz', () => {
                const sampleRate = 8000;

                minimalAudioContext = new MinimalAudioContext({ sampleRate });

                expect(minimalAudioContext.sampleRate).to.equal(sampleRate);
            });

            it('should allow to set the sampleRate to 96 kHz', () => {
                const sampleRate = 96000;

                minimalAudioContext = new MinimalAudioContext({ sampleRate });

                expect(minimalAudioContext.sampleRate).to.equal(sampleRate);
            });

            it('should not allow to set the sampleRate to zero', (done) => {
                try {
                    minimalAudioContext = new MinimalAudioContext({ sampleRate: 0 });
                } catch (err) {
                    expect(err.code).to.equal(9);
                    expect(err.name).to.equal('NotSupportedError');

                    // Create a new AudioContext to ensure the afterEach hooks keeps working.
                    minimalAudioContext = new MinimalAudioContext();

                    done();
                }
            });
        });

        describe('with a constructed MinimalAudioContext', () => {
            beforeEach(() => {
                minimalAudioContext = new MinimalAudioContext();
            });

            describe('baseLatency', () => {
                it('should be a number', () => {
                    expect(minimalAudioContext.baseLatency).to.be.a('number');
                });

                it('should be readonly', () => {
                    expect(() => {
                        minimalAudioContext.baseLatency = 0;
                    }).to.throw(TypeError);
                });
            });

            describe('currentTime', () => {
                it('should be a number', () => {
                    expect(minimalAudioContext.currentTime).to.be.a('number');
                });

                it('should be readonly', () => {
                    expect(() => {
                        minimalAudioContext.currentTime = 0;
                    }).to.throw(TypeError);
                });

                it('should advance over time', function (done) {
                    this.timeout(10000);

                    const now = minimalAudioContext.currentTime;

                    minimalAudioContext.onstatechange = () => {
                        minimalAudioContext.onstatechange = null;

                        setTimeout(() => {
                            expect(minimalAudioContext.currentTime).to.above(now);

                            done();
                        }, 5000);
                    };

                    // Kick off the minimalAudioContext.
                    new GainNode(minimalAudioContext);
                });
            });

            describe('destination', () => {
                it('should be an implementation of the AudioDestinationNode interface', () => {
                    const destination = minimalAudioContext.destination;

                    expect(destination.channelCount).to.equal(2);
                    expect(destination.channelCountMode).to.equal('explicit');
                    expect(destination.channelInterpretation).to.equal('speakers');
                    expect(destination.maxChannelCount).to.be.a('number');
                    expect(destination.numberOfInputs).to.equal(1);
                    expect(destination.numberOfOutputs).to.equal(1);
                });

                it('should be readonly', () => {
                    expect(() => {
                        minimalAudioContext.destination = 'a fake AudioDestinationNode';
                    }).to.throw(TypeError);
                });
            });

            describe('listener', () => {
                it('should be an implementation of the AudioListener interface', () => {
                    const listener = minimalAudioContext.listener;

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
                    expect(minimalAudioContext.onstatechange).to.be.null;
                });

                it('should be assignable to a function', () => {
                    const fn = () => {}; // eslint-disable-line unicorn/consistent-function-scoping
                    const onstatechange = (minimalAudioContext.onstatechange = fn); // eslint-disable-line no-multi-assign

                    expect(onstatechange).to.equal(fn);
                    expect(minimalAudioContext.onstatechange).to.equal(fn);
                });

                it('should be assignable to null', () => {
                    const onstatechange = (minimalAudioContext.onstatechange = null); // eslint-disable-line no-multi-assign

                    expect(onstatechange).to.be.null;
                    expect(minimalAudioContext.onstatechange).to.be.null;
                });

                it('should not be assignable to something else', () => {
                    const string = 'no function or null value';

                    minimalAudioContext.onstatechange = () => {};

                    const onstatechange = (minimalAudioContext.onstatechange = string); // eslint-disable-line no-multi-assign

                    expect(onstatechange).to.equal(string);
                    expect(minimalAudioContext.onstatechange).to.be.null;
                });

                it('should register an independent event listener', () => {
                    const onstatechange = spy();

                    minimalAudioContext.onstatechange = onstatechange;
                    minimalAudioContext.addEventListener('statechange', onstatechange);

                    minimalAudioContext.dispatchEvent(new Event('statechange'));

                    expect(onstatechange).to.have.been.calledTwice;
                });

                it('should fire an assigned statechange event listener', (done) => {
                    minimalAudioContext.onstatechange = function (event) {
                        minimalAudioContext.onstatechange = null;

                        expect(event).to.be.an.instanceOf(Event);
                        expect(event.currentTarget).to.equal(minimalAudioContext);
                        expect(event.target).to.equal(minimalAudioContext);
                        expect(event.type).to.equal('statechange');

                        expect(this).to.equal(minimalAudioContext);

                        done();
                    };

                    // Kick off the minimalAudioContext.
                    new GainNode(minimalAudioContext);
                });
            });

            describe('sampleRate', () => {
                it('should be a number', () => {
                    expect(minimalAudioContext.sampleRate).to.be.a('number');
                });

                it('should be readonly', () => {
                    expect(() => {
                        minimalAudioContext.sampleRate = 22050;
                    }).to.throw(TypeError);
                });
            });

            describe('state', () => {
                it('should be suspended at the beginning', () => {
                    expect(minimalAudioContext.state).to.equal('suspended');
                });

                it('should be readonly', () => {
                    expect(() => {
                        minimalAudioContext.state = 'closed';
                    }).to.throw(TypeError);
                });

                it('should be transitioned to running', (done) => {
                    minimalAudioContext.onstatechange = () => {
                        minimalAudioContext.onstatechange = null;

                        expect(minimalAudioContext.state).to.equal('running');

                        done();
                    };

                    // Kick off the minimalAudioContext.
                    new GainNode(minimalAudioContext);
                });
            });

            describe('addEventListener()', () => {
                it('should fire a registered statechange event listener', (done) => {
                    function stateChangeListener(event) {
                        minimalAudioContext.removeEventListener('statechange', stateChangeListener);

                        expect(event).to.be.an.instanceOf(Event);
                        expect(event.currentTarget).to.equal(minimalAudioContext);
                        expect(event.target).to.equal(minimalAudioContext);
                        expect(event.type).to.equal('statechange');

                        expect(this).to.equal(minimalAudioContext);

                        done();
                    }

                    minimalAudioContext.addEventListener('statechange', stateChangeListener);

                    // Kick off the minimalAudioContext.
                    new GainNode(minimalAudioContext);
                });
            });

            describe('close()', () => {
                afterEach(() => {
                    // Create a closeable AudioContext to align the behaviour with other tests.
                    minimalAudioContext = new MinimalAudioContext();
                });

                it('should return a promise', () => {
                    expect(minimalAudioContext.close()).to.be.an.instanceOf(Promise);
                });

                it('should set the state to closed', (done) => {
                    minimalAudioContext.close().then(() => {
                        // According to the spec the context state is changed to 'closed' after the promise gets resolved.
                        setTimeout(() => {
                            expect(minimalAudioContext.state).to.equal('closed');

                            done();
                        });
                    });
                });

                describe('with a closed MinimalAudioContext', () => {
                    beforeEach(() => minimalAudioContext.close());

                    it('should throw an error', (done) => {
                        minimalAudioContext.close().catch((err) => {
                            expect(err.code).to.equal(11);
                            expect(err.name).to.equal('InvalidStateError');

                            done();
                        });
                    });
                });
            });

            describe('resume()', () => {
                it('should return a promise', () => {
                    expect(minimalAudioContext.resume()).to.be.an.instanceOf(Promise);
                });

                it('should set the state to running', (done) => {
                    minimalAudioContext.resume().then(() => {
                        // According to the spec the context state is changed to 'running' after the promise gets resolved.
                        setTimeout(() => {
                            expect(minimalAudioContext.state).to.equal('running');

                            done();
                        });
                    });
                });

                describe('with a closed MinimalAudioContext', () => {
                    afterEach(() => {
                        // Create a closeable AudioContext to align the behaviour with other tests.
                        minimalAudioContext = new MinimalAudioContext();
                    });

                    beforeEach(() => minimalAudioContext.close());

                    it('should throw an error', (done) => {
                        minimalAudioContext.resume().catch((err) => {
                            expect(err.code).to.equal(11);
                            expect(err.name).to.equal('InvalidStateError');

                            done();
                        });
                    });
                });

                describe('with a running MinimalAudioContext', () => {
                    beforeEach(() => minimalAudioContext.resume());

                    it('should ignore consecutive calls', () => {
                        return minimalAudioContext.resume();
                    });
                });
            });

            describe('suspend()', () => {
                it('should return a promise', () => {
                    expect(minimalAudioContext.suspend()).to.be.an.instanceOf(Promise);
                });

                it('should set the state to suspended', (done) => {
                    minimalAudioContext.suspend().then(() => {
                        // According to the spec the context state is changed to 'suspended' after the promise gets resolved.
                        setTimeout(() => {
                            expect(minimalAudioContext.state).to.equal('suspended');

                            done();
                        });
                    });
                });

                describe('with a closed MinimalAudioContext', () => {
                    afterEach(() => {
                        // Create a closeable AudioContext to align the behaviour with other tests.
                        minimalAudioContext = new MinimalAudioContext();
                    });

                    beforeEach(() => minimalAudioContext.close());

                    it('should throw an error', (done) => {
                        minimalAudioContext.suspend().catch((err) => {
                            expect(err.code).to.equal(11);
                            expect(err.name).to.equal('InvalidStateError');

                            done();
                        });
                    });
                });

                describe('with a suspended MinimalAudioContext', () => {
                    beforeEach(() => minimalAudioContext.suspend());

                    it('should ignore consecutive calls', () => {
                        return minimalAudioContext.suspend();
                    });
                });
            });
        });
    });
}
