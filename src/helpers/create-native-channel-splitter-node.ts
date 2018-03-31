import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { IChannelSplitterOptions } from '../interfaces';
import { TNativeChannelSplitterNode, TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';
import { wrapChannelSplitterNode } from '../wrappers/channel-splitter-node';

export const createNativeChannelSplitterNode = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    options: Partial<IChannelSplitterOptions> = { }
): TNativeChannelSplitterNode => {
    const nativeNode = nativeContext.createChannelSplitter((options.numberOfOutputs === undefined) ? 6 : options.numberOfOutputs);

    assignNativeAudioNodeOptions(nativeNode, options);

    // Bug #29 - #32: Only Chrome & Opera partially support the spec yet.
    wrapChannelSplitterNode(nativeNode);

    return nativeNode;
};
