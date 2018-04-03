import { INoneAudioDestinationNodeConstructor, IOscillatorNodeConstructor } from '../interfaces';
import { TAudioParamFactory } from './audio-param-factory';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeOscillatorNodeFactory } from './native-oscillator-node-factory';
import { TOscillatorNodeRendererFactory } from './oscillator-node-renderer-factory';

export type TOscillatorNodeConstructorFactory = (
    createAudioParam: TAudioParamFactory,
    createInvalidStateError: TInvalidStateErrorFactory,
    createNativeOscillatorNode: TNativeOscillatorNodeFactory,
    createOscillatorNodeRenderer: TOscillatorNodeRendererFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IOscillatorNodeConstructor;
