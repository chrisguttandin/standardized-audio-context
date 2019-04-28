import { TInternalStateEventListener } from '../types';
import { IAudioNode } from './audio-node';
import { IAudioParamRenderer } from './audio-param-renderer';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';
import { IMinimalOfflineAudioContext } from './minimal-offline-audio-context';

export interface IAudioParamConnections<T extends IMinimalBaseAudioContext> {

    inputs: Set<[ symbol | IAudioNode<T>, null | TInternalStateEventListener, number ]>;

    renderer: T extends IMinimalOfflineAudioContext ? IAudioParamRenderer : null;

}
