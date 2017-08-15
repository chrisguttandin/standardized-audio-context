import { IAudioNode } from './audio-node';

export interface IIIRFilterNode extends IAudioNode {

    getFrequencyResponse (frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array): void;

}
