import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeOfflineAudioContextConstructor } from './native-offline-audio-context-constructor';

export type TIsNativeOfflineAudioContextFactory = (
    nativeAudioWorkletNodeConstructor: null | TNativeOfflineAudioContextConstructor
) => TIsNativeOfflineAudioContextFunction;
