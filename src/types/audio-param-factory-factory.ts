import { TAudioParamFactory } from './audio-param-factory';
import { TAudioParamRendererFactory } from './audio-param-renderer-factory';
import { TNativeAudioContextConstructor } from './native-audio-context-constructor';

export type TAudioParamFactoryFactory = (
    createAudioParamRenderer: TAudioParamRendererFactory,
    nativeAudioContextConstructor: null | TNativeAudioContextConstructor
) => TAudioParamFactory;
