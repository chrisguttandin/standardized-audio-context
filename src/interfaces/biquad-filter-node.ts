import { TBiquadFilterType } from '../types';
import { IAudioNode } from './audio-node';
import { IAudioParam } from './audio-param';

export interface IBiquadFilterNode extends IAudioNode {

    readonly detune: IAudioParam;

    readonly frequency: IAudioParam;

    readonly gain: IAudioParam;

    readonly Q: IAudioParam;

    type: TBiquadFilterType;

    getFrequencyResponse (frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array): void;

}
