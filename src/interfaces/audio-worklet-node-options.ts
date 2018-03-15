import { IAudioNodeOptions } from './audio-node-options';

export interface IAudioWorkletNodeOptions extends IAudioNodeOptions {

    numberOfInputs: number;

    numberOfOutputs: number;

    // @todo outputChannelCount: sequence<unsigned long>;

    // @todo parameterData: record<DOMString, double>;

    // @todo processorOptions: object;

}
