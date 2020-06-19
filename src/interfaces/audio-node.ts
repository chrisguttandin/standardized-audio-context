import { TChannelCountMode, TChannelInterpretation, TContext, TNativeEventTarget } from '../types';
import { IAudioParam } from './audio-param';

export interface IAudioNode<T extends TContext> extends TNativeEventTarget {
    channelCount: number;

    channelCountMode: TChannelCountMode;

    channelInterpretation: TChannelInterpretation;

    readonly context: T;

    readonly numberOfInputs: number;

    readonly numberOfOutputs: number;

    connect<U extends TContext, V extends IAudioNode<U>>(destinationNode: V, output?: number, input?: number): V;
    connect(destinationParam: IAudioParam, output?: number): void;

    disconnect(output?: number): void;
    disconnect<U extends TContext>(destinationNode: IAudioNode<U>, output?: number, input?: number): void;
    disconnect(destinationParam: IAudioParam, output?: number): void;
}
