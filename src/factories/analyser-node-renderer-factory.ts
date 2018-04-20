import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IAnalyserNode, IAnalyserOptions } from '../interfaces';
import { TAnalyserNodeRendererFactoryFactory, TNativeAnalyserNode, TNativeOfflineAudioContext } from '../types';

export const createAnalyserNodeRendererFactory: TAnalyserNodeRendererFactoryFactory = (createNativeAnalyserNode) => {
    return () => {
        let nativeNode: null | TNativeAnalyserNode = null;

        return {
            render: async (proxy: IAnalyserNode, nativeOfflineAudioContext: TNativeOfflineAudioContext): Promise<TNativeAnalyserNode> => {
                if (nativeNode !== null) {
                    return nativeNode;
                }

                nativeNode = <TNativeAnalyserNode> getNativeNode(proxy);

                // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
                if (!isOwnedByContext(nativeNode, nativeOfflineAudioContext)) {
                    const options: IAnalyserOptions = {
                        channelCount: nativeNode.channelCount,
                        channelCountMode: nativeNode.channelCountMode,
                        channelInterpretation: nativeNode.channelInterpretation,
                        fftSize: nativeNode.fftSize,
                        maxDecibels: nativeNode.maxDecibels,
                        minDecibels: nativeNode.minDecibels,
                        smoothingTimeConstant: nativeNode.smoothingTimeConstant
                    };

                    nativeNode = createNativeAnalyserNode(nativeOfflineAudioContext, options);
                }

                await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeNode);

                return nativeNode;
            }
        };
    };
};
