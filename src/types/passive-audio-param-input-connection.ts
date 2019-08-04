import { IMinimalBaseAudioContext, IMinimalOfflineAudioContext } from '../interfaces';
import { TInternalStateEventListener } from './internal-state-event-listener';

export type TPassiveAudioParamInputConnection<T extends IMinimalBaseAudioContext> = [
    number,
    T extends IMinimalOfflineAudioContext ? null : TInternalStateEventListener
];
