import { TOscillatorType } from '../types';
import { IAudioNodeOptions } from './audio-node-options';

export interface IOscillatorOptions extends IAudioNodeOptions {

    detune: number;

    frequency: number;

    periodicWave?: PeriodicWave; // @todo Define a new interface.

    type: TOscillatorType;

}
