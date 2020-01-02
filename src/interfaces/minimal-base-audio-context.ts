import { TAudioContextState, TNativeEventTarget } from '../types';
import { IAudioDestinationNode } from './audio-destination-node';
import { IAudioListener } from './audio-listener';
import { IStateChangeEventHandler } from './state-change-event-handler';

export interface IMinimalBaseAudioContext extends TNativeEventTarget {

    readonly currentTime: number;

    readonly destination: IAudioDestinationNode<this>;

    readonly listener: IAudioListener;

    onstatechange: null | IStateChangeEventHandler<this>;

    readonly sampleRate: number;

    readonly state: TAudioContextState;

}
