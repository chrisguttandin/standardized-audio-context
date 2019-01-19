import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeChannelSplitterNodeFactoryFactory } from '../types';
import { wrapChannelSplitterNode } from '../wrappers/channel-splitter-node';

export const createNativeChannelSplitterNodeFactory: TNativeChannelSplitterNodeFactoryFactory = (createNativeAudioNode) => {
    return (nativeContext, options) => {
        const nativeChannelSplitterNode = createNativeAudioNode(nativeContext, (ntvCntxt) => {
            return ntvCntxt.createChannelSplitter(options.numberOfOutputs);
        });

        // Bug #96: Safari does not have the correct channelCount.
        // Bug #29: Edge & Safari do not have the correct channelCountMode.
        // Bug #31: Edge & Safari do not have the correct channelInterpretation.
        assignNativeAudioNodeOptions(nativeChannelSplitterNode, options);

        // Bug #29, #30, #31, #32, #96 & #97: Only Chrome, Firefox & Opera partially support the spec yet.
        wrapChannelSplitterNode(nativeChannelSplitterNode);

        return nativeChannelSplitterNode;
    };
};
