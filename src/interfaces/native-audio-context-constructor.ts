import { TNativeAudioContext } from '../types';
import { IAudioContextOptions } from './audio-context-options';

export interface INativeAudioContextConstructor {

    new (options?: IAudioContextOptions): TNativeAudioContext;

}
