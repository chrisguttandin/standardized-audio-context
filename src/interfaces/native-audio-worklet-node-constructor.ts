import { TNativeAudioWorkletNodeOptions, TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';
import { INativeAudioWorkletNode } from './native-audio-worklet-node';

export interface INativeAudioWorkletNodeConstructor {

    new (
        context: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
        name: string,
        options?: TNativeAudioWorkletNodeOptions
    ): INativeAudioWorkletNode;

}
