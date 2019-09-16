import { IPeriodicWave } from '../interfaces';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TNativePeriodicWaveFactory } from './native-periodic-wave-factory';
import { TPeriodicWaveConstructor } from './periodic-wave-constructor';

export type TPeriodicWaveConstructorFactory = (
    createNativePeriodicWave: TNativePeriodicWaveFactory,
    getNativeContext: TGetNativeContextFunction,
    periodicWaveStore: WeakSet<IPeriodicWave>
) => TPeriodicWaveConstructor;
