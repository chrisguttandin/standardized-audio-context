import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeMediaStreamAudioSourceNodeFactory } from './native-media-stream-audio-source-node-factory';

export type TNativeMediaStreamAudioSourceNodeFactoryFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory
) => TNativeMediaStreamAudioSourceNodeFactory;
