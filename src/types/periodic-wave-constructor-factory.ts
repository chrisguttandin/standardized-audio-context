import { IPeriodicWaveConstructor } from '../interfaces';
import { TNativePeriodicWaveFactory } from './native-periodic-wave-factory';

export type TPeriodicWaveConstructorFactory = (createNativePeriodicWave: TNativePeriodicWaveFactory) => IPeriodicWaveConstructor;
