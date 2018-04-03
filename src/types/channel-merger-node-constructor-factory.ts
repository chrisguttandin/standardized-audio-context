import { IChannelMergerNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeChannelMergerNodeFactory } from './native-channel-merger-node-factory';

export type TChannelMergerNodeConstructorFactory = (
    createNativeChannelMergerNode: TNativeChannelMergerNodeFactory,
    isNativeOfflineAudioContextFunction: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IChannelMergerNodeConstructor;
