import { IAudioNode, IAudioNodeRenderer, IMinimalOfflineAudioContext, IOfflineAudioContext } from '../interfaces';
import { TGetNativeAudioNodeFunction, TNativeAudioNode, TNativeOfflineAudioContext, TRenderInputsOfAudioNodeFunction } from '../types';

export const createChannelMergerNodeRendererFactory = (
    getNativeAudioNode: TGetNativeAudioNodeFunction,
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => {
    return <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>(): IAudioNodeRenderer<T, IAudioNode<T>> => {
        const renderedNativeAudioNodes = new WeakMap<TNativeOfflineAudioContext, TNativeAudioNode>();

        return {
            async render(proxy: IAudioNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext): Promise<TNativeAudioNode> {
                const renderedNativeAudioNode = renderedNativeAudioNodes.get(nativeOfflineAudioContext);

                if (renderedNativeAudioNode !== undefined) {
                    return renderedNativeAudioNode;
                }

                const nativeAudioNode = getNativeAudioNode<T, TNativeAudioNode>(proxy);

                renderedNativeAudioNodes.set(nativeOfflineAudioContext, nativeAudioNode);

                await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeAudioNode);

                return nativeAudioNode;
            }
        };
    };
};
