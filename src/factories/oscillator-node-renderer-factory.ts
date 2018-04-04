import { connectAudioParam } from '../helpers/connect-audio-param';
import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IOscillatorNode, IOscillatorOptions } from '../interfaces';
import { TNativeOfflineAudioContext, TNativeOscillatorNode, TOscillatorNodeRendererFactoryFactory } from '../types';

export const createOscillatorNodeRendererFactory: TOscillatorNodeRendererFactoryFactory = (
    createNativeOscillatorNode
) => {
    return () => {
        let nativeNode: null | TNativeOscillatorNode = null;
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
                offlineAudioContext: TNativeOfflineAudioContext
            ): Promise<TNativeOscillatorNode> => {
                if (nativeNode !== null) {
                    return nativeNode;
                }

                nativeNode = <TNativeOscillatorNode> getNativeNode(proxy);

                // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
                if (!isOwnedByContext(nativeNode, offlineAudioContext)) {
                    const options: IOscillatorOptions = {
                        channelCount: nativeNode.channelCount,
                        channelCountMode: nativeNode.channelCountMode,
                        channelInterpretation: nativeNode.channelInterpretation,
                        detune: nativeNode.detune.value,
                        frequency: nativeNode.frequency.value,
                        // @todo periodicWave is not exposed by the native node.
                        type: nativeNode.type
                    };

                    nativeNode = createNativeOscillatorNode(offlineAudioContext, options);

                    if (start !== null) {
                        nativeNode.start(start);
                    }

                    if (stop !== null) {
                        nativeNode.stop(stop);
                    }

                    await renderAutomation(proxy.context, offlineAudioContext, proxy.detune, nativeNode.detune);
                    await renderAutomation(proxy.context, offlineAudioContext, proxy.frequency, nativeNode.frequency);
                } else {
                    await connectAudioParam(proxy.context, offlineAudioContext, proxy.detune);
                    await connectAudioParam(proxy.context, offlineAudioContext, proxy.frequency);
                }

                await renderInputsOfAudioNode(proxy, offlineAudioContext, nativeNode);

                return nativeNode;
            }
        };
    };
};
