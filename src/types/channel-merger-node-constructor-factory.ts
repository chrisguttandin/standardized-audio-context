import { IChannelMergerNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';

export type TChannelMergerNodeConstructorFactory = (
    isNativeOfflineAudioContextFunction: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IChannelMergerNodeConstructor;
