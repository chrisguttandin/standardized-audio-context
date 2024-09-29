import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeChannelMergerNodeFactory } from '../types';

export const createNativeChannelMergerNode: TNativeChannelMergerNodeFactory = (nativeContext, options) => {
    const nativeChannelMergerNode = nativeContext.createChannelMerger(options.numberOfInputs);

    assignNativeAudioNodeOptions(nativeChannelMergerNode, options);

    return nativeChannelMergerNode;
};
