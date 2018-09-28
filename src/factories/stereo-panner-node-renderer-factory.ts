import { connectAudioParam } from '../helpers/connect-audio-param';
import { getNativeAudioNode } from '../helpers/get-native-audio-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { INativeStereoPannerNodeFaker, IStereoPannerNode, IStereoPannerOptions } from '../interfaces';
import { TNativeOfflineAudioContext, TNativeStereoPannerNode, TStereoPannerNodeRendererFactoryFactory } from '../types';

export const createStereoPannerNodeRendererFactory: TStereoPannerNodeRendererFactoryFactory = (createNativeStereoPannerNode) => {
    return () => {
        let nativeStereoPannerNode: null | TNativeStereoPannerNode = null;

        return {
            render: async (
                proxy: IStereoPannerNode,
                nativeOfflineAudioContext: TNativeOfflineAudioContext
            ): Promise<TNativeStereoPannerNode> => {
                if (nativeStereoPannerNode !== null) {
                    return nativeStereoPannerNode;
                }

                nativeStereoPannerNode = getNativeAudioNode<TNativeStereoPannerNode>(proxy);

                /*
                 * If the initially used nativeStereoPannerNode was not constructed on the same OfflineAudioContext it needs to be created
                 * again.
                 */
                if (!isOwnedByContext(nativeStereoPannerNode, nativeOfflineAudioContext)) {
                    const options: IStereoPannerOptions = {
                        channelCount: nativeStereoPannerNode.channelCount,
                        channelCountMode: nativeStereoPannerNode.channelCountMode,
                        channelInterpretation: nativeStereoPannerNode.channelInterpretation,
                        pan: nativeStereoPannerNode.pan.value
                    };

                    nativeStereoPannerNode = createNativeStereoPannerNode(nativeOfflineAudioContext, options);

                    await renderAutomation(proxy.context, nativeOfflineAudioContext, proxy.pan, nativeStereoPannerNode.pan);
                } else {
                    await connectAudioParam(proxy.context, nativeOfflineAudioContext, proxy.pan);
                }

                if ((<INativeStereoPannerNodeFaker> nativeStereoPannerNode).inputs !== undefined) {
                    await renderInputsOfAudioNode(
                        proxy,
                        nativeOfflineAudioContext,
                        (<INativeStereoPannerNodeFaker> nativeStereoPannerNode).inputs[0]
                    );
                } else {
                    await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeStereoPannerNode);
                }

                return nativeStereoPannerNode;
            }
        };
    };
};
