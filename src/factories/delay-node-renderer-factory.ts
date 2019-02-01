import { connectAudioParam } from '../helpers/connect-audio-param';
import { getNativeAudioNode } from '../helpers/get-native-audio-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IDelayNode, IDelayOptions } from '../interfaces';
import { TDelayNodeRendererFactoryFactory, TNativeDelayNode, TNativeOfflineAudioContext } from '../types';

export const createDelayNodeRendererFactory: TDelayNodeRendererFactoryFactory = (createNativeDelayNode) => {
    return (maxDelayTime: number) => {
        let nativeDelayNodePromise: null | Promise<TNativeDelayNode> = null;

        const createDelayNode = async (proxy: IDelayNode, nativeOfflineAudioContext: TNativeOfflineAudioContext) => {
            let nativeDelayNode = getNativeAudioNode<TNativeDelayNode>(proxy);

            // If the initially used nativeDelayNode was not constructed on the same OfflineAudioContext it needs to be created again.
            if (!isOwnedByContext(nativeDelayNode, nativeOfflineAudioContext)) {
                const options: IDelayOptions = {
                    channelCount: nativeDelayNode.channelCount,
                    channelCountMode: nativeDelayNode.channelCountMode,
                    channelInterpretation: nativeDelayNode.channelInterpretation,
                    delayTime: nativeDelayNode.delayTime.value,
                    maxDelayTime
                };

                nativeDelayNode = createNativeDelayNode(nativeOfflineAudioContext, options);

                await renderAutomation(proxy.context, nativeOfflineAudioContext, proxy.delayTime, nativeDelayNode.delayTime);
            } else {
                await connectAudioParam(proxy.context, nativeOfflineAudioContext, proxy.delayTime);
            }

            await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeDelayNode);

            return nativeDelayNode;
        };

        return {
            render (proxy: IDelayNode, nativeOfflineAudioContext: TNativeOfflineAudioContext): Promise<TNativeDelayNode> {
                if (nativeDelayNodePromise === null) {
                    nativeDelayNodePromise = createDelayNode(proxy, nativeOfflineAudioContext);
                }

                return nativeDelayNodePromise;
            }
        };
    };
};
