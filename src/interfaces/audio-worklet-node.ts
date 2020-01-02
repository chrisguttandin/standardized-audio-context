import { TAudioParamMap } from '../types';
import { IAudioNode } from './audio-node';
import { IAudioWorkletNodeEventMap } from './audio-worklet-node-event-map';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';
import { IProcessorErrorEventHandler } from './processor-error-event-handler';

export interface IAudioWorkletNode<T extends IMinimalBaseAudioContext> extends IAudioNode<T> {

    onprocessorerror: null | IProcessorErrorEventHandler<T, this>;

    readonly parameters: TAudioParamMap;

    readonly port: MessagePort;

    addEventListener<K extends keyof IAudioWorkletNodeEventMap> (
        type: K,
        listener: (this: IAudioWorkletNode<T>, event: IAudioWorkletNodeEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;

    addEventListener (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

    removeEventListener<K extends keyof IAudioWorkletNodeEventMap> (
        type: K,
        listener: (this: IAudioWorkletNode<T>, event: IAudioWorkletNodeEventMap[K]) => any,
        options?: boolean | EventListenerOptions
    ): void;

    removeEventListener (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;

}
