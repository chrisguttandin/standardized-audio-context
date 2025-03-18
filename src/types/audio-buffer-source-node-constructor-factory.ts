import type { createAudioBufferSourceNodeRendererFactory } from '../factories/audio-buffer-source-node-renderer-factory';
import { TAudioBufferSourceNodeConstructor } from './audio-buffer-source-node-constructor';
import { TAudioNodeConstructor } from './audio-node-constructor';
import { TAudioParamFactory } from './audio-param-factory';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeAudioBufferSourceNodeFactory } from './native-audio-buffer-source-node-factory';
import { TWrapEventListenerFunction } from './wrap-event-listener-function';

export type TAudioBufferSourceNodeConstructorFactory = (
    audioNodeConstructor: TAudioNodeConstructor,
    createAudioBufferSourceNodeRenderer: ReturnType<typeof createAudioBufferSourceNodeRendererFactory>,
    createAudioParam: TAudioParamFactory,
    createNativeAudioBufferSourceNode: TNativeAudioBufferSourceNodeFactory,
    getNativeContext: TGetNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    wrapEventListener: TWrapEventListenerFunction
) => TAudioBufferSourceNodeConstructor;
