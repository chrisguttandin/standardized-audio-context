import { TActiveInputConnection, TInternalStateEventListener } from '../types';
import { IAudioNode } from './audio-node';
import { IAudioParamRenderer } from './audio-param-renderer';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';
import { IMinimalOfflineAudioContext } from './minimal-offline-audio-context';

export interface IAudioParamConnections<T extends IMinimalBaseAudioContext> {

    activeInputs: Set<TActiveInputConnection<T>>;

    passiveInputs: WeakMap<IAudioNode<T>, Set<[ number, null | TInternalStateEventListener ]>>;

    renderer: T extends IMinimalOfflineAudioContext ? IAudioParamRenderer : null;

}
