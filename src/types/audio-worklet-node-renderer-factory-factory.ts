import { TAudioWorkletNodeRendererFactory } from './audio-worklet-node-renderer-factory';
import { TConnectAudioParamFunction } from './connect-audio-param-function';
import { TDeleteUnrenderedAudioWorkletNodeFunction } from './delete-unrendered-audio-worklet-node-function';
import { TGetNativeAudioNodeFunction } from './get-native-audio-node-function';
import { TNativeAudioWorkletNodeConstructor } from './native-audio-worklet-node-constructor';
import { TRenderAutomationFunction } from './render-automation-function';
import { TRenderInputsOfAudioNodeFunction } from './render-inputs-of-audio-node-function';

export type TAudioWorkletNodeRendererFactoryFactory = (
    connectAudioParam: TConnectAudioParamFunction,
    deleteUnrenderedAudioWorkletNode: TDeleteUnrenderedAudioWorkletNodeFunction,
    getNativeAudioNode: TGetNativeAudioNodeFunction,
    nativeAudioWorkletNodeConstructor: null | TNativeAudioWorkletNodeConstructor,
    renderAutomation: TRenderAutomationFunction,
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => TAudioWorkletNodeRendererFactory;
