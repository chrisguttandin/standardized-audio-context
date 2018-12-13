import { IAudioNodeRenderer } from './audio-node-renderer';
import { IPeriodicWave } from './periodic-wave';

export interface IOscillatorNodeRenderer extends IAudioNodeRenderer {

    periodicWave: null | IPeriodicWave;

    start: number;

    stop: number;

}
