import { IPeriodicWave, IPeriodicWaveOptions } from '../interfaces';
import { TContext, TPeriodicWaveConstructorFactory } from '../types';

const DEFAULT_OPTIONS = {
    disableNormalization: false
} as const;

export const createPeriodicWaveConstructor: TPeriodicWaveConstructorFactory = (
    createNativePeriodicWave,
    getNativeContext,
    periodicWaveStore
) => {
    return class PeriodicWave<T extends TContext> implements IPeriodicWave {
        constructor(
            context: T,
            options: { imag: IPeriodicWaveOptions['imag']; real: IPeriodicWaveOptions['real'] } & Partial<IPeriodicWaveOptions>
        ) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

            const periodicWave = createNativePeriodicWave(nativeContext, mergedOptions);

            periodicWaveStore.add(periodicWave);

            // This does violate all good pratices but it is used here to simplify the handling of periodic waves.
            return periodicWave;
        }

        public static [Symbol.hasInstance](instance: unknown): boolean {
            return (
                (instance !== null && typeof instance === 'object' && Object.getPrototypeOf(instance) === PeriodicWave.prototype) ||
                periodicWaveStore.has(<any>instance)
            );
        }
    };
};
