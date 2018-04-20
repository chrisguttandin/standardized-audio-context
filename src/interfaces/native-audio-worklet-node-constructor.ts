import { TNativeAudioWorkletNodeOptions, TNativeContext } from '../types';
import { INativeAudioWorkletNode } from './native-audio-worklet-node';

export interface INativeAudioWorkletNodeConstructor {

    new (nativeContext: TNativeContext, name: string, options?: Partial<TNativeAudioWorkletNodeOptions>): INativeAudioWorkletNode;

}
