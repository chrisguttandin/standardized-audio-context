import { IAudioNode } from './audio-node';

export interface IAudioWorkletNode extends IAudioNode {

    // @todo onprocessorstatechange: EventHandler;

    // @todo readonly parameters: IAudioParamMap;

    readonly port: MessagePort;

    // @todo readonly processorState: TAudioWorkletProcessorState;

}
