import { TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';
import { IBaseAudioContext } from './base-audio-context';

export interface IBaseAudioContextConstructor {

    new (context: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext, numberOfChannels: number): IBaseAudioContext;

}
