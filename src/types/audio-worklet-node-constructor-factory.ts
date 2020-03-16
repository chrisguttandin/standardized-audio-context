import { TAddUnrenderedAudioWorkletNodeFunction } from './add-unrendered-audio-worklet-node-function';
import { TAudioNodeConstructor } from './audio-node-constructor';
import { TAudioParamFactory } from './audio-param-factory';
import { TAudioWorkletNodeConstructor } from './audio-worklet-node-constructor';
import { TAudioWorkletNodeRendererFactory } from './audio-worklet-node-renderer-factory';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeAudioWorkletNodeConstructor } from './native-audio-worklet-node-constructor';
import { TNativeAudioWorkletNodeFactory } from './native-audio-worklet-node-factory';
import { TWrapEventListenerFunction } from './wrap-event-listener-function';

export type TAudioWorkletNodeConstructorFactory = (
    addUnrenderedAudioWorkletNode: TAddUnrenderedAudioWorkletNodeFunction,
    audioNodeConstructor: TAudioNodeConstructor,
    createAudioParam: TAudioParamFactory,
    createAudioWorkletNodeRenderer: TAudioWorkletNodeRendererFactory,
    createNativeAudioWorkletNode: TNativeAudioWorkletNodeFactory,
    getNativeContext: TGetNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    nativeAudioWorkletNodeConstructor: null | TNativeAudioWorkletNodeConstructor,
    wrapEventListener: TWrapEventListenerFunction
) => TAudioWorkletNodeConstructor;
