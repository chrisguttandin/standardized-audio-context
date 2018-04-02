import { IConstantSourceNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TAudioParamFactory } from './audio-param-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';

export type TConstantSourceNodeConstructorFactory = (
    createAudioParam: TAudioParamFactory,
    isNativeOfflineAudioContextFunction: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IConstantSourceNodeConstructor;
