import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { IAudioNode, IDynamicsCompressorNode, IMinimalOfflineAudioContext, IOfflineAudioContext } from '../interfaces';
import { TDynamicsCompressorNodeRendererFactoryFactory, TNativeDynamicsCompressorNode, TNativeOfflineAudioContext } from '../types';

export const createDynamicsCompressorNodeRendererFactory: TDynamicsCompressorNodeRendererFactoryFactory = (
    connectAudioParam,
    createNativeDynamicsCompressorNode,
    getNativeAudioNode,
    renderAutomation,
    renderInputsOfAudioNode
) => {
    return <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>() => {
        const renderedNativeDynamicsCompressorNodes = new WeakMap<TNativeOfflineAudioContext, TNativeDynamicsCompressorNode>();

        const createDynamicsCompressorNode = async (
            proxy: IDynamicsCompressorNode<T>,
            nativeOfflineAudioContext: TNativeOfflineAudioContext,
            trace: readonly IAudioNode<T>[]
        ) => {
            let nativeDynamicsCompressorNode = getNativeAudioNode<T, TNativeDynamicsCompressorNode>(proxy);

            /*
             * If the initially used nativeDynamicsCompressorNode was not constructed on the same OfflineAudioContext it needs to be
             * created again.
             */
            const nativeDynamicsCompressorNodeIsOwnedByContext = isOwnedByContext(nativeDynamicsCompressorNode, nativeOfflineAudioContext);

            if (!nativeDynamicsCompressorNodeIsOwnedByContext) {
                const options = {
                    attack: nativeDynamicsCompressorNode.attack.value,
                    channelCount: nativeDynamicsCompressorNode.channelCount,
                    channelCountMode: nativeDynamicsCompressorNode.channelCountMode,
                    channelInterpretation: nativeDynamicsCompressorNode.channelInterpretation,
                    knee: nativeDynamicsCompressorNode.knee.value,
                    ratio: nativeDynamicsCompressorNode.ratio.value,
                    release: nativeDynamicsCompressorNode.release.value,
                    threshold: nativeDynamicsCompressorNode.threshold.value
                };

                nativeDynamicsCompressorNode = createNativeDynamicsCompressorNode(nativeOfflineAudioContext, options);
            }

            renderedNativeDynamicsCompressorNodes.set(nativeOfflineAudioContext, nativeDynamicsCompressorNode);

            if (!nativeDynamicsCompressorNodeIsOwnedByContext) {
                await renderAutomation(nativeOfflineAudioContext, proxy.attack, nativeDynamicsCompressorNode.attack, trace);
                await renderAutomation(nativeOfflineAudioContext, proxy.knee, nativeDynamicsCompressorNode.knee, trace);
                await renderAutomation(nativeOfflineAudioContext, proxy.ratio, nativeDynamicsCompressorNode.ratio, trace);
                await renderAutomation(nativeOfflineAudioContext, proxy.release, nativeDynamicsCompressorNode.release, trace);
                await renderAutomation(nativeOfflineAudioContext, proxy.threshold, nativeDynamicsCompressorNode.threshold, trace);
            } else {
                await connectAudioParam(nativeOfflineAudioContext, proxy.attack, nativeDynamicsCompressorNode.attack, trace);
                await connectAudioParam(nativeOfflineAudioContext, proxy.knee, nativeDynamicsCompressorNode.knee, trace);
                await connectAudioParam(nativeOfflineAudioContext, proxy.ratio, nativeDynamicsCompressorNode.ratio, trace);
                await connectAudioParam(nativeOfflineAudioContext, proxy.release, nativeDynamicsCompressorNode.release, trace);
                await connectAudioParam(nativeOfflineAudioContext, proxy.threshold, nativeDynamicsCompressorNode.threshold, trace);
            }

            await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeDynamicsCompressorNode, trace);

            return nativeDynamicsCompressorNode;
        };

        return {
            render(
                proxy: IDynamicsCompressorNode<T>,
                nativeOfflineAudioContext: TNativeOfflineAudioContext,
                trace: readonly IAudioNode<T>[]
            ): Promise<TNativeDynamicsCompressorNode> {
                const renderedNativeDynamicsCompressorNode = renderedNativeDynamicsCompressorNodes.get(nativeOfflineAudioContext);

                if (renderedNativeDynamicsCompressorNode !== undefined) {
                    return Promise.resolve(renderedNativeDynamicsCompressorNode);
                }

                return createDynamicsCompressorNode(proxy, nativeOfflineAudioContext, trace);
            }
        };
    };
};
