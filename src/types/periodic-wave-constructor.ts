import { IPeriodicWave, IPeriodicWaveOptions } from '../interfaces';
import { TContext } from './context';

export type TPeriodicWaveConstructor = new <T extends TContext>(
    context: T,
    options: { imag: IPeriodicWaveOptions['imag']; real: IPeriodicWaveOptions['real'] } & Partial<IPeriodicWaveOptions>
) => IPeriodicWave;
