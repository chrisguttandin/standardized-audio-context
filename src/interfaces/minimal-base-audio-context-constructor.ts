import { TNativeContext } from '../types';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IMinimalBaseAudioContextConstructor {

    new (nativeContext: TNativeContext, numberOfChannels: number): IMinimalBaseAudioContext;

}
