import '../../helper/play-silence';
import { AudioBuffer, AudioBufferSourceNode, GainNode, WaveShaperNode } from '../../../src/module';
import { BACKUP_NATIVE_CONTEXT_STORE } from '../../../src/globals';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';

const createWaveShaperNodeWithConstructor = (context, options = null) => {
    if (options === null) {
        return new WaveShaperNode(context);
    }

    return new WaveShaperNode(context, options);
};
const createWaveShaperNodeWithFactoryFunction = (context, options = null) => {
    const waveShaperNode = context.createWaveShaper();

    if (options !== null && options.channelCount !== undefined) {
        waveShaperNode.channelCount = options.channelCount;
    }

    if (options !== null && options.channelCountMode !== undefined) {
        waveShaperNode.channelCountMode = options.channelCountMode;
    }

    if (options !== null && options.channelInterpretation !== undefined) {
        waveShaperNode.channelInterpretation = options.channelInterpretation;
    }

    if (options !== null && options.curve !== undefined) {
        waveShaperNode.curve = options.curve;
    }

    if (options !== null && options.oversample !== undefined) {
        waveShaperNode.oversample = options.oversample;
    }

    return waveShaperNode;
};
const testCases = {
    'constructor of a MinimalAudioContext': {
        createContext: createMinimalAudioContext,
        createWaveShaperNode: createWaveShaperNodeWithConstructor
    },
    'constructor of a MinimalOfflineAudioContext': {
        createContext: createMinimalOfflineAudioContext,
        createWaveShaperNode: createWaveShaperNodeWithConstructor
    },
    'constructor of an AudioContext': {
        createContext: createAudioContext,
        createWaveShaperNode: createWaveShaperNodeWithConstructor
    },
    'constructor of an OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createWaveShaperNode: createWaveShaperNodeWithConstructor
    },
    'factory function of an AudioContext': {
        createContext: createAudioContext,
        createWaveShaperNode: createWaveShaperNodeWithFactoryFunction
    },
    'factory function of an OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createWaveShaperNode: createWaveShaperNodeWithFactoryFunction
    }
};

