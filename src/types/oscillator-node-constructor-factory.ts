import { TAudioNodeConstructor } from './audio-node-constructor';
import { TAudioParamFactory } from './audio-param-factory';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeOscillatorNodeFactory } from './native-oscillator-node-factory';
import { TOscillatorNodeConstructor } from './oscillator-node-constructor';
import { TOscillatorNodeRendererFactory } from './oscillator-node-renderer-factory';
import { TWrapEventListenerFunction } from './wrap-event-listener-function';

export type TOscillatorNodeConstructorFactory = (
    audioNodeConstructor: TAudioNodeConstructor,
    createAudioParam: TAudioParamFactory,
    createInvalidStateError: TInvalidStateErrorFactory,
    createNativeOscillatorNode: TNativeOscillatorNodeFactory,
    createOscillatorNodeRenderer: TOscillatorNodeRendererFactory,
    getNativeContext: TGetNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    wrapEventListener: TWrapEventListenerFunction
) => TOscillatorNodeConstructor;
