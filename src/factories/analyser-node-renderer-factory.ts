import { IAnalyserNode, IAudioNodeRenderer, IMinimalOfflineAudioContext, IOfflineAudioContext } from '../interfaces';
import { TGetNativeAudioNodeFunction, TNativeAnalyserNode, TNativeOfflineAudioContext, TRenderInputsOfAudioNodeFunction } from '../types';

export const createAnalyserNodeRendererFactory = (
    getNativeAudioNode: TGetNativeAudioNodeFunction,
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => {
    return <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>(): IAudioNodeRenderer<T, IAnalyserNode<T>> => {
        const renderedNativeAnalyserNodes = new WeakMap<TNativeOfflineAudioContext, TNativeAnalyserNode>();

        return {
            async render(proxy: IAnalyserNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext): Promise<TNativeAnalyserNode> {
                const renderedNativeAnalyserNode = renderedNativeAnalyserNodes.get(nativeOfflineAudioContext);

                if (renderedNativeAnalyserNode !== undefined) {
                    return renderedNativeAnalyserNode;
                }

                const nativeAnalyserNode = getNativeAudioNode<T, TNativeAnalyserNode>(proxy);

                renderedNativeAnalyserNodes.set(nativeOfflineAudioContext, nativeAnalyserNode);

                await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeAnalyserNode);

                return nativeAnalyserNode;
            }
        };
    };
};
