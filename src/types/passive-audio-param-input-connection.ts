import { IMinimalOfflineAudioContext, IOfflineAudioContext } from '../interfaces';
import { TContext } from './context';
import { TInternalStateEventListener } from './internal-state-event-listener';

export type TPassiveAudioParamInputConnection<T extends TContext> = [
    number,
    T extends IMinimalOfflineAudioContext | IOfflineAudioContext ? null : TInternalStateEventListener
];
