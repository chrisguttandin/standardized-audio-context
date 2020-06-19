import { IPeriodicWaveConstraints } from './periodic-wave-constraints';

export interface IPeriodicWaveOptions extends IPeriodicWaveConstraints {
    imag: number[];

    real: number[];
}
