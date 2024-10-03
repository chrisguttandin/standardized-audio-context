import { TConnectedNativeAudioBufferSourceNodeFactory } from './connected-native-audio-buffer-source-node-factory';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TIsDCCurveFunction } from './is-dc-curve-function';
import { TMonitorConnectionsFunction } from './monitor-connections-function';
import { TNativeWaveShaperNodeFactory } from './native-wave-shaper-node-factory';
import { TOverwriteAccessorsFunction } from './overwrite-accessors-function';

export type TNativeWaveShaperNodeFactoryFactory = (
    createConnectedNativeAudioBufferSourceNode: TConnectedNativeAudioBufferSourceNodeFactory,
    createInvalidStateError: TInvalidStateErrorFactory,
    isDCCurve: TIsDCCurveFunction,
    monitorConnections: TMonitorConnectionsFunction,
    overwriteAccessors: TOverwriteAccessorsFunction
) => TNativeWaveShaperNodeFactory;
