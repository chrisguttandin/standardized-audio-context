import {
    IAudioWorkletNodeConstructor,
    IAudioWorkletNodeRendererConstructor,
    INativeAudioWorkletNodeConstructor,
    INoneAudioDestinationNodeConstructor
} from '../interfaces';
import { TAudioParamFactory } from './audio-param-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeAudioWorkletNodeFactory } from './native-audio-worklet-node-factory';

export type TAudioWorkletNodeConstructorFactory = (
    audioWorkletNodeRendererConstructor: IAudioWorkletNodeRendererConstructor,
    createAudioParam: TAudioParamFactory,
    createNativeAudioWorkletNode: TNativeAudioWorkletNodeFactory,
    isNativeOfflineAudioContextFunction: TIsNativeOfflineAudioContextFunction,
    nativeAudioWorkletNodeConstructor: null | INativeAudioWorkletNodeConstructor,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IAudioWorkletNodeConstructor;
