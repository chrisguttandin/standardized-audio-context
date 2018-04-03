import { IAudioDestinationNode } from '../interfaces';
import { TNativeAudioBuffer } from './native-audio-buffer';
import { TUnpatchedOfflineAudioContext } from './unpatched-offline-audio-context';

export type TStartRenderingFunction = (
    destination: IAudioDestinationNode,
    unpatchedOfflineAudioContext: TUnpatchedOfflineAudioContext
) => Promise<TNativeAudioBuffer>;
