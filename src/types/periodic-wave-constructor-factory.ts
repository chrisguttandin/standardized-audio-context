import { TNativePeriodicWaveFactory } from './native-periodic-wave-factory';
import { TPeriodicWaveConstructor } from './periodic-wave-constructor';

export type TPeriodicWaveConstructorFactory = (createNativePeriodicWave: TNativePeriodicWaveFactory) => TPeriodicWaveConstructor;
