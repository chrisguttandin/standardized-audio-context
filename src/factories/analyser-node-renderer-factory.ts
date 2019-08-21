import { getNativeAudioNode } from '../helpers/get-native-audio-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IAnalyserNode, IMinimalOfflineAudioContext } from '../interfaces';
import { TAnalyserNodeRendererFactoryFactory, TNativeAnalyserNode, TNativeOfflineAudioContext } from '../types';

export const createAnalyserNodeRendererFactory: TAnalyserNodeRendererFactoryFactory = (createNativeAnalyserNode) => {
    return <T extends IMinimalOfflineAudioContext>() => {
        let nativeAnalyserNodePromise: null | Promise<TNativeAnalyserNode> = null;

        const createAnalyserNode = async (proxy: IAnalyserNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext) => {
            let nativeAnalyserNode = getNativeAudioNode<T, TNativeAnalyserNode>(proxy);

            // If the initially used nativeAnalyserNode was not constructed on the same OfflineAudioContext it needs to be created again.
            if (!isOwnedByContext(nativeAnalyserNode, nativeOfflineAudioContext)) {
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

            await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeAnalyserNode);

            return nativeAnalyserNode;
        };

        return {
            render (proxy: IAnalyserNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext): Promise<TNativeAnalyserNode> {
                if (nativeAnalyserNodePromise === null) {
                    nativeAnalyserNodePromise = createAnalyserNode(proxy, nativeOfflineAudioContext);
                }

                return nativeAnalyserNodePromise;
            }
        };
    };
};
