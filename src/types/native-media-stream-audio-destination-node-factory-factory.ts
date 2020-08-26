import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeMediaStreamAudioDestinationNodeFactory } from './native-media-stream-audio-destination-node-factory';

export type TNativeMediaStreamAudioDestinationNodeFactoryFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory
) => TNativeMediaStreamAudioDestinationNodeFactory;
