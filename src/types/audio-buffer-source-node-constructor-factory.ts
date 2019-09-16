import { TAudioBufferSourceNodeConstructor } from './audio-buffer-source-node-constructor';
import { TAudioBufferSourceNodeRendererFactory } from './audio-buffer-source-node-renderer-factory';
import { TAudioParamFactory } from './audio-param-factory';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeAudioBufferSourceNodeFactory } from './native-audio-buffer-source-node-factory';
import { TNoneAudioDestinationNodeConstructor } from './none-audio-destination-node-constructor';

export type TAudioBufferSourceNodeConstructorFactory = (
    createAudioBufferSourceNodeRenderer: TAudioBufferSourceNodeRendererFactory,
    createAudioParam: TAudioParamFactory,
    createInvalidStateError: TInvalidStateErrorFactory,
    createNativeAudioBufferSourceNode: TNativeAudioBufferSourceNodeFactory,
    getNativeContext: TGetNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructor
) => TAudioBufferSourceNodeConstructor;
