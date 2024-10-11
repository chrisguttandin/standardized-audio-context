import { TNativeAudioWorkletNodeFactory } from './native-audio-worklet-node-factory';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TNativeAudioWorkletNodeFactoryFactory = (createNotSupportedError: TNotSupportedErrorFactory) => TNativeAudioWorkletNodeFactory;
