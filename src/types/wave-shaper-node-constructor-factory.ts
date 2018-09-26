import { INoneAudioDestinationNodeConstructor, IWaveShaperNodeConstructor } from '../interfaces';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeWaveShaperNodeFactory } from './native-wave-shaper-node-factory';
import { TWaveShaperNodeRendererFactory } from './wave-shaper-node-renderer-factory';

export type TWaveShaperNodeConstructorFactory = (
    createInvalidStateError: TInvalidStateErrorFactory,
    createNativeWaveShaperNode: TNativeWaveShaperNodeFactory,
    createWaveShaperNodeRenderer: TWaveShaperNodeRendererFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IWaveShaperNodeConstructor;
