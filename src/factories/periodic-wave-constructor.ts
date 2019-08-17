import { getNativeContext } from '../helpers/get-native-context';
import { IMinimalBaseAudioContext, IPeriodicWave, IPeriodicWaveOptions } from '../interfaces';
import { TPeriodicWaveConstructorFactory } from '../types';

const DEFAULT_OPTIONS = {
    disableNormalization: false
} as const;

export const createPeriodicWaveConstructor: TPeriodicWaveConstructorFactory = (createNativePeriodicWave) => {

    return class PeriodicWave<T extends IMinimalBaseAudioContext> implements IPeriodicWave {

        constructor (
            context: T,
            options: { imag: IPeriodicWaveOptions['imag']; real: IPeriodicWaveOptions['real'] } & Partial<IPeriodicWaveOptions>
        ) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

            // This does violate all good pratices but it is used here to simplify the handling of periodic waves.
            return createNativePeriodicWave(nativeContext, mergedOptions);
        }

    };

};
