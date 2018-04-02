import {
    IAudioWorkletNodeConstructor,
    IAudioWorkletNodeRendererConstructor,
    INativeAudioWorkletNodeConstructor,
    INoneAudioDestinationNodeConstructor
} from '../interfaces';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';

export type TAudioWorkletNodeConstructorFactory = (
    audioWorkletNodeRendererConstructor: IAudioWorkletNodeRendererConstructor,
    isNativeOfflineAudioContextFunction: TIsNativeOfflineAudioContextFunction,
    nativeAudioWorkletNodeConstructor: null | INativeAudioWorkletNodeConstructor,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IAudioWorkletNodeConstructor;
