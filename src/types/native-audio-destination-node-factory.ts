import { TNativeAudioDestinationNode } from './native-audio-destination-node';
import { TUnpatchedAudioContext } from './unpatched-audio-context';
import { TUnpatchedOfflineAudioContext } from './unpatched-offline-audio-context';

export type TNativeAudioDestinationNodeFactory = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    channelCount: number,
    isNodeOfNativeOfflineAudioContext: boolean
) => TNativeAudioDestinationNode;
