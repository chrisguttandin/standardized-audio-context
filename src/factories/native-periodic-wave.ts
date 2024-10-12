import { TNativePeriodicWaveFactory } from '../types';

export const createNativePeriodicWave: TNativePeriodicWaveFactory = (nativeContext, { disableNormalization, imag, real }) =>
    nativeContext.createPeriodicWave(<number[]>real, <number[]>imag, { disableNormalization });
