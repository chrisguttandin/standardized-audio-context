import { INativeAudioContextConstructor, INativeOfflineAudioContextConstructor } from '../interfaces';
import { TGetBackupNativeContextFunction } from './get-backup-native-context-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';

export type TGetBackupNativeContextFactory = (
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    nativeAudioContextConstructor: null | INativeAudioContextConstructor,
    nativeOfflineAudioContextConstructor: null | INativeOfflineAudioContextConstructor
) => TGetBackupNativeContextFunction;
