import { TNativeAudioNode, TNativeAudioParamMap } from '../types';

// @todo Since there are no native types yet they need to be crafted.
export interface INativeAudioWorkletNode extends TNativeAudioNode {

    onprocessorerror: null | ((this: INativeAudioWorkletNode, event: Event) => any);

    readonly parameters: TNativeAudioParamMap;

    readonly port: MessagePort;

}
