import { TNativeAudioNode, TNativeIIRFilterNode } from '../types';
import { INativeAudioNodeFaker } from './native-audio-node-faker';

export interface INativeIIRFilterNodeFaker extends INativeAudioNodeFaker, TNativeIIRFilterNode {

    bufferSize: number;

    inputs: TNativeAudioNode[];

}
