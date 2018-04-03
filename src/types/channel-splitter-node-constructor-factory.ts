import { IChannelSplitterNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TChannelSplitterNodeRendererFactory } from './channel-splitter-node-renderer-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeChannelSplitterNodeFactory } from './native-channel-splitter-node-factory';

export type TChannelSplitterNodeConstructorFactory = (
    createChannelSplitterNodeRenderer: TChannelSplitterNodeRendererFactory,
    createNativeChannelSplitterNode: TNativeChannelSplitterNodeFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IChannelSplitterNodeConstructor;
