import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IAudioNode } from '../interfaces';
import { TAnalyserNodeRendererFactoryFactory, TNativeAudioNode, TUnpatchedOfflineAudioContext } from '../types';

export const createAnalyserNodeRendererFactory: TAnalyserNodeRendererFactoryFactory = (createNativeAnalyserNode) => {
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
                    nativeNode = createNativeAnalyserNode(offlineAudioContext);
                }

                await renderInputsOfAudioNode(proxy, offlineAudioContext, nativeNode);

                return nativeNode;
            }
        };
    };
};
