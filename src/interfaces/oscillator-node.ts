import { TOscillatorType } from '../types';
import { IAudioScheduledSourceNode } from './audio-scheduled-source-node';

export interface IOscillatorNode extends IAudioScheduledSourceNode {

    readonly detune: AudioParam;

    readonly frequency: AudioParam;

    type: TOscillatorType;

    // @todo setPeriodicWave (periodicWave: PeriodicWave): void;

}
