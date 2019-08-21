import { connectAudioParam } from '../helpers/connect-audio-param';
import { getNativeAudioNode } from '../helpers/get-native-audio-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IBiquadFilterNode, IMinimalOfflineAudioContext } from '../interfaces';
import { TBiquadFilterNodeRendererFactoryFactory, TNativeBiquadFilterNode, TNativeOfflineAudioContext } from '../types';

export const createBiquadFilterNodeRendererFactory: TBiquadFilterNodeRendererFactoryFactory = (createNativeBiquadFilterNode) => {
    return <T extends IMinimalOfflineAudioContext>() => {
        let nativeBiquadFilterNodePromise: null | Promise<TNativeBiquadFilterNode> = null;

        const createBiquadFilterNode = async (proxy: IBiquadFilterNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext) => {
            let nativeBiquadFilterNode = getNativeAudioNode<T, TNativeBiquadFilterNode>(proxy);

            /*
             * If the initially used nativeBiquadFilterNode was not constructed on the same OfflineAudioContext it needs to be created
             * again.
             */
            if (!isOwnedByContext(nativeBiquadFilterNode, nativeOfflineAudioContext)) {
                const options = {
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
        };

        return {
            render (proxy: IBiquadFilterNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext): Promise<TNativeBiquadFilterNode> {
                if (nativeBiquadFilterNodePromise === null) {
                    nativeBiquadFilterNodePromise = createBiquadFilterNode(proxy, nativeOfflineAudioContext);
                }

                return nativeBiquadFilterNodePromise;
            }
        };
    };
};
