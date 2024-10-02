import { TConnectAudioParamFunction } from './connect-audio-param-function';
import { TGetNativeAudioNodeFunction } from './get-native-audio-node-function';
import { TNativePannerNodeFactory } from './native-panner-node-factory';
import { TPannerNodeRendererFactory } from './panner-node-renderer-factory';
import { TRenderAutomationFunction } from './render-automation-function';
import { TRenderInputsOfAudioNodeFunction } from './render-inputs-of-audio-node-function';

export type TPannerNodeRendererFactoryFactory = (
    connectAudioParam: TConnectAudioParamFunction,
    createNativePannerNode: TNativePannerNodeFactory,
    getNativeAudioNode: TGetNativeAudioNodeFunction,
    renderAutomation: TRenderAutomationFunction,
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => TPannerNodeRendererFactory;
