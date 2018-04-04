import { TNativeAudioContext } from './native-audio-context';
import { TNativeAudioDestinationNode } from './native-audio-destination-node';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TNativeAudioDestinationNodeFactory = (
    nativeContext: TNativeAudioContext | TNativeOfflineAudioContext,
    channelCount: number,
    isNodeOfNativeOfflineAudioContext: boolean
) => TNativeAudioDestinationNode;
