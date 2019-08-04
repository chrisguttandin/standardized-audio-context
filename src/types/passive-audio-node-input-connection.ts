import { IMinimalBaseAudioContext, IMinimalOfflineAudioContext } from '../interfaces';
import { TInternalStateEventListener } from './internal-state-event-listener';

export type TPassiveAudioNodeInputConnection<T extends IMinimalBaseAudioContext> = [
    number,
    number,
    T extends IMinimalOfflineAudioContext ? null : TInternalStateEventListener
];
