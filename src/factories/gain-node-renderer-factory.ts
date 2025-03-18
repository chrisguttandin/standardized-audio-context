import { IAudioNodeRenderer, IGainNode, IMinimalOfflineAudioContext, IOfflineAudioContext } from '../interfaces';
import {
    TConnectAudioParamFunction,
    TGetNativeAudioNodeFunction,
    TNativeGainNode,
    TNativeOfflineAudioContext,
    TRenderInputsOfAudioNodeFunction
} from '../types';

export const createGainNodeRendererFactory = (
    connectAudioParam: TConnectAudioParamFunction,
    getNativeAudioNode: TGetNativeAudioNodeFunction,
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => {
    return <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>(): IAudioNodeRenderer<T, IGainNode<T>> => {
        const renderedNativeGainNodes = new WeakMap<TNativeOfflineAudioContext, TNativeGainNode>();

        return {
            async render(proxy: IGainNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext): Promise<TNativeGainNode> {
                const renderedNativeGainNode = renderedNativeGainNodes.get(nativeOfflineAudioContext);

                if (renderedNativeGainNode !== undefined) {
                    return renderedNativeGainNode;
                }

                const nativeGainNode = getNativeAudioNode<T, TNativeGainNode>(proxy);

                renderedNativeGainNodes.set(nativeOfflineAudioContext, nativeGainNode);

                await connectAudioParam(nativeOfflineAudioContext, proxy.gain, nativeGainNode.gain);
                await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeGainNode);

                return nativeGainNode;
            }
        };
    };
};
