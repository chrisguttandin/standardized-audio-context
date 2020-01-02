import { IAudioScheduledSourceNode } from './audio-scheduled-source-node';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IEndedEventHandler<T extends IMinimalBaseAudioContext, U extends IAudioScheduledSourceNode<T>> extends ThisType<U> {

    (event: Event): void;

}
