import { TNativeAudioBuffer } from './native-audio-buffer';
import { TUnpatchedOfflineAudioContext } from './unpatched-offline-audio-context';

export type TRenderNativeOfflineAudioContextFunction = (
    nativeOfflineAudioContext: TUnpatchedOfflineAudioContext
) => Promise<TNativeAudioBuffer>;
