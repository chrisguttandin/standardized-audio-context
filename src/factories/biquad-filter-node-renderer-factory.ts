import { IAudioNodeRenderer, IBiquadFilterNode, IMinimalOfflineAudioContext, IOfflineAudioContext } from '../interfaces';
import {
    TConnectAudioParamFunction,
    TGetNativeAudioNodeFunction,
    TNativeBiquadFilterNode,
    TNativeOfflineAudioContext,
    TRenderInputsOfAudioNodeFunction
} from '../types';

export const createBiquadFilterNodeRendererFactory = (
    connectAudioParam: TConnectAudioParamFunction,
    getNativeAudioNode: TGetNativeAudioNodeFunction,
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => {
    return <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>(): IAudioNodeRenderer<T, IBiquadFilterNode<T>> => {
        const renderedNativeBiquadFilterNodes = new WeakMap<TNativeOfflineAudioContext, TNativeBiquadFilterNode>();

        return {
            async render(
                proxy: IBiquadFilterNode<T>,
                nativeOfflineAudioContext: TNativeOfflineAudioContext
            ): Promise<TNativeBiquadFilterNode> {
                const renderedNativeBiquadFilterNode = renderedNativeBiquadFilterNodes.get(nativeOfflineAudioContext);

                if (renderedNativeBiquadFilterNode !== undefined) {
                    return renderedNativeBiquadFilterNode;
                }

                const nativeBiquadFilterNode = getNativeAudioNode<T, TNativeBiquadFilterNode>(proxy);

                renderedNativeBiquadFilterNodes.set(nativeOfflineAudioContext, nativeBiquadFilterNode);

                await connectAudioParam(nativeOfflineAudioContext, proxy.Q, nativeBiquadFilterNode.Q);
                await connectAudioParam(nativeOfflineAudioContext, proxy.detune, nativeBiquadFilterNode.detune);
                await connectAudioParam(nativeOfflineAudioContext, proxy.frequency, nativeBiquadFilterNode.frequency);
                await connectAudioParam(nativeOfflineAudioContext, proxy.gain, nativeBiquadFilterNode.gain);
                await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeBiquadFilterNode);

                return nativeBiquadFilterNode;
            }
        };
    };
};
