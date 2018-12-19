import { TChannelMergerNodeConstructor } from './channel-merger-node-constructor';
import { TChannelMergerNodeRendererFactory } from './channel-merger-node-renderer-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeChannelMergerNodeFactory } from './native-channel-merger-node-factory';
import { TNoneAudioDestinationNodeConstructor } from './none-audio-destination-node-constructor';

export type TChannelMergerNodeConstructorFactory = (
    createChannelMergerNodeRenderer: TChannelMergerNodeRendererFactory,
    createNativeChannelMergerNode: TNativeChannelMergerNodeFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructor
) => TChannelMergerNodeConstructor;
