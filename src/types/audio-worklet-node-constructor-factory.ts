import { IAudioWorkletNodeConstructor, INativeAudioWorkletNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TAudioParamFactory } from './audio-param-factory';
import { TAudioWorkletNodeRendererFactory } from './audio-worklet-node-renderer-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeAudioWorkletNodeFactory } from './native-audio-worklet-node-factory';

export type TAudioWorkletNodeConstructorFactory = (
    createAudioParam: TAudioParamFactory,
    createAudioWorkletNodeRenderer: TAudioWorkletNodeRendererFactory,
    createNativeAudioWorkletNode: TNativeAudioWorkletNodeFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    nativeAudioWorkletNodeConstructor: null | INativeAudioWorkletNodeConstructor,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IAudioWorkletNodeConstructor;
