import { TNativeOfflineAudioContext } from '../types';

export interface INativeOfflineAudioContextConstructor {

    new (numberOfChannels: number, length: number, sampleRate: number): TNativeOfflineAudioContext;

}
