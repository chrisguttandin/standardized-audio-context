import { TWindow } from '../types';

export const createNativePeriodicWaveConstructor = (window: null | TWindow) => {
    if (window !== null && 'PeriodicWave' in window) {
        return window.PeriodicWave;
    }

    return null;
};
