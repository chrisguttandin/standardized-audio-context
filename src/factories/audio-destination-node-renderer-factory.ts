import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IAudioDestinationNode } from '../interfaces';
import { TAudioDestinationNodeRendererFactory, TNativeAudioDestinationNode, TNativeOfflineAudioContext } from '../types';

export const createAudioDestinationNodeRenderer: TAudioDestinationNodeRendererFactory = () => {
    let nativeNode: null | TNativeAudioDestinationNode = null;

    return {
        render: async (
            proxy: IAudioDestinationNode,
            nativeOfflineAudioContext: TNativeOfflineAudioContext
        ): Promise<TNativeAudioDestinationNode> => {
            if (nativeNode !== null) {
                return nativeNode;
            }

            nativeNode = nativeOfflineAudioContext.destination;

            await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeNode);

            return nativeNode;
        }
    };
};
