import { TNativeAudioNode } from '../types';
import { INativeAudioNodeFaker } from './native-audio-node-faker';
import { INativeAudioWorkletNode } from './native-audio-worklet-node';

export interface INativeAudioWorkletNodeFaker extends INativeAudioNodeFaker, INativeAudioWorkletNode {

    bufferSize: number;

    input: TNativeAudioNode;

}
