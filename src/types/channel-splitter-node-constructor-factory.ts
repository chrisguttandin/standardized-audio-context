import { TChannelSplitterNodeConstructor } from './channel-splitter-node-constructor';
import { TChannelSplitterNodeRendererFactory } from './channel-splitter-node-renderer-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeChannelSplitterNodeFactory } from './native-channel-splitter-node-factory';
import { TNoneAudioDestinationNodeConstructor } from './none-audio-destination-node-constructor';

export type TChannelSplitterNodeConstructorFactory = (
    createChannelSplitterNodeRenderer: TChannelSplitterNodeRendererFactory,
    createNativeChannelSplitterNode: TNativeChannelSplitterNodeFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructor
) => TChannelSplitterNodeConstructor;
