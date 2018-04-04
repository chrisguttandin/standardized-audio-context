import { TNativeAudioContext, TNativeOfflineAudioContext } from '../types';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IMinimalBaseAudioContextConstructor {

    new (context: TNativeAudioContext | TNativeOfflineAudioContext, numberOfChannels: number): IMinimalBaseAudioContext;

}
