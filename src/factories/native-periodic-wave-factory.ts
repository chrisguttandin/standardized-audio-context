import { TNativePeriodicWaveFactoryFactory } from '../types';

export const createNativePeriodicWaveFactory: TNativePeriodicWaveFactoryFactory = (createIndexSizeError) => {
    return (nativeContext, { disableNormalization, imag, real }) => {
        const nativePeriodicWave = nativeContext.createPeriodicWave(<number[]>real, <number[]>imag, { disableNormalization });

        // Bug #181: Firefox throws no IndexSizeError so far if the given arrays have less than two values.
        if (Array.from(imag).length < 2) {
            throw createIndexSizeError();
        }

        return nativePeriodicWave;
    };
};
