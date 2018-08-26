import { TChannelCountMode, TChannelInterpretation, TContext } from '../types';
import { IAudioParam } from './audio-param';

export interface IAudioNode extends EventTarget {

    channelCount: number;

    channelCountMode: TChannelCountMode;

    channelInterpretation: TChannelInterpretation;

    readonly context: TContext;

    readonly numberOfInputs: number;

    readonly numberOfOutputs: number;

    connect (destinationNode: IAudioNode, output?: number, input?: number): IAudioNode;
    connect (destinationParam: IAudioParam, output?: number): void;

    // @todo Consider all possible variations.
    disconnect (destination?: IAudioNode): void;

}
