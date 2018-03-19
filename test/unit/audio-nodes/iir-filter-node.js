import { AudioBuffer } from '../../../src/audio-buffer';
import { AudioBufferSourceNode } from '../../../src/audio-nodes/audio-buffer-source-node';
import { AudioContext } from '../../../src/audio-contexts/audio-context';
import { GainNode } from '../../../src/audio-nodes/gain-node';
import { IIRFilterNode } from '../../../src/audio-nodes/iir-filter-node';
import { MinimalAudioContext } from '../../../src/audio-contexts/minimal-audio-context';
import { MinimalOfflineAudioContext } from '../../../src/audio-contexts/minimal-offline-audio-context';
import { OfflineAudioContext } from '../../../src/audio-contexts/offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';

describe('IIRFilterNode', () => {

    // @todo leche seems to need a unique string as identifier as first argument.
    leche.withData([
        [ 'constructor with AudioContext', () => new AudioContext(), (context, feedback, feedforward) => new IIRFilterNode(context, { feedback, feedforward }) ],
        [ 'constructor with MinimalAudioContext', () => new MinimalAudioContext(), (context, feedback, feedforward) => new IIRFilterNode(context, { feedback, feedforward }) ],
        [ 'constructor with OfflineAudioContext', () => new OfflineAudioContext({ length: 5, sampleRate: 44100 }), (context, feedback, feedforward) => new IIRFilterNode(context, { feedback, feedforward }) ],
        [ 'constructor with MinimalOfflineAudioContext', () => new MinimalOfflineAudioContext({ length: 5, sampleRate: 44100 }), (context, feedback, feedforward) => new IIRFilterNode(context, { feedback, feedforward }) ],
        [ 'factory function of AudioContext', () => new AudioContext(), (context, feedback, feedforward) => context.createIIRFilter(feedforward, feedback) ],
        [ 'factory function of OfflineAudioContext', () => new OfflineAudioContext({ length: 5, sampleRate: 44100 }), (context, feedback, feedforward) => context.createIIRFilter(feedforward, feedback) ]
    ], (_, createContext, createIIRFilterNode) => {

        let context;
        let feedback;
        let feedforward;

        afterEach(() => {
            if (context.close !== undefined) {
                return context.close();
            }
        });

        beforeEach(() => {
            context = createContext();
            feedback = [ 1 ];
            feedforward = [ 1 ];
        });

        describe('without any feedback coefficients', () => {

            it('should throw an NotSupportedError', (done) => {
                try {
                    createIIRFilterNode(context, [ ], feedforward);
                } catch (err) {
                    expect(err.code).to.equal(9);
                    expect(err.name).to.equal('NotSupportedError');

                    done();
                }
            });

        });

        describe('with feedback coefficients beginning with zero', () => {

            it('should throw an InvalidStateError', (done) => {
                try {
                    createIIRFilterNode(context, [ 0, 1 ], feedforward);
                } catch (err) {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    done();
                }
            });

        });

        describe('with too many feedback coefficients', () => {

            it('should throw an NotSupportedError', (done) => {
                try {
                    createIIRFilterNode(context, [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21 ], feedforward);
                } catch (err) {
                    expect(err.code).to.equal(9);
                    expect(err.name).to.equal('NotSupportedError');

                    done();
                }
            });

        });

        describe('without any feedforward coefficients', () => {

            it('should throw an NotSupportedError', (done) => {
                try {
                    createIIRFilterNode(context, feedback, [ ]);
                } catch (err) {
                    expect(err.code).to.equal(9);
                    expect(err.name).to.equal('NotSupportedError');

                    done();
                }
            });

        });

        describe('with feedforward coefficients of only zero', () => {

            it('should throw an InvalidStateError', (done) => {
                try {
                    createIIRFilterNode(context, feedback, [ 0 ]);
                } catch (err) {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    done();
                }
            });

        });

        describe('with too many feedforward coefficients', () => {

            it('should throw an NotSupportedError', (done) => {
                try {
                    createIIRFilterNode(context, feedback, [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21 ]);
                } catch (err) {
                    expect(err.code).to.equal(9);
                    expect(err.name).to.equal('NotSupportedError');

                    done();
                }
            });

        });

        describe('with valid feedback and feedforward coefficients', () => {

            it('should be an instance of the EventTarget interface', () => {
                const iIRFilterNode = createIIRFilterNode(context, feedback, feedforward);

                expect(iIRFilterNode.addEventListener).to.be.a('function');
                expect(iIRFilterNode.dispatchEvent).to.be.a('function');
                expect(iIRFilterNode.removeEventListener).to.be.a('function');
            });

            it('should be an instance of the AudioNode interface', () => {
                const iIRFilterNode = createIIRFilterNode(context, feedback, feedforward);

                expect(iIRFilterNode.channelCount).to.equal(2);
                expect(iIRFilterNode.channelCountMode).to.equal('max');
                expect(iIRFilterNode.channelInterpretation).to.equal('speakers');
                expect(iIRFilterNode.connect).to.be.a('function');
                expect(iIRFilterNode.context).to.be.an.instanceOf(context.constructor);
                expect(iIRFilterNode.disconnect).to.be.a('function');
                expect(iIRFilterNode.numberOfInputs).to.equal(1);
                expect(iIRFilterNode.numberOfOutputs).to.equal(1);
            });

            it('should return an instance of the IIRFilterNode interface', () => {
                const iIRFilterNode = createIIRFilterNode(context, feedback, feedforward);

                expect(iIRFilterNode.getFrequencyResponse).to.be.a('function');
            });

            it('should throw an error if the AudioContext is closed', (done) => {
                ((context.close === undefined) ? context.startRendering() : context.close())
                    .then(() => createIIRFilterNode(context, feedback, feedforward))
                    .catch((err) => {
                        expect(err.code).to.equal(11);
                        expect(err.name).to.equal('InvalidStateError');

                        context.close = undefined;

                        done();
                    });
            });

            describe('rendering', () => {

                let audioBufferSourceNode;
                let iIRFilterNode;
                let renderer;

                describe('with some filter coefficients', () => {

                    beforeEach(() => {
                        audioBufferSourceNode = new AudioBufferSourceNode(context);
                        iIRFilterNode = createIIRFilterNode(context, [ 1, -0.5 ], [ 1, -1 ]);

                        const audioBuffer = new AudioBuffer({ length: 5, numberOfChannels: 1, sampleRate: context.sampleRate });

                        audioBuffer.copyToChannel(new Float32Array([ 1, 0, 0, 0, 0 ]), 0);
                        // @todo Render a second channel with the following values: 0, 1, 1 ...

                        audioBufferSourceNode.buffer = audioBuffer;

                        renderer = createRenderer({
                            bufferSize: (iIRFilterNode._nativeNode.bufferSize === undefined) ? 0 : iIRFilterNode._nativeNode.bufferSize,
                            connect (destination) {
                                audioBufferSourceNode
                                    .connect(iIRFilterNode)
                                    .connect(destination);
                            },
                            context,
                            length: (context.length === undefined) ? 5 : undefined
                        });
                    });

                    it('should modify the signal', function () {
                        this.timeout(5000);

                        return renderer((startTime) => audioBufferSourceNode.start(startTime))
                            .then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([ 1, -0.5, -0.25, -0.125, -0.0625 ]);
                                // @todo The second channel should be 0, 1, 0.5 ...
                            });
                    });

                });

                describe('with some other filter coefficients', () => {

                    beforeEach(() => {
                        audioBufferSourceNode = new AudioBufferSourceNode(context);
                        iIRFilterNode = createIIRFilterNode(context, [ 1, 0.5 ], [ 0.5, -1 ]);

                        const audioBuffer = new AudioBuffer({ length: 5, numberOfChannels: 1, sampleRate: context.sampleRate });

                        audioBuffer.copyToChannel(new Float32Array([ 1, 1, 1, 1, 1 ]), 0);
                        /*
                         * @todo Render a second channel with the following values: 1, 0, 0 ...
                         * @todo Render a third channel with the following values: 0, 1, 1 ...
                         */

                        audioBufferSourceNode.buffer = audioBuffer;

                        renderer = createRenderer({
                            bufferSize: (iIRFilterNode._nativeNode.bufferSize === undefined) ? 0 : iIRFilterNode._nativeNode.bufferSize,
                            connect (destination) {
                                audioBufferSourceNode
                                    .connect(iIRFilterNode)
                                    .connect(destination);
                            },
                            context,
                            length: (context.length === undefined) ? 5 : undefined
                        });
                    });

                    it('should modify the signal', function () {
                        this.timeout(5000);

                        return renderer((startTime) => audioBufferSourceNode.start(startTime))
                            .then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([ 0.5, -0.75, -0.125, -0.4375, -0.28125 ]);
                                /*
                                 * @todo The second channel should be 0.5, -1.25, 0.625 ...
                                 * @todo The third channel should be 0, 0.5, -0.75 ...
                                 */
                            });
                    });

                });

            });

        });

        describe('connect()', () => {

            let iIRFilterNode;

            beforeEach(() => {
                iIRFilterNode = createIIRFilterNode(context, feedback, feedforward);
            });

            it('should be chainable', () => {
                const gainNode = new GainNode(context);

                expect(iIRFilterNode.connect(gainNode)).to.equal(gainNode);
            });

            it('should not be connectable to an AudioNode of another AudioContext', (done) => {
                const anotherContext = createContext();

                try {
                    iIRFilterNode.connect(anotherContext.destination);
                } catch (err) {
                    expect(err.code).to.equal(15);
                    expect(err.name).to.equal('InvalidAccessError');

                    done();
                } finally {
                    if (anotherContext.close !== undefined) {
                        anotherContext.close();
                    }
                }
            });

            it('should not be connectable to an AudioParam of another AudioContext', (done) => {
                const anotherContext = createContext();
                const gainNode = new GainNode(anotherContext);

                try {
                    iIRFilterNode.connect(gainNode.gain);
                } catch (err) {
                    expect(err.code).to.equal(15);
                    expect(err.name).to.equal('InvalidAccessError');

                    done();
                } finally {
                    if (anotherContext.close !== undefined) {
                        anotherContext.close();
                    }
                }
            });

            it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                const gainNode = new GainNode(context);

                try {
                    iIRFilterNode.connect(gainNode.gain, -1);
                } catch (err) {
                    expect(err.code).to.equal(1);
                    expect(err.name).to.equal('IndexSizeError');

                    done();
                }
            });

        });

        describe('disconnect()', () => {

            let audioBufferSourceNode;
            let firstDummyGainNode;
            let iIRFilterNode;
            let secondDummyGainNode;
            let renderer;
            let values;

            beforeEach(() => {
                audioBufferSourceNode = new AudioBufferSourceNode(context);
                iIRFilterNode = createIIRFilterNode(context, feedback, feedforward);
                firstDummyGainNode = new GainNode(context);
                secondDummyGainNode = new GainNode(context);
                values = [ 1, 1, 1, 1, 1 ];

                const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });

                audioBuffer.copyToChannel(new Float32Array(values), 0);

                audioBufferSourceNode.buffer = audioBuffer;

                renderer = createRenderer({
                    bufferSize: (iIRFilterNode._nativeNode.bufferSize === undefined) ? 0 : iIRFilterNode._nativeNode.bufferSize,
                    connect (destination) {
                        audioBufferSourceNode
                            .connect(iIRFilterNode)
                            .connect(firstDummyGainNode)
                            .connect(destination);

                        iIRFilterNode.connect(secondDummyGainNode);
                    },
                    context,
                    length: (context.length === undefined) ? 5 : undefined
                });
            });

            it('should be possible to disconnect a destination', function () {
                this.timeout(5000);

                return renderer((startTime) => {
                    iIRFilterNode.disconnect(firstDummyGainNode);

                    audioBufferSourceNode.start(startTime);
                })
                    .then((channelData) => {
                        expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                    });
            });

            it('should be possible to disconnect another destination in isolation', function () {
                this.timeout(5000);

                return renderer((startTime) => {
                    iIRFilterNode.disconnect(secondDummyGainNode);

                    audioBufferSourceNode.start(startTime);
                })
                    .then((channelData) => {
                        expect(Array.from(channelData)).to.deep.equal(values);
                    });
            });

            it('should be possible to disconnect all destinations', function () {
                this.timeout(5000);

                return renderer((startTime) => {
                    iIRFilterNode.disconnect();

                    audioBufferSourceNode.start(startTime);
                })
                    .then((channelData) => {
                        expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                    });
            });

        });

        describe('getFrequencyResponse()', () => {

            describe('with a frequencyHz parameter smaller as the others', () => {

                it('should throw an InvalidAccessError', (done) => {
                    const iIRFilterNode = createIIRFilterNode(context, feedback, feedforward);

                    try {
                        iIRFilterNode.getFrequencyResponse(new Float32Array(), new Float32Array(1), new Float32Array(1));
                    } catch (err) {
                        expect(err.code).to.equal(15);
                        expect(err.name).to.equal('InvalidAccessError');

                        done();
                    }
                });

            });

            describe('with a magResponse parameter smaller as the others', () => {

                it('should throw an InvalidAccessError', (done) => {
                    const iIRFilterNode = createIIRFilterNode(context, feedback, feedforward);

                    try {
                        iIRFilterNode.getFrequencyResponse(new Float32Array([ 1 ]), new Float32Array(0), new Float32Array(1));
                    } catch (err) {
                        expect(err.code).to.equal(15);
                        expect(err.name).to.equal('InvalidAccessError');

                        done();
                    }
                });

            });

            describe('with a phaseResponse parameter smaller as the others', () => {

                it('should throw an InvalidAccessError', (done) => {
                    const iIRFilterNode = createIIRFilterNode(context, feedback, feedforward);

                    try {
                        iIRFilterNode.getFrequencyResponse(new Float32Array([ 1 ]), new Float32Array(1), new Float32Array(0));
                    } catch (err) {
                        expect(err.code).to.equal(15);
                        expect(err.name).to.equal('InvalidAccessError');

                        done();
                    }
                });

            });

            describe('with valid parameters', () => {

                describe('with some filter coefficients', () => {

                    it('should fill the magResponse and phaseResponse arrays', () => {
                        const iIRFilterNode = createIIRFilterNode(context, [ 1 ], [ 1 ]);
                        const magResponse = new Float32Array(5);
                        const phaseResponse = new Float32Array(5);

                        iIRFilterNode.getFrequencyResponse(new Float32Array([ 200, 400, 800, 1600, 3200 ]), magResponse, phaseResponse);

                        expect(Array.from(magResponse)).to.deep.equal([ 1, 1, 1, 1, 1 ]);
                        expect(Array.from(phaseResponse)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                    });

                });

                describe('with some other filter coefficients', () => {

                    it('should fill the magResponse and phaseResponse arrays', () => {
                        const iIRFilterNode = createIIRFilterNode(context, [ 1, -0.5 ], [ 1, -1 ]);
                        const magResponse = new Float32Array(5);
                        const phaseResponse = new Float32Array(5);

                        iIRFilterNode.getFrequencyResponse(new Float32Array([ 200, 400, 800, 1600, 3200 ]), magResponse, phaseResponse);

                        expect(Array.from(magResponse)).to.deep.equal([ 0.056942202150821686, 0.11359700560569763, 0.2249375581741333, 0.43307945132255554, 0.7616625428199768 ]);
                        expect(Array.from(phaseResponse)).to.deep.equal([ 1.5280766487121582, 1.4854952096939087, 1.401282548904419, 1.2399859428405762, 0.9627721309661865 ]);
                    });

                });

            });

        });


    });

});
