import { TUnpatchedAudioContext } from '../types';
import { IAudioContextOptions } from './audio-context-options';

export interface IUnpatchedAudioContextConstructor {

    new (options?: IAudioContextOptions): TUnpatchedAudioContext;

}
