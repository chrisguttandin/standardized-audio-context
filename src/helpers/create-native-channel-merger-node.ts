import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { IChannelMergerOptions } from '../interfaces';
import { TNativeChannelMergerNode, TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';
import { wrapChannelMergerNode } from '../wrappers/channel-merger-node';

export const createNativeChannelMergerNode = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    options: Partial<IChannelMergerOptions> = { }
): TNativeChannelMergerNode => {
    const nativeNode = nativeContext.createChannelMerger((options.numberOfInputs === undefined) ? 6 : options.numberOfInputs);

    assignNativeAudioNodeOptions(nativeNode, options);

    // Bug #15: Safari does not return the default properties.
    if (nativeNode.channelCount !== 1 &&
            nativeNode.channelCountMode !== 'explicit') {
        wrapChannelMergerNode(nativeContext, nativeNode);
    }

    // Bug #16: Firefox does not throw an error when setting a different channelCount or channelCountMode.
    try {
        nativeNode.channelCount = (options.numberOfInputs === undefined) ? 6 : options.numberOfInputs;

        wrapChannelMergerNode(nativeContext, nativeNode);
    } catch (err) {} // tslint:disable-line:no-empty

    return nativeNode;
};
