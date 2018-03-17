import { TNativeAudioNode, TNativeAudioWorkletProcessorState } from '../types';
import { INativeAudioParamMap } from './native-audio-param-map';

// @todo Since there are no native types yet they need to be crafted.
export interface INativeAudioWorkletNode extends TNativeAudioNode {

    onprocessorstatechange: null | ((this: INativeAudioWorkletNode, event: Event) => any);

    readonly parameters: INativeAudioParamMap;

    readonly port: MessagePort;

    readonly processorState: TNativeAudioWorkletProcessorState;

}
