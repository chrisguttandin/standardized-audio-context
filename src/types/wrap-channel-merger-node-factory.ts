import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TWrapChannelMergerNodeFunction } from './wrap-channel-merger-node-function';

export type TWrapChannelMergerNodeFactory = (
    createInvalidStateError: TInvalidStateErrorFactory,
    createNativeAudioNode: TNativeAudioNodeFactory
) => TWrapChannelMergerNodeFunction;
