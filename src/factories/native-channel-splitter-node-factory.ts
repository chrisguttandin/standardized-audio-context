import { TNativeChannelSplitterNodeFactoryFactory } from '../types';
import { wrapChannelSplitterNode } from '../wrappers/channel-splitter-node';

export const createNativeChannelSplitterNodeFactory: TNativeChannelSplitterNodeFactoryFactory = (createNativeAudioNode) => {
    return (nativeContext, options) => {
        const nativeChannelSplitterNode = createNativeAudioNode(nativeContext, (ntvCntxt) => {
            return ntvCntxt.createChannelSplitter(options.numberOfOutputs);
        });

        // Bug #29, #30, #31, #32, #96 & #97: Only Chrome, Firefox & Opera partially support the spec yet.
        wrapChannelSplitterNode(nativeChannelSplitterNode);

        return nativeChannelSplitterNode;
    };
};
