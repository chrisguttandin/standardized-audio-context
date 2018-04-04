import { connectAudioParam } from '../helpers/connect-audio-param';
import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IGainNode, IGainOptions } from '../interfaces';
import { TGainNodeRendererFactoryFactory, TNativeGainNode, TNativeOfflineAudioContext } from '../types';

export const createGainNodeRendererFactory: TGainNodeRendererFactoryFactory = (createNativeGainNode) => {
    return () => {
        let nativeNode: null | TNativeGainNode = null;

        return {
            render: async (proxy: IGainNode, offlineAudioContext: TNativeOfflineAudioContext): Promise<TNativeGainNode> => {
                if (nativeNode !== null) {
                    return nativeNode;
                }

                nativeNode = <TNativeGainNode> getNativeNode(proxy);

                // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
                if (!isOwnedByContext(nativeNode, offlineAudioContext)) {
                    const options: IGainOptions = {
                        channelCount: nativeNode.channelCount,
                        channelCountMode: nativeNode.channelCountMode,
                        channelInterpretation: nativeNode.channelInterpretation,
                        gain: nativeNode.gain.value
                    };

                    nativeNode = createNativeGainNode(offlineAudioContext, options);

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
