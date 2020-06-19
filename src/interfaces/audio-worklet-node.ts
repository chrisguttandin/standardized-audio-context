import { TAudioParamMap, TContext, TErrorEventHandler } from '../types';
import { IAudioNode } from './audio-node';
import { IAudioWorkletNodeEventMap } from './audio-worklet-node-event-map';

export interface IAudioWorkletNode<T extends TContext> extends IAudioNode<T> {
    onprocessorerror: null | TErrorEventHandler<this>;

    readonly parameters: TAudioParamMap;

    readonly port: MessagePort;

    addEventListener<K extends keyof IAudioWorkletNodeEventMap>(
        type: K,
        listener: (this: this, event: IAudioWorkletNodeEventMap[K]) => void,
        options?: boolean | AddEventListenerOptions
    ): void;

    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

    removeEventListener<K extends keyof IAudioWorkletNodeEventMap>(
        type: K,
        listener: (this: this, event: IAudioWorkletNodeEventMap[K]) => void,
        options?: boolean | EventListenerOptions
    ): void;

    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
