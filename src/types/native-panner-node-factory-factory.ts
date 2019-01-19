import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativePannerNodeFactory } from './native-panner-node-factory';
import { TNativePannerNodeFakerFactory } from './native-panner-node-faker-factory';

export type TNativePannerNodeFactoryFactory = (
    createInvalidStateError: TInvalidStateErrorFactory,
    createNativeAudioNode: TNativeAudioNodeFactory,
    createNativePannerNodeFaker: TNativePannerNodeFakerFactory
) => TNativePannerNodeFactory;
