import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativePannerNodeFactory } from './native-panner-node-factory';
import { TNativePannerNodeFakerFactory } from './native-panner-node-faker-factory';

export type TNativePannerNodeFactoryFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory,
    createNativePannerNodeFaker: TNativePannerNodeFakerFactory
) => TNativePannerNodeFactory;
