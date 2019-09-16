import { TAudioParamFactory } from './audio-param-factory';
import { TConstantSourceNodeConstructor } from './constant-source-node-constructor';
import { TConstantSourceNodeRendererFactory } from './constant-source-node-renderer-factory';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeConstantSourceNodeFactory } from './native-constant-source-node-factory';
import { TNoneAudioDestinationNodeConstructor } from './none-audio-destination-node-constructor';

export type TConstantSourceNodeConstructorFactory = (
    createAudioParam: TAudioParamFactory,
    createConstantSourceNodeRenderer: TConstantSourceNodeRendererFactory,
    createNativeConstantSourceNode: TNativeConstantSourceNodeFactory,
    getNativeContext: TGetNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructor
) => TConstantSourceNodeConstructor;
