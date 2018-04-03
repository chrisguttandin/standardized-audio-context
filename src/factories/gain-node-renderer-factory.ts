import { connectAudioParam } from '../helpers/connect-audio-param';
import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IGainNode } from '../interfaces';
import { TGainNodeRendererFactoryFactory, TNativeGainNode, TUnpatchedOfflineAudioContext } from '../types';

export const createGainNodeRendererFactory: TGainNodeRendererFactoryFactory = (createNativeGainNode) => {
    return () => {
        let nativeNode: null | TNativeGainNode = null;

        return {
            render: async (proxy: IGainNode, offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<TNativeGainNode> => {
                if (nativeNode !== null) {
                    return nativeNode;
                }

                nativeNode = <TNativeGainNode> getNativeNode(proxy);

                // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
                if (!isOwnedByContext(nativeNode, offlineAudioContext)) {
                    nativeNode = createNativeGainNode(offlineAudioContext);

                    await renderAutomation(proxy.context, offlineAudioContext, proxy.gain, nativeNode.gain);
                } else {
                    await connectAudioParam(proxy.context, offlineAudioContext, proxy.gain);
                }

                await renderInputsOfAudioNode(proxy, offlineAudioContext, nativeNode);

                return nativeNode;
            }
        };
    };
};
