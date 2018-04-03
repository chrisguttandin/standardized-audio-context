import { TAnalyserNodeRendererFactory } from './analyser-node-renderer-factory';
import { TNativeAnalyserNodeFactory } from './native-analyser-node-factory';

export type TAnalyserNodeRendererFactoryFactory = (createNativeAnalyserNode: TNativeAnalyserNodeFactory) => TAnalyserNodeRendererFactory;
