import { IAudioBufferSourceNode, IAudioNodeRenderer, IMinimalOfflineAudioContext, IOfflineAudioContext } from '../interfaces';
import {
    TConnectAudioParamFunction,
    TGetNativeAudioNodeFunction,
    TNativeAudioBufferSourceNode,
    TNativeOfflineAudioContext,
    TRenderInputsOfAudioNodeFunction
} from '../types';

export const createAudioBufferSourceNodeRendererFactory = (
    connectAudioParam: TConnectAudioParamFunction,
    getNativeAudioNode: TGetNativeAudioNodeFunction,
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => {
    return <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>(): IAudioNodeRenderer<T, IAudioBufferSourceNode<T>> => {
        const renderedNativeAudioBufferSourceNodes = new WeakMap<TNativeOfflineAudioContext, TNativeAudioBufferSourceNode>();

        return {
            async render(
                proxy: IAudioBufferSourceNode<T>,
                nativeOfflineAudioContext: TNativeOfflineAudioContext
            ): Promise<TNativeAudioBufferSourceNode> {
                const renderedNativeAudioBufferSourceNode = renderedNativeAudioBufferSourceNodes.get(nativeOfflineAudioContext);

                if (renderedNativeAudioBufferSourceNode !== undefined) {
                    return renderedNativeAudioBufferSourceNode;
                }

                const nativeAudioBufferSourceNode = getNativeAudioNode<T, TNativeAudioBufferSourceNode>(proxy);

                renderedNativeAudioBufferSourceNodes.set(nativeOfflineAudioContext, nativeAudioBufferSourceNode);

                await connectAudioParam(nativeOfflineAudioContext, proxy.detune, nativeAudioBufferSourceNode.detune);
                await connectAudioParam(nativeOfflineAudioContext, proxy.playbackRate, nativeAudioBufferSourceNode.playbackRate);
                await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeAudioBufferSourceNode);

                return nativeAudioBufferSourceNode;
            }
        };
    };
};
