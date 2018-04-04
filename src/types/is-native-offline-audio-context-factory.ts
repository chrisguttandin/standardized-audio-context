import { INativeOfflineAudioContextConstructor } from '../interfaces';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';

export type TIsNativeOfflineAudioContextFactory = (
    nativeAudioWorkletNodeConstructor: null | INativeOfflineAudioContextConstructor
) => TIsNativeOfflineAudioContextFunction;
