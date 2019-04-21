import { IAudioNode } from './audio-node';
import { IAudioParamRenderer } from './audio-param-renderer';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IAudioParamConnections<T extends IMinimalBaseAudioContext> {

    inputs: Set<[ IAudioNode<T>, number ]>;

    renderer: null | IAudioParamRenderer;

}
