import type { createWaveShaperNodeRendererFactory } from '../factories/wave-shaper-node-renderer-factory';
import { TAudioNodeConstructor } from './audio-node-constructor';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeWaveShaperNodeFactory } from './native-wave-shaper-node-factory';
import { TSetAudioNodeTailTimeFunction } from './set-audio-node-tail-time-function';
import { TWaveShaperNodeConstructor } from './wave-shaper-node-constructor';

export type TWaveShaperNodeConstructorFactory = (
    audioNodeConstructor: TAudioNodeConstructor,
    createInvalidStateError: TInvalidStateErrorFactory,
    createNativeWaveShaperNode: TNativeWaveShaperNodeFactory,
    createWaveShaperNodeRenderer: ReturnType<typeof createWaveShaperNodeRendererFactory>,
    getNativeContext: TGetNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    setAudioNodeTailTime: TSetAudioNodeTailTimeFunction
) => TWaveShaperNodeConstructor;
