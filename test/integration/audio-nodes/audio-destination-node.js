import { ConstantSourceNode, GainNode } from '../../../src/module';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createAudioContext } from '../../helper/create-audio-context';
import { createMinimalAudioContext } from '../../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../../helper/create-minimal-offline-audio-context';
import { createNativeAudioContext } from '../../helper/create-native-audio-context';
import { createNativeOfflineAudioContext } from '../../helper/create-native-offline-audio-context';
import { createOfflineAudioContext } from '../../helper/create-offline-audio-context';
import { createRenderer } from '../../helper/create-renderer';

const testCases = {
    'constructor of a MinimalAudioContext': createMinimalAudioContext,
    'constructor of a MinimalOfflineAudioContext': createMinimalOfflineAudioContext,
    'constructor of an AudioContext': createAudioContext,
    'constructor of an OfflineAudioContext': createOfflineAudioContext
};

describe('AudioDestinationNode', { skip: typeof window === 'undefined' }, () => {
    describe.for(Object.entries(testCases))('with the %s', ([description, createContext]) => {
        let context;

        afterEach(() => context.close?.());

        beforeEach(() => (context = createContext()));

        describe('channelCount', () => {
            let audioDestinationNode;

            beforeEach(() => {
                audioDestinationNode = context.destination;
            });

            if (description.includes('Offline')) {
                it('should not be assignable to another value', () => {
                    expect(() => {
                        audioDestinationNode.channelCount = 2;
                    })
                        .to.throw(DOMException)
                        .to.include({ code: 11, name: 'InvalidStateError' });
                });
            } else {
                it('should be assignable to a value smaller than or equal to the maxChannelCount', () => {
                    const channelCount = 1;

                    audioDestinationNode.channelCount = channelCount;

                    expect(audioDestinationNode.channelCount).to.equal(channelCount);
                });

                it('should not be assignable to a value larger than the maxChannelCount', () => {
                    const channelCount = audioDestinationNode.maxChannelCount + 1;

                    expect(() => {
                        audioDestinationNode.channelCount = channelCount;
                    })
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });
            }
        });

        describe('channelCountMode', () => {
            let audioDestinationNode;

            beforeEach(() => {
                audioDestinationNode = context.destination;
            });

            if (description.includes('Offline')) {
                it('should not be assignable to another value', () => {
                    expect(() => {
                        audioDestinationNode.channelCountMode = 'max';
                    })
                        .to.throw(DOMException)
                        .to.include({ code: 11, name: 'InvalidStateError' });
                });
            } else {
                it('should be assignable to another value', () => {
                    const channelCountMode = 'max';

                    audioDestinationNode.channelCountMode = channelCountMode;

                    expect(audioDestinationNode.channelCountMode).to.equal(channelCountMode);
                });
            }
        });

        describe('channelInterpretation', () => {
            let audioDestinationNode;

            beforeEach(() => {
                audioDestinationNode = context.destination;
            });

            it('should be assignable to another value', () => {
                const channelInterpretation = 'discrete';

                audioDestinationNode.channelInterpretation = channelInterpretation;

                expect(audioDestinationNode.channelInterpretation).to.equal(channelInterpretation);
            });
        });

        describe('maxChannelCount', () => {
            let audioDestinationNode;

            beforeEach(() => {
                audioDestinationNode = context.destination;
            });

            it('should have maxChannelCount which is at least the channelCount', () => {
                expect(audioDestinationNode.maxChannelCount).to.be.at.least(audioDestinationNode.channelCount);
            });

            it('should be readonly', () => {
                expect(() => {
                    audioDestinationNode.numberOfInputs = 2;
                }).to.throw(TypeError);
            });
        });

        describe('numberOfInputs', () => {
            let audioDestinationNode;

            beforeEach(() => {
                audioDestinationNode = context.destination;
            });

            it('should be readonly', () => {
                expect(() => {
                    audioDestinationNode.numberOfInputs = 2;
                }).to.throw(TypeError);
            });
        });

        describe('numberOfOutputs', () => {
            let audioDestinationNode;

            beforeEach(() => {
                audioDestinationNode = context.destination;
            });

            it('should be readonly', () => {
                expect(() => {
                    audioDestinationNode.numberOfOutputs = 2;
                }).to.throw(TypeError);
            });
        });

        describe('connect()', () => {
            describe.for(['AudioNode', 'AudioParam'])('with an %s', (type) => {
                let audioNodeOrAudioParam;
                let audioDestinationNode;

                beforeEach(() => {
                    const gainNode = new GainNode(context);

                    audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                    audioDestinationNode = context.destination;
                });

                if (type === 'AudioNode') {
                    it('should be chainable', () => {
                        expect(audioDestinationNode.connect(audioNodeOrAudioParam)).to.equal(audioNodeOrAudioParam);
                    });
                } else {
                    it('should not be chainable', () => {
                        expect(audioDestinationNode.connect(audioNodeOrAudioParam)).to.be.undefined;
                    });
                }

                it('should accept duplicate connections', () => {
                    audioDestinationNode.connect(audioNodeOrAudioParam);
                    audioDestinationNode.connect(audioNodeOrAudioParam);
                });

                it('should throw an IndexSizeError if the output is out-of-bound', () => {
                    expect(() => audioDestinationNode.connect(audioNodeOrAudioParam, -1))
                        .to.throw(DOMException)
                        .to.include({ code: 1, name: 'IndexSizeError' });
                });

                if (type === 'AudioNode') {
                    it('should throw an IndexSizeError if the input is out-of-bound', () => {
                        expect(() => audioDestinationNode.connect(audioNodeOrAudioParam, 0, -1))
                            .to.throw(DOMException)
                            .to.include({ code: 1, name: 'IndexSizeError' });
                    });

                    it('should not throw an error if the connection creates a cycle by connecting to the source', () => {
                        audioNodeOrAudioParam.connect(audioDestinationNode).connect(audioNodeOrAudioParam);
                    });

                    it('should not throw an error if the connection creates a cycle by connecting to an AudioParam of the source', () => {
                        audioNodeOrAudioParam.connect(audioDestinationNode).connect(audioNodeOrAudioParam.gain);
                    });
                }
            });

            describe.for(['AudioNode', 'AudioParam'])('with an %s of another context', (type) => {
                let anotherContext;
                let audioNodeOrAudioParam;
                let audioDestinationNode;

                afterEach(() => anotherContext.close?.());

                beforeEach(() => {
                    anotherContext = createContext();

                    const gainNode = new GainNode(anotherContext);

                    audioDestinationNode = context.destination;
                    audioNodeOrAudioParam = type === 'AudioNode' ? gainNode : gainNode.gain;
                });

                it('should throw an InvalidAccessError', () => {
                    expect(() => audioDestinationNode.connect(audioNodeOrAudioParam))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });

            describe.for(['AudioNode', 'AudioParam'])('with an %s of a native context', (type) => {
                let audioDestinationNode;
                let nativeAudioNodeOrAudioParam;
                let nativeContext;

                afterEach(() => nativeContext.close?.());

                beforeEach(() => {
                    audioDestinationNode = context.destination;
                    nativeContext = description.includes('Offline') ? createNativeOfflineAudioContext() : createNativeAudioContext();

                    const nativeGainNode = nativeContext.createGain();

                    nativeAudioNodeOrAudioParam = type === 'AudioNode' ? nativeGainNode : nativeGainNode.gain;
                });

                it('should throw an InvalidAccessError', () => {
                    expect(() => audioDestinationNode.connect(nativeAudioNodeOrAudioParam))
                        .to.throw(DOMException)
                        .to.include({ code: 15, name: 'InvalidAccessError' });
                });
            });

            describe('with a cycle', () => {
                let renderer;

                beforeEach(() => {
                    renderer = createRenderer({
                        context,
                        length: context.length === undefined ? 5 : undefined,
                        setup(destination) {
                            const constantSourceNode = new ConstantSourceNode(context);
                            const gainNode = new GainNode(context);

                            constantSourceNode.connect(destination);

                            destination.connect(gainNode).connect(destination);

                            return { constantSourceNode, gainNode };
                        }
                    });
                });

                it('should render silence', () => {
                    return renderer({
                        start(startTime, { constantSourceNode }) {
                            constantSourceNode.start(startTime);
                        }
                    }).then((channelData) => {
                        expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 0]);
                    });
                });
            });
        });
    });
});
