import { TChannelMergerNodeConstructor } from './channel-merger-node-constructor';
import { TChannelMergerNodeRendererFactory } from './channel-merger-node-renderer-factory';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeChannelMergerNodeFactory } from './native-channel-merger-node-factory';
import { TNoneAudioDestinationNodeConstructor } from './none-audio-destination-node-constructor';

export type TChannelMergerNodeConstructorFactory = (
    createChannelMergerNodeRenderer: TChannelMergerNodeRendererFactory,
    createNativeChannelMergerNode: TNativeChannelMergerNodeFactory,
    getNativeContext: TGetNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructor
) => TChannelMergerNodeConstructor;
