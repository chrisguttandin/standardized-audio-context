import { TGetNativeAudioNodeFunction } from './get-native-audio-node-function';
import { TIIRFilterNodeRendererFactory } from './iir-filter-node-renderer-factory';
import { TRenderInputsOfAudioNodeFunction } from './render-inputs-of-audio-node-function';

export type TIIRFilterNodeRendererFactoryFactory = (
    getNativeAudioNode: TGetNativeAudioNodeFunction,
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => TIIRFilterNodeRendererFactory;
