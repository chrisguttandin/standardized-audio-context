import { PeriodicWave } from '../../src/module';
import { createAudioContext } from '../helper/create-audio-context';
import { createMinimalAudioContext } from '../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../helper/create-minimal-offline-audio-context';
import { createOfflineAudioContext } from '../helper/create-offline-audio-context';

const createPeriodicWaveWithConstructor = (context, options) => {
    return new PeriodicWave(context, options);
};
const createPeriodicWaveWithFactoryFunction = (context, options) => {
    return options.disableNormalization === undefined
        ? context.createPeriodicWave(options.real, options.imag)
        : context.createPeriodicWave(options.real, options.imag, { disableNormalization: options.disableNormalization });
};
const testCases = {
    'constructor of a MinimalAudioContext': {
        createContext: createMinimalAudioContext,
        createPeriodicWave: createPeriodicWaveWithConstructor
    },
    'constructor of a MinimalOfflineAudioContext': {
        createContext: createMinimalOfflineAudioContext,
        createPeriodicWave: createPeriodicWaveWithConstructor
    },
    'constructor of an AudioContext': {
        createContext: createAudioContext,
        createPeriodicWave: createPeriodicWaveWithConstructor
    },
    'constructor of an OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createPeriodicWave: createPeriodicWaveWithConstructor
    },
    'factory function of an AudioContext': {
        createContext: createAudioContext,
        createPeriodicWave: createPeriodicWaveWithFactoryFunction
    },
    'factory function of an OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        createPeriodicWave: createPeriodicWaveWithFactoryFunction
    }
};

if (typeof window !== 'undefined') {
    describe('PeriodicWave', () => {
        for (const [description, { createPeriodicWave, createContext }] of Object.entries(testCases)) {
            describe(`with the ${description}`, () => {
                let context;

                afterEach(() => context.close?.());

                beforeEach(() => (context = createContext()));

                describe('constructor()', () => {
                    for (const audioContextState of ['closed', 'running']) {
                        describe(`with an audioContextState of "${audioContextState}"`, () => {
                            afterEach(() => {
                                if (audioContextState === 'closed') {
                                    context.close = undefined;
                                }
                            });

                            beforeEach(() => {
                                if (audioContextState === 'closed') {
                                    return context.close?.() ?? context.startRendering?.();
                                }
                            });

                            if (description.includes('constructor')) {
                                describe('without any options', () => {
                                    it('should return an instance of the PeriodicWave constructor', () => {
                                        const periodicWave = createPeriodicWave(context);

                                        expect(periodicWave).to.be.an.instanceOf(PeriodicWave);
                                    });
                                });
                            }

                            describe('with valid options', () => {
                                for (const withDisableNormalization of [true, false]) {
                                    describe(`${withDisableNormalization ? 'with' : 'without'} disableNormalization specified`, () => {
                                        it('should return an instance of the PeriodicWave constructor', () => {
                                            const options = { imag: [1, 1], real: [1, 1] };
                                            const periodicWave = createPeriodicWave(
                                                context,
                                                withDisableNormalization ? { ...options, disableNormalization: true } : options
                                            );

                                            expect(periodicWave).to.be.an.instanceOf(PeriodicWave);
                                        });
                                    });

                                    if (description.includes('constructor')) {
                                        describe('without an imag property', () => {
                                            it('should return an implementation of the PeriodicWave interface', () => {
                                                const options = { real: [1, 1] };
                                                const periodicWave = createPeriodicWave(
                                                    context,
                                                    withDisableNormalization ? { ...options, disableNormalization: true } : options
                                                );

                                                expect(periodicWave).to.be.an.instanceOf(PeriodicWave);
                                            });
                                        });

                                        describe('without a real property', () => {
                                            it('should return an implementation of the PeriodicWave interface', () => {
                                                const options = { imag: [1, 1] };
                                                const periodicWave = createPeriodicWave(
                                                    context,
                                                    withDisableNormalization ? { ...options, disableNormalization: true } : options
                                                );

                                                expect(periodicWave).to.be.an.instanceOf(PeriodicWave);
                                            });
                                        });
                                    }
                                }
                            });

                            describe('with invalid options', () => {
                                describe('with an imag and real property with a different length', () => {
                                    it('should throw an IndexSizeError', (done) => {
                                        try {
                                            createPeriodicWave(context, { imag: [1, 2, 3], real: [1, 2, 3, 4, 5] });
                                        } catch (err) {
                                            expect(err.code).to.equal(1);
                                            expect(err.name).to.equal('IndexSizeError');

                                            done();
                                        }
                                    });
                                });

                                describe('with an imag and real property with a length of 1', () => {
                                    it('should throw an IndexSizeError', (done) => {
                                        try {
                                            createPeriodicWave(context, { imag: [1], real: [1] });
                                        } catch (err) {
                                            expect(err.code).to.equal(1);
                                            expect(err.name).to.equal('IndexSizeError');

                                            done();
                                        }
                                    });
                                });

                                if (description.includes('constructor')) {
                                    describe('with an imag property of only one value', () => {
                                        it('should throw an IndexSizeError', (done) => {
                                            try {
                                                createPeriodicWave(context, { imag: [1] });
                                            } catch (err) {
                                                expect(err.code).to.equal(1);
                                                expect(err.name).to.equal('IndexSizeError');

                                                done();
                                            }
                                        });
                                    });

                                    describe('with a real property of only one value', () => {
                                        it('should throw an IndexSizeError', (done) => {
                                            try {
                                                createPeriodicWave(context, { real: [1] });
                                            } catch (err) {
                                                expect(err.code).to.equal(1);
                                                expect(err.name).to.equal('IndexSizeError');

                                                done();
                                            }
                                        });
                                    });
                                }
                            });
                        });
                    }
                });
            });
        }
    });
}
