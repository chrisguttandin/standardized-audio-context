import { TNativeAnalyserNodeFactory } from './native-analyser-node-factory';
import { TNativeAudioNodeFactory } from './native-audio-node-factory';

export type TNativeAnalyserNodeFactoryFactory = (createNativeAudioNode: TNativeAudioNodeFactory) => TNativeAnalyserNodeFactory;
