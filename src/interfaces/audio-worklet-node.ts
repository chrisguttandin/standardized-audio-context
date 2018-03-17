import { TAudioWorkletProcessorState, TProcessorStateChangeEventHandler } from '../types';
import { IAudioNode } from './audio-node';
import { IAudioParamMap } from './audio-param-map';

export interface IAudioWorkletNode extends IAudioNode {

    onprocessorstatechange: null | TProcessorStateChangeEventHandler;

    readonly parameters: IAudioParamMap;

    readonly port: MessagePort;

    readonly processorState: TAudioWorkletProcessorState;

}
