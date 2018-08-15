import '../../helper/play-silence';
import { AudioBuffer, AudioBufferSourceNode, MinimalOfflineAudioContext } from '../../../src/module';

describe('MinimalOfflineAudioContext', () => {

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

        it('should be an instance of the AudioDestinationNode interface', () => {
            const minimalOfflineAudioContext = new MinimalOfflineAudioContext({ length, sampleRate });
            const destination = minimalOfflineAudioContext.destination;

            expect(destination.channelCount).to.equal(1);
            expect(destination.channelCountMode).to.equal('explicit');
            expect(destination.channelInterpretation).to.equal('speakers');
            expect(destination.maxChannelCount).to.equal(1);
            expect(destination.numberOfInputs).to.equal(1);
            expect(destination.numberOfOutputs).to.equal(0);
        });

        it('should be readonly', () => {
            const minimalOfflineAudioContext = new MinimalOfflineAudioContext({ length, sampleRate });

            expect(() => {
                minimalOfflineAudioContext.destination = 'a fake AudioDestinationNode';
            }).to.throw(TypeError);
        });

        it('should have maxChannelCount which is at least the channelCount', () => {
            const minimalOfflineAudioContext = new MinimalOfflineAudioContext({ length, sampleRate });
            const destination = minimalOfflineAudioContext.destination;

            expect(destination.maxChannelCount).to.be.at.least(destination.channelCount);
        });

        it('should not allow to change the value of the channelCount property', (done) => {
            const minimalOfflineAudioContext = new MinimalOfflineAudioContext({ length, sampleRate });

            try {
                minimalOfflineAudioContext.destination.channelCount = 2;
            } catch (err) {
                expect(err.code).to.equal(11);
                expect(err.name).to.equal('InvalidStateError');

                done();
            }
        });

        it('should not allow to change the value of the channelCountMode property', (done) => {
            const minimalOfflineAudioContext = new MinimalOfflineAudioContext({ length, sampleRate });

            try {
                minimalOfflineAudioContext.destination.channelCountMode = 'max';
            } catch (err) {
                expect(err.code).to.equal(11);
                expect(err.name).to.equal('InvalidStateError');

                done();
            }
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

    describe('onstatechange', () => {

        let minimalOfflineAudioContext;

        beforeEach(() => {
            minimalOfflineAudioContext = new MinimalOfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be null', () => {
            expect(minimalOfflineAudioContext.onstatechange).to.be.null;
        });

        it('should be assignable to a function', () => {
            const fn = () => {};
            const onstatechange = minimalOfflineAudioContext.onstatechange = fn; // eslint-disable-line no-multi-assign

            expect(onstatechange).to.equal(fn);
            expect(minimalOfflineAudioContext.onstatechange).to.equal(fn);
        });

        it('should be assignable to null', () => {
            const onstatechange = minimalOfflineAudioContext.onstatechange = null; // eslint-disable-line no-multi-assign

            expect(onstatechange).to.be.null;
            expect(minimalOfflineAudioContext.onstatechange).to.be.null;
        });

        it('should not be assignable to something else', () => {
            const string = 'no function or null value';

            minimalOfflineAudioContext.onstatechange = () => {};

            const onstatechange = minimalOfflineAudioContext.onstatechange = string; // eslint-disable-line no-multi-assign

            expect(onstatechange).to.equal(string);
            expect(minimalOfflineAudioContext.onstatechange).to.be.null;
        });

        it('should fire an Event of type statechange when starting to render', (done) => {
            minimalOfflineAudioContext.onstatechange = (event) => {
                minimalOfflineAudioContext.onstatechange = null;

                expect(event.type).to.equal('statechange');

                done();
            };

            minimalOfflineAudioContext.startRendering();
        });

        it('should fire an Event of type statechange when done with rendering', (done) => {
            minimalOfflineAudioContext
                .startRendering()
                .then(() => {
                    minimalOfflineAudioContext.onstatechange = (event) => {
                        minimalOfflineAudioContext.onstatechange = null;

                        expect(event.type).to.equal('statechange');

                        done();
                    };
                });
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
            return minimalOfflineAudioContext
                .startRendering()
                .then(() => {
                    expect(minimalOfflineAudioContext.state).to.equal('closed');
                });
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
            const buffer = new Float32Array(10);
            const bufferSourceNode = new AudioBufferSourceNode(minimalOfflineAudioContext);

            for (let i = 0; i < buffer.length; i += 1) {
                buffer[i] = i;
            }

            audioBuffer.copyToChannel(buffer, 0, 0);

            bufferSourceNode.buffer = audioBuffer;

            bufferSourceNode.connect(minimalOfflineAudioContext.destination);

            bufferSourceNode.start(0);

            return minimalOfflineAudioContext
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

        it('should resolve to an instance of the AudioBuffer interface', () => {
            const audioBuffer = new AudioBuffer({ length: 10, numberOfChannels: 1, sampleRate: 44100 });
            const buffer = new Float32Array(10);
            const bufferSourceNode = new AudioBufferSourceNode(minimalOfflineAudioContext);

            for (let i = 0; i < buffer.length; i += 1) {
                buffer[i] = i;
            }

            audioBuffer.copyToChannel(buffer, 0, 0);

            bufferSourceNode.buffer = audioBuffer;

            bufferSourceNode.connect(minimalOfflineAudioContext.destination);

            bufferSourceNode.start(0);

            return minimalOfflineAudioContext
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
            minimalOfflineAudioContext.startRendering();

            minimalOfflineAudioContext
                .startRendering()
                .catch((err) => {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    done();
                });
        });

    });

});
