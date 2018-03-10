import { TChannelCountMode, TChannelInterpretation } from '../types';
import { IAudioParam } from './audio-param';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IAudioNode extends EventTarget {

    readonly context: IMinimalBaseAudioContext;

    channelCount: number;

    channelCountMode: TChannelCountMode;

    channelInterpretation: TChannelInterpretation;

    readonly numberOfInputs: number;

    readonly numberOfOutputs: number;

    connect (destinationNode: IAudioNode, output?: number, input?: number): IAudioNode;
    connect (destinationParam: IAudioParam, output?: number): void;

    // @todo Consider all possible variations.
    disconnect (destination?: IAudioNode): void;

}
