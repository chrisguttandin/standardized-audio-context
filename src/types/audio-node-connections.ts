import { IAudioNode, IAudioNodeRenderer, IMinimalBaseAudioContext, IMinimalOfflineAudioContext } from '../interfaces';
import { TActiveInputConnection } from './active-input-connection';
import { TOutputConnection } from './output-connection';
import { TPassiveAudioNodeInputConnection } from './passive-audio-node-input-connection';

export type TAudioNodeConnections<T extends IMinimalBaseAudioContext> = Readonly<{

    activeInputs: Set<TActiveInputConnection<T>>[];

    outputs: Set<TOutputConnection<T>>;

    passiveInputs: WeakMap<IAudioNode<T>, Set<TPassiveAudioNodeInputConnection<T>>>;

    renderer: T extends IMinimalOfflineAudioContext ? IAudioNodeRenderer<T, IAudioNode<T>> : null;

}>;
