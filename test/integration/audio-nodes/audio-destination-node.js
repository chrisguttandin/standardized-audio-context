import { ConstantSourceNode, GainNode } from '../../../src/module';
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

if (typeof window !== 'undefined') {
    describe('AudioDestinationNode', () => {
        for (const [description, createContext] of Object.entries(testCases)) {
            describe(`with the ${description}`, () => {
                let context;

                afterEach(() => context.close?.());

                beforeEach(() => (context = createContext()));

                describe('channelCount', () => {
                    let audioDestinationNode;

                    beforeEach(() => {
                        audioDestinationNode = context.destination;
                    });

                    if (description.includes('Offline')) {
                        it('should not be assignable to another value', (done) => {
                            try {
                                audioDestinationNode.channelCount = 2;
                            } catch (err) {
                                expect(err.code).to.equal(11);
                                expect(err.name).to.equal('InvalidStateError');

                                done();
                            }
                        });
                    } else {
                        it('should be assignable to a value smaller than or equal to the maxChannelCount', () => {
                            const channelCount = 1;

                            audioDestinationNode.channelCount = channelCount;

                            expect(audioDestinationNode.channelCount).to.equal(channelCount);
                        });

                        it('should not be assignable to a value larger than the maxChannelCount', (done) => {
                            const channelCount = audioDestinationNode.maxChannelCount + 1;

                            try {
                                audioDestinationNode.channelCount = channelCount;
                            } catch (err) {
                                expect(err.code).to.equal(1);
                                expect(err.name).to.equal('IndexSizeError');

                                done();
                            }
                        });
                    }
                });

                describe('channelCountMode', () => {
                    let audioDestinationNode;

                    beforeEach(() => {
                        audioDestinationNode = context.destination;
                    });

                    if (description.includes('Offline')) {
                        it('should not be assignable to another value', (done) => {
                            try {
                                audioDestinationNode.channelCountMode = 'max';
                            } catch (err) {
                                expect(err.code).to.equal(11);
                                expect(err.name).to.equal('InvalidStateError');

                                done();
                            }
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
                    for (const type of ['AudioNode', 'AudioParam']) {
                        describe(`with an ${type}`, () => {
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

                            it('should throw an IndexSizeError if the output is out-of-bound', (done) => {
                                try {
                                    audioDestinationNode.connect(audioNodeOrAudioParam, -1);
                                } catch (err) {
                                    expect(err.code).to.equal(1);
                                    expect(err.name).to.equal('IndexSizeError');

                                    done();
                                }
                            });

                            if (type === 'AudioNode') {
                                it('should throw an IndexSizeError if the input is out-of-bound', (done) => {
                                    try {
                                        audioDestinationNode.connect(audioNodeOrAudioParam, 0, -1);
                                    } catch (err) {
                                        expect(err.code).to.equal(1);
                                        expect(err.name).to.equal('IndexSizeError');

                                        done();
                                    }
                                });

                                it('should not throw an error if the connection creates a cycle by connecting to the source', () => {
                                    audioNodeOrAudioParam.connect(audioDestinationNode).connect(audioNodeOrAudioParam);
                                });

                                it('should not throw an error if the connection creates a cycle by connecting to an AudioParam of the source', () => {
                                    audioNodeOrAudioParam.connect(audioDestinationNode).connect(audioNodeOrAudioParam.gain);
                                });
                            }
                        });

                        describe(`with an ${type} of another context`, () => {
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

                            it('should throw an InvalidAccessError', (done) => {
                                try {
                                    audioDestinationNode.connect(audioNodeOrAudioParam);
                                } catch (err) {
                                    expect(err.code).to.equal(15);
                                    expect(err.name).to.equal('InvalidAccessError');

                                    done();
                                }
                            });
                        });

                        describe(`with an ${type} of a native context`, () => {
                            let audioDestinationNode;
                            let nativeAudioNodeOrAudioParam;
                            let nativeContext;

                            afterEach(() => nativeContext.close?.());

                            beforeEach(() => {
                                audioDestinationNode = context.destination;
                                nativeContext = description.includes('Offline')
                                    ? createNativeOfflineAudioContext()
                                    : createNativeAudioContext();

                                const nativeGainNode = nativeContext.createGain();

                                nativeAudioNodeOrAudioParam = type === 'AudioNode' ? nativeGainNode : nativeGainNode.gain;
                            });

                            it('should throw an InvalidAccessError', (done) => {
                                try {
                                    audioDestinationNode.connect(nativeAudioNodeOrAudioParam);
                                } catch (err) {
                                    expect(err.code).to.equal(15);
                                    expect(err.name).to.equal('InvalidAccessError');

                                    done();
                                }
                            });
                        });
                    }

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

                        it('should render silence', function () {
                            this.timeout(10000);

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
        }
    });
}
