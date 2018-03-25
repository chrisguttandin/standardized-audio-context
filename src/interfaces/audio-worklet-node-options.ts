import { IAudioNodeOptions } from './audio-node-options';

export interface IAudioWorkletNodeOptions extends IAudioNodeOptions {

    numberOfInputs: number;

    numberOfOutputs: number;

    outputChannelCount: undefined | number[];

    parameterData: { [ name: string ]: number };

    processorOptions: null | object;

}
