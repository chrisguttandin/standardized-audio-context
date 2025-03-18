import { IAudioNodeRenderer, IIIRFilterNode, IMinimalOfflineAudioContext, IOfflineAudioContext } from '../interfaces';
import {
    TGetNativeAudioNodeFunction,
    TNativeAudioBufferSourceNode,
    TNativeIIRFilterNode,
    TNativeOfflineAudioContext,
    TRenderInputsOfAudioNodeFunction
} from '../types';

export const createIIRFilterNodeRendererFactory = (
    getNativeAudioNode: TGetNativeAudioNodeFunction,
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => {
    return <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>(): IAudioNodeRenderer<T, IIIRFilterNode<T>> => {
        const renderedNativeAudioNodes = new WeakMap<TNativeOfflineAudioContext, TNativeAudioBufferSourceNode | TNativeIIRFilterNode>();

        return {
            async render(
                proxy: IIIRFilterNode<T>,
                nativeOfflineAudioContext: TNativeOfflineAudioContext
            ): Promise<TNativeAudioBufferSourceNode | TNativeIIRFilterNode> {
                const renderedNativeAudioNode = renderedNativeAudioNodes.get(nativeOfflineAudioContext);

                if (renderedNativeAudioNode !== undefined) {
                    return renderedNativeAudioNode;
                }

                const nativeIIRFilterNode = getNativeAudioNode<T, TNativeIIRFilterNode>(proxy);

                renderedNativeAudioNodes.set(nativeOfflineAudioContext, nativeIIRFilterNode);

                await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeIIRFilterNode);

                return nativeIIRFilterNode;
            }
        };
    };
};
