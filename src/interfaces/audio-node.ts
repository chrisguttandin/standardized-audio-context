import { TChannelCountMode, TChannelInterpretation } from '../types';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IAudioNode extends EventTarget {

    readonly context: IMinimalBaseAudioContext;

    channelCount: number;

    channelCountMode: TChannelCountMode;

    channelInterpretation: TChannelInterpretation;

    readonly numberOfInputs: number;

    readonly numberOfOutputs: number;

    // @todo connect (destination: IAudioParam, output?: number): void;
    connect (destination: IAudioNode, output?: number, input?: number): IAudioNode;

    // @todo Consider all possible variations.
    disconnect (destination?: IAudioNode): void;

}
