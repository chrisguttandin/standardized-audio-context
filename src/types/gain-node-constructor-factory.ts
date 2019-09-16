import { TAudioParamFactory } from './audio-param-factory';
import { TGainNodeConstructor } from './gain-node-constructor';
import { TGainNodeRendererFactory } from './gain-node-renderer-factory';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeGainNodeFactory } from './native-gain-node-factory';
import { TNoneAudioDestinationNodeConstructor } from './none-audio-destination-node-constructor';

export type TGainNodeConstructorFactory = (
    createAudioParam: TAudioParamFactory,
    createGainNodeRenderer: TGainNodeRendererFactory,
    createNativeGainNode: TNativeGainNodeFactory,
    getNativeContext: TGetNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructor
) => TGainNodeConstructor;
