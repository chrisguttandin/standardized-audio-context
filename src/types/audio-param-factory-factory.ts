import { TAudioParamFactory } from './audio-param-factory';
import { TAudioParamRendererFactory } from './audio-param-renderer-factory';

export type TAudioParamFactoryFactory = (createAudioParamRenderer: TAudioParamRendererFactory) => TAudioParamFactory;
