import { TNativeAudioBuffer } from './native-audio-buffer';

export type TGetFirstSampleFunction = (audioBuffer: TNativeAudioBuffer, buffer: Float32Array<ArrayBuffer>, channelNumber: number) => number;
