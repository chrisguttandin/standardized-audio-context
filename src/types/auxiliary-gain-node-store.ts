import { TNativeAudioWorkletNode } from './native-audio-worklet-node';
import { TNativeGainNode } from './native-gain-node';

export type TAuxiliaryGainNodeStore = WeakMap<TNativeAudioWorkletNode, Map<number, TNativeGainNode>>;
