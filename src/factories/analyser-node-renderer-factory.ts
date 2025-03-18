import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { IAnalyserNode, IAudioNodeRenderer, IMinimalOfflineAudioContext, IOfflineAudioContext } from '../interfaces';
import {
    TGetNativeAudioNodeFunction,
    TNativeAnalyserNode,
    TNativeAnalyserNodeFactory,
    TNativeOfflineAudioContext,
    TRenderInputsOfAudioNodeFunction
} from '../types';

export const createAnalyserNodeRendererFactory = (
    createNativeAnalyserNode: TNativeAnalyserNodeFactory,
    getNativeAudioNode: TGetNativeAudioNodeFunction,
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => {
    return <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>(): IAudioNodeRenderer<T, IAnalyserNode<T>> => {
        const renderedNativeAnalyserNodes = new WeakMap<TNativeOfflineAudioContext, TNativeAnalyserNode>();

        const createAnalyserNode = async (proxy: IAnalyserNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext) => {
            let nativeAnalyserNode = getNativeAudioNode<T, TNativeAnalyserNode>(proxy);

            // If the initially used nativeAnalyserNode was not constructed on the same OfflineAudioContext it needs to be created again.
            const nativeAnalyserNodeIsOwnedByContext = isOwnedByContext(nativeAnalyserNode, nativeOfflineAudioContext);

            if (!nativeAnalyserNodeIsOwnedByContext) {
                const options = {
                    channelCount: nativeAnalyserNode.channelCount,
                    channelCountMode: nativeAnalyserNode.channelCountMode,
                    channelInterpretation: nativeAnalyserNode.channelInterpretation,
                    fftSize: nativeAnalyserNode.fftSize,
                    maxDecibels: nativeAnalyserNode.maxDecibels,
                    minDecibels: nativeAnalyserNode.minDecibels,
                    smoothingTimeConstant: nativeAnalyserNode.smoothingTimeConstant
                };

                nativeAnalyserNode = createNativeAnalyserNode(nativeOfflineAudioContext, options);
            }

            renderedNativeAnalyserNodes.set(nativeOfflineAudioContext, nativeAnalyserNode);

            await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeAnalyserNode);

            return nativeAnalyserNode;
        };

        return {
            render(proxy: IAnalyserNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext): Promise<TNativeAnalyserNode> {
                const renderedNativeAnalyserNode = renderedNativeAnalyserNodes.get(nativeOfflineAudioContext);

                if (renderedNativeAnalyserNode !== undefined) {
                    return Promise.resolve(renderedNativeAnalyserNode);
                }

                return createAnalyserNode(proxy, nativeOfflineAudioContext);
            }
        };
    };
};
