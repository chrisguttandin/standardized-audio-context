import { IAudioNodeRenderer, IAudioWorkletNode, IMinimalOfflineAudioContext, IOfflineAudioContext, IReadOnlyMap } from '../interfaces';
import {
    TConnectAudioParamFunction,
    TDeleteUnrenderedAudioWorkletNodeFunction,
    TGetNativeAudioNodeFunction,
    TNativeAudioParam,
    TNativeAudioWorkletNode,
    TNativeAudioWorkletNodeConstructor,
    TNativeGainNode,
    TNativeOfflineAudioContext,
    TRenderInputsOfAudioNodeFunction
} from '../types';

export const createAudioWorkletNodeRendererFactory = (
    connectAudioParam: TConnectAudioParamFunction,
    deleteUnrenderedAudioWorkletNode: TDeleteUnrenderedAudioWorkletNodeFunction,
    getNativeAudioNode: TGetNativeAudioNodeFunction,
    nativeAudioWorkletNodeConstructor: null | TNativeAudioWorkletNodeConstructor,
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => {
    return <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>(): IAudioNodeRenderer<T, IAudioWorkletNode<T>> => {
        if (nativeAudioWorkletNodeConstructor === null) {
            throw new Error('Missing the native AudioWorkletNode constructor.');
        }

        const renderedNativeAudioNodes = new WeakMap<TNativeOfflineAudioContext, TNativeAudioWorkletNode | TNativeGainNode>();

        return {
            async render(
                proxy: IAudioWorkletNode<T>,
                nativeOfflineAudioContext: TNativeOfflineAudioContext
            ): Promise<TNativeAudioWorkletNode | TNativeGainNode> {
                deleteUnrenderedAudioWorkletNode(nativeOfflineAudioContext, proxy);

                const renderedNativeAudioWorkletNodeOrGainNode = renderedNativeAudioNodes.get(nativeOfflineAudioContext);

                if (renderedNativeAudioWorkletNodeOrGainNode !== undefined) {
                    return renderedNativeAudioWorkletNodeOrGainNode;
                }

                const nativeAudioWorkletNode = getNativeAudioNode<T, TNativeAudioWorkletNode>(proxy);

                renderedNativeAudioNodes.set(nativeOfflineAudioContext, nativeAudioWorkletNode);

                for (const [nm, audioParam] of proxy.parameters.entries()) {
                    await connectAudioParam(
                        nativeOfflineAudioContext,
                        audioParam,
                        // @todo The definition that TypeScript uses of the AudioParamMap is lacking many methods.
                        <TNativeAudioParam>(<IReadOnlyMap<string, TNativeAudioParam>>nativeAudioWorkletNode.parameters).get(nm)
                    );
                }

                await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeAudioWorkletNode);

                return nativeAudioWorkletNode;
            }
        };
    };
};
