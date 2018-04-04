import { IAudioContext } from './audio-context';
import { IAudioContextOptions } from './audio-context-options';

export interface IAudioContextConstructor {

    new (options?: IAudioContextOptions): IAudioContext;

}
