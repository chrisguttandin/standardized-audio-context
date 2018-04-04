import { connectAudioParam } from '../helpers/connect-audio-param';
import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IConstantSourceNode, IConstantSourceOptions, INativeConstantSourceNode } from '../interfaces';
import { TConstantSourceNodeRendererFactoryFactory, TNativeOfflineAudioContext } from '../types';

export const createConstantSourceNodeRendererFactory: TConstantSourceNodeRendererFactoryFactory = (
    createNativeConstantSourceNode
) => {
    return () => {
        let nativeNode: null | INativeConstantSourceNode = null;
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
                proxy: IConstantSourceNode,
                offlineAudioContext: TNativeOfflineAudioContext
            ): Promise<INativeConstantSourceNode> => {
                if (nativeNode !== null) {
                    return nativeNode;
                }

                nativeNode = <INativeConstantSourceNode> getNativeNode(proxy);

                // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
                if (!isOwnedByContext(nativeNode, offlineAudioContext)) {
                    const options: IConstantSourceOptions = {
                        channelCount: nativeNode.channelCount,
                        channelCountMode: nativeNode.channelCountMode,
                        channelInterpretation: nativeNode.channelInterpretation,
                        offset: nativeNode.offset.value
                    };

                    nativeNode = createNativeConstantSourceNode(offlineAudioContext, options);

                    if (start !== null) {
                        nativeNode.start(start);
                    }

                    if (stop !== null) {
                        nativeNode.stop(stop);
                    }

                    await renderAutomation(proxy.context, offlineAudioContext, proxy.offset, nativeNode.offset);
                } else {
                    await connectAudioParam(proxy.context, offlineAudioContext, proxy.offset);
                }

                await renderInputsOfAudioNode(proxy, offlineAudioContext, nativeNode);

                return nativeNode;
            }
        };
    };
};
