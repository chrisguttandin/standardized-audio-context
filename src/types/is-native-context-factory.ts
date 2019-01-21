import { TIsNativeContextFunction } from './is-native-context-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeAudioContextConstructor } from './native-audio-context-constructor';

export type TIsNativeContextFactory = (
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    nativeAudioContextConstructor: null | TNativeAudioContextConstructor
) => TIsNativeContextFunction;
