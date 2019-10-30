import { TAuxiliaryGainNodeStore } from './auxiliary-gain-node-store';
import { TConnectMultipleOutputsFunction } from './connect-multiple-outputs-function';
import { TDisconnectMultipleOutputsFunction } from './disconnect-multiple-outputs-function';
import { TExposeCurrentFrameAndCurrentTimeFunction } from './expose-current-frame-and-current-time-function';
import { TIndexSizeErrorFactory } from './index-size-error-factory';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TMonitorConnectionsFunction } from './monitor-connections-function';
import { TNativeAudioWorkletNodeFakerFactory } from './native-audio-worklet-node-faker-factory';
import { TNativeChannelMergerNodeFactory } from './native-channel-merger-node-factory';
import { TNativeChannelSplitterNodeFactory } from './native-channel-splitter-node-factory';
import { TNativeConstantSourceNodeFactory } from './native-constant-source-node-factory';
import { TNativeGainNodeFactory } from './native-gain-node-factory';
import { TNativeScriptProcessorNodeFactory } from './native-script-processor-node-factory';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TNativeAudioWorkletNodeFakerFactoryFactory = (
    auxiliaryGainNodeStore: TAuxiliaryGainNodeStore,
    connectMultipleOutputs: TConnectMultipleOutputsFunction,
    createIndexSizeError: TIndexSizeErrorFactory,
    createInvalidStateError: TInvalidStateErrorFactory,
    createNativeChannelMergerNode: TNativeChannelMergerNodeFactory,
    createNativeChannelSplitterNode: TNativeChannelSplitterNodeFactory,
    createNativeConstantSourceNode: TNativeConstantSourceNodeFactory,
    createNativeGainNode: TNativeGainNodeFactory,
    createNativeScriptProcessorNode: TNativeScriptProcessorNodeFactory,
    createNotSupportedError: TNotSupportedErrorFactory,
    disconnectMultipleOutputs: TDisconnectMultipleOutputsFunction,
    exposeCurrentFrameAndCurrentTime: TExposeCurrentFrameAndCurrentTimeFunction,
    monitorConnections: TMonitorConnectionsFunction
) => TNativeAudioWorkletNodeFakerFactory;
