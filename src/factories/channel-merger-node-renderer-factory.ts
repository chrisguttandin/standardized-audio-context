import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IAudioNode, IChannelMergerOptions } from '../interfaces';
import { TChannelMergerNodeRendererFactoryFactory, TNativeAudioNode, TUnpatchedOfflineAudioContext } from '../types';

export const createChannelMergerNodeRendererFactory: TChannelMergerNodeRendererFactoryFactory = (createNativeChannelMergerNode) => {
    return () => {
        let nativeNode: null | TNativeAudioNode = null;

        return {
            render: async (proxy: IAudioNode, offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<TNativeAudioNode> => {
                if (nativeNode !== null) {
                    return nativeNode;
                }

                nativeNode = getNativeNode(proxy);

                // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
                if (!isOwnedByContext(nativeNode, offlineAudioContext)) {
                    const options: IChannelMergerOptions = {
                        channelCount: nativeNode.channelCount,
                        channelCountMode: nativeNode.channelCountMode,
                        channelInterpretation: nativeNode.channelInterpretation,
                        numberOfInputs: nativeNode.numberOfInputs
                    };

                    nativeNode = createNativeChannelMergerNode(offlineAudioContext, options);
                }

                await renderInputsOfAudioNode(proxy, offlineAudioContext, nativeNode);

                return nativeNode;
            }
        };
    };
};
