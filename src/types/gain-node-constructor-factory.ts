import { IGainNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';

export type TGainNodeConstructorFactory = (
    isNativeOfflineAudioContextFunction: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IGainNodeConstructor;
