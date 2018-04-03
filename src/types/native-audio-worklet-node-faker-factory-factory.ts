import { TConnectMultipleOutputsFunction } from './connect-multiple-outputs-function';
import { TDisconnectMultipleOutputsFunction } from './disconnect-multiple-outputs-function';
import { TIndexSizeErrorFactory } from './index-size-error-factory';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TNativeAudioWorkletNodeFakerFactory } from './native-audio-worklet-node-faker-factory';
import { TNativeChannelMergerNodeFactory } from './native-channel-merger-node-factory';
import { TNativeChannelSplitterNodeFactory } from './native-channel-splitter-node-factory';
import { TNativeConstantSourceNodeFactory } from './native-constant-source-node-factory';
import { TNativeGainNodeFactory } from './native-gain-node-factory';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TNativeAudioWorkletNodeFakerFactoryFactory = (
    connectMultipleOutputs: TConnectMultipleOutputsFunction,
    createIndexSizeError: TIndexSizeErrorFactory,
    createInvalidStateError: TInvalidStateErrorFactory,
    createNativeChannelMergerNode: TNativeChannelMergerNodeFactory,
    createNativeChannelSplitterNode: TNativeChannelSplitterNodeFactory,
    createNativeConstantSourceNode: TNativeConstantSourceNodeFactory,
    createNativeGainNode: TNativeGainNodeFactory,
    createNotSupportedError: TNotSupportedErrorFactory,
    disconnectMultipleOutputs: TDisconnectMultipleOutputsFunction
) => TNativeAudioWorkletNodeFakerFactory;
