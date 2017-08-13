import { TAudioContextState, TStateChangeEventHandler } from '../types';
import { IAudioDestinationNode } from './audio-destination-node';

export interface IMinimalBaseAudioContext extends EventTarget {

    readonly currentTime: number;

    readonly destination: IAudioDestinationNode;

    onstatechange: null | TStateChangeEventHandler;

    readonly sampleRate: number;

    readonly state: TAudioContextState;

}
