import { TChannelCountMode, TChannelInterpretation, TNativeEventTarget } from '../types';
import { IAudioParam } from './audio-param';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IAudioNode<T extends IMinimalBaseAudioContext> extends TNativeEventTarget {

    channelCount: number;

    channelCountMode: TChannelCountMode;

    channelInterpretation: TChannelInterpretation;

    readonly context: T;

    readonly numberOfInputs: number;

    readonly numberOfOutputs: number;

    connect <U extends IAudioNode<T>> (destinationNode: U, output?: number, input?: number): U;
    connect (destinationParam: T, output?: number): void;

    disconnect (output?: number): void;
    disconnect (destinationNode: IAudioNode<T>, output?: number, input?: number): void;
    disconnect (destinationParam: IAudioParam, output?: number): void;

}
