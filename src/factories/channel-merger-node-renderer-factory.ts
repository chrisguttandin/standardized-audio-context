import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { IAudioNode, IAudioNodeRenderer, IMinimalOfflineAudioContext, IOfflineAudioContext } from '../interfaces';
import {
    TGetNativeAudioNodeFunction,
    TNativeAudioNode,
    TNativeChannelMergerNodeFactory,
    TNativeOfflineAudioContext,
    TRenderInputsOfAudioNodeFunction
} from '../types';

export const createChannelMergerNodeRendererFactory = (
    createNativeChannelMergerNode: TNativeChannelMergerNodeFactory,
    getNativeAudioNode: TGetNativeAudioNodeFunction,
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => {
    return <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>(): IAudioNodeRenderer<T, IAudioNode<T>> => {
        const renderedNativeAudioNodes = new WeakMap<TNativeOfflineAudioContext, TNativeAudioNode>();

        const createAudioNode = async (proxy: IAudioNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext) => {
            let nativeAudioNode = getNativeAudioNode<T, TNativeAudioNode>(proxy);

            // If the initially used nativeAudioNode was not constructed on the same OfflineAudioContext it needs to be created again.
            const nativeAudioNodeIsOwnedByContext = isOwnedByContext(nativeAudioNode, nativeOfflineAudioContext);

            if (!nativeAudioNodeIsOwnedByContext) {
                const options = {
                    channelCount: nativeAudioNode.channelCount,
                    channelCountMode: nativeAudioNode.channelCountMode,
                    channelInterpretation: nativeAudioNode.channelInterpretation,
                    numberOfInputs: nativeAudioNode.numberOfInputs
                };

                nativeAudioNode = createNativeChannelMergerNode(nativeOfflineAudioContext, options);
            }

            renderedNativeAudioNodes.set(nativeOfflineAudioContext, nativeAudioNode);

            await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeAudioNode);

            return nativeAudioNode;
        };

        return {
            render(proxy: IAudioNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext): Promise<TNativeAudioNode> {
                const renderedNativeAudioNode = renderedNativeAudioNodes.get(nativeOfflineAudioContext);

                if (renderedNativeAudioNode !== undefined) {
                    return Promise.resolve(renderedNativeAudioNode);
                }

                return createAudioNode(proxy, nativeOfflineAudioContext);
            }
        };
    };
};
