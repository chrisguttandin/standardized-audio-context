import { TAudioParamFactory } from './audio-param-factory';
import { TAudioWorkletNodeConstructor } from './audio-worklet-node-constructor';
import { TAudioWorkletNodeRendererFactory } from './audio-worklet-node-renderer-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeAudioWorkletNodeConstructor } from './native-audio-worklet-node-constructor';
import { TNativeAudioWorkletNodeFactory } from './native-audio-worklet-node-factory';
import { TNoneAudioDestinationNodeConstructor } from './none-audio-destination-node-constructor';

export type TAudioWorkletNodeConstructorFactory = (
    createAudioParam: TAudioParamFactory,
    createAudioWorkletNodeRenderer: TAudioWorkletNodeRendererFactory,
    createNativeAudioWorkletNode: TNativeAudioWorkletNodeFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    nativeAudioWorkletNodeConstructor: null | TNativeAudioWorkletNodeConstructor,
    noneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructor
) => TAudioWorkletNodeConstructor;
