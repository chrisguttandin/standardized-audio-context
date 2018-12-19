import { IAudioBufferOptions } from '../interfaces';
import { TNativeAudioBuffer } from './native-audio-buffer';

export type TNativeAudioBufferConstructor = new (options?: IAudioBufferOptions) => TNativeAudioBuffer;
