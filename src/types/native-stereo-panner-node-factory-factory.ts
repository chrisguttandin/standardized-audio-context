import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeStereoPannerNodeFactory } from './native-stereo-panner-node-factory';
import { TNativeStereoPannerNodeFakerFactory } from './native-stereo-panner-node-faker-factory';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TNativeStereoPannerNodeFactoryFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory,
    createNativeStereoPannerNodeFaker: TNativeStereoPannerNodeFakerFactory,
    createNotSupportedError: TNotSupportedErrorFactory
) => TNativeStereoPannerNodeFactory;
