import { IAudioNode, IAudioNodeRenderer, IMinimalBaseAudioContext, IMinimalOfflineAudioContext } from '../interfaces';

export type TAudioNodeRenderer<T extends IMinimalBaseAudioContext, U extends IAudioNode<T> = IAudioNode<T>> =
    T extends IMinimalOfflineAudioContext ? IAudioNodeRenderer<T, U> : null;
