import { IAudioDestinationNode, IMinimalOfflineAudioContext } from '../interfaces';
import {
    TAudioDestinationNodeRendererFactory,
    TNativeAudioDestinationNode,
    TNativeOfflineAudioContext,
    TRenderInputsOfAudioNodeFunction
} from '../types';

export const createAudioDestinationNodeRenderer: TAudioDestinationNodeRendererFactory = <T extends IMinimalOfflineAudioContext>(
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => {
    let nativeAudioDestinationNodePromise: null | Promise<TNativeAudioDestinationNode> = null;

    const createAudioDestinationNode = async (proxy: IAudioDestinationNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext) => {
        const nativeAudioDestinationNode = nativeOfflineAudioContext.destination;

        await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeAudioDestinationNode);

        return nativeAudioDestinationNode;
    };

    return {
        render (
            proxy: IAudioDestinationNode<T>,
            nativeOfflineAudioContext: TNativeOfflineAudioContext
        ): Promise<TNativeAudioDestinationNode> {
            if (nativeAudioDestinationNodePromise === null) {
                nativeAudioDestinationNodePromise = createAudioDestinationNode(proxy, nativeOfflineAudioContext);
            }

            return nativeAudioDestinationNodePromise;
        }
    };
};
