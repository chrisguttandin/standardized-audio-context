import { INoneAudioDestinationNodeConstructor, IOscillatorNodeConstructor } from '../interfaces';
import { TAudioParamFactory } from './audio-param-factory';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeOscillatorNodeFactory } from './native-oscillator-node-factory';

export type TOscillatorNodeConstructorFactory = (
    createAudioParam: TAudioParamFactory,
    createInvalidStateError: TInvalidStateErrorFactory,
    createNativeOscillatorNode: TNativeOscillatorNodeFactory,
    isNativeOfflineAudioContextFunction: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IOscillatorNodeConstructor;
