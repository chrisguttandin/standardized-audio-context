import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IAudioDestinationNode } from '../interfaces';
import { TAudioDestinationNodeRendererFactory, TNativeAudioDestinationNode, TNativeOfflineAudioContext } from '../types';

export const createAudioDestinationNodeRenderer: TAudioDestinationNodeRendererFactory = () => {
    let nativeAudioDestinationNodePromise: null | Promise<TNativeAudioDestinationNode> = null;

    const createAudioDestinationNode = async (proxy: IAudioDestinationNode, nativeOfflineAudioContext: TNativeOfflineAudioContext) => {
        const nativeAudioDestinationNode = nativeOfflineAudioContext.destination;

        await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeAudioDestinationNode);

        return nativeAudioDestinationNode;
    };

    return {
        render (
            proxy: IAudioDestinationNode,
            nativeOfflineAudioContext: TNativeOfflineAudioContext
        ): Promise<TNativeAudioDestinationNode> {
            if (nativeAudioDestinationNodePromise === null) {
                nativeAudioDestinationNodePromise = createAudioDestinationNode(proxy, nativeOfflineAudioContext);
            }

            return nativeAudioDestinationNodePromise;
        }
    };
};
