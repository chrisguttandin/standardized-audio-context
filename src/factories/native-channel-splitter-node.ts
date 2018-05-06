import { TNativeChannelSplitterNodeFactory } from '../types';
import { wrapChannelSplitterNode } from '../wrappers/channel-splitter-node';

export const createNativeChannelSplitterNode: TNativeChannelSplitterNodeFactory = (nativeContext, options) => {
    const nativeChannelSplitterNode = nativeContext.createChannelSplitter(options.numberOfOutputs);

    // Bug #29, #30, #31 & #32: Only Chrome & Opera partially support the spec yet.
    wrapChannelSplitterNode(nativeChannelSplitterNode);

    return nativeChannelSplitterNode;
};
