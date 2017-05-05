import { IBaseAudioContext } from './base-audio-context';

export interface IOfflineAudioContext extends IBaseAudioContext {

    readonly length: number;

    startRendering(): Promise<AudioBuffer>;

}
