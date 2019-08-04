import { TActiveInputConnection, TOutputConnection, TPassiveAudioNodeInputConnection } from '../types';
import { IAudioNode } from './audio-node';
import { IAudioNodeRenderer } from './audio-node-renderer';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';
import { IMinimalOfflineAudioContext } from './minimal-offline-audio-context';

export interface IAudioNodeConnections<T extends IMinimalBaseAudioContext> {

    activeInputs: Set<TActiveInputConnection<T>>[];

    outputs: Set<TOutputConnection<T>>;

    passiveInputs: WeakMap<IAudioNode<T>, Set<TPassiveAudioNodeInputConnection<T>>>;

    renderer: T extends IMinimalOfflineAudioContext ? IAudioNodeRenderer<T, IAudioNode<T>> : null;

}
