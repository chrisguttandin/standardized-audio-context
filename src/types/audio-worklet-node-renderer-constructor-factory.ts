import {
    IAudioWorkletNodeRendererConstructor,
    INativeAudioWorkletNodeConstructor,
    IUnpatchedOfflineAudioContextConstructor
} from '../interfaces';
import { TConnectMultipleOutputsFunction } from './connect-multiple-outputs-function';
import { TDisconnectMultipleOutputsFunction } from './disconnect-multiple-outputs-function';
import { TNativeAudioBufferSourceNodeFactory } from './native-audio-buffer-source-node-factory';
import { TNativeChannelMergerNodeFactory } from './native-channel-merger-node-factory';
import { TNativeChannelSplitterNodeFactory } from './native-channel-splitter-node-factory';
import { TNativeConstantSourceNodeFactory } from './native-constant-source-node-factory';
import { TNativeGainNodeFactory } from './native-gain-node-factory';
import { TRenderNativeOfflineAudioContextFunction } from './render-native-offline-audio-context-function';

export type TAudioWorkletNodeRendererConstructorFactory = (
    connectMultipleOutputs: TConnectMultipleOutputsFunction,
    createNativeAudioBufferSourceNode: TNativeAudioBufferSourceNodeFactory,
    createNativeChannelMergerNode: TNativeChannelMergerNodeFactory,
    createNativeChannelSplitterNode: TNativeChannelSplitterNodeFactory,
    createNativeConstantSourceNode: TNativeConstantSourceNodeFactory,
    createNativeGainNode: TNativeGainNodeFactory,
    disconnectMultipleOutputs: TDisconnectMultipleOutputsFunction,
    nativeAudioWorkletNodeConstructor: null | INativeAudioWorkletNodeConstructor,
    renderNativeOfflineAudioContext: TRenderNativeOfflineAudioContextFunction,
    unpatchedOfflineAudioContextConstructor: null | IUnpatchedOfflineAudioContextConstructor
) => IAudioWorkletNodeRendererConstructor;
