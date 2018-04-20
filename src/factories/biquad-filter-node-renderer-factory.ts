import { connectAudioParam } from '../helpers/connect-audio-param';
import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IBiquadFilterNode, IBiquadFilterOptions } from '../interfaces';
import { TBiquadFilterNodeRendererFactoryFactory, TNativeBiquadFilterNode, TNativeOfflineAudioContext } from '../types';

export const createBiquadFilterNodeRendererFactory: TBiquadFilterNodeRendererFactoryFactory = (createNativeBiquadFilterNode) => {
    return () => {
        let nativeNode: null | TNativeBiquadFilterNode = null;

        return {
            render: async (
                proxy: IBiquadFilterNode,
                nativeOfflineAudioContext: TNativeOfflineAudioContext
            ): Promise<TNativeBiquadFilterNode> => {
                if (nativeNode !== null) {
                    return nativeNode;
                }

                nativeNode = <TNativeBiquadFilterNode> getNativeNode(proxy);

                // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
                if (!isOwnedByContext(nativeNode, nativeOfflineAudioContext)) {
                    const options: IBiquadFilterOptions = {
                        Q: nativeNode.Q.value,
                        channelCount: nativeNode.channelCount,
                        channelCountMode: nativeNode.channelCountMode,
                        channelInterpretation: nativeNode.channelInterpretation,
                        detune: nativeNode.detune.value,
                        frequency: nativeNode.frequency.value,
                        gain: nativeNode.gain.value,
                        type: nativeNode.type
                    };

                    nativeNode = createNativeBiquadFilterNode(nativeOfflineAudioContext, options);

                    await renderAutomation(proxy.context, nativeOfflineAudioContext, proxy.Q, nativeNode.Q);
                    await renderAutomation(proxy.context, nativeOfflineAudioContext, proxy.detune, nativeNode.detune);
                    await renderAutomation(proxy.context, nativeOfflineAudioContext, proxy.frequency, nativeNode.frequency);
                    await renderAutomation(proxy.context, nativeOfflineAudioContext, proxy.gain, nativeNode.gain);
                } else {
                    await connectAudioParam(proxy.context, nativeOfflineAudioContext, proxy.Q);
                    await connectAudioParam(proxy.context, nativeOfflineAudioContext, proxy.detune);
                    await connectAudioParam(proxy.context, nativeOfflineAudioContext, proxy.frequency);
                    await connectAudioParam(proxy.context, nativeOfflineAudioContext, proxy.gain);
                }

                await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeNode);

                return nativeNode;
            }
        };
    };
};
