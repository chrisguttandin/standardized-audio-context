import { IAudioNode } from './audio-node';
import { IAudioParamRenderer } from './audio-param-renderer';

export interface IAudioParamConnections {

    inputs: Set<[ IAudioNode, number ]>;

    renderer: null | IAudioParamRenderer;

}
