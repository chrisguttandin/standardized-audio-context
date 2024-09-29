import { TCreateNativeOfflineAudioContextFunction } from './create-native-offline-audio-context-function';
import { TNativeOfflineAudioContextConstructor } from './native-offline-audio-context-constructor';

export type TCreateNativeOfflineAudioContextFactory = (
    nativeOfflineAudioContextConstructor: null | TNativeOfflineAudioContextConstructor
) => TCreateNativeOfflineAudioContextFunction;
