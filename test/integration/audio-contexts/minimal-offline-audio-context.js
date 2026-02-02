import { AudioBuffer, AudioBufferSourceNode, MinimalOfflineAudioContext } from '../../../src/module';
import { beforeEach, describe, expect, it } from 'vitest';
import { spy } from 'sinon';

describe('MinimalOfflineAudioContext', { skip: typeof window === 'undefined' }, () => {
    describe('constructor()', () => {
        describe('with mininal options', () => {
            let minimalOfflineAudioContext;

            beforeEach(() => {
                minimalOfflineAudioContext = new MinimalOfflineAudioContext({ length: 1, sampleRate: 44100 });
            });

            it('should return an implementation of the EventTarget interface', () => {
                expect(minimalOfflineAudioContext.addEventListener).to.be.a('function');
                expect(minimalOfflineAudioContext.dispatchEvent).to.be.a('function');
                expect(minimalOfflineAudioContext.removeEventListener).to.be.a('function');
            });

            // @todo it('should return an implementation of the IMinimalBaseAudioContext interface');

            // @todo it('should return an implementation of the IMinimalOfflineAudioContext interface');
        });

        describe('with valid options', () => {
            describe('with valid options', () => {
                it('should return a MinimalOfflineAudioContext with the given length', () => {
                    const length = 250;
                    const minimalOfflineAudioContext = new MinimalOfflineAudioContext({ length, sampleRate: 44100 });

                    expect(minimalOfflineAudioContext.length).to.equal(length);
                });

                it('should return a MinimalOfflineAudioContext with the given numberOfChannels as maxChannelCount of its destination', () => {
                    const numberOfChannels = 32;
                    const minimalOfflineAudioContext = new MinimalOfflineAudioContext({
                        length: 1000,
                        numberOfChannels,
                        sampleRate: 44100
                    });

                    expect(minimalOfflineAudioContext.destination.maxChannelCount).to.equal(numberOfChannels);
                });

                it('should return a MinimalOfflineAudioContext with the given sampleRate of 8 kHz', () => {
                    const sampleRate = 8000;
                    const minimalOfflineAudioContext = new MinimalOfflineAudioContext({ length: 1000, sampleRate });

                    expect(minimalOfflineAudioContext.sampleRate).to.equal(sampleRate);
                });

                it('should return a MinimalOfflineAudioContext with the given sampleRate of 96 kHz', () => {
                    const sampleRate = 96000;
                    const minimalOfflineAudioContext = new MinimalOfflineAudioContext({ length: 1000, sampleRate });

                    expect(minimalOfflineAudioContext.sampleRate).to.equal(sampleRate);
                });
            });
        });

        describe('with invalid options', () => {
            describe('with zero as the numberOfChannels', () => {
                it('should throw a NotSupportedError', () => {
                    expect(() => {
                        new MinimalOfflineAudioContext({ length: 1000, numberOfChannels: 0, sampleRate: 44100 });
                    })
                        .to.throw(DOMException)
                        .to.include({ code: 9, name: 'NotSupportedError' });
                });
            });

            describe('with a length of zero', () => {
                it('should throw a NotSupportedError', () => {
                    expect(() => {
                        new MinimalOfflineAudioContext({ length: 0, sampleRate: 44100 });
                    })
                        .to.throw(DOMException)
                        .to.include({ code: 9, name: 'NotSupportedError' });
                });
            });

            describe('with a sampleRate of zero', () => {
                it('should throw a NotSupportedError', () => {
                    expect(() => {
                        new MinimalOfflineAudioContext({ length: 1000, sampleRate: 0 });
                    })
                        .to.throw(DOMException)
                        .to.include({ code: 9, name: 'NotSupportedError' });
                });
            });
        });
    });

    describe('currentTime', () => {
        let minimalOfflineAudioContext;

        beforeEach(() => {
            minimalOfflineAudioContext = new MinimalOfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be a number', () => {
            expect(minimalOfflineAudioContext.currentTime).to.be.a('number');
        });

        it('should be readonly', () => {
            expect(() => {
                minimalOfflineAudioContext.currentTime = 0;
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
            const minimalOfflineAudioContext = new MinimalOfflineAudioContext({ length, sampleRate });
            const destination = minimalOfflineAudioContext.destination;

            expect(destination.channelCount).to.equal(1);
            expect(destination.channelCountMode).to.equal('explicit');
            expect(destination.channelInterpretation).to.equal('speakers');
            expect(destination.maxChannelCount).to.equal(1);
            expect(destination.numberOfInputs).to.equal(1);
            expect(destination.numberOfOutputs).to.equal(1);
        });

        it('should be readonly', () => {
            const minimalOfflineAudioContext = new MinimalOfflineAudioContext({ length, sampleRate });

            expect(() => {
                minimalOfflineAudioContext.destination = 'a fake AudioDestinationNode';
            }).to.throw(TypeError);
        });

        describe('without a specified value for numberOfChannels', () => {
            let minimalOfflineAudioContext;

            beforeEach(() => {
                minimalOfflineAudioContext = new MinimalOfflineAudioContext({ length, sampleRate });
            });

            it('should have a channelCount of one', () => {
                expect(minimalOfflineAudioContext.destination.channelCount).to.equal(1);
            });

            it('should have a maxChannelCount of one', () => {
                expect(minimalOfflineAudioContext.destination.maxChannelCount).to.equal(1);
            });
        });

        describe('with a specified value for numberOfChannels', () => {
            let minimalOfflineAudioContext;
            let numberOfChannels;

            beforeEach(() => {
                numberOfChannels = 8;
                minimalOfflineAudioContext = new MinimalOfflineAudioContext({ length, numberOfChannels, sampleRate });
            });

            it('should have a channelCount which equals the numberOfChannels', () => {
                expect(minimalOfflineAudioContext.destination.channelCount).to.equal(numberOfChannels);
            });

            it('should have a maxChannelCount which equals the numberOfChannels', () => {
                expect(minimalOfflineAudioContext.destination.maxChannelCount).to.equal(numberOfChannels);
            });
        });
    });

    describe('length', () => {
        let length;
        let minimalOfflineAudioContext;

        beforeEach(() => {
            length = 129;
            minimalOfflineAudioContext = new MinimalOfflineAudioContext({ length, sampleRate: 44100 });
        });

        it('should expose its length', () => {
            expect(minimalOfflineAudioContext.length).to.equal(length);
        });

        it('should be readonly', () => {
            expect(() => {
                minimalOfflineAudioContext.length = 128;
            }).to.throw(TypeError);
        });
    });

    describe('listener', () => {
        let minimalOfflineAudioContext;

        beforeEach(() => {
            minimalOfflineAudioContext = new MinimalOfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be an implementation of the AudioListener interface', () => {
            const listener = minimalOfflineAudioContext.listener;

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
        let minimalOfflineAudioContext;

        beforeEach(() => {
            minimalOfflineAudioContext = new MinimalOfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be null', () => {
            expect(minimalOfflineAudioContext.onstatechange).to.be.null;
        });

        it('should be assignable to a function', () => {
            const fn = () => {}; // eslint-disable-line unicorn/consistent-function-scoping
            const onstatechange = (minimalOfflineAudioContext.onstatechange = fn); // eslint-disable-line no-multi-assign

            expect(onstatechange).to.equal(fn);
            expect(minimalOfflineAudioContext.onstatechange).to.equal(fn);
        });

        it('should be assignable to null', () => {
            const onstatechange = (minimalOfflineAudioContext.onstatechange = null); // eslint-disable-line no-multi-assign

            expect(onstatechange).to.be.null;
            expect(minimalOfflineAudioContext.onstatechange).to.be.null;
        });

        it('should not be assignable to something else', () => {
            const string = 'no function or null value';

            minimalOfflineAudioContext.onstatechange = () => {};

            const onstatechange = (minimalOfflineAudioContext.onstatechange = string); // eslint-disable-line no-multi-assign

            expect(onstatechange).to.equal(string);
            expect(minimalOfflineAudioContext.onstatechange).to.be.null;
        });

        it('should register an independent event listener', () => {
            const onstatechange = spy();

            minimalOfflineAudioContext.onstatechange = onstatechange;
            minimalOfflineAudioContext.addEventListener('statechange', onstatechange);

            minimalOfflineAudioContext.dispatchEvent(new Event('statechange'));

            expect(onstatechange).to.have.been.calledTwice;
        });

        it('should fire an assigned statechange event listener when starting to render', () => {
            const { promise, resolve } = Promise.withResolvers();

            minimalOfflineAudioContext.onstatechange = function (event) {
                minimalOfflineAudioContext.onstatechange = null;

                expect(event).to.be.an.instanceOf(Event);
                expect(event.currentTarget).to.equal(minimalOfflineAudioContext);
                expect(event.target).to.equal(minimalOfflineAudioContext);
                expect(event.type).to.equal('statechange');

                expect(this).to.equal(minimalOfflineAudioContext);

                resolve();
            };

            minimalOfflineAudioContext.startRendering();

            return promise;
        });

        it('should fire an assigned statechange event listener when done with rendering', () => {
            const { promise, resolve } = Promise.withResolvers();

            minimalOfflineAudioContext.startRendering().then(() => {
                minimalOfflineAudioContext.onstatechange = function (event) {
                    minimalOfflineAudioContext.onstatechange = null;

                    expect(event).to.be.an.instanceOf(Event);
                    expect(event.currentTarget).to.equal(minimalOfflineAudioContext);
                    expect(event.target).to.equal(minimalOfflineAudioContext);
                    expect(event.type).to.equal('statechange');

                    expect(this).to.equal(minimalOfflineAudioContext);

                    resolve();
                };
            });

            return promise;
        });
    });

    describe('sampleRate', () => {
        let minimalOfflineAudioContext;
        let sampleRate;

        beforeEach(() => {
            sampleRate = 44100;
            minimalOfflineAudioContext = new MinimalOfflineAudioContext({ length: 1, sampleRate });
        });

        it('should expose its sampleRate', () => {
            expect(minimalOfflineAudioContext.sampleRate).to.equal(sampleRate);
        });

        it('should be readonly', () => {
            expect(() => {
                minimalOfflineAudioContext.sampleRate = 22050;
            }).to.throw(TypeError);
        });
    });

    describe('state', () => {
        let minimalOfflineAudioContext;

        beforeEach(() => {
            minimalOfflineAudioContext = new MinimalOfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be suspended at the beginning', () => {
            expect(minimalOfflineAudioContext.state).to.equal('suspended');
        });

        it('should be readonly', () => {
            expect(() => {
                minimalOfflineAudioContext.state = 'closed';
            }).to.throw(TypeError);
        });

        it('should be running when starting to render', () => {
            minimalOfflineAudioContext.startRendering();

            expect(minimalOfflineAudioContext.state).to.equal('running');
        });

        it('should be closed after the buffer was rendered', () => {
            return minimalOfflineAudioContext.startRendering().then(() => {
                expect(minimalOfflineAudioContext.state).to.equal('closed');
            });
        });
    });

    describe('addEventListener()', () => {
        let minimalOfflineAudioContext;

        beforeEach(() => {
            minimalOfflineAudioContext = new MinimalOfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should fire a registered statechange event listener when starting to render', () => {
            const { promise, resolve } = Promise.withResolvers();

            function stateChangeListener(event) {
                minimalOfflineAudioContext.removeEventListener('statechange', stateChangeListener);

                expect(event).to.be.an.instanceOf(Event);
                expect(event.currentTarget).to.equal(minimalOfflineAudioContext);
                expect(event.target).to.equal(minimalOfflineAudioContext);
                expect(event.type).to.equal('statechange');

                expect(this).to.equal(minimalOfflineAudioContext);

                resolve();
            }

            minimalOfflineAudioContext.addEventListener('statechange', stateChangeListener);
            minimalOfflineAudioContext.startRendering();

            return promise;
        });

        it('should fire a registered statechange event listener when done with rendering', () => {
            const { promise, resolve } = Promise.withResolvers();

            minimalOfflineAudioContext.startRendering().then(() => {
                function stateChangeListener(event) {
                    minimalOfflineAudioContext.removeEventListener('statechange', stateChangeListener);

                    expect(event).to.be.an.instanceOf(Event);
                    expect(event.currentTarget).to.equal(minimalOfflineAudioContext);
                    expect(event.target).to.equal(minimalOfflineAudioContext);
                    expect(event.type).to.equal('statechange');

                    expect(this).to.equal(minimalOfflineAudioContext);

                    resolve();
                }

                minimalOfflineAudioContext.addEventListener('statechange', stateChangeListener);
            });

            return promise;
        });
    });

    describe('startRendering()', () => {
        let minimalOfflineAudioContext;

        beforeEach(() => {
            minimalOfflineAudioContext = new MinimalOfflineAudioContext({ length: 10, sampleRate: 44100 });
        });

        it('should return a promise', () => {
            expect(minimalOfflineAudioContext.startRendering()).to.be.an.instanceOf(Promise);
        });

        it('should resolve with the renderedBuffer', () => {
            const audioBuffer = new AudioBuffer({ length: 10, numberOfChannels: 1, sampleRate: 44100 });
            const audioBufferSourceNode = new AudioBufferSourceNode(minimalOfflineAudioContext);
            const buffer = new Float32Array(10);

            for (let i = 0; i < buffer.length; i += 1) {
                buffer[i] = i;
            }

            audioBuffer.copyToChannel(buffer, 0, 0);

            audioBufferSourceNode.buffer = audioBuffer;

            audioBufferSourceNode.connect(minimalOfflineAudioContext.destination);

            audioBufferSourceNode.start(0);

            return minimalOfflineAudioContext.startRendering().then((renderedBuffer) => {
                expect(renderedBuffer.length).to.equal(audioBuffer.length);

                const channelData = renderedBuffer.getChannelData(0);

                for (let i = 0; i < audioBuffer.length; i += 1) {
                    expect(channelData[i]).to.equal(i);
                }
            });
        });

        it('should throw an InvalidStateError if it was invoked before', () => {
            minimalOfflineAudioContext.startRendering();

            return minimalOfflineAudioContext.startRendering().then(
                () => {
                    throw new Error('This should never be called.');
                },
                (err) => {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');
                }
            );
        });
    });
});
