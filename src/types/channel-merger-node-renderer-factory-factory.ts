import { TChannelMergerNodeRendererFactory } from './channel-merger-node-renderer-factory';
import { TNativeChannelMergerNodeFactory } from './native-channel-merger-node-factory';

export type TChannelMergerNodeRendererFactoryFactory = (
    createNativeChannelMergerNode: TNativeChannelMergerNodeFactory
) => TChannelMergerNodeRendererFactory;
