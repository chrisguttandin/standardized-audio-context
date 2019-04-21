import { IMinimalBaseAudioContext, IPeriodicWave, IPeriodicWaveOptions } from '../interfaces';

export type TPeriodicWaveConstructor = new <T extends IMinimalBaseAudioContext>(
    context: T,
    options: { imag: IPeriodicWaveOptions['imag']; real: IPeriodicWaveOptions['real'] } & Partial<IPeriodicWaveOptions>
) => IPeriodicWave;
