import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeChannelSplitterNodeFactory } from '../types';

export const createNativeChannelSplitterNode: TNativeChannelSplitterNodeFactory = (nativeContext, options) => {
    const nativeChannelSplitterNode = nativeContext.createChannelSplitter(options.numberOfOutputs);

    assignNativeAudioNodeOptions(nativeChannelSplitterNode, options);

    return nativeChannelSplitterNode;
};
