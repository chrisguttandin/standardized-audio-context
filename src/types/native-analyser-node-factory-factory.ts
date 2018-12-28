import { TIndexSizeErrorFactory } from './index-size-error-factory';
import { TNativeAnalyserNodeFactory } from './native-analyser-node-factory';
import { TNativeAudioNodeFactory } from './native-audio-node-factory';

export type TNativeAnalyserNodeFactoryFactory = (
    createIndexSizeError: TIndexSizeErrorFactory,
    createNativeAudioNode: TNativeAudioNodeFactory
) => TNativeAnalyserNodeFactory;
