import {
    IAudioWorkletNodeConstructor,
    IAudioWorkletNodeRendererConstructor,
    INativeAudioWorkletNodeConstructor,
    INoneAudioDestinationNodeConstructor
} from '../interfaces';
import { TAudioParamFactory } from './audio-param-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';

export type TAudioWorkletNodeConstructorFactory = (
    audioWorkletNodeRendererConstructor: IAudioWorkletNodeRendererConstructor,
    createAudioParam: TAudioParamFactory,
    isNativeOfflineAudioContextFunction: TIsNativeOfflineAudioContextFunction,
    nativeAudioWorkletNodeConstructor: null | INativeAudioWorkletNodeConstructor,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IAudioWorkletNodeConstructor;
