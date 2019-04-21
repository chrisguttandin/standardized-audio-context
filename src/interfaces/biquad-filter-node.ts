import { TBiquadFilterType } from '../types';
import { IAudioNode } from './audio-node';
import { IAudioParam } from './audio-param';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IBiquadFilterNode<T extends IMinimalBaseAudioContext> extends IAudioNode<T> {

    readonly detune: IAudioParam;

    readonly frequency: IAudioParam;

    readonly gain: IAudioParam;

    readonly Q: IAudioParam;

    type: TBiquadFilterType;

    getFrequencyResponse (frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array): void;

}
