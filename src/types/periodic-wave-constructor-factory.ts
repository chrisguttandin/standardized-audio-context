import { TNativePeriodicWaveFactory } from './native-periodic-wave-factory';
import { TPeriodicWaveConstructor } from './periodic-wave-constructor';
import { TPeriodicWaveStore } from './periodic-wave-store';

export type TPeriodicWaveConstructorFactory = (
    createNativePeriodicWave: TNativePeriodicWaveFactory,
    periodicWaveStore: TPeriodicWaveStore
) => TPeriodicWaveConstructor;
