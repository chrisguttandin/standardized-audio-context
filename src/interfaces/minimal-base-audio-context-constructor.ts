import { TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IMinimalBaseAudioContextConstructor {

    new (context: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext, numberOfChannels: number): IMinimalBaseAudioContext;

}
