import { TNativeAudioWorkletNode } from './native-audio-worklet-node';
import { TNativeAudioWorkletNodeOptions } from './native-audio-worklet-node-options';
import { TNativeContext } from './native-context';

export type TNativeAudioWorkletNodeConstructor = new (
    nativeContext: TNativeContext,
    name: string,
    options?: Partial<TNativeAudioWorkletNodeOptions>
) => TNativeAudioWorkletNode;
