import { TAudioParamFactory } from './audio-param-factory';
import { TDelayNodeConstructor } from './delay-node-constructor';
import { TDelayNodeRendererFactory } from './delay-node-renderer-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeDelayNodeFactory } from './native-delay-node-factory';
import { TNoneAudioDestinationNodeConstructor } from './none-audio-destination-node-constructor';

export type TDelayNodeConstructorFactory = (
    createAudioParam: TAudioParamFactory,
    createDelayNodeRendererFactory: TDelayNodeRendererFactory,
    createNativeDelayNode: TNativeDelayNodeFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructor
) => TDelayNodeConstructor;
