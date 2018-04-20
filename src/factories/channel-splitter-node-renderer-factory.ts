import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IAudioNode, IChannelSplitterOptions } from '../interfaces';
import { TChannelSplitterNodeRendererFactoryFactory, TNativeAudioNode, TNativeOfflineAudioContext } from '../types';

export const createChannelSplitterNodeRendererFactory: TChannelSplitterNodeRendererFactoryFactory = (createNativeChannelSplitterNode) => {
    return () => {
        let nativeNode: null | TNativeAudioNode = null;

        return {
            render: async (proxy: IAudioNode, nativeOfflineAudioContext: TNativeOfflineAudioContext): Promise<TNativeAudioNode> => {
                if (nativeNode !== null) {
                    return nativeNode;
                }

                nativeNode = getNativeNode(proxy);

                // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
                if (!isOwnedByContext(nativeNode, nativeOfflineAudioContext)) {
                    const options: IChannelSplitterOptions = {
                        channelCount: nativeNode.channelCount,
                        channelCountMode: nativeNode.channelCountMode,
                        channelInterpretation: nativeNode.channelInterpretation,
                        numberOfOutputs: nativeNode.numberOfOutputs
                    };

                    nativeNode = createNativeChannelSplitterNode(nativeOfflineAudioContext, options);
                }

                await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeNode);

                return nativeNode;
            }
        };
    };
};
