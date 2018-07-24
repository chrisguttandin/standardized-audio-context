import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeGainNodeFactory } from './native-gain-node-factory';

export type TNativeGainNodeFactoryFactory = (createNativeAudioNode: TNativeAudioNodeFactory) => TNativeGainNodeFactory;
