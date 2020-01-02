import { TAudioContextState, TNativeEventTarget } from '../types';
import { IAudioDestinationNode } from './audio-destination-node';
import { IAudioListener } from './audio-listener';
import { IMinimalBaseAudioContextEventMap } from './minimal-base-audio-context-event-map';
import { IStateChangeEventHandler } from './state-change-event-handler';

export interface IMinimalBaseAudioContext extends TNativeEventTarget {

    readonly currentTime: number;

    readonly destination: IAudioDestinationNode<this>;

    readonly listener: IAudioListener;

    onstatechange: null | IStateChangeEventHandler<this>;

    readonly sampleRate: number;

    readonly state: TAudioContextState;

    addEventListener<K extends keyof IMinimalBaseAudioContextEventMap> (
        type: K,
        listener: (this: IMinimalBaseAudioContext, event: IMinimalBaseAudioContextEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;

    addEventListener (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

    removeEventListener<K extends keyof IMinimalBaseAudioContextEventMap> (
        type: K,
        listener: (this: IMinimalBaseAudioContext, event: IMinimalBaseAudioContextEventMap[K]) => any,
        options?: boolean | EventListenerOptions
    ): void;

    removeEventListener (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;

}
