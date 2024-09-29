import { TIndexSizeErrorFactory } from './index-size-error-factory';
import { TNativeAnalyserNodeFactory } from './native-analyser-node-factory';

export type TNativeAnalyserNodeFactoryFactory = (createIndexSizeError: TIndexSizeErrorFactory) => TNativeAnalyserNodeFactory;
