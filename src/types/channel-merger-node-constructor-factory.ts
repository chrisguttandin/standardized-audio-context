import { IChannelMergerNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TChannelMergerNodeRendererFactory } from './channel-merger-node-renderer-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeChannelMergerNodeFactory } from './native-channel-merger-node-factory';

export type TChannelMergerNodeConstructorFactory = (
    createChannelMergerNodeRenderer: TChannelMergerNodeRendererFactory,
    createNativeChannelMergerNode: TNativeChannelMergerNodeFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IChannelMergerNodeConstructor;
