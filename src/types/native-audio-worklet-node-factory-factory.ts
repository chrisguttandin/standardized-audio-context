import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TMonitorConnectionsFunction } from './monitor-connections-function';
import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeAudioWorkletNodeFactory } from './native-audio-worklet-node-factory';
import { TNativeAudioWorkletNodeFakerFactory } from './native-audio-worklet-node-faker-factory';
import { TNativeGainNodeFactory } from './native-gain-node-factory';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TNativeAudioWorkletNodeFactoryFactory = (
    createInvalidStateError: TInvalidStateErrorFactory,
    createNativeAudioNode: TNativeAudioNodeFactory,
    createNativeAudioWorkletNodeFaker: TNativeAudioWorkletNodeFakerFactory,
    createNativeGainNode: TNativeGainNodeFactory,
    createNotSupportedError: TNotSupportedErrorFactory,
    monitorConnections: TMonitorConnectionsFunction
) => TNativeAudioWorkletNodeFactory;
