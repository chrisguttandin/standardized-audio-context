import { IAudioNode } from './audio-node';
import { IAudioScheduledSourceNodeEventMap } from './audio-scheduled-source-node-event-map';
import { IEndedEventHandler } from './ended-event-handler';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IAudioScheduledSourceNode<T extends IMinimalBaseAudioContext> extends IAudioNode<T> {

    onended: null | IEndedEventHandler<T, this>;

    addEventListener<K extends keyof IAudioScheduledSourceNodeEventMap> (
        type: K,
        listener: (this: IAudioScheduledSourceNode<T>, event: IAudioScheduledSourceNodeEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;

    addEventListener (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

    removeEventListener<K extends keyof IAudioScheduledSourceNodeEventMap> (
        type: K,
        listener: (this: IAudioScheduledSourceNode<T>, event: IAudioScheduledSourceNodeEventMap[K]) => any,
        options?: boolean | EventListenerOptions
    ): void;

    removeEventListener (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;

    start (when?: number): void;

    stop (when?: number): void;

}
