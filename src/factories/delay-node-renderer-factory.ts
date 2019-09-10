import { connectAudioParam } from '../helpers/connect-audio-param';
import { getNativeAudioNode } from '../helpers/get-native-audio-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IDelayNode, IMinimalOfflineAudioContext } from '../interfaces';
import { TDelayNodeRendererFactoryFactory, TNativeDelayNode, TNativeOfflineAudioContext } from '../types';

export const createDelayNodeRendererFactory: TDelayNodeRendererFactoryFactory = (createNativeDelayNode) => {
    return <T extends IMinimalOfflineAudioContext>(maxDelayTime: number) => {
        const renderedNativeDelayNodes = new WeakMap<TNativeOfflineAudioContext, TNativeDelayNode>();

        const createDelayNode = async (proxy: IDelayNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext) => {
            let nativeDelayNode = getNativeAudioNode<T, TNativeDelayNode>(proxy);

            // If the initially used nativeDelayNode was not constructed on the same OfflineAudioContext it needs to be created again.
            const nativeDelayNodeIsOwnedByContext = isOwnedByContext(nativeDelayNode, nativeOfflineAudioContext);

            if (!nativeDelayNodeIsOwnedByContext) {
                const options = {
                    channelCount: nativeDelayNode.channelCount,
                    channelCountMode: nativeDelayNode.channelCountMode,
                    channelInterpretation: nativeDelayNode.channelInterpretation,
                    delayTime: nativeDelayNode.delayTime.value,
                    maxDelayTime
                };

                nativeDelayNode = createNativeDelayNode(nativeOfflineAudioContext, options);
            }

            renderedNativeDelayNodes.set(nativeOfflineAudioContext, nativeDelayNode);

            if (!nativeDelayNodeIsOwnedByContext) {
                await renderAutomation(nativeOfflineAudioContext, proxy.delayTime, nativeDelayNode.delayTime);
            } else {
                await connectAudioParam(nativeOfflineAudioContext, proxy.delayTime);
            }

            await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeDelayNode);

            return nativeDelayNode;
        };

        return {
            render (proxy: IDelayNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext): Promise<TNativeDelayNode> {
                const renderedNativeDelayNode = renderedNativeDelayNodes.get(nativeOfflineAudioContext);

                if (renderedNativeDelayNode !== undefined) {
                    return Promise.resolve(renderedNativeDelayNode);
                }

                return createDelayNode(proxy, nativeOfflineAudioContext);
            }
        };
    };
};
