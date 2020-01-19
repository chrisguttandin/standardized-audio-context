import { IAudioNode, IMinimalOfflineAudioContext, IOfflineAudioContext } from '../interfaces';
import { TContext } from './context';
import { TInternalStateEventListener } from './internal-state-event-listener';

export type TActiveInputConnection<T extends TContext> = [
    IAudioNode<T>,
    number,
    T extends IMinimalOfflineAudioContext | IOfflineAudioContext ? null : TInternalStateEventListener
];
