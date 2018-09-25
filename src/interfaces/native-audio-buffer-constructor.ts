import { TNativeAudioBuffer } from '../types';
import { IAudioBufferOptions } from './audio-buffer-options';

export interface INativeAudioBufferConstructor {

    new (options?: IAudioBufferOptions): TNativeAudioBuffer;

}
