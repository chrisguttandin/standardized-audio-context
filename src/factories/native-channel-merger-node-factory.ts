import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeChannelMergerNodeFactoryFactory } from '../types';

export const createNativeChannelMergerNodeFactory: TNativeChannelMergerNodeFactoryFactory = (
    createNativeAudioNode,
    wrapChannelMergerNode
) => {
    return (nativeContext, options) => {
        const nativeChannelMergerNode = createNativeAudioNode(nativeContext, (ntvCntxt) => {
            return ntvCntxt.createChannelMerger(options.numberOfInputs);
        });

        // Bug #15: Safari does not return the default properties.
        // Bug #16: Safari does not throw an error when setting a different channelCount or channelCountMode.
        if (nativeChannelMergerNode.channelCount !== 1 && nativeChannelMergerNode.channelCountMode !== 'explicit') {
            wrapChannelMergerNode(nativeContext, nativeChannelMergerNode);
        }

        assignNativeAudioNodeOptions(nativeChannelMergerNode, options);

        return nativeChannelMergerNode;
    };
};
