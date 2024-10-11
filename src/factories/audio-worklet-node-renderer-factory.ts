import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { IAudioWorkletNode, IMinimalOfflineAudioContext, IOfflineAudioContext, IReadOnlyMap } from '../interfaces';
import {
    TAudioWorkletNodeRendererFactoryFactory,
    TNativeAudioParam,
    TNativeAudioWorkletNode,
    TNativeGainNode,
    TNativeOfflineAudioContext
} from '../types';

export const createAudioWorkletNodeRendererFactory: TAudioWorkletNodeRendererFactoryFactory = (
    connectAudioParam,
    deleteUnrenderedAudioWorkletNode,
    getNativeAudioNode,
    nativeAudioWorkletNodeConstructor,
    renderAutomation,
    renderInputsOfAudioNode
) => {
    return <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>(name: string) => {
        if (nativeAudioWorkletNodeConstructor === null) {
            throw new Error('Missing the native AudioWorkletNode constructor.');
        }

        const renderedNativeAudioNodes = new WeakMap<TNativeOfflineAudioContext, TNativeAudioWorkletNode | TNativeGainNode>();

        const createAudioNode = async (proxy: IAudioWorkletNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext) => {
            let nativeAudioWorkletNode = getNativeAudioNode<T, TNativeAudioWorkletNode>(proxy);

            const nativeAudioWorkletNodeIsOwnedByContext = isOwnedByContext(nativeAudioWorkletNode, nativeOfflineAudioContext);

            // If the initially used nativeAudioNode was not constructed on the same OfflineAudioContext it needs to be created again.
            if (!nativeAudioWorkletNodeIsOwnedByContext) {
                nativeAudioWorkletNode = new nativeAudioWorkletNodeConstructor(nativeOfflineAudioContext, name);
            }

            renderedNativeAudioNodes.set(nativeOfflineAudioContext, nativeAudioWorkletNode);

            if (!nativeAudioWorkletNodeIsOwnedByContext) {
                for (const [nm, audioParam] of proxy.parameters.entries()) {
                    await renderAutomation(
                        nativeOfflineAudioContext,
                        audioParam,
                        // @todo The definition that TypeScript uses of the AudioParamMap is lacking many methods.
                        <TNativeAudioParam>(<IReadOnlyMap<string, TNativeAudioParam>>nativeAudioWorkletNode.parameters).get(nm)
                    );
                }
            } else {
                for (const [nm, audioParam] of proxy.parameters.entries()) {
                    await connectAudioParam(
                        nativeOfflineAudioContext,
                        audioParam,
                        // @todo The definition that TypeScript uses of the AudioParamMap is lacking many methods.
                        <TNativeAudioParam>(<IReadOnlyMap<string, TNativeAudioParam>>nativeAudioWorkletNode.parameters).get(nm)
                    );
                }
            }

            await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeAudioWorkletNode);

            return nativeAudioWorkletNode;
        };

        return {
            render(
                proxy: IAudioWorkletNode<T>,
                nativeOfflineAudioContext: TNativeOfflineAudioContext
            ): Promise<TNativeAudioWorkletNode | TNativeGainNode> {
                deleteUnrenderedAudioWorkletNode(nativeOfflineAudioContext, proxy);

                const renderedNativeAudioWorkletNodeOrGainNode = renderedNativeAudioNodes.get(nativeOfflineAudioContext);

                if (renderedNativeAudioWorkletNodeOrGainNode !== undefined) {
                    return Promise.resolve(renderedNativeAudioWorkletNodeOrGainNode);
                }

                return createAudioNode(proxy, nativeOfflineAudioContext);
            }
        };
    };
};
