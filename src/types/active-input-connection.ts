import { IAudioNode, IMinimalBaseAudioContext, IMinimalOfflineAudioContext } from '../interfaces';
import { TInternalStateEventListener } from '../types';

export type TActiveInputConnection<T extends IMinimalBaseAudioContext> = [
    IAudioNode<T>,
    number,
    T extends IMinimalOfflineAudioContext ? null : TInternalStateEventListener
];
