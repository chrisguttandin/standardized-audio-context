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

        it('should be an instance of the EventTarget interface', async () => {
            const audioWorkletNode = await createAudioWorkletNode(context);

            expect(audioWorkletNode.addEventListener).to.be.a('function');
            expect(audioWorkletNode.dispatchEvent).to.be.a('function');
            expect(audioWorkletNode.removeEventListener).to.be.a('function');
        });

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
            expect(audioWorkletNode.parameters).not.to.be.undefined;
            expect(audioWorkletNode.port).to.be.an.instanceOf(MessagePort);
            expect(audioWorkletNode.processorState).to.equal('pending');
        });

        it('should throw an error if the AudioContext is closed', (done) => {
            ((context.close === undefined) ? context.startRendering() : context.close())
                .then(() => createAudioWorkletNode(context))
                .catch((err) => {
                    expect(err.code).to.equal(11);
                    expect(err.name).to.equal('InvalidStateError');

                    context.close = undefined;

                    done();
                });
        });

        describe('parameters', () => {

            let audioWorkletNode;
            let parameters;

            beforeEach(async () => {
                audioWorkletNode = await createAudioWorkletNode(context);
                parameters = audioWorkletNode.parameters;
            });

            it('should return an instance of the AudioParamMap interface', () => {
                expect(parameters.entries).to.be.a('function');
                expect(parameters.forEach).to.be.a('function');
                expect(parameters.get).to.be.a('function');
                expect(parameters.has).to.be.a('function');
                expect(parameters.keys).to.be.a('function');
                expect(parameters.values).to.be.a('function');
                // @todo expect(parameters[ Symbol.iterator ]).to.be.a('function');
            });

            describe('size', () => {

                // @todo

            });

            describe('entries()', () => {

                let entries;

                beforeEach(() => {
                    entries = parameters.entries();
                });

                it('should return an instance of the Iterator interface', () => {
                    expect(entries.next).to.be.a('function');
                });

                it('should iterate over all entries', () => {
                    expect(Array.from(entries)).to.deep.equal([ [ 'gain', parameters.get('gain') ] ]);
                });

            });

            describe('forEach()', () => {

                it('should iterate over all parameters', () => {
                    const args = [ ];

                    parameters.forEach((value, key, map) => {
                        args.push({ key, map, value });
                    });

                    expect(args).to.deep.equal([ {
                        key: 'gain',
                        map: parameters,
                        value: parameters.get('gain')
                    } ]);
                });

            });

            describe('get()', () => {

                describe('with an unexisting parameter', () => {

                    it('should return undefined', () => {
                        expect(parameters.get('unknown')).to.be.undefined;
                    });

                });

                describe('with an existing parameter', () => {

                    it('should return an instance of the AudioParam interface', () => {
                        const gain = parameters.get('gain');

                        // @todo cancelAndHoldAtTime
                        expect(gain.cancelScheduledValues).to.be.a('function');
                        expect(gain.defaultValue).to.equal(1);
                        expect(gain.exponentialRampToValueAtTime).to.be.a('function');
                        expect(gain.linearRampToValueAtTime).to.be.a('function');
                        /*
                         * @todo maxValue
                         * @todo minValue
                         */
                        expect(gain.setTargetAtTime).to.be.a('function');
                        // @todo setValueAtTime
                        expect(gain.setValueCurveAtTime).to.be.a('function');
                        expect(gain.value).to.equal(1);
                    });

                });

            });

            describe('has()', () => {

                describe('with an unexisting parameter', () => {

                    it('should return false', () => {
                        expect(parameters.has('unknown')).to.be.false;
                    });

                });

                describe('with an existing parameter', () => {

                    it('should return true', () => {
                        expect(parameters.has('gain')).to.be.true;
                    });

                });

            });

            describe('keys()', () => {

                let keys;

                beforeEach(() => {
                    keys = parameters.keys();
                });

                it('should return an instance of the Iterator interface', () => {
                    expect(keys.next).to.be.a('function');
                });

                it('should iterate over all keys', () => {
                    expect(Array.from(keys)).to.deep.equal([ 'gain' ]);
                });

            });

            describe('values()', () => {

                let values;

                beforeEach(() => {
                    values = parameters.values();
                });

                it('should return an instance of the Iterator interface', () => {
                    expect(values.next).to.be.a('function');
                });

                it('should iterate over all values', () => {
                    expect(Array.from(values)).to.deep.equal([ parameters.get('gain') ]);
                });

            });

            // @todo Symbol.iterator

            describe('automation', () => {

                let audioBufferSourceNode;
                let renderer;
                let values;

                beforeEach(() => {
                    audioBufferSourceNode = new AudioBufferSourceNode(context);
                    values = [ 1, 0.5, 0, -0.5, -1 ];

                    // @todo For some reason up-mixing doesn't work yet, which is why a stereo buffer is used for testing.
                    const audioBuffer = new AudioBuffer({ length: 5, numberOfChannels: 2, sampleRate: context.sampleRate });

                    audioBuffer.copyToChannel(new Float32Array(values), 0);
                    audioBuffer.copyToChannel(new Float32Array(values), 1);

                    audioBufferSourceNode.buffer = audioBuffer;

                    renderer = createRenderer({
                        bufferSize: (audioWorkletNode._nativeNode.bufferSize === undefined) ? 0 : audioWorkletNode._nativeNode.bufferSize,
                        connect (destination) {
                            audioBufferSourceNode
                                .connect(audioWorkletNode)
                                .connect(destination);
                        },
                        context,
                        length: (context.length === undefined) ? 5 : undefined
                    });
                });

                describe('without any automation', () => {

                    it('should not modify the signal', function () {
                        this.timeout(5000);

                        return renderer((startTime) => audioBufferSourceNode.start(startTime))
                            .then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal(values);
                            });
                    });

                });

                describe('with a modified value', () => {

                    it('should modify the signal', function () {
                        this.timeout(5000);

                        parameters.get('gain').value = 0.5;

                        return renderer((startTime) => audioBufferSourceNode.start(startTime))
                            .then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([ 0.5, 0.25, 0, -0.25, -0.5 ]);
                            });
                    });

                });

                describe('with a call to setValueAtTime()', () => {

                    it('should modify the signal', function () {
                        this.timeout(5000);

                        return renderer((startTime) => {
                            parameters.get('gain').setValueAtTime(0.5, startTime + (2 / context.sampleRate));

                            audioBufferSourceNode.start(startTime);
                        })
                            .then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([ 1, 0.5, 0, -0.25, -0.5 ]);
                            });
                    });

                });

                describe('with a call to setValueCurveAtTime()', () => {

                    it('should modify the signal', function () {
                        this.timeout(5000);

                        return renderer((startTime) => {
                            parameters.get('gain').setValueCurveAtTime(new Float32Array([ 0, 0.25, 0.5, 0.75, 1 ]), startTime, startTime + (5 / context.sampleRate));

                            audioBufferSourceNode.start(startTime);
                        })
                            .then((channelData) => {
                                // @todo The implementation of Safari is different. Therefore this test only checks if the values have changed.
                                expect(Array.from(channelData)).to.not.deep.equal(values);
                            });
                    });

                });

                describe('with another AudioNode connected to the AudioParam', () => {

                    it('should modify the signal', function () {
                        this.timeout(5000);

                        const audioBuffer = new AudioBuffer({ length: 5, sampleRate: context.sampleRate });
                        const audioBufferSourceNodeForAudioParam = new AudioBufferSourceNode(context);

                        audioBuffer.copyToChannel(new Float32Array([ 0.5, 0.5, 0.5, 0.5, 0.5 ]), 0);

                        audioBufferSourceNodeForAudioParam.buffer = audioBuffer;

                        return renderer((startTime) => {
                            parameters.get('gain').value = 0;
                            // @todo This should probably be inside of the connect method.
                            audioBufferSourceNodeForAudioParam.connect(parameters.get('gain'));

                            audioBufferSourceNode.start(startTime);
                            audioBufferSourceNodeForAudioParam.start(startTime);
                        })
                            .then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([ 0.5, 0.25, 0, -0.25, -0.5 ]);
                            });
                    });

                });

                // @todo Test other automations as well.

            });

        });

        describe('port', () => {

            let audioWorkletNode;

            beforeEach(async () => {
                audioWorkletNode = await createAudioWorkletNode(context);
            });

            it('should echo any message', (done) => {
                const message = { a: 'simple', test: 'message' };

                audioWorkletNode.port.onmessage = ({ data }) => {
                    expect(data).to.deep.equal(message);

                    done();
                };

                audioWorkletNode.port.postMessage(message);
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

                // @todo For some reason up-mixing doesn't work yet, which is why a stereo buffer is used for testing.
                const audioBuffer = new AudioBuffer({ length: 5, numberOfChannels: 2, sampleRate: context.sampleRate });

                audioBuffer.copyToChannel(new Float32Array(values), 0);
                audioBuffer.copyToChannel(new Float32Array(values), 1);

                audioBufferSourceNode.buffer = audioBuffer;

                renderer = createRenderer({
                    bufferSize: (audioWorkletNode._nativeNode.bufferSize === undefined) ? 0 : audioWorkletNode._nativeNode.bufferSize,
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
