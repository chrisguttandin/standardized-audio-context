import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TNativeAudioWorkletNodeFactory } from './native-audio-worklet-node-factory';
import { TNativeAudioWorkletNodeFakerFactory } from './native-audio-worklet-node-faker-factory';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TNativeAudioWorkletNodeFactoryFactory = (
    createInvalidStateError: TInvalidStateErrorFactory,
    createNativeAudioWorkletNodeFaker: TNativeAudioWorkletNodeFakerFactory,
    createNotSupportedError: TNotSupportedErrorFactory
) => TNativeAudioWorkletNodeFactory;
