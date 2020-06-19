import { TContext, TEventHandler } from '../types';
import { IAudioNode } from './audio-node';
import { IAudioScheduledSourceNodeEventMap } from './audio-scheduled-source-node-event-map';

export interface IAudioScheduledSourceNode<T extends TContext> extends IAudioNode<T> {
    onended: null | TEventHandler<this>;

    addEventListener<K extends keyof IAudioScheduledSourceNodeEventMap>(
        type: K,
        listener: (this: this, event: IAudioScheduledSourceNodeEventMap[K]) => void,
        options?: boolean | AddEventListenerOptions
    ): void;

    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

    removeEventListener<K extends keyof IAudioScheduledSourceNodeEventMap>(
        type: K,
        listener: (this: this, event: IAudioScheduledSourceNodeEventMap[K]) => void,
        options?: boolean | EventListenerOptions
    ): void;

    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;

    start(when?: number): void;

    stop(when?: number): void;
}
