import { IDelayNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TAudioParamFactory } from './audio-param-factory';
import { TDelayNodeRendererFactory } from './delay-node-renderer-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeDelayNodeFactory } from './native-delay-node-factory';

export type TDelayNodeConstructorFactory = (
    createAudioParam: TAudioParamFactory,
    createDelayNodeRendererFactory: TDelayNodeRendererFactory,
    createNativeDelayNode: TNativeDelayNodeFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IDelayNodeConstructor;
