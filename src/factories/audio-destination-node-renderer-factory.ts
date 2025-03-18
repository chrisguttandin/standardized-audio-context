import { IAudioDestinationNode, IAudioNodeRenderer, IMinimalOfflineAudioContext, IOfflineAudioContext } from '../interfaces';
import { TNativeAudioDestinationNode, TNativeOfflineAudioContext, TRenderInputsOfAudioNodeFunction } from '../types';

export const createAudioDestinationNodeRenderer = <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>(
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
): IAudioNodeRenderer<T, IAudioDestinationNode<T>> => {
    const renderedNativeAudioDestinationNodes = new WeakMap<TNativeOfflineAudioContext, TNativeAudioDestinationNode>();

    return {
        async render(
            proxy: IAudioDestinationNode<T>,
            nativeOfflineAudioContext: TNativeOfflineAudioContext
        ): Promise<TNativeAudioDestinationNode> {
            const renderedNativeAudioDestinationNode = renderedNativeAudioDestinationNodes.get(nativeOfflineAudioContext);

            if (renderedNativeAudioDestinationNode !== undefined) {
                return renderedNativeAudioDestinationNode;
            }

            const nativeAudioDestinationNode = nativeOfflineAudioContext.destination;

            renderedNativeAudioDestinationNodes.set(nativeOfflineAudioContext, nativeAudioDestinationNode);

            await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeAudioDestinationNode);

            return nativeAudioDestinationNode;
        }
    };
};
