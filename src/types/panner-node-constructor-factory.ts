import { TAudioParamFactory } from './audio-param-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativePannerNodeFactory } from './native-panner-node-factory';
import { TNoneAudioDestinationNodeConstructor } from './none-audio-destination-node-constructor';
import { TPannerNodeConstructor } from './panner-node-constructor';
import { TPannerNodeRendererFactory } from './panner-node-renderer-factory';

export type TPannerNodeConstructorFactory = (
    createAudioParam: TAudioParamFactory,
    createNativePannerNode: TNativePannerNodeFactory,
    createPannerNodeRenderer: TPannerNodeRendererFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructor
) => TPannerNodeConstructor;
