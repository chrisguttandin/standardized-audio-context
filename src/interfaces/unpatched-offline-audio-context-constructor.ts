import { TUnpatchedOfflineAudioContext } from '../types';

export interface IUnpatchedOfflineAudioContextConstructor {

    new (numberOfChannels: number, length: number, sampleRate: number): TUnpatchedOfflineAudioContext;

}
