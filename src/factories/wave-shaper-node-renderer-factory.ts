import { getNativeAudioNode } from '../helpers/get-native-audio-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IWaveShaperNode, IWaveShaperOptions } from '../interfaces';
import { TNativeOfflineAudioContext, TNativeWaveShaperNode, TWaveShaperNodeRendererFactoryFactory } from '../types';

export const createWaveShaperNodeRendererFactory: TWaveShaperNodeRendererFactoryFactory = (createNativeWaveShaperNode) => {
    return () => {
        let nativeWaveShaperNode: null | TNativeWaveShaperNode = null;

        return {
            render: async (
                proxy: IWaveShaperNode,
                nativeOfflineAudioContext: TNativeOfflineAudioContext
            ): Promise<TNativeWaveShaperNode> => {
                if (nativeWaveShaperNode !== null) {
                    return nativeWaveShaperNode;
                }

                nativeWaveShaperNode = getNativeAudioNode<TNativeWaveShaperNode>(proxy);

                /*
                 * If the initially used nativeWaveShaperNode was not constructed on the same OfflineAudioContext it needs to be created
                 * again.
                 */
                if (!isOwnedByContext(nativeWaveShaperNode, nativeOfflineAudioContext)) {
                    const options: IWaveShaperOptions = {
                        channelCount: nativeWaveShaperNode.channelCount,
                        channelCountMode: nativeWaveShaperNode.channelCountMode,
                        channelInterpretation: nativeWaveShaperNode.channelInterpretation,
                        curve: nativeWaveShaperNode.curve,
                        oversample: nativeWaveShaperNode.oversample
                    };

                    nativeWaveShaperNode = createNativeWaveShaperNode(nativeOfflineAudioContext, options);
                }

                await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeWaveShaperNode);

                return nativeWaveShaperNode;
            }
        };
    };
};
