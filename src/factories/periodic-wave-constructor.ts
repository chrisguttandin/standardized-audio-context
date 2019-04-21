import { getNativeContext } from '../helpers/get-native-context';
import { IMinimalBaseAudioContext, IPeriodicWave, IPeriodicWaveOptions } from '../interfaces';
import { TPeriodicWaveConstructorFactory } from '../types';

// The DEFAULT_OPTIONS are only of type Partial<IPeriodicWaveOptions> because there are no default values for imag and real.
const DEFAULT_OPTIONS: Partial<IPeriodicWaveOptions> = {
    disableNormalization: false
};

export const createPeriodicWaveConstructor: TPeriodicWaveConstructorFactory = (createNativePeriodicWave) => {

    return class PeriodicWave<T extends IMinimalBaseAudioContext> implements IPeriodicWave {

        constructor (
            context: T,
            options: { imag: IPeriodicWaveOptions['imag']; real: IPeriodicWaveOptions['real'] } & Partial<IPeriodicWaveOptions>
        ) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = <IPeriodicWaveOptions> { ...DEFAULT_OPTIONS, ...options };

            // This does violate all good pratices but it is used here to simplify the handling of periodic waves.
            return createNativePeriodicWave(nativeContext, mergedOptions);
        }

    };

};
