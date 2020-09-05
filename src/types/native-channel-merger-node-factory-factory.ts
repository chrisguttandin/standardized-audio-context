import { TNativeChannelMergerNodeFactory } from './native-channel-merger-node-factory';
import { TWrapChannelMergerNodeFunction } from './wrap-channel-merger-node-function';

export type TNativeChannelMergerNodeFactoryFactory = (
    wrapChannelMergerNode: TWrapChannelMergerNodeFunction
) => TNativeChannelMergerNodeFactory;
