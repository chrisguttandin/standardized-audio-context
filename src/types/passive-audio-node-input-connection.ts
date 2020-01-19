import { IMinimalOfflineAudioContext, IOfflineAudioContext } from '../interfaces';
import { TContext } from './context';
import { TInternalStateEventListener } from './internal-state-event-listener';

export type TPassiveAudioNodeInputConnection<T extends TContext> = [
    number,
    number,
    T extends IMinimalOfflineAudioContext | IOfflineAudioContext ? null : TInternalStateEventListener
];
