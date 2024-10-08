import { TConnectedNativeAudioBufferSourceNodeFactory } from './connected-native-audio-buffer-source-node-factory';
import { TIsDCCurveFunction } from './is-dc-curve-function';
import { TMonitorConnectionsFunction } from './monitor-connections-function';
import { TNativeGainNodeFactory } from './native-gain-node-factory';
import { TNativeWaveShaperNodeFakerFactory } from './native-wave-shaper-node-faker-factory';

export type TNativeWaveShaperNodeFakerFactoryFactory = (
    createConnectedNativeAudioBufferSourceNode: TConnectedNativeAudioBufferSourceNodeFactory,
    createNativeGainNode: TNativeGainNodeFactory,
    isDCCurve: TIsDCCurveFunction,
    monitorConnections: TMonitorConnectionsFunction
) => TNativeWaveShaperNodeFakerFactory;
