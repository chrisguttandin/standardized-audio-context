import { getNativeAudioNode } from '../helpers/get-native-audio-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IAnalyserNode, IAnalyserOptions } from '../interfaces';
import { TAnalyserNodeRendererFactoryFactory, TNativeAnalyserNode, TNativeOfflineAudioContext } from '../types';

export const createAnalyserNodeRendererFactory: TAnalyserNodeRendererFactoryFactory = (createNativeAnalyserNode) => {
    return () => {
        let nativeAnalyserNode: null | TNativeAnalyserNode = null;

        return {
            render: async (proxy: IAnalyserNode, nativeOfflineAudioContext: TNativeOfflineAudioContext): Promise<TNativeAnalyserNode> => {
                if (nativeAnalyserNode !== null) {
                    return nativeAnalyserNode;
                }

                nativeAnalyserNode = getNativeAudioNode<TNativeAnalyserNode>(proxy);

                /*
                 * If the initially used nativeAnalyserNode was not constructed on the same OfflineAudioContext it needs to be created
                 * again.
                 */
                if (!isOwnedByContext(nativeAnalyserNode, nativeOfflineAudioContext)) {
                    const options: IAnalyserOptions = {
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
            }
        };
    };
};
