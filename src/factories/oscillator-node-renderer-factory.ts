import { connectAudioParam } from '../helpers/connect-audio-param';
import { getNativeAudioNode } from '../helpers/get-native-audio-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IOscillatorNode, IOscillatorOptions } from '../interfaces';
import { TNativeOfflineAudioContext, TNativeOscillatorNode, TOscillatorNodeRendererFactoryFactory } from '../types';

export const createOscillatorNodeRendererFactory: TOscillatorNodeRendererFactoryFactory = (
    createNativeOscillatorNode
) => {
    return () => {
        let nativeOscillatorNode: null | TNativeOscillatorNode = null;
        let start: null | number = null;
        let stop: null | number = null;

        return {
            set start (value: number) {
                start = value;
            },
            set stop (value: number) {
                stop = value;
            },
            render: async (
                proxy: IOscillatorNode,
                nativeOfflineAudioContext: TNativeOfflineAudioContext
            ): Promise<TNativeOscillatorNode> => {
                if (nativeOscillatorNode !== null) {
                    return nativeOscillatorNode;
                }

                nativeOscillatorNode = getNativeAudioNode<TNativeOscillatorNode>(proxy);

                /*
                 * If the initially used nativeOscillatorNode was not constructed on the same OfflineAudioContext it needs to be created
                 * again.
                 */
                if (!isOwnedByContext(nativeOscillatorNode, nativeOfflineAudioContext)) {
                    const options: IOscillatorOptions = {
                        channelCount: nativeOscillatorNode.channelCount,
                        channelCountMode: nativeOscillatorNode.channelCountMode,
                        channelInterpretation: nativeOscillatorNode.channelInterpretation,
                        detune: nativeOscillatorNode.detune.value,
                        frequency: nativeOscillatorNode.frequency.value,
                        // @todo periodicWave is not exposed by the native node.
                        type: nativeOscillatorNode.type
                    };

                    nativeOscillatorNode = createNativeOscillatorNode(nativeOfflineAudioContext, options);

                    if (start !== null) {
                        nativeOscillatorNode.start(start);
                    }

                    if (stop !== null) {
                        nativeOscillatorNode.stop(stop);
                    }

                    await renderAutomation(proxy.context, nativeOfflineAudioContext, proxy.detune, nativeOscillatorNode.detune);
                    await renderAutomation(proxy.context, nativeOfflineAudioContext, proxy.frequency, nativeOscillatorNode.frequency);
                } else {
                    await connectAudioParam(proxy.context, nativeOfflineAudioContext, proxy.detune);
                    await connectAudioParam(proxy.context, nativeOfflineAudioContext, proxy.frequency);
                }

                await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeOscillatorNode);

                return nativeOscillatorNode;
            }
        };
    };
};
