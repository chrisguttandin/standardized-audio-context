import { TCacheTestResultFunction } from './cache-test-result-function';
import { TIndexSizeErrorFactory } from './index-size-error-factory';
import { TNativeAnalyserNodeFactory } from './native-analyser-node-factory';
import { TNativeAudioNodeFactory } from './native-audio-node-factory';

export type TNativeAnalyserNodeFactoryFactory = (
    cacheTestResult: TCacheTestResultFunction,
    createIndexSizeError: TIndexSizeErrorFactory,
    createNativeAudioNode: TNativeAudioNodeFactory
) => TNativeAnalyserNodeFactory;
