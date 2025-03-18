import type { createOscillatorNodeRendererFactory } from '../factories/oscillator-node-renderer-factory';
import { TAudioNodeConstructor } from './audio-node-constructor';
import { TAudioParamFactory } from './audio-param-factory';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeOscillatorNodeFactory } from './native-oscillator-node-factory';
import { TOscillatorNodeConstructor } from './oscillator-node-constructor';
import { TWrapEventListenerFunction } from './wrap-event-listener-function';

export type TOscillatorNodeConstructorFactory = (
    audioNodeConstructor: TAudioNodeConstructor,
    createAudioParam: TAudioParamFactory,
    createNativeOscillatorNode: TNativeOscillatorNodeFactory,
    createOscillatorNodeRenderer: ReturnType<typeof createOscillatorNodeRendererFactory>,
    getNativeContext: TGetNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    wrapEventListener: TWrapEventListenerFunction
) => TOscillatorNodeConstructor;
