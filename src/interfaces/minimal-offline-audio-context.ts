import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IMinimalOfflineAudioContext extends IMinimalBaseAudioContext {

    readonly length: number;

    startRendering (): Promise<AudioBuffer>;

}
