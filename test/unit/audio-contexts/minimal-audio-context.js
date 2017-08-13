import { GainNode } from '../../../src/audio-nodes/gain-node';
import { MinimalAudioContext } from '../../../src/audio-contexts/minimal-audio-context';

describe('MinimalAudioContext', () => {

    let minimalAudioContext;

    afterEach(() => {
        return minimalAudioContext.close();
    });

    beforeEach(() => {
        minimalAudioContext = new MinimalAudioContext();
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

        it('should advance over time', (done) => {
            const now = minimalAudioContext.currentTime;

            minimalAudioContext.onstatechange = () => {
                // Prevent consecutive calls.
                minimalAudioContext.onstatechange = null;

                setTimeout(() => {
                    expect(minimalAudioContext.currentTime).to.above(now);

                    done();
                }, 1000);
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
                expect(minimalAudioContext.state).to.equal('running');

                // Prevent consecutive calls.
                minimalAudioContext.onstatechange = null;

                done();
            };

            // Kick off the minimalAudioContext.
            new GainNode(minimalAudioContext);
        });

        // closed is tested below

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
                })
                .catch(done);
        });

        it('should throw an error on consecutive calls to closed', (done) => {
            minimalAudioContext
                .close()
                .then(() => {
                    return minimalAudioContext.close();
                })
                .catch((err) => {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    done();
                });
        });

    });

});
