import {
    IIIRFilterNodeRendererConstructor,
    IUnpatchedOfflineAudioContextConstructor
} from '../interfaces';
import { TNativeAudioBufferSourceNodeFactory } from './native-audio-buffer-source-node-factory';
import { TRenderNativeOfflineAudioContextFunction } from './render-native-offline-audio-context-function';

export type TIIRFilterNodeRendererConstructorFactory = (
    createNativeAudioBufferSourceNode: TNativeAudioBufferSourceNodeFactory,
    renderNativeOfflineAudioContext: TRenderNativeOfflineAudioContextFunction,
    unpatchedOfflineAudioContextConstructor: null | IUnpatchedOfflineAudioContextConstructor
) => IIIRFilterNodeRendererConstructor;
