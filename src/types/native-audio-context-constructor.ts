import { IAudioContextOptions } from '../interfaces';
import { TNativeAudioContext } from './native-audio-context';

export type TNativeAudioContextConstructor = new (options?: IAudioContextOptions) => TNativeAudioContext;
