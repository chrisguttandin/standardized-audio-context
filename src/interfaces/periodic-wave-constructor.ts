import { TContext } from '../types';
import { IPeriodicWave } from './periodic-wave';
import { IPeriodicWaveOptions } from './periodic-wave-options';

export interface IPeriodicWaveConstructor {

    new (
        context: TContext,
        options: { imag: IPeriodicWaveOptions['imag']; real: IPeriodicWaveOptions['real'] } & Partial<IPeriodicWaveOptions>
    ): IPeriodicWave;

}
