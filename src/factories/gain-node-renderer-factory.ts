import { connectAudioParam } from '../helpers/connect-audio-param';
import { getNativeAudioNode } from '../helpers/get-native-audio-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IGainNode, IMinimalOfflineAudioContext } from '../interfaces';
import { TGainNodeRendererFactoryFactory, TNativeGainNode, TNativeOfflineAudioContext } from '../types';

export const createGainNodeRendererFactory: TGainNodeRendererFactoryFactory = (createNativeGainNode) => {
    return <T extends IMinimalOfflineAudioContext>() => {
        const renderedNativeGainNodes = new WeakMap<TNativeOfflineAudioContext, TNativeGainNode>();

        const createGainNode = async (proxy: IGainNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext) => {
            let nativeGainNode = getNativeAudioNode<T, TNativeGainNode>(proxy);

            // If the initially used nativeGainNode was not constructed on the same OfflineAudioContext it needs to be created again.
            const nativeGainNodeIsOwnedByContext = isOwnedByContext(nativeGainNode, nativeOfflineAudioContext);

            if (!nativeGainNodeIsOwnedByContext) {
                const options = {
                    channelCount: nativeGainNode.channelCount,
                    channelCountMode: nativeGainNode.channelCountMode,
                    channelInterpretation: nativeGainNode.channelInterpretation,
                    gain: nativeGainNode.gain.value
                };

                nativeGainNode = createNativeGainNode(nativeOfflineAudioContext, options);
            }

            renderedNativeGainNodes.set(nativeOfflineAudioContext, nativeGainNode);

            if (!nativeGainNodeIsOwnedByContext) {
                await renderAutomation(nativeOfflineAudioContext, proxy.gain, nativeGainNode.gain);
            } else {
                await connectAudioParam(nativeOfflineAudioContext, proxy.gain);
            }

            await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeGainNode);

            return nativeGainNode;
        };

        return {
            render (proxy: IGainNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext): Promise<TNativeGainNode> {
                const renderedNativeGainNode = renderedNativeGainNodes.get(nativeOfflineAudioContext);

                if (renderedNativeGainNode !== undefined) {
                    return Promise.resolve(renderedNativeGainNode);
                }

                return createGainNode(proxy, nativeOfflineAudioContext);
            }
        };
    };
};
