import { connectAudioParam } from '../helpers/connect-audio-param';
import { getNativeAudioNode } from '../helpers/get-native-audio-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IGainNode, IGainOptions } from '../interfaces';
import { TGainNodeRendererFactoryFactory, TNativeGainNode, TNativeOfflineAudioContext } from '../types';

export const createGainNodeRendererFactory: TGainNodeRendererFactoryFactory = (createNativeGainNode) => {
    return () => {
        let nativeGainNode: null | TNativeGainNode = null;

        return {
            render: async (proxy: IGainNode, nativeOfflineAudioContext: TNativeOfflineAudioContext): Promise<TNativeGainNode> => {
                if (nativeGainNode !== null) {
                    return nativeGainNode;
                }

                nativeGainNode = getNativeAudioNode<TNativeGainNode>(proxy);

                // If the initially used nativeGainNode was not constructed on the same OfflineAudioContext it needs to be created again.
                if (!isOwnedByContext(nativeGainNode, nativeOfflineAudioContext)) {
                    const options: IGainOptions = {
                        channelCount: nativeGainNode.channelCount,
                        channelCountMode: nativeGainNode.channelCountMode,
                        channelInterpretation: nativeGainNode.channelInterpretation,
                        gain: nativeGainNode.gain.value
                    };

                    nativeGainNode = createNativeGainNode(nativeOfflineAudioContext, options);

                    await renderAutomation(proxy.context, nativeOfflineAudioContext, proxy.gain, nativeGainNode.gain);
                } else {
                    await connectAudioParam(proxy.context, nativeOfflineAudioContext, proxy.gain);
                }

                await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeGainNode);

                return nativeGainNode;
            }
        };
    };
};
