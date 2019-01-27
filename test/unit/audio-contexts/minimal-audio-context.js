import '../../helper/play-silence';
import { GainNode, MinimalAudioContext } from '../../../src/module';
import { isSafari } from '../../helper/is-safari';

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
            }).to.throw(TypeError, "The provided value 'negative' is not a valid enum value of type AudioContextLatencyCategory.");

            // Create a new AudioContext to ensure the afterEach hooks keeps working.
            minimalAudioContext = new MinimalAudioContext();
        });

        if (isSafari(navigator)) {

            describe('with four running MinimalAudioContexts', () => {

                let gainNodes;
                let minimalAudioContexts;

                afterEach(() => {
                    [ minimalAudioContext, ...minimalAudioContexts ]
                        .forEach((mnmlDCntxt, index) => gainNodes[index].disconnect(mnmlDCntxt.destination));

                    return Promise.all(minimalAudioContexts.map((mnmlDCntxt) => mnmlDCntxt.close()));
                });

                beforeEach(() => {
                    minimalAudioContext = new MinimalAudioContext();
                    minimalAudioContexts = [ new MinimalAudioContext(), new MinimalAudioContext(), new MinimalAudioContext() ];

                    gainNodes = [ minimalAudioContext, ...minimalAudioContexts ]
                        .map((mnmlDCntxt) => {
                            const gainNode = new GainNode(mnmlDCntxt);

                            gainNode.connect(mnmlDCntxt.destination);

                            return gainNode;
                        });
                });

                it('should throw an error', () => {
                    expect(() => {
                        new MinimalAudioContext({ latencyHint: 'balanced' });
                    }).to.throw(DOMException).with.property('name', 'UnknownError');
                });

            });

        }

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

            it('should be an instance of the AudioDestinationNode interface', () => {
                const destination = minimalAudioContext.destination;

                expect(destination.channelCount).to.equal(2);
                expect(destination.channelCountMode).to.equal('explicit');
                expect(destination.channelInterpretation).to.equal('speakers');
                expect(destination.maxChannelCount).to.be.a('number');
                expect(destination.numberOfInputs).to.equal(1);
                expect(destination.numberOfOutputs).to.equal(0);
            });

            it('should be readonly', () => {
                expect(() => {
                    minimalAudioContext.destination = 'a fake AudioDestinationNode';
                }).to.throw(TypeError);
            });

            it('should have maxChannelCount which is at least the channelCount', () => {
                const destination = minimalAudioContext.destination;

                expect(destination.maxChannelCount).to.be.at.least(destination.channelCount);
            });

            it('should not allow to change the value of the channelCount property to a value above the maxChannelCount', (done) => {
                const destination = minimalAudioContext.destination;

                try {
                    destination.channelCount = destination.maxChannelCount + 1;
                } catch (err) {
                    expect(err.code).to.equal(1);
                    expect(err.name).to.equal('IndexSizeError');

                    done();
                }
            });

        });

        describe('listener', () => {

            it('should be an instance of the AudioListener interface', () => {
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
                const fn = () => {};
                const onstatechange = minimalAudioContext.onstatechange = fn; // eslint-disable-line no-multi-assign

                expect(onstatechange).to.equal(fn);
                expect(minimalAudioContext.onstatechange).to.equal(fn);
            });

            it('should be assignable to null', () => {
                const onstatechange = minimalAudioContext.onstatechange = null; // eslint-disable-line no-multi-assign

                expect(onstatechange).to.be.null;
                expect(minimalAudioContext.onstatechange).to.be.null;
            });

            it('should not be assignable to something else', () => {
                const string = 'no function or null value';

                minimalAudioContext.onstatechange = () => {};

                const onstatechange = minimalAudioContext.onstatechange = string; // eslint-disable-line no-multi-assign

                expect(onstatechange).to.equal(string);
                expect(minimalAudioContext.onstatechange).to.be.null;
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
                function stateChangeListener (event) {
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
                minimalAudioContext
                    .close()
                    .then(() => {
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
                    minimalAudioContext
                        .close()
                        .catch((err) => {
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
                minimalAudioContext
                    .resume()
                    .then(() => {
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
                    minimalAudioContext
                        .resume()
                        .catch((err) => {
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
                minimalAudioContext
                    .suspend()
                    .then(() => {
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
                    minimalAudioContext
                        .suspend()
                        .catch((err) => {
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
