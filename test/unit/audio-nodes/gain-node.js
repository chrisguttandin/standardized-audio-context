import { AudioContext } from '../../../src/audio-contexts/audio-context';
import { GainNode } from '../../../src/audio-nodes/gain-node';
import { OfflineAudioContext } from '../../../src/audio-contexts/offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';

describe('GainNode', () => {

    // @todo leche seems to need a unique string as identifier as first argument.
    leche.withData([
        [ 'constructor with AudioContext', () => new AudioContext(), (context) => new GainNode(context) ],
        [ 'constructor with OfflineAudioContext', () => new OfflineAudioContext({ length: 5, sampleRate: 44100 }), (context) => new GainNode(context) ],
        [ 'factory function of AudioContext', () => new AudioContext(), (context) => context.createGain() ],
        [ 'factory function of OfflineAudioContext', () => new OfflineAudioContext({ length: 5, sampleRate: 44100 }), (context) => context.createGain() ]
    ], (_, createContext, createGainNode) => {

        let context;
        let gainNode;

        afterEach(() => {
            if (context instanceof AudioContext) {
                return context.close();
            }
        });

        beforeEach(() => {
            context = createContext();
            gainNode = createGainNode(context);
        });

        describe('gain', () => {

            it('should return an instance of the AudioParam interface', () => {
                // @todo cancelAndHoldAtTime
                expect(gainNode.gain.cancelScheduledValues).to.be.a('function');
                expect(gainNode.gain.defaultValue).to.equal(1);
                expect(gainNode.gain.exponentialRampToValueAtTime).to.be.a('function');
                expect(gainNode.gain.linearRampToValueAtTime).to.be.a('function');
                /*
                 * @todo maxValue
                 * @todo minValue
                 */
                expect(gainNode.gain.setTargetAtTime).to.be.a('function');
                // @todo setValueAtTime
                expect(gainNode.gain.setValueCurveAtTime).to.be.a('function');
                expect(gainNode.gain.value).to.equal(1);
            });

            describe('automation', () => {

                let audioBufferSourceNode;
                let renderer;
                let values;

                beforeEach(() => {
                    audioBufferSourceNode = context.createBufferSource();
                    values = [ 1, 0.5, 0, -0.5, -1 ];

                    const audioBuffer = context.createBuffer(1, 5, context.sampleRate);

                    audioBuffer.copyToChannel(new Float32Array(values), 0);

                    audioBufferSourceNode.buffer = audioBuffer;

                    renderer = createRenderer({
                        connect (destination) {
                            audioBufferSourceNode
                                .connect(gainNode)
                                .connect(destination);
                        },
                        context,
                        length: (context instanceof AudioContext) ? 5 : undefined
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

                        gainNode.gain.value = 0.5;

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
                            gainNode.gain.setValueAtTime(0, startTime + (2 / context.sampleRate));

                            audioBufferSourceNode.start(startTime);
                        })
                            .then((channelData) => {
                                expect(Array.from(channelData)).to.deep.equal([ 1, 0.5, 0, -0, -0 ]);
                            });
                    });

                });

                describe('with a call to setValueCurveAtTime()', () => {

                    it('should modify the signal', function () {
                        this.timeout(5000);

                        return renderer((startTime) => {
                            gainNode.gain.setValueCurveAtTime(new Float32Array([ 0, 0.25, 0.5, 0.75, 1 ]), startTime, startTime + (5 / context.sampleRate));

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

                        const audioBufferSourceNodeForAudioParam = context.createBufferSource();
                        const audioBuffer = context.createBuffer(1, 5, context.sampleRate);

                        audioBuffer.copyToChannel(new Float32Array([ 0.5, 0.5, 0.5, 0.5, 0.5 ]), 0);

                        audioBufferSourceNodeForAudioParam.buffer = audioBuffer;

                        return renderer((startTime) => {
                            gainNode.gain.value = 0;
                            // @todo This should probably be inside of the connect method.
                            audioBufferSourceNodeForAudioParam.connect(gainNode.gain);

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

        describe('connect()', () => {

            it('should not be connectable to an AudioParam of another AudioContext', (done) => {
                const anotherContext = createContext();
                const anotherGainNode = createGainNode(anotherContext);

                try {
                    gainNode.connect(anotherGainNode.gain);
                } catch (err) {
                    expect(err.code).to.equal(15);
                    expect(err.name).to.equal('InvalidAccessError');

                    done();
                } finally {
                    if (anotherContext instanceof AudioContext) {
                        return anotherContext.close();
                    }
                }
            });

            it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                const anotherGainNode = createGainNode(context);

                try {
                    gainNode.connect(anotherGainNode.gain, -1);
                } catch (err) {
                    expect(err.code).to.equal(1);
                    expect(err.name).to.equal('IndexSizeError');

                    done();
                }
            });

        });

    });

});
