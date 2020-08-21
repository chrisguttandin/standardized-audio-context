import { IPeriodicWave, IPeriodicWaveOptions } from '../interfaces';
import { TContext, TPeriodicWaveConstructorFactory } from '../types';

const DEFAULT_OPTIONS = {
    disableNormalization: false
} as const;

const createZeroFilledCopy = (array: number[]): number[] => {
    const copy = array.slice(0);

    copy.fill(0);

    return copy;
};

const sanitizedOptions = (options: { disableNormalization: boolean } & Partial<IPeriodicWaveOptions>): IPeriodicWaveOptions => {
    const { imag, real } = options;

    if (imag === undefined) {
        if (real === undefined) {
            return { ...options, imag: [0, 0], real: [0, 0] };
        }

        return { ...options, imag: createZeroFilledCopy(real), real };
    }

    if (real === undefined) {
        return { ...options, imag, real: createZeroFilledCopy(imag) };
    }

    return { ...options, imag, real };
};

export const createPeriodicWaveConstructor: TPeriodicWaveConstructorFactory = (
    createNativePeriodicWave,
    getNativeContext,
    periodicWaveStore
) => {
    return class PeriodicWave<T extends TContext> implements IPeriodicWave {
        constructor(context: T, options?: Partial<IPeriodicWaveOptions>) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = sanitizedOptions({ ...DEFAULT_OPTIONS, ...options });

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
