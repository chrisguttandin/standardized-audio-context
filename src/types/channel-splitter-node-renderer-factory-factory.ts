import { TChannelSplitterNodeRendererFactory } from './channel-splitter-node-renderer-factory';
import { TNativeChannelSplitterNodeFactory } from './native-channel-splitter-node-factory';

export type TChannelSplitterNodeRendererFactoryFactory = (
    createNativeChannelSplitterNode: TNativeChannelSplitterNodeFactory
) => TChannelSplitterNodeRendererFactory;
