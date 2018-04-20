import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeChannelMergerNodeFactory } from '../types';
import { wrapChannelMergerNode } from '../wrappers/channel-merger-node';

export const createNativeChannelMergerNode: TNativeChannelMergerNodeFactory = (nativeContext, options = { }) => {
    const nativeChannelMergerNode = nativeContext.createChannelMerger((options.numberOfInputs === undefined) ? 6 : options.numberOfInputs);

    assignNativeAudioNodeOptions(nativeChannelMergerNode, options);

    // Bug #15: Safari does not return the default properties.
    if (nativeChannelMergerNode.channelCount !== 1 &&
            nativeChannelMergerNode.channelCountMode !== 'explicit') {
        wrapChannelMergerNode(nativeContext, nativeChannelMergerNode);
    }

    // Bug #16: Firefox does not throw an error when setting a different channelCount or channelCountMode.
    try {
        nativeChannelMergerNode.channelCount = (options.numberOfInputs === undefined) ? 6 : options.numberOfInputs;

        wrapChannelMergerNode(nativeContext, nativeChannelMergerNode);
    } catch (err) {} // tslint:disable-line:no-empty

    return nativeChannelMergerNode;
};
