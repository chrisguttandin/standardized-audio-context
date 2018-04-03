import { IGainNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TAudioParamFactory } from './audio-param-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeGainNodeFactory } from './native-gain-node-factory';

export type TGainNodeConstructorFactory = (
    createAudioParam: TAudioParamFactory,
    createNativeGainNode: TNativeGainNodeFactory,
    isNativeOfflineAudioContextFunction: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IGainNodeConstructor;
