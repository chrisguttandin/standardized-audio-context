import { IAudioBufferSourceNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TAudioParamFactory } from './audio-param-factory';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeAudioBufferSourceNodeFactory } from './native-audio-buffer-source-node-factory';

export type TAudioBufferSourceNodeConstructorFactory = (
    createAudioParam: TAudioParamFactory,
    createInvalidStateError: TInvalidStateErrorFactory,
    createNativeAudioBufferSourceNode: TNativeAudioBufferSourceNodeFactory,
    isNativeOfflineAudioContextFunction: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IAudioBufferSourceNodeConstructor;
