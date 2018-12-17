import { TAudioContextState, TStateChangeEventHandler } from '../types';
import { IAudioDestinationNode } from './audio-destination-node';
import { IAudioListener } from './audio-listener';

export interface IMinimalBaseAudioContext extends EventTarget {

    readonly currentTime: number;

    readonly destination: IAudioDestinationNode;

    readonly listener: IAudioListener;

    onstatechange: null | TStateChangeEventHandler;

    readonly sampleRate: number;

    readonly state: TAudioContextState;

}
