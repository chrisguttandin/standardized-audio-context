import { IBaseAudioContext } from './base-audio-context';
import { IMinimalOfflineAudioContext } from './minimal-offline-audio-context';

export interface IOfflineAudioContext extends IBaseAudioContext, IMinimalOfflineAudioContext {

    // @todo oncomplete

}
