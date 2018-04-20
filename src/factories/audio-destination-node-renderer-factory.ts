import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IAudioDestinationNode } from '../interfaces';
import { TAudioDestinationNodeRendererFactory, TNativeAudioDestinationNode, TNativeOfflineAudioContext } from '../types';

export const createAudioDestinationNodeRenderer: TAudioDestinationNodeRendererFactory = () => {
    let nativeAudioDestinationNode: null | TNativeAudioDestinationNode = null;

    return {
        render: async (
            proxy: IAudioDestinationNode,
            nativeOfflineAudioContext: TNativeOfflineAudioContext
        ): Promise<TNativeAudioDestinationNode> => {
            if (nativeAudioDestinationNode !== null) {
                return nativeAudioDestinationNode;
            }

            nativeAudioDestinationNode = nativeOfflineAudioContext.destination;

            await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeAudioDestinationNode);

            return nativeAudioDestinationNode;
        }
    };
};
