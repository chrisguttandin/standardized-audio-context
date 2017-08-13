import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IMinimalAudioContext extends IMinimalBaseAudioContext {

    close(): Promise<void>;

}
