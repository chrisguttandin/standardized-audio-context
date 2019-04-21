import { IAudioNode } from './audio-node';
import { IEndedEventHandler } from './ended-event-handler';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IAudioScheduledSourceNode<T extends IMinimalBaseAudioContext> extends IAudioNode<T> {

    onended: null | IEndedEventHandler<T, this>;

    start (when?: number): void;

    stop (when?: number): void;

}
