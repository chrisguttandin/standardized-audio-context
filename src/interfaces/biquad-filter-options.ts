import { TBiquadFilterType } from '../types';
import { IAudioNodeOptions } from './audio-node-options';

export interface IBiquadFilterOptions extends IAudioNodeOptions {

    Q: number;

    detune: number;

    frequency: number;

    gain: number;

    type: TBiquadFilterType;

}
