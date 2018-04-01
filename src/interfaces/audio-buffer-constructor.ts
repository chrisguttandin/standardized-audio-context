import { IAudioBuffer } from './audio-buffer';
import { IAudioBufferOptions } from './audio-buffer-options';

export interface IAudioBufferConstructor {

    new (options: IAudioBufferOptions): IAudioBuffer;

}
