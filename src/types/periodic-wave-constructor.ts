import { IPeriodicWave, IPeriodicWaveOptions } from '../interfaces';
import { TContext } from './context';

export type TPeriodicWaveConstructor = new (
    context: TContext,
    options: { imag: IPeriodicWaveOptions['imag']; real: IPeriodicWaveOptions['real'] } & Partial<IPeriodicWaveOptions>
) => IPeriodicWave;
