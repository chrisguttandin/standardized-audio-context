import { IAudioDestinationNode, IAudioNode, IMinimalOfflineAudioContext, IOfflineAudioContext } from '../interfaces';
import {
    TAudioDestinationNodeRendererFactory,
    TNativeAudioDestinationNode,
    TNativeOfflineAudioContext,
    TRenderInputsOfAudioNodeFunction
} from '../types';

export const createAudioDestinationNodeRenderer: TAudioDestinationNodeRendererFactory = <
    T extends IMinimalOfflineAudioContext | IOfflineAudioContext
>(
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => {
    let nativeAudioDestinationNodePromise: null | Promise<TNativeAudioDestinationNode> = null;

    const createAudioDestinationNode = async (
        proxy: IAudioDestinationNode<T>,
        nativeOfflineAudioContext: TNativeOfflineAudioContext,
        trace: readonly IAudioNode<T>[]
    ) => {
        const nativeAudioDestinationNode = nativeOfflineAudioContext.destination;

        await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeAudioDestinationNode, trace);

        return nativeAudioDestinationNode;
    };

    return {
        render(
            proxy: IAudioDestinationNode<T>,
            nativeOfflineAudioContext: TNativeOfflineAudioContext,
            trace: readonly IAudioNode<T>[]
        ): Promise<TNativeAudioDestinationNode> {
            if (nativeAudioDestinationNodePromise === null) {
                nativeAudioDestinationNodePromise = createAudioDestinationNode(proxy, nativeOfflineAudioContext, trace);
            }

            return nativeAudioDestinationNodePromise;
        }
    };
};
