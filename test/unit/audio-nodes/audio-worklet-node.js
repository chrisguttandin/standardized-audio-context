import { AudioBuffer } from '../../../src/audio-buffer';
import { AudioBufferSourceNode } from '../../../src/audio-nodes/audio-buffer-source-node';
import { AudioContext } from '../../../src/audio-contexts/audio-context';
import { AudioWorkletNode } from '../../../src/audio-nodes/audio-worklet-node';
import { GainNode } from '../../../src/audio-nodes/gain-node';
import { MinimalAudioContext } from '../../../src/audio-contexts/minimal-audio-context';
import { MinimalOfflineAudioContext } from '../../../src/audio-contexts/minimal-offline-audio-context';
import { OfflineAudioContext } from '../../../src/audio-contexts/offline-audio-context';
import { addAudioWorkletModule } from '../../../src/add-audio-worklet-module';
import { createRenderer } from '../../helper/create-renderer';

describe('AudioWorkletNode', () => {

    // @todo leche seems to need a unique string as identifier as first argument.
    leche.withData([
        [
            'constructor with AudioContext',
            () => new AudioContext(),
            async (context) => {
                await context.audioWorklet.addModule('base/test/fixtures/gain-processor.js');

                return new AudioWorkletNode(context, 'gain-processor');
            }
        ], [
            'constructor with MinimalAudioContext',
            () => new MinimalAudioContext(),
            async (context) => {
                await addAudioWorkletModule(context, 'base/test/fixtures/gain-processor.js');

                return new AudioWorkletNode(context, 'gain-processor');
            }
        ], [
            'constructor with OfflineAudioContext',
            () => new OfflineAudioContext({ length: 5, sampleRate: 44100 }),
            async (context) => {
                await context.audioWorklet.addModule('base/test/fixtures/gain-processor.js');

                return new AudioWorkletNode(context, 'gain-processor');
            }
        ], [
            'constructor with MinimalOfflineAudioContext',
            () => new MinimalOfflineAudioContext({ length: 5, sampleRate: 44100 }),
            async (context) => {
                await addAudioWorkletModule(context, 'base/test/fixtures/gain-processor.js');

                return new AudioWorkletNode(context, 'gain-processor');
            }
        ]
    ], (_, createContext, createAudioWorkletNode) => {

        let context;

        afterEach(() => {
            if (context.close !== undefined) {
                return context.close();
            }
        });

        beforeEach(() => context = createContext());

        it('should be an instance of the AudioNode interface', async () => {
            const audioWorkletNode = await createAudioWorkletNode(context);

            expect(audioWorkletNode.channelCount).to.equal(2);
            expect(audioWorkletNode.channelCountMode).to.equal('max');
            expect(audioWorkletNode.channelInterpretation).to.equal('speakers');
            expect(audioWorkletNode.connect).to.be.a('function');
            expect(audioWorkletNode.context).to.be.an.instanceOf(context.constructor);
            expect(audioWorkletNode.disconnect).to.be.a('function');
            expect(audioWorkletNode.numberOfInputs).to.equal(1);
            expect(audioWorkletNode.numberOfOutputs).to.equal(1);
        });

        it('should be an instance of the AudioWorkletNode interface', async () => {
            const audioWorkletNode = await createAudioWorkletNode(context);

            expect(audioWorkletNode.onprocessorstatechange).to.be.null;
            expect(audioWorkletNode.parameters.entries).to.be.a('function');
            expect(audioWorkletNode.parameters.forEach).to.be.a('function');
            expect(audioWorkletNode.parameters.get).to.be.a('function');
            expect(audioWorkletNode.parameters.has).to.be.a('function');
            expect(audioWorkletNode.parameters.keys).to.be.a('function');
            expect(audioWorkletNode.parameters.values).to.be.a('function');
            expect(audioWorkletNode.parameters[ Symbol.iterator ]).to.be.a('function');
            expect(audioWorkletNode.port).to.be.an.instanceOf(MessagePort);
            expect(audioWorkletNode.processorState).to.equal('pending');
        });

        it('should throw an error if the AudioContext is closed', (done) => {
            ((context.close === undefined) ? context.startRendering() : context.close())
                .then(() => createAudioWorkletNode(context))
                .catch((err) => {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    context = new AudioContext();

                    done();
                });
        });

        describe('connect()', () => {

            let audioWorkletNode;

            beforeEach(async () => {
                audioWorkletNode = await createAudioWorkletNode(context);
            });

            it('should be chainable', () => {
                const gainNode = new GainNode(context);

                expect(audioWorkletNode.connect(gainNode)).to.equal(gainNode);
            });

            it('should not be connectable to an AudioNode of another AudioContext', (done) => {
                const anotherContext = createContext();

                try {
                    audioWorkletNode.connect(anotherContext.destination);
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
                    audioWorkletNode.connect(gainNode.gain);
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
                    audioWorkletNode.connect(gainNode.gain, -1);
                } catch (err) {
                    expect(err.code).to.equal(1);
                    expect(err.name).to.equal('IndexSizeError');

                    done();
                }
            });

        });

        describe('disconnect()', () => {

            let audioBufferSourceNode;
            let audioWorkletNode;
            let firstDummyGainNode;
            let secondDummyGainNode;
            let renderer;
            let values;

            beforeEach(async () => {
                audioBufferSourceNode = new AudioBufferSourceNode(context);
                audioWorkletNode = await createAudioWorkletNode(context);
                firstDummyGainNode = new GainNode(context);
                secondDummyGainNode = new GainNode(context);
                values = [ 1, 1, 1, 1, 1 ];

                const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });

                audioBuffer.copyToChannel(new Float32Array(values), 0);

                audioBufferSourceNode.buffer = audioBuffer;

                renderer = createRenderer({
                    bufferSize: (audioWorkletNode._nativeNode === null) ? 0 : ((audioWorkletNode._nativeNode.bufferSize === undefined) ? 0 : audioWorkletNode._nativeNode.bufferSize),
                    connect (destination) {
                        audioBufferSourceNode
                            .connect(audioWorkletNode)
                            .connect(firstDummyGainNode)
                            .connect(destination);

                        audioWorkletNode.connect(secondDummyGainNode);
                    },
                    context,
                    length: (context.length === undefined) ? 5 : undefined
                });
            });

            it('should be possible to disconnect a destination', function () {
                this.timeout(5000);

                return renderer((startTime) => {
                    audioWorkletNode.disconnect(firstDummyGainNode);

                    audioBufferSourceNode.start(startTime);
                })
                    .then((channelData) => {
                        expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                    });
            });

            it('should be possible to disconnect another destination in isolation', function () {
                this.timeout(5000);

                return renderer((startTime) => {
                    audioWorkletNode.disconnect(secondDummyGainNode);

                    audioBufferSourceNode.start(startTime);
                })
                    .then((channelData) => {
                        expect(Array.from(channelData)).to.deep.equal(values);
                    });
            });

            it('should be possible to disconnect all destinations', function () {
                this.timeout(5000);

                return renderer((startTime) => {
                    audioWorkletNode.disconnect();

                    audioBufferSourceNode.start(startTime);
                })
                    .then((channelData) => {
                        expect(Array.from(channelData)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
                    });
            });

        });

    });

});
