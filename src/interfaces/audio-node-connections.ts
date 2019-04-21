import { IAudioNode } from './audio-node';
import { IAudioNodeRenderer } from './audio-node-renderer';
import { IAudioParam } from './audio-param';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';
import { IMinimalOfflineAudioContext } from './minimal-offline-audio-context';

export interface IAudioNodeConnections<T extends IMinimalBaseAudioContext> {

    inputs: Set<[ IAudioNode<T>, number ]>[];

    outputs: Set<[ IAudioNode<T>, number, number ] | [ IAudioParam, number ]>;

    renderer: T extends IMinimalOfflineAudioContext ? IAudioNodeRenderer<T, IAudioNode<T>> : null;

}
