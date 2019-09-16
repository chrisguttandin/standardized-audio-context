import { TGetNativeContextFunction } from './get-native-context-function';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeWaveShaperNodeFactory } from './native-wave-shaper-node-factory';
import { TNoneAudioDestinationNodeConstructor } from './none-audio-destination-node-constructor';
import { TWaveShaperNodeConstructor } from './wave-shaper-node-constructor';
import { TWaveShaperNodeRendererFactory } from './wave-shaper-node-renderer-factory';

export type TWaveShaperNodeConstructorFactory = (
    createInvalidStateError: TInvalidStateErrorFactory,
    createNativeWaveShaperNode: TNativeWaveShaperNodeFactory,
    createWaveShaperNodeRenderer: TWaveShaperNodeRendererFactory,
    getNativeContext: TGetNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructor
) => TWaveShaperNodeConstructor;
