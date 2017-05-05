import { IOfflineAudioContext } from './offline-audio-context';

export interface IOfflineAudioContextConstructor {

    new (numberOfChannels: number, length: number, sampleRate: number): IOfflineAudioContext;

}
