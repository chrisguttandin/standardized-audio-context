import { TNativeAudioNode } from '../types';

export interface INativeAudioNodeFaker extends TNativeAudioNode {

    bufferSize?: number;

    input?: TNativeAudioNode;

}
