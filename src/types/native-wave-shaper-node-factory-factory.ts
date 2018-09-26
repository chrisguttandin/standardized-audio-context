import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeWaveShaperNodeFactory } from './native-wave-shaper-node-factory';

export type TNativeWaveShaperNodeFactoryFactory = (
    createInvalidStateError: TInvalidStateErrorFactory,
    createNativeAudioNode: TNativeAudioNodeFactory
) => TNativeWaveShaperNodeFactory;
