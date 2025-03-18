import { IAudioNodeRenderer, IMinimalOfflineAudioContext, IOfflineAudioContext, IOscillatorNode } from '../interfaces';
import {
    TConnectAudioParamFunction,
    TGetNativeAudioNodeFunction,
    TNativeOfflineAudioContext,
    TNativeOscillatorNode,
    TRenderInputsOfAudioNodeFunction
} from '../types';

export const createOscillatorNodeRendererFactory = (
    connectAudioParam: TConnectAudioParamFunction,
    getNativeAudioNode: TGetNativeAudioNodeFunction,
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => {
    return <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>(): IAudioNodeRenderer<T, IOscillatorNode<T>> => {
        const renderedNativeOscillatorNodes = new WeakMap<TNativeOfflineAudioContext, TNativeOscillatorNode>();

        return {
            async render(proxy: IOscillatorNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext): Promise<TNativeOscillatorNode> {
                const renderedNativeOscillatorNode = renderedNativeOscillatorNodes.get(nativeOfflineAudioContext);

                if (renderedNativeOscillatorNode !== undefined) {
                    return renderedNativeOscillatorNode;
                }

                const nativeOscillatorNode = getNativeAudioNode<T, TNativeOscillatorNode>(proxy);

                renderedNativeOscillatorNodes.set(nativeOfflineAudioContext, nativeOscillatorNode);

                await connectAudioParam(nativeOfflineAudioContext, proxy.detune, nativeOscillatorNode.detune);
                await connectAudioParam(nativeOfflineAudioContext, proxy.frequency, nativeOscillatorNode.frequency);
                await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeOscillatorNode);

                return nativeOscillatorNode;
            }
        };
    };
};
