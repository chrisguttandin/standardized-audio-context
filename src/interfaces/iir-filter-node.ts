import { IAudioNode } from './audio-node';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IIIRFilterNode<T extends IMinimalBaseAudioContext> extends IAudioNode<T> {

    getFrequencyResponse (frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array): void;

}
