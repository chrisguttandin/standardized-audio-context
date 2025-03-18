import { IAudioNodeRenderer, IDelayNode, IMinimalOfflineAudioContext, IOfflineAudioContext } from '../interfaces';
import {
    TConnectAudioParamFunction,
    TGetNativeAudioNodeFunction,
    TNativeDelayNode,
    TNativeOfflineAudioContext,
    TRenderInputsOfAudioNodeFunction
} from '../types';

export const createDelayNodeRendererFactory = (
    connectAudioParam: TConnectAudioParamFunction,
    getNativeAudioNode: TGetNativeAudioNodeFunction,
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => {
    return <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>(): IAudioNodeRenderer<T, IDelayNode<T>> => {
        const renderedNativeDelayNodes = new WeakMap<TNativeOfflineAudioContext, TNativeDelayNode>();

        return {
            async render(proxy: IDelayNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext): Promise<TNativeDelayNode> {
                const renderedNativeDelayNode = renderedNativeDelayNodes.get(nativeOfflineAudioContext);

                if (renderedNativeDelayNode !== undefined) {
                    return renderedNativeDelayNode;
                }

                const nativeDelayNode = getNativeAudioNode<T, TNativeDelayNode>(proxy);

                renderedNativeDelayNodes.set(nativeOfflineAudioContext, nativeDelayNode);

                await connectAudioParam(nativeOfflineAudioContext, proxy.delayTime, nativeDelayNode.delayTime);
                await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeDelayNode);

                return nativeDelayNode;
            }
        };
    };
};
