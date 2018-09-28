import { INoneAudioDestinationNodeConstructor, IStereoPannerNodeConstructor } from '../interfaces';
import { TAudioParamFactory } from './audio-param-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeStereoPannerNodeFactory } from './native-stereo-panner-node-factory';
import { TStereoPannerNodeRendererFactory } from './stereo-panner-node-renderer-factory';

export type TStereoPannerNodeConstructorFactory = (
    createAudioParam: TAudioParamFactory,
    createNativeStereoPannerNode: TNativeStereoPannerNodeFactory,
    createStereoPannerNodeRenderer: TStereoPannerNodeRendererFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IStereoPannerNodeConstructor;
