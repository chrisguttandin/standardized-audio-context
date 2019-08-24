import { getNativeAudioNode } from '../helpers/get-native-audio-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IConvolverNode, IMinimalOfflineAudioContext } from '../interfaces';
import { TConvolverNodeRendererFactoryFactory, TNativeConvolverNode, TNativeOfflineAudioContext } from '../types';

export const createConvolverNodeRendererFactory: TConvolverNodeRendererFactoryFactory = (createNativeConvolverNode) => {
    return <T extends IMinimalOfflineAudioContext>() => {
        const renderedNativeConvolverNodes = new WeakMap<TNativeOfflineAudioContext, TNativeConvolverNode>();

        const createConvolverNode = async (proxy: IConvolverNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext) => {
            let nativeConvolverNode = getNativeAudioNode<T, TNativeConvolverNode>(proxy);

            // If the initially used nativeConvolverNode was not constructed on the same OfflineAudioContext it needs to be created again.
            const nativeConvolverNodeIsOwnedByContext = isOwnedByContext(nativeConvolverNode, nativeOfflineAudioContext);

            if (!nativeConvolverNodeIsOwnedByContext) {
                const options = {
                    buffer: nativeConvolverNode.buffer,
                    channelCount: nativeConvolverNode.channelCount,
                    channelCountMode: nativeConvolverNode.channelCountMode,
                    channelInterpretation: nativeConvolverNode.channelInterpretation,
                    disableNormalization: !nativeConvolverNode.normalize
                };

                nativeConvolverNode = createNativeConvolverNode(nativeOfflineAudioContext, options);
            }

            renderedNativeConvolverNodes.set(nativeOfflineAudioContext, nativeConvolverNode);

            await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeConvolverNode);

            return nativeConvolverNode;
        };

        return {
            render (proxy: IConvolverNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext): Promise<TNativeConvolverNode> {
                const renderedNativeConvolverNode = renderedNativeConvolverNodes.get(nativeOfflineAudioContext);

                if (renderedNativeConvolverNode !== undefined) {
                    return Promise.resolve(renderedNativeConvolverNode);
                }

                return createConvolverNode(proxy, nativeOfflineAudioContext);
            }
        };
    };
};
