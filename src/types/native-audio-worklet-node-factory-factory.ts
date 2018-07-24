import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeAudioWorkletNodeFactory } from './native-audio-worklet-node-factory';
import { TNativeAudioWorkletNodeFakerFactory } from './native-audio-worklet-node-faker-factory';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TNativeAudioWorkletNodeFactoryFactory = (
    createInvalidStateError: TInvalidStateErrorFactory,
    createNativeAudioNode: TNativeAudioNodeFactory,
    createNativeAudioWorkletNodeFaker: TNativeAudioWorkletNodeFakerFactory,
    createNotSupportedError: TNotSupportedErrorFactory
) => TNativeAudioWorkletNodeFactory;
