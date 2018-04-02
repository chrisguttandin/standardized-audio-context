import { INoneAudioDestinationNodeConstructor, IOscillatorNodeConstructor } from '../interfaces';
import { TAudioParamFactory } from './audio-param-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';

export type TOscillatorNodeConstructorFactory = (
    createAudioParam: TAudioParamFactory,
    isNativeOfflineAudioContextFunction: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IOscillatorNodeConstructor;
