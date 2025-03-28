import type { createConstantSourceNodeRendererFactory } from '../factories/constant-source-node-renderer-factory';
import { TAudioNodeConstructor } from './audio-node-constructor';
import { TAudioParamFactory } from './audio-param-factory';
import { TConstantSourceNodeConstructor } from './constant-source-node-constructor';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeConstantSourceNodeFactory } from './native-constant-source-node-factory';
import { TWrapEventListenerFunction } from './wrap-event-listener-function';

export type TConstantSourceNodeConstructorFactory = (
    audioNodeConstructor: TAudioNodeConstructor,
    createAudioParam: TAudioParamFactory,
    createConstantSourceNodeRenderer: ReturnType<typeof createConstantSourceNodeRendererFactory>,
    createNativeConstantSourceNode: TNativeConstantSourceNodeFactory,
    getNativeContext: TGetNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    wrapEventListener: TWrapEventListenerFunction
) => TConstantSourceNodeConstructor;
