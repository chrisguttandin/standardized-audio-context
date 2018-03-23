import { TAudioParamMap, TProcessorErrorEventHandler } from '../types';
import { IAudioNode } from './audio-node';

export interface IAudioWorkletNode extends IAudioNode {

    onprocessorerror: null | TProcessorErrorEventHandler;

    readonly parameters: TAudioParamMap;

    readonly port: MessagePort;

}
