import { IConstantSourceNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TAudioParamFactory } from './audio-param-factory';
import { TConstantSourceNodeRendererFactory } from './constant-source-node-renderer-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeConstantSourceNodeFactory } from './native-constant-source-node-factory';

export type TConstantSourceNodeConstructorFactory = (
    createAudioParam: TAudioParamFactory,
    createConstantSourceNodeRendererFactory: TConstantSourceNodeRendererFactory,
    createNativeConstantSourceNode: TNativeConstantSourceNodeFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IConstantSourceNodeConstructor;
