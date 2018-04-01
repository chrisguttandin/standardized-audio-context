import { IMinimalOfflineAudioContext } from './minimal-offline-audio-context';
import { IOfflineAudioContextOptions } from './offline-audio-context-options';

export interface IMinimalOfflineAudioContextConstructor {

    new (options: IOfflineAudioContextOptions): IMinimalOfflineAudioContext;

}
