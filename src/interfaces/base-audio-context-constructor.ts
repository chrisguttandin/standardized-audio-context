import { TNativeAudioContext, TNativeOfflineAudioContext } from '../types';
import { IBaseAudioContext } from './base-audio-context';

export interface IBaseAudioContextConstructor {

    new (context: TNativeAudioContext | TNativeOfflineAudioContext, numberOfChannels: number): IBaseAudioContext;

}
