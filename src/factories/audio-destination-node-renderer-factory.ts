import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IAudioDestinationNode } from '../interfaces';
import { TAudioDestinationNodeRendererFactory, TNativeAudioDestinationNode, TUnpatchedOfflineAudioContext } from '../types';

export const createAudioDestinationNodeRenderer: TAudioDestinationNodeRendererFactory = () => {
    let nativeNode: null | TNativeAudioDestinationNode = null;

    return {
        render: async (
            proxy: IAudioDestinationNode,
            offlineAudioContext: TUnpatchedOfflineAudioContext
        ): Promise<TNativeAudioDestinationNode> => {
            if (nativeNode !== null) {
                return nativeNode;
            }

            nativeNode = offlineAudioContext.destination;

            await renderInputsOfAudioNode(proxy, offlineAudioContext, nativeNode);

            return nativeNode;
        }
    };
};
