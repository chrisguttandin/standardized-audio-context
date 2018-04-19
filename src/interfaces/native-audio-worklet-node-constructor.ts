import { TNativeAudioContext, TNativeAudioWorkletNodeOptions, TNativeOfflineAudioContext } from '../types';
import { INativeAudioWorkletNode } from './native-audio-worklet-node';

export interface INativeAudioWorkletNodeConstructor {

    new (
        context: TNativeAudioContext | TNativeOfflineAudioContext,
        name: string,
        options?: Partial<TNativeAudioWorkletNodeOptions>
    ): INativeAudioWorkletNode;

}
