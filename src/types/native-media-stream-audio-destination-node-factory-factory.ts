import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeMediaStreamAudioDestinationNodeFactory } from './native-media-stream-audio-destination-node-factory';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TNativeMediaStreamAudioDestinationNodeFactoryFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory,
    createNotSupportedError: TNotSupportedErrorFactory
) => TNativeMediaStreamAudioDestinationNodeFactory;
