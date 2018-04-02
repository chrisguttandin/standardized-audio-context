import { TUnpatchedAudioContext } from './unpatched-audio-context';
import { TUnpatchedOfflineAudioContext } from './unpatched-offline-audio-context';

export type TIsNativeOfflineAudioContextFunction = (nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext) => boolean;
