import { getNativeAudioNode } from '../helpers/get-native-audio-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IAudioNode, IChannelMergerOptions } from '../interfaces';
import { TChannelMergerNodeRendererFactoryFactory, TNativeAudioNode, TNativeOfflineAudioContext } from '../types';

export const createChannelMergerNodeRendererFactory: TChannelMergerNodeRendererFactoryFactory = (createNativeChannelMergerNode) => {
    return () => {
        let nativeAudioNodePromise: null | Promise<TNativeAudioNode> = null;

        const createAudioNode = async (proxy: IAudioNode, nativeOfflineAudioContext: TNativeOfflineAudioContext) => {
            let nativeAudioNode = getNativeAudioNode<TNativeAudioNode>(proxy);

            // If the initially used nativeAudioNode was not constructed on the same OfflineAudioContext it needs to be created again.
            if (!isOwnedByContext(nativeAudioNode, nativeOfflineAudioContext)) {
                const options: IChannelMergerOptions = {
                    channelCount: nativeAudioNode.channelCount,
                    channelCountMode: nativeAudioNode.channelCountMode,
                    channelInterpretation: nativeAudioNode.channelInterpretation,
                    numberOfInputs: nativeAudioNode.numberOfInputs
                };

                nativeAudioNode = createNativeChannelMergerNode(nativeOfflineAudioContext, options);
            }

            await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeAudioNode);

            return nativeAudioNode;
        };

        return {
            render (proxy: IAudioNode, nativeOfflineAudioContext: TNativeOfflineAudioContext): Promise<TNativeAudioNode> {
                if (nativeAudioNodePromise === null) {
                    nativeAudioNodePromise = createAudioNode(proxy, nativeOfflineAudioContext);
                }

                return nativeAudioNodePromise;
            }
        };
    };
};
