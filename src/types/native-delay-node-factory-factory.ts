import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeDelayNodeFactory } from './native-delay-node-factory';

export type TNativeDelayNodeFactoryFactory = (createNativeAudioNode: TNativeAudioNodeFactory) => TNativeDelayNodeFactory;
