import { TNativeAudioNode } from '../types';
import { IAudioNode } from './audio-node';
import { IAudioNodeConnections } from './audio-node-connections';
import { IAudioParam } from './audio-param';
import { IAudioParamConnections } from './audio-param-connections';

export interface IAudioGraph {

    nodes: WeakMap<IAudioNode | TNativeAudioNode, IAudioNodeConnections>;

    params: WeakMap<IAudioParam, IAudioParamConnections>;

}
