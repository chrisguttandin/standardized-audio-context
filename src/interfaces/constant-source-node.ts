import { IAudioParam } from './audio-param';
import { IAudioScheduledSourceNode } from './audio-scheduled-source-node';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IConstantSourceNode<T extends IMinimalBaseAudioContext> extends IAudioScheduledSourceNode<T> {

    readonly offset: IAudioParam;

}
