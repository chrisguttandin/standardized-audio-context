import { IAudioContextOptions } from './audio-context-options';
import { IMinimalAudioContext } from './minimal-audio-context';

export interface IMinimalAudioContextConstructor {

    new (options?: IAudioContextOptions): IMinimalAudioContext;

}
