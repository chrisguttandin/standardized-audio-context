import { TNativeAudioNode } from '../types';

// @todo Since there are not native types yet they need to be crafted.
export interface INativeAudioWorkletNode extends TNativeAudioNode {

    // @todo onprocessorstatechange: EventHandler;

    // @todo readonly parameters: IAudioParamMap;

    readonly port: MessagePort;

    // @todo readonly processorState: TAudioWorkletProcessorState;

}
