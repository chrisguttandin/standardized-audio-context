import { connectAudioParam } from '../helpers/connect-audio-param';
import { getNativeAudioNode } from '../helpers/get-native-audio-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IConstantSourceNode, IMinimalOfflineAudioContext } from '../interfaces';
import { TConstantSourceNodeRendererFactoryFactory, TNativeConstantSourceNode, TNativeOfflineAudioContext } from '../types';

export const createConstantSourceNodeRendererFactory: TConstantSourceNodeRendererFactoryFactory = (
    createNativeConstantSourceNode
) => {
    return <T extends IMinimalOfflineAudioContext>() => {
        let nativeConstantSourceNodePromise: null | Promise<TNativeConstantSourceNode> = null;
        let start: null | number = null;
        let stop: null | number = null;

        const createConstantSourceNode = async (proxy: IConstantSourceNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext) => {
            let nativeConstantSourceNode = getNativeAudioNode<T, TNativeConstantSourceNode>(proxy);

            /*
             * If the initially used nativeConstantSourceNode was not constructed on the same OfflineAudioContext it needs to be created
             * again.
             */
            if (!isOwnedByContext(nativeConstantSourceNode, nativeOfflineAudioContext)) {
                const options = {
                    channelCount: nativeConstantSourceNode.channelCount,
                    channelCountMode: nativeConstantSourceNode.channelCountMode,
                    channelInterpretation: nativeConstantSourceNode.channelInterpretation,
                    offset: nativeConstantSourceNode.offset.value
                };

                nativeConstantSourceNode = createNativeConstantSourceNode(nativeOfflineAudioContext, options);

                if (start !== null) {
                    nativeConstantSourceNode.start(start);
                }

                if (stop !== null) {
                    nativeConstantSourceNode.stop(stop);
                }

                await renderAutomation(proxy.context, nativeOfflineAudioContext, proxy.offset, nativeConstantSourceNode.offset);
            } else {
                await connectAudioParam(proxy.context, nativeOfflineAudioContext, proxy.offset);
            }

            await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeConstantSourceNode);

            return nativeConstantSourceNode;
        };

        return {
            set start (value: number) {
                start = value;
            },
            set stop (value: number) {
                stop = value;
            },
            render (
                proxy: IConstantSourceNode<T>,
                nativeOfflineAudioContext: TNativeOfflineAudioContext
            ): Promise<TNativeConstantSourceNode> {
                if (nativeConstantSourceNodePromise === null) {
                    nativeConstantSourceNodePromise = createConstantSourceNode(proxy, nativeOfflineAudioContext);
                }

                return nativeConstantSourceNodePromise;
            }
        };
    };
};
