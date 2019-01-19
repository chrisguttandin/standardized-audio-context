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
        } catch { /* Ignore errors. */ } // tslint:disable-line:no-empty

        return nativeChannelMergerNode;
    };
};
