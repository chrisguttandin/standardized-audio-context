import { TNativeContext } from '../types';
import { IBaseAudioContext } from './base-audio-context';

export interface IBaseAudioContextConstructor {

    new (nativeContext: TNativeContext, numberOfChannels: number): IBaseAudioContext;

}