describe('WaveShaperNode', () => {

    for (const [ description, { createWaveShaperNode, createContext } ] of Object.entries(testCases)) {

        describe(`with the ${ description }`, () => {

            let context;

            afterEach(() => {
                if (context.close !== undefined) {
                    return context.close();
                }
            });

            beforeEach(() => context = createContext());

            describe('constructor()', () => {

                for (const audioContextState of [ 'closed', 'running' ]) {

                    describe(`with an audioContextState of "${ audioContextState }"`, () => {

                        afterEach(() => {
                            if (audioContextState === 'closed') {
                                const backupNativeContext = BACKUP_NATIVE_CONTEXT_STORE.get(context._nativeContext);

                                // Bug #94: Edge also exposes a close() method on an OfflineAudioContext which is why this check is necessary.
                                if (backupNativeContext !== undefined && backupNativeContext.startRendering === undefined) {
                                    context = backupNativeContext;
                                } else {
                                    context.close = undefined;
                                }
                            }
                        });

                        beforeEach(() => {
                            if (audioContextState === 'closed') {
                                if (context.close === undefined) {
                                    return context.startRendering();
                                }

                                return context.close();
                            }
                        });

                        describe('without any options', () => {

                            let waveShaperNode;

                            beforeEach(() => {
                                waveShaperNode = createWaveShaperNode(context);
                            });

                            it('should return an instance of the EventTarget interface', () => {
                                expect(waveShaperNode.addEventListener).to.be.a('function');
                                expect(waveShaperNode.dispatchEvent).to.be.a('function');
                                expect(waveShaperNode.removeEventListener).to.be.a('function');
                            });

                            it('should return an instance of the AudioNode interface', () => {
                                expect(waveShaperNode.channelCount).to.equal(2);
                                expect(waveShaperNode.channelCountMode).to.equal('max');
                                expect(waveShaperNode.channelInterpretation).to.equal('speakers');
                                expect(waveShaperNode.connect).to.be.a('function');
                                expect(waveShaperNode.context).to.be.an.instanceOf(context.constructor);
                                expect(waveShaperNode.disconnect).to.be.a('function');
                                expect(waveShaperNode.numberOfInputs).to.equal(1);
                                expect(waveShaperNode.numberOfOutputs).to.equal(1);
                            });

                            it('should return an instance of the WaveShaperNode interface', () => {
                                expect(waveShaperNode.curve).to.be.null;
                                expect(waveShaperNode.oversample).to.equal('none');
                            });

                        });

                        describe('with valid options', () => {

                            it('should return an instance with the given channelCount', () => {
                                const channelCount = 4;
                                const waveShaperNode = createWaveShaperNode(context, { channelCount });

                                expect(waveShaperNode.channelCount).to.equal(channelCount);
                            });

                            it('should return an instance with the given channelCountMode', () => {
                                const channelCountMode = 'explicit';
                                const waveShaperNode = createWaveShaperNode(context, { channelCountMode });

                                expect(waveShaperNode.channelCountMode).to.equal(channelCountMode);
                            });

                            it('should return an instance with the given channelInterpretation', () => {
                                const channelInterpretation = 'discrete';
                                const waveShaperNode = createWaveShaperNode(context, { channelInterpretation });

                                expect(waveShaperNode.channelInterpretation).to.equal(channelInterpretation);
                            });

                            it('should return an instance with the given curve', () => {
                                const curve = new Float32Array([ 0.3, 0.5 ]);
                                const waveShaperNode = createWaveShaperNode(context, { curve });

                                expect(waveShaperNode.curve).to.be.an.instanceOf(Float32Array);
                                expect(waveShaperNode.curve).to.deep.equal(curve);
                            });

                            it('should return an instance with the given oversample type', () => {
                                const oversample = '2x';
                                const waveShaperNode = createWaveShaperNode(context, { oversample });

                                expect(waveShaperNode.oversample).to.equal(oversample);
                            });

                        });

                        describe('with invalid options', () => {

                            describe('with a curve of less than two samples', () => {

                                it('should throw an InvalidStateError', (done) => {
                                    try {
                                        createWaveShaperNode(context, { curve: new Float32Array([ 1 ]) });
                                    } catch (err) {
                                        expect(err.code).to.equal(11);
                                        expect(err.name).to.equal('InvalidStateError');

                                        done();
                                    }
                                });

                            });

                        });

                    });

                }

            });

            describe('channelCount', () => {

                let waveShaperNode;

                beforeEach(() => {
                    waveShaperNode = createWaveShaperNode(context);
                });

                it('should be assignable to another value', () => {
                    const channelCount = 4;

                    waveShaperNode.channelCount = channelCount;

                    expect(waveShaperNode.channelCount).to.equal(channelCount);
                });

            });

            describe('channelCountMode', () => {

                let waveShaperNode;

                beforeEach(() => {
                    waveShaperNode = createWaveShaperNode(context);
                });

                it('should be assignable to another value', () => {
                    const channelCountMode = 'explicit';

                    waveShaperNode.channelCountMode = channelCountMode;

                    expect(waveShaperNode.channelCountMode).to.equal(channelCountMode);
                });

            });

            describe('channelInterpretation', () => {

                let waveShaperNode;

                beforeEach(() => {
                    waveShaperNode = createWaveShaperNode(context);
                });

                it('should be assignable to another value', () => {
                    const channelInterpretation = 'discrete';

                    waveShaperNode.channelInterpretation = channelInterpretation;

                    expect(waveShaperNode.channelInterpretation).to.equal(channelInterpretation);
                });

            });

            describe('curve', () => {

                let waveShaperNode;

                beforeEach(() => {
                    waveShaperNode = createWaveShaperNode(context);
                });

                describe('with a valid curve', () => {

                    it('should be assignable to a Float32Array', () => {
                        const curve = new Float32Array([ -1, 0, 1 ]);

                        waveShaperNode.curve = curve;

                        expect(waveShaperNode.curve).to.be.an.instanceOf(Float32Array);
                        expect(waveShaperNode.curve).to.deep.equal(curve);
                    });

                });

                describe('with a previously assigned curve', () => {

                    it('should be assignable to null', () => {
                        waveShaperNode.curve = new Float32Array([ 0.4, 0, 0.4 ]);
                        waveShaperNode.curve = null;

                        expect(waveShaperNode.curve).to.be.null;
                    });

                });

                describe('with a curve of less than two samples', () => {

                    it('should throw an InvalidStateError', (done) => {
                        try {
                            waveShaperNode.curve = new Float32Array([ 1 ]);
                        } catch (err) {
                            expect(err.code).to.equal(11);
                            expect(err.name).to.equal('InvalidStateError');

                            done();
                        }
                    });

                });

            });

            describe('oversample', () => {

                let waveShaperNode;

                beforeEach(() => {
                    waveShaperNode = createWaveShaperNode(context);
                });

                it('should be assignable to another oversample type', () => {
                    const oversample = waveShaperNode.oversample = '4x'; // eslint-disable-line no-multi-assign

                    expect(oversample).to.equal('4x');
                    expect(waveShaperNode.oversample).to.equal('4x');
                });

                it('should not be assignable to something else', () => {
                    const string = 'none of the accepted oversample types';
                    const oversample = waveShaperNode.oversample = string; // eslint-disable-line no-multi-assign

                    expect(oversample).to.equal(string);
                    expect(waveShaperNode.oversample).to.equal('none');
                });

            });

            describe('connect()', () => {

                let waveShaperNode;

                beforeEach(() => {
                    waveShaperNode = createWaveShaperNode(context);
                });

                for (const type of [ 'AudioNode', 'AudioParam' ]) {

                    describe(`with an ${ type }`, () => {

                        let audioNodeOrAudioParam;

                        beforeEach(() => {
                            const gainNode = new GainNode(context);

                            audioNodeOrAudioParam = (type === 'AudioNode') ? gainNode : gainNode.gain;
                        });

                        if (type === 'AudioNode') {

                            it('should be chainable', () => {
                                expect(waveShaperNode.connect(audioNodeOrAudioParam)).to.equal(audioNodeOrAudioParam);
                            });

                        } else {

                            it('should not be chainable', () => {
                                expect(waveShaperNode.connect(audioNodeOrAudioParam)).to.be.undefined;
                            });

                        }

                        it('should accept duplicate connections', () => {
                            waveShaperNode.connect(audioNodeOrAudioParam);
                            waveShaperNode.connect(audioNodeOrAudioParam);
                        });

                        it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                            try {
                                waveShaperNode.connect(audioNodeOrAudioParam, -1);
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });

                    });

                    describe(`with an ${ type } of another context`, () => {

                        let anotherContext;
                        let audioNodeOrAudioParam;

                        afterEach(() => {
                            if (anotherContext.close !== undefined) {
                                return anotherContext.close();
                            }
                        });

                        beforeEach(() => {
                            anotherContext = createContext();

                            const gainNode = new GainNode(anotherContext);

                            audioNodeOrAudioParam = (type === 'AudioNode') ? gainNode : gainNode.gain;
                        });

                        it('should throw an InvalidAccessError', (done) => {
                            try {
                                waveShaperNode.connect(audioNodeOrAudioParam);
                            } catch (err) {
                                expect(err.code).to.equal(15);
                                expect(err.name).to.equal('InvalidAccessError');

                                done();
                            }
                        });

                    });

                }

            });

            describe('disconnect()', () => {

                let renderer;
                let values;

                beforeEach(function () {
                    this.timeout(10000);

                    values = [ 1, 0.5, 0, -0.5, -1 ];

                    renderer = createRenderer({
                        context,
                        length: (context.length === undefined) ? 5 : undefined,
                        prepare (destination) {
                            const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                            const audioBufferSourceNode = new AudioBufferSourceNode(context);
                            const firstDummyGainNode = new GainNode(context);
                            const secondDummyGainNode = new GainNode(context);
                            const waveShaperNode = createWaveShaperNode(context, { curve: new Float32Array([ 0, 0.25, 0.5, 0.75, 1 ]) });

                            audioBuffer.copyToChannel(new Float32Array(values), 0);

                            audioBufferSourceNode.buffer = audioBuffer;

                            audioBufferSourceNode
                                .connect(waveShaperNode)
                                .connect(firstDummyGainNode)
                                .connect(destination);

                            waveShaperNode.connect(secondDummyGainNode);

                            return { audioBufferSourceNode, firstDummyGainNode, secondDummyGainNode, waveShaperNode };
                        }
                    });
                });

                it('should be possible to disconnect a destination', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ firstDummyGainNode, waveShaperNode }) {
                            waveShaperNode.disconnect(firstDummyGainNode);
                        },
                        start (startTime, { audioBufferSourceNode }) {
                            audioBufferSourceNode.start(startTime);
                        }
                    })
                        .then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                        });
                });

                it('should be possible to disconnect another destination in isolation', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ waveShaperNode, secondDummyGainNode }) {
                            waveShaperNode.disconnect(secondDummyGainNode);
                        },
                        start (startTime, { audioBufferSourceNode }) {
                            audioBufferSourceNode.start(startTime);
                        }
                    })
                        .then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([ 1, 0.75, 0.5, 0.25, 0 ]);
                        });
                });

                it('should be possible to disconnect all destinations by specifying the output', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ waveShaperNode }) {
                            waveShaperNode.disconnect(0);
                        },
                        start (startTime, { audioBufferSourceNode }) {
                            audioBufferSourceNode.start(startTime);
                        }
                    })
                        .then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                        });
                });

                it('should be possible to disconnect all destinations', function () {
                    this.timeout(10000);

                    return renderer({
                        prepare ({ waveShaperNode }) {
                            waveShaperNode.disconnect();
                        },
                        start (startTime, { audioBufferSourceNode }) {
                            audioBufferSourceNode.start(startTime);
                        }
                    })
                        .then((channelData) => {
                            expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                        });
                });

            });

        });

    }

});
