import {
    IConstantSourceNodeConstructor,
    IConstantSourceNodeRendererConstructor,
    INoneAudioDestinationNodeConstructor
} from '../interfaces';
import { TAudioParamFactory } from './audio-param-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeConstantSourceNodeFactory } from './native-constant-source-node-factory';

export type TConstantSourceNodeConstructorFactory = (
    createAudioParam: TAudioParamFactory,
    createNativeConstantSourceNode: TNativeConstantSourceNodeFactory,
    constantSourceNodeRendererConstructor: IConstantSourceNodeRendererConstructor,
    isNativeOfflineAudioContextFunction: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IConstantSourceNodeConstructor;
