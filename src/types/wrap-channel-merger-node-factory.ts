import { TMonitorConnectionsFunction } from './monitor-connections-function';
import { TWrapChannelMergerNodeFunction } from './wrap-channel-merger-node-function';

export type TWrapChannelMergerNodeFactory = (monitorConnectionsFunction: TMonitorConnectionsFunction) => TWrapChannelMergerNodeFunction;
