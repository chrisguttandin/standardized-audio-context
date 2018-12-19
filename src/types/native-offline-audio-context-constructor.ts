import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TNativeOfflineAudioContextConstructor = new (
    numberOfChannels: number,
    length: number,
    sampleRate: number
) => TNativeOfflineAudioContext;
