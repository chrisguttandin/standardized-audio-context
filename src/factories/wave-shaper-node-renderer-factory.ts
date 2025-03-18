import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { IAudioNodeRenderer, IMinimalOfflineAudioContext, IOfflineAudioContext, IWaveShaperNode } from '../interfaces';
import {
    TGetNativeAudioNodeFunction,
    TNativeOfflineAudioContext,
    TNativeWaveShaperNode,
    TNativeWaveShaperNodeFactory,
    TRenderInputsOfAudioNodeFunction
} from '../types';

export const createWaveShaperNodeRendererFactory = (
    createNativeWaveShaperNode: TNativeWaveShaperNodeFactory,
    getNativeAudioNode: TGetNativeAudioNodeFunction,
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => {
    return <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>(): IAudioNodeRenderer<T, IWaveShaperNode<T>> => {
        const renderedNativeWaveShaperNodes = new WeakMap<TNativeOfflineAudioContext, TNativeWaveShaperNode>();

        const createWaveShaperNode = async (proxy: IWaveShaperNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext) => {
            let nativeWaveShaperNode = getNativeAudioNode<T, TNativeWaveShaperNode>(proxy);

            // If the initially used nativeWaveShaperNode was not constructed on the same OfflineAudioContext it needs to be created again.
            const nativeWaveShaperNodeIsOwnedByContext = isOwnedByContext(nativeWaveShaperNode, nativeOfflineAudioContext);

            if (!nativeWaveShaperNodeIsOwnedByContext) {
                const options = {
                    channelCount: nativeWaveShaperNode.channelCount,
                    channelCountMode: nativeWaveShaperNode.channelCountMode,
                    channelInterpretation: nativeWaveShaperNode.channelInterpretation,
                    curve: nativeWaveShaperNode.curve,
                    oversample: nativeWaveShaperNode.oversample
                };

                nativeWaveShaperNode = createNativeWaveShaperNode(nativeOfflineAudioContext, options);
            }

            renderedNativeWaveShaperNodes.set(nativeOfflineAudioContext, nativeWaveShaperNode);

            await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeWaveShaperNode);

            return nativeWaveShaperNode;
        };

        return {
            render(proxy: IWaveShaperNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext): Promise<TNativeWaveShaperNode> {
                const renderedNativeWaveShaperNode = renderedNativeWaveShaperNodes.get(nativeOfflineAudioContext);

                if (renderedNativeWaveShaperNode !== undefined) {
                    return Promise.resolve(renderedNativeWaveShaperNode);
                }

                return createWaveShaperNode(proxy, nativeOfflineAudioContext);
            }
        };
    };
};
