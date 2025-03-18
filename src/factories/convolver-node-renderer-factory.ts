import { IAudioNodeRenderer, IConvolverNode, IMinimalOfflineAudioContext, IOfflineAudioContext } from '../interfaces';
import { TGetNativeAudioNodeFunction, TNativeConvolverNode, TNativeOfflineAudioContext, TRenderInputsOfAudioNodeFunction } from '../types';

export const createConvolverNodeRendererFactory = (
    getNativeAudioNode: TGetNativeAudioNodeFunction,
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => {
    return <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>(): IAudioNodeRenderer<T, IConvolverNode<T>> => {
        const renderedNativeConvolverNodes = new WeakMap<TNativeOfflineAudioContext, TNativeConvolverNode>();

        return {
            async render(proxy: IConvolverNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext): Promise<TNativeConvolverNode> {
                const renderedNativeConvolverNode = renderedNativeConvolverNodes.get(nativeOfflineAudioContext);

                if (renderedNativeConvolverNode !== undefined) {
                    return renderedNativeConvolverNode;
                }

                const nativeConvolverNode = getNativeAudioNode<T, TNativeConvolverNode>(proxy);

                renderedNativeConvolverNodes.set(nativeOfflineAudioContext, nativeConvolverNode);

                await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeConvolverNode);

                return nativeConvolverNode;
            }
        };
    };
};
