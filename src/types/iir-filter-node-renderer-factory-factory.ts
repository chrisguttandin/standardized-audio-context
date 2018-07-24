import { INativeOfflineAudioContextConstructor } from '../interfaces';
import { TIIRFilterNodeRendererFactory } from './iir-filter-node-renderer-factory';
import { TNativeAudioBufferSourceNodeFactory } from './native-audio-buffer-source-node-factory';
import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TRenderNativeOfflineAudioContextFunction } from './render-native-offline-audio-context-function';

export type TIIRFilterNodeRendererFactoryFactory = (
    createNativeAudioBufferSourceNode: TNativeAudioBufferSourceNodeFactory,
    createNativeAudioNode: TNativeAudioNodeFactory,
    nativeOfflineAudioContextConstructor: null | INativeOfflineAudioContextConstructor,
    renderNativeOfflineAudioContext: TRenderNativeOfflineAudioContextFunction
) => TIIRFilterNodeRendererFactory;
