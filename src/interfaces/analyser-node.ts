import { IAudioNode } from './audio-node';

export interface IAnalyserNode extends IAudioNode {

    fftSize: number;

    readonly frequencyBinCount: number;

    maxDecibels: number;

    minDecibels: number;

    smoothingTimeConstant: number;

    getByteFrequencyData (array: Uint8Array): void;

    getByteTimeDomainData (array: Uint8Array): void;

    getFloatFrequencyData (array: Float32Array): void;

    getFloatTimeDomainData (array: Float32Array): void;

}
