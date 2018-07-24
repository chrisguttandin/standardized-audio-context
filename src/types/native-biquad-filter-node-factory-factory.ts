import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeBiquadFilterNodeFactory } from './native-biquad-filter-node-factory';

export type TNativeBiquadFilterNodeFactoryFactory = (createNativeAudioNode: TNativeAudioNodeFactory) => TNativeBiquadFilterNodeFactory;
