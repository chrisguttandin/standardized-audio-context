import { TNativePeriodicWaveFactoryFactory } from '../types';

export const createNativePeriodicWaveFactory: TNativePeriodicWaveFactoryFactory = (createIndexSizeError, getBackupNativeContext) => {
    return (nativeContext, { disableNormalization, imag, real }) => {
        // Bug #50: Only Edge does currently not allow to create AudioNodes (and other objects) on a closed context yet.
        const backupNativeContext = getBackupNativeContext(nativeContext);

        // Bug #180: Safari does not allow to use ordinary arrays.
        const wrappedImag = new Float32Array(imag);
        const wrappedReal = new Float32Array(real);

        const nativePeriodicWave =
            backupNativeContext === null
                ? nativeContext.createPeriodicWave(wrappedReal, wrappedImag, { disableNormalization })
                : backupNativeContext.createPeriodicWave(wrappedReal, wrappedImag, { disableNormalization });

        // Bug #181: No browser does throw an IndexSizeError so far if the given arrays have less than two values.
        if (imag.length < 2) {
            throw createIndexSizeError();
        }

        return nativePeriodicWave;
    };
};
