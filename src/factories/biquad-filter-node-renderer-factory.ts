import { connectAudioParam } from '../helpers/connect-audio-param';
import { getNativeAudioNode } from '../helpers/get-native-audio-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IBiquadFilterNode, IBiquadFilterOptions } from '../interfaces';
import { TBiquadFilterNodeRendererFactoryFactory, TNativeBiquadFilterNode, TNativeOfflineAudioContext } from '../types';

export const createBiquadFilterNodeRendererFactory: TBiquadFilterNodeRendererFactoryFactory = (createNativeBiquadFilterNode) => {
    return () => {
        let nativeBiquadFilterNode: null | TNativeBiquadFilterNode = null;

        return {
            render: async (
                proxy: IBiquadFilterNode,
                nativeOfflineAudioContext: TNativeOfflineAudioContext
            ): Promise<TNativeBiquadFilterNode> => {
                if (nativeBiquadFilterNode !== null) {
                    return nativeBiquadFilterNode;
                }

                nativeBiquadFilterNode = getNativeAudioNode<TNativeBiquadFilterNode>(proxy);

                /*
                 * If the initially used nativeBiquadFilterNode was not constructed on the same OfflineAudioContext it needs to be created
                 * again.
                 */
                if (!isOwnedByContext(nativeBiquadFilterNode, nativeOfflineAudioContext)) {
                    const options: IBiquadFilterOptions = {
                        Q: nativeBiquadFilterNode.Q.value,
                        channelCount: nativeBiquadFilterNode.channelCount,
                        channelCountMode: nativeBiquadFilterNode.channelCountMode,
                        channelInterpretation: nativeBiquadFilterNode.channelInterpretation,
                        detune: nativeBiquadFilterNode.detune.value,
                        frequency: nativeBiquadFilterNode.frequency.value,
                        gain: nativeBiquadFilterNode.gain.value,
                        type: nativeBiquadFilterNode.type
                    };

                    nativeBiquadFilterNode = createNativeBiquadFilterNode(nativeOfflineAudioContext, options);

                    await renderAutomation(proxy.context, nativeOfflineAudioContext, proxy.Q, nativeBiquadFilterNode.Q);
                    await renderAutomation(proxy.context, nativeOfflineAudioContext, proxy.detune, nativeBiquadFilterNode.detune);
                    await renderAutomation(proxy.context, nativeOfflineAudioContext, proxy.frequency, nativeBiquadFilterNode.frequency);
                    await renderAutomation(proxy.context, nativeOfflineAudioContext, proxy.gain, nativeBiquadFilterNode.gain);
                } else {
                    await connectAudioParam(proxy.context, nativeOfflineAudioContext, proxy.Q);
                    await connectAudioParam(proxy.context, nativeOfflineAudioContext, proxy.detune);
                    await connectAudioParam(proxy.context, nativeOfflineAudioContext, proxy.frequency);
                    await connectAudioParam(proxy.context, nativeOfflineAudioContext, proxy.gain);
                }

                await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeBiquadFilterNode);

                return nativeBiquadFilterNode;
            }
        };
    };
};
