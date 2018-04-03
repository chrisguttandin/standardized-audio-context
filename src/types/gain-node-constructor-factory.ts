import { IGainNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TAudioParamFactory } from './audio-param-factory';
import { TGainNodeRendererFactory } from './gain-node-renderer-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeGainNodeFactory } from './native-gain-node-factory';

export type TGainNodeConstructorFactory = (
    createAudioParam: TAudioParamFactory,
    createGainNodeRenderer: TGainNodeRendererFactory,
    createNativeGainNode: TNativeGainNodeFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IGainNodeConstructor;
