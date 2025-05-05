import { IAudioTimestamp } from '../interfaces';

export type TNativeAudioTimestamp = AudioTimestamp extends Partial<IAudioTimestamp> ? Required<AudioTimestamp> : never;
