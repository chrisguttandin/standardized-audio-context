import { IIIRFilterNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';

export type TIIRFilterNodeConstructorFactory = (
    isNativeOfflineAudioContextFunction: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IIIRFilterNodeConstructor;
