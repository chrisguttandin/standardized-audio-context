import { TAudioParamFactory } from './audio-param-factory';
import { TGainNodeConstructor } from './gain-node-constructor';
import { TGainNodeRendererFactory } from './gain-node-renderer-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeGainNodeFactory } from './native-gain-node-factory';
import { TNoneAudioDestinationNodeConstructor } from './none-audio-destination-node-constructor';

export type TGainNodeConstructorFactory = (
    createAudioParam: TAudioParamFactory,
    createGainNodeRenderer: TGainNodeRendererFactory,
    createNativeGainNode: TNativeGainNodeFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructor
) => TGainNodeConstructor;
