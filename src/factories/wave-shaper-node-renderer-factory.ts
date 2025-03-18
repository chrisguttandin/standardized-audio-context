import { IAudioNodeRenderer, IMinimalOfflineAudioContext, IOfflineAudioContext, IWaveShaperNode } from '../interfaces';
import { TGetNativeAudioNodeFunction, TNativeOfflineAudioContext, TNativeWaveShaperNode, TRenderInputsOfAudioNodeFunction } from '../types';

export const createWaveShaperNodeRendererFactory = (
    getNativeAudioNode: TGetNativeAudioNodeFunction,
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => {
    return <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>(): IAudioNodeRenderer<T, IWaveShaperNode<T>> => {
        const renderedNativeWaveShaperNodes = new WeakMap<TNativeOfflineAudioContext, TNativeWaveShaperNode>();

        return {
            async render(proxy: IWaveShaperNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext): Promise<TNativeWaveShaperNode> {
                const renderedNativeWaveShaperNode = renderedNativeWaveShaperNodes.get(nativeOfflineAudioContext);

                if (renderedNativeWaveShaperNode !== undefined) {
                    return renderedNativeWaveShaperNode;
                }

                const nativeWaveShaperNode = getNativeAudioNode<T, TNativeWaveShaperNode>(proxy);

                renderedNativeWaveShaperNodes.set(nativeOfflineAudioContext, nativeWaveShaperNode);

                await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeWaveShaperNode);

                return nativeWaveShaperNode;
            }
        };
    };
};
