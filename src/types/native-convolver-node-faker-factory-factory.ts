import { TMonitorConnectionsFunction } from './monitor-connections-function';
import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeConvolverNodeFakerFactory } from './native-convolver-node-faker-factory';
import { TNativeGainNodeFactory } from './native-gain-node-factory';

export type TNativeConvolverNodeFakerFactoryFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory,
    createNativeGainNode: TNativeGainNodeFactory,
    monitorConnections: TMonitorConnectionsFunction
) => TNativeConvolverNodeFakerFactory;
