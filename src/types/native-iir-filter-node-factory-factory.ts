import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeIIRFilterNodeFactory } from './native-iir-filter-node-factory';
import { TNativeIIRFilterNodeFakerFactory } from './native-iir-filter-node-faker-factory';

export type TNativeIIRFilterNodeFactoryFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory,
    createNativeIIRFilterNodeFaker: TNativeIIRFilterNodeFakerFactory
) => TNativeIIRFilterNodeFactory;
