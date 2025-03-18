import type { createPannerNodeRendererFactory } from '../factories/panner-node-renderer-factory';
import { TAudioNodeConstructor } from './audio-node-constructor';
import { TAudioParamFactory } from './audio-param-factory';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativePannerNodeFactory } from './native-panner-node-factory';
import { TPannerNodeConstructor } from './panner-node-constructor';
import { TSetAudioNodeTailTimeFunction } from './set-audio-node-tail-time-function';

export type TPannerNodeConstructorFactory = (
    audioNodeConstructor: TAudioNodeConstructor,
    createAudioParam: TAudioParamFactory,
    createNativePannerNode: TNativePannerNodeFactory,
    createPannerNodeRenderer: ReturnType<typeof createPannerNodeRendererFactory>,
    getNativeContext: TGetNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    setAudioNodeTailTime: TSetAudioNodeTailTimeFunction
) => TPannerNodeConstructor;
