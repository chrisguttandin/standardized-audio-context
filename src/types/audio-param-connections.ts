import { IAudioNode, IAudioParamRenderer, IMinimalBaseAudioContext, IMinimalOfflineAudioContext } from '../interfaces';
import { TActiveInputConnection } from './active-input-connection';
import { TPassiveAudioParamInputConnection } from './passive-audio-param-input-connection';

export type TAudioParamConnections<T extends IMinimalBaseAudioContext> = Readonly<{

    activeInputs: Set<TActiveInputConnection<T>>;

    passiveInputs: WeakMap<IAudioNode<T>, Set<TPassiveAudioParamInputConnection<T>>>;

    renderer: T extends IMinimalOfflineAudioContext ? IAudioParamRenderer : null;

}>;
