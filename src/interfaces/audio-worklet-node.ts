import { TAudioParamMap, TAudioWorkletProcessorState, TProcessorStateChangeEventHandler } from '../types';
import { IAudioNode } from './audio-node';

export interface IAudioWorkletNode extends IAudioNode {

    onprocessorstatechange: null | TProcessorStateChangeEventHandler;

    readonly parameters: TAudioParamMap;

    readonly port: MessagePort;

    readonly processorState: TAudioWorkletProcessorState;

}
