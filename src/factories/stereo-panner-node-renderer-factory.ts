import { IAudioNodeRenderer, IMinimalOfflineAudioContext, IOfflineAudioContext, IStereoPannerNode } from '../interfaces';
import {
    TConnectAudioParamFunction,
    TGetNativeAudioNodeFunction,
    TNativeOfflineAudioContext,
    TNativeStereoPannerNode,
    TRenderInputsOfAudioNodeFunction
} from '../types';

export const createStereoPannerNodeRendererFactory = (
    connectAudioParam: TConnectAudioParamFunction,
    getNativeAudioNode: TGetNativeAudioNodeFunction,
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => {
    return <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>(): IAudioNodeRenderer<T, IStereoPannerNode<T>> => {
        const renderedNativeStereoPannerNodes = new WeakMap<TNativeOfflineAudioContext, TNativeStereoPannerNode>();

        return {
            async render(
                proxy: IStereoPannerNode<T>,
                nativeOfflineAudioContext: TNativeOfflineAudioContext
            ): Promise<TNativeStereoPannerNode> {
                const renderedNativeStereoPannerNode = renderedNativeStereoPannerNodes.get(nativeOfflineAudioContext);

                if (renderedNativeStereoPannerNode !== undefined) {
                    return renderedNativeStereoPannerNode;
                }

                const nativeStereoPannerNode = getNativeAudioNode<T, TNativeStereoPannerNode>(proxy);

                renderedNativeStereoPannerNodes.set(nativeOfflineAudioContext, nativeStereoPannerNode);

                await connectAudioParam(nativeOfflineAudioContext, proxy.pan, nativeStereoPannerNode.pan);
                await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeStereoPannerNode);

                return nativeStereoPannerNode;
            }
        };
    };
};
