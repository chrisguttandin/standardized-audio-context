import { IAudioNode } from './audio-node';
import { IAudioNodeRenderer } from './audio-node-renderer';
import { IAudioParam } from './audio-param';

export interface IAudioNodeConnections {

    inputs: Set<[ IAudioNode, number ]>[];

    outputs: Set<[ IAudioNode, number, number ] | [ IAudioParam, number ]>;

    renderer: null | IAudioNodeRenderer;

}
