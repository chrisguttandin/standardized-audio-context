import '../helper/play-silence';
import { BACKUP_NATIVE_CONTEXT_STORE } from '../../src/globals';
import { PeriodicWave } from '../../src/module';
import { createAudioContext } from '../helper/create-audio-context';
import { createMinimalAudioContext } from '../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../helper/create-minimal-offline-audio-context';
import { createOfflineAudioContext } from '../helper/create-offline-audio-context';

const createPeriodicWaveWithConstructor = (context, options = null) => {
    if (options === null) {
        return new PeriodicWave(context);
    }

    return new PeriodicWave(context, options);
};
const createPeriodicWaveWithFactoryFunction = (context, options = null) => {
    return (options === null)
        ? context.createPeriodicWave()
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

describe('PeriodicWave', () => {

    for (const [ description, { createPeriodicWave, createContext } ] of Object.entries(testCases)) {

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

                            it('should return an instance of the PeriodicWave interface', () => {
                                createPeriodicWave(context, { imag: [ 1 ], real: [ 1 ] });

                                // The PeriodicWave interface has no methods or properties.
                            });

                        });

                        describe('with valid options', () => {

                            it('should return an instance of the PeriodicWave interface', () => {
                                createPeriodicWave(context, { disableNormalization: true, imag: [ 1 ], real: [ 1 ] });

                                // The PeriodicWave interface has no methods or properties.
                            });

                        });

                        describe('with invalid options', () => {

                            // @todo

                        });

                    });

                }

            });

        });

    }

});
