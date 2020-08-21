import { TNativePeriodicWaveFactoryFactory } from '../types';

export const createNativePeriodicWaveFactory: TNativePeriodicWaveFactoryFactory = (getBackupNativeContext) => {
    return (nativeContext, { disableNormalization, imag, real }) => {
        // Bug #50: Only Edge does currently not allow to create AudioNodes (and other objects) on a closed context yet.
        const backupNativeContext = getBackupNativeContext(nativeContext);

        // Bug #180: Safari does not allow to use ordinary arrays.
        const wrappedImag = new Float32Array(imag);
        const wrappedReal = new Float32Array(real);

        if (backupNativeContext !== null) {
            return backupNativeContext.createPeriodicWave(wrappedReal, wrappedImag, { disableNormalization });
        }

        return nativeContext.createPeriodicWave(wrappedReal, wrappedImag, { disableNormalization });
    };
};
