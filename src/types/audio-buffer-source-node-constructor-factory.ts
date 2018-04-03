import { IAudioBufferSourceNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TAudioBufferSourceNodeRendererFactory } from './audio-buffer-source-node-renderer-factory';
import { TAudioParamFactory } from './audio-param-factory';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeAudioBufferSourceNodeFactory } from './native-audio-buffer-source-node-factory';

export type TAudioBufferSourceNodeConstructorFactory = (
    createAudioBufferSourceNodeRenderer: TAudioBufferSourceNodeRendererFactory,
    createAudioParam: TAudioParamFactory,
    createInvalidStateError: TInvalidStateErrorFactory,
    createNativeAudioBufferSourceNode: TNativeAudioBufferSourceNodeFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IAudioBufferSourceNodeConstructor;
