import { TAudioNodeConstructor } from './audio-node-constructor';
import { TAudioParamFactory } from './audio-param-factory';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativePannerNodeFactory } from './native-panner-node-factory';
import { TPannerNodeConstructor } from './panner-node-constructor';
import { TPannerNodeRendererFactory } from './panner-node-renderer-factory';

export type TPannerNodeConstructorFactory = (
    audioNodeConstructor: TAudioNodeConstructor,
    createAudioParam: TAudioParamFactory,
    createNativePannerNode: TNativePannerNodeFactory,
    createPannerNodeRenderer: TPannerNodeRendererFactory,
    getNativeContext: TGetNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction
) => TPannerNodeConstructor;
