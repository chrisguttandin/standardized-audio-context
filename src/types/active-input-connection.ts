import { IAudioNode, IMinimalBaseAudioContext } from '../interfaces';
import { TInternalStateEventListener } from '../types';

export type TActiveInputConnection<T extends IMinimalBaseAudioContext> = [ IAudioNode<T>, number, null | TInternalStateEventListener ];
