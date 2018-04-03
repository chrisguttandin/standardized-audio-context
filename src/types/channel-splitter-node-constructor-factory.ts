import { IChannelSplitterNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeChannelSplitterNodeFactory } from './native-channel-splitter-node-factory';

export type TChannelSplitterNodeConstructorFactory = (
    createNativeChannelSplitterNode: TNativeChannelSplitterNodeFactory,
    isNativeOfflineAudioContextFunction: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IChannelSplitterNodeConstructor;
