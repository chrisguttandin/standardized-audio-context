import { TNativeAudioContext } from './native-audio-context';

export type TNativeAudioContextConstructor = new (options?: AudioContextOptions) => TNativeAudioContext;
