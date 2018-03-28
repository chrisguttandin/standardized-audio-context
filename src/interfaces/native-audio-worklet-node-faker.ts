import { TNativeAudioNode } from '../types';
import { INativeAudioWorkletNode } from './native-audio-worklet-node';

// @todo This does kind of implement the INativeAudioNodeFaker interface.
export interface INativeAudioWorkletNodeFaker extends INativeAudioWorkletNode {

    bufferSize: number;

    inputs: TNativeAudioNode[];

}
