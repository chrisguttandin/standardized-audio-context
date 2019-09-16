import { TAudioParamFactory } from './audio-param-factory';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeOscillatorNodeFactory } from './native-oscillator-node-factory';
import { TNoneAudioDestinationNodeConstructor } from './none-audio-destination-node-constructor';
import { TOscillatorNodeConstructor } from './oscillator-node-constructor';
import { TOscillatorNodeRendererFactory } from './oscillator-node-renderer-factory';

export type TOscillatorNodeConstructorFactory = (
    createAudioParam: TAudioParamFactory,
    createInvalidStateError: TInvalidStateErrorFactory,
    createNativeOscillatorNode: TNativeOscillatorNodeFactory,
    createOscillatorNodeRenderer: TOscillatorNodeRendererFactory,
    getNativeContext: TGetNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructor
) => TOscillatorNodeConstructor;
