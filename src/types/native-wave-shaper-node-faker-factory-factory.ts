import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeGainNodeFactory } from './native-gain-node-factory';
import { TNativeWaveShaperNodeFakerFactory } from './native-wave-shaper-node-faker-factory';

export type TNativeWaveShaperNodeFakerFactoryFactory = (
    createInvalidStateError: TInvalidStateErrorFactory,
    createNativeAudioNode: TNativeAudioNodeFactory,
    createNativeGainNode: TNativeGainNodeFactory
) => TNativeWaveShaperNodeFakerFactory;
