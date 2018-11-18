import { TNativeAudioWorkletNode, TNativeAudioWorkletNodeOptions, TNativeContext } from '../types';

export interface INativeAudioWorkletNodeConstructor {

    new (nativeContext: TNativeContext, name: string, options?: Partial<TNativeAudioWorkletNodeOptions>): TNativeAudioWorkletNode;

}
