import { TChannelCountMode, TChannelInterpretation } from '../types';

export interface IAudioNodeOptions {

    channelCount: number;

    channelCountMode: TChannelCountMode;

    channelInterpretation: TChannelInterpretation;

    numberOfInputs: number;

    numberOfOutputs: number;

}
