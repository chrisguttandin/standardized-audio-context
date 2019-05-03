import { IAudioNode } from './audio-node';
import { IAudioNodeConnections } from './audio-node-connections';
import { IAudioParam } from './audio-param';
import { IAudioParamConnections } from './audio-param-connections';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IAudioGraph<T extends IMinimalBaseAudioContext> {

    nodes: WeakMap<IAudioNode<T>, Readonly<IAudioNodeConnections<T>>>;

    params: WeakMap<IAudioParam, Readonly<IAudioParamConnections<T>>>;

}
