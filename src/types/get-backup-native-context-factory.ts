import { TGetBackupNativeContextFunction } from './get-backup-native-context-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeAudioContextConstructor } from './native-audio-context-constructor';
import { TNativeOfflineAudioContextConstructor } from './native-offline-audio-context-constructor';

export type TGetBackupNativeContextFactory = (
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    nativeAudioContextConstructor: null | TNativeAudioContextConstructor,
    nativeOfflineAudioContextConstructor: null | TNativeOfflineAudioContextConstructor
) => TGetBackupNativeContextFunction;
