import type { createGainNodeRendererFactory } from '../factories/gain-node-renderer-factory';
import { TAudioNodeConstructor } from './audio-node-constructor';
import { TAudioParamFactory } from './audio-param-factory';
import { TGainNodeConstructor } from './gain-node-constructor';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeGainNodeFactory } from './native-gain-node-factory';

export type TGainNodeConstructorFactory = (
    audioNodeConstructor: TAudioNodeConstructor,
    createAudioParam: TAudioParamFactory,
    createGainNodeRenderer: ReturnType<typeof createGainNodeRendererFactory>,
    createNativeGainNode: TNativeGainNodeFactory,
    getNativeContext: TGetNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction
) => TGainNodeConstructor;
