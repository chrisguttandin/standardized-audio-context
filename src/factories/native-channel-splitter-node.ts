import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { wrapChannelSplitterNode } from '../helpers/wrap-channel-splitter-node';
import { TNativeChannelSplitterNodeFactory } from '../types';

export const createNativeChannelSplitterNode: TNativeChannelSplitterNodeFactory = (nativeContext, options) => {
    const nativeChannelSplitterNode = nativeContext.createChannelSplitter(options.numberOfOutputs);

    assignNativeAudioNodeOptions(nativeChannelSplitterNode, options);

    // Bug #30, #32 & #97: Only Chrome and Firefox partially support the spec yet.
    wrapChannelSplitterNode(nativeChannelSplitterNode);

    return nativeChannelSplitterNode;
};
