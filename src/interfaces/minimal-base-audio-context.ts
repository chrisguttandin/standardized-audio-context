import { TAudioContextState, TContext, TEventHandler, TNativeEventTarget } from '../types';
import { IAudioDestinationNode } from './audio-destination-node';
import { IAudioListener } from './audio-listener';
import { IMinimalBaseAudioContextEventMap } from './minimal-base-audio-context-event-map';

export interface IMinimalBaseAudioContext<T extends TContext> extends TNativeEventTarget {
    readonly currentTime: number;

    readonly destination: IAudioDestinationNode<T>;

    readonly listener: IAudioListener;

    onstatechange: null | TEventHandler<T>;

    readonly sampleRate: number;

    readonly state: TAudioContextState;

    addEventListener<K extends keyof IMinimalBaseAudioContextEventMap>(
        type: K,
        listener: (this: this, event: IMinimalBaseAudioContextEventMap[K]) => void,
        options?: boolean | AddEventListenerOptions
    ): void;

    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

    removeEventListener<K extends keyof IMinimalBaseAudioContextEventMap>(
        type: K,
        listener: (this: this, event: IMinimalBaseAudioContextEventMap[K]) => void,
        options?: boolean | EventListenerOptions
    ): void;

    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
