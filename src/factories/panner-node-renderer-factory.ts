import { IAudioNodeRenderer, IMinimalOfflineAudioContext, IOfflineAudioContext, IPannerNode } from '../interfaces';
import {
    TConnectAudioParamFunction,
    TGetNativeAudioNodeFunction,
    TNativeGainNode,
    TNativeOfflineAudioContext,
    TNativePannerNode,
    TRenderInputsOfAudioNodeFunction
} from '../types';

export const createPannerNodeRendererFactory = (
    connectAudioParam: TConnectAudioParamFunction,
    getNativeAudioNode: TGetNativeAudioNodeFunction,
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => {
    return <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>(): IAudioNodeRenderer<T, IPannerNode<T>> => {
        const renderedNativeAudioNodes = new WeakMap<TNativeOfflineAudioContext, TNativeGainNode | TNativePannerNode>();

        return {
            async render(
                proxy: IPannerNode<T>,
                nativeOfflineAudioContext: TNativeOfflineAudioContext
            ): Promise<TNativeGainNode | TNativePannerNode> {
                const renderedNativeGainNodeOrNativePannerNode = renderedNativeAudioNodes.get(nativeOfflineAudioContext);

                if (renderedNativeGainNodeOrNativePannerNode !== undefined) {
                    return renderedNativeGainNodeOrNativePannerNode;
                }

                const nativePannerNode = getNativeAudioNode<T, TNativePannerNode>(proxy);

                renderedNativeAudioNodes.set(nativeOfflineAudioContext, nativePannerNode);

                await connectAudioParam(nativeOfflineAudioContext, proxy.orientationX, nativePannerNode.orientationX);
                await connectAudioParam(nativeOfflineAudioContext, proxy.orientationY, nativePannerNode.orientationY);
                await connectAudioParam(nativeOfflineAudioContext, proxy.orientationZ, nativePannerNode.orientationZ);
                await connectAudioParam(nativeOfflineAudioContext, proxy.positionX, nativePannerNode.positionX);
                await connectAudioParam(nativeOfflineAudioContext, proxy.positionY, nativePannerNode.positionY);
                await connectAudioParam(nativeOfflineAudioContext, proxy.positionZ, nativePannerNode.positionZ);
                await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativePannerNode);

                return nativePannerNode;
            }
        };
    };
};
