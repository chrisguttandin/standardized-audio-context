import { TNativeAudioContext } from './native-audio-context';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TGetBackupNativeContextFunction = <T extends TNativeAudioContext | TNativeOfflineAudioContext>(nativeContext: T) => null | T;
