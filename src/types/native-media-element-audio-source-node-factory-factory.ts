import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeMediaElementAudioSourceNodeFactory } from './native-media-element-audio-source-node-factory';

export type TNativeMediaElementAudioSourceNodeFactoryFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory
) => TNativeMediaElementAudioSourceNodeFactory;
