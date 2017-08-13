import { TBiquadFilterType } from '../types';
import { IAudioNode } from './audio-node';

export interface IBiquadFilterNode extends IAudioNode {

    readonly detune: AudioParam;

    readonly frequency: AudioParam;

    readonly gain: AudioParam;

    readonly Q: AudioParam;

    type: TBiquadFilterType;

    getFrequencyResponse (frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array): void;

}
