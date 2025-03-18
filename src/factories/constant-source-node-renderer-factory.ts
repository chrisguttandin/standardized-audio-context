import { IAudioNodeRenderer, IConstantSourceNode, IMinimalOfflineAudioContext, IOfflineAudioContext } from '../interfaces';
import {
    TConnectAudioParamFunction,
    TGetNativeAudioNodeFunction,
    TNativeConstantSourceNode,
    TNativeOfflineAudioContext,
    TRenderInputsOfAudioNodeFunction
} from '../types';

export const createConstantSourceNodeRendererFactory = (
    connectAudioParam: TConnectAudioParamFunction,
    getNativeAudioNode: TGetNativeAudioNodeFunction,
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => {
    return <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>(): IAudioNodeRenderer<T, IConstantSourceNode<T>> => {
        const renderedNativeConstantSourceNodes = new WeakMap<TNativeOfflineAudioContext, TNativeConstantSourceNode>();

        return {
            async render(
                proxy: IConstantSourceNode<T>,
                nativeOfflineAudioContext: TNativeOfflineAudioContext
            ): Promise<TNativeConstantSourceNode> {
                const renderedNativeConstantSourceNode = renderedNativeConstantSourceNodes.get(nativeOfflineAudioContext);

                if (renderedNativeConstantSourceNode !== undefined) {
                    return renderedNativeConstantSourceNode;
                }

                const nativeConstantSourceNode = getNativeAudioNode<T, TNativeConstantSourceNode>(proxy);

                renderedNativeConstantSourceNodes.set(nativeOfflineAudioContext, nativeConstantSourceNode);

                await connectAudioParam(nativeOfflineAudioContext, proxy.offset, nativeConstantSourceNode.offset);
                await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeConstantSourceNode);

                return nativeConstantSourceNode;
            }
        };
    };
};
