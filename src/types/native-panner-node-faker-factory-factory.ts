import { TConnectNativeAudioNodeToNativeAudioNodeFunction } from './connect-native-audio-node-to-native-audio-node-function';
import { TDisconnectNativeAudioNodeFromNativeAudioNodeFunction } from './disconnect-native-audio-node-from-native-audio-node-function';
import { TGetFirstSampleFunction } from './get-first-sample-function';
import { TMonitorConnectionsFunction } from './monitor-connections-function';
import { TNativeChannelMergerNodeFactory } from './native-channel-merger-node-factory';
import { TNativeGainNodeFactory } from './native-gain-node-factory';
import { TNativePannerNodeFakerFactory } from './native-panner-node-faker-factory';
import { TNativeScriptProcessorNodeFactory } from './native-script-processor-node-factory';
import { TNativeWaveShaperNodeFactory } from './native-wave-shaper-node-factory';

export type TNativePannerNodeFakerFactoryFactory = (
    connectNativeAudioNodeToNativeAudioNode: TConnectNativeAudioNodeToNativeAudioNodeFunction,
    createNativeChannelMergerNode: TNativeChannelMergerNodeFactory,
    createNativeGainNode: TNativeGainNodeFactory,
    createNativeScriptProcessorNode: TNativeScriptProcessorNodeFactory,
    createNativeWaveShaperNode: TNativeWaveShaperNodeFactory,
    disconnectNativeAudioNodeToNativeAudioNode: TDisconnectNativeAudioNodeFromNativeAudioNodeFunction,
    getFirstSample: TGetFirstSampleFunction,
    monitorConnections: TMonitorConnectionsFunction
) => TNativePannerNodeFakerFactory;
