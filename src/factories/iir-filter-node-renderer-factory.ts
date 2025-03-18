import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { IAudioNodeRenderer, IIIRFilterNode, IMinimalOfflineAudioContext, IOfflineAudioContext } from '../interfaces';
import {
    TGetNativeAudioNodeFunction,
    TNativeAudioBufferSourceNode,
    TNativeIIRFilterNode,
    TNativeOfflineAudioContext,
    TRenderInputsOfAudioNodeFunction
} from '../types';

export const createIIRFilterNodeRendererFactory = (
    getNativeAudioNode: TGetNativeAudioNodeFunction,
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => {
    return <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>(
        feedback: Iterable<number>,
        feedforward: Iterable<number>
    ): IAudioNodeRenderer<T, IIIRFilterNode<T>> => {
        const renderedNativeAudioNodes = new WeakMap<TNativeOfflineAudioContext, TNativeAudioBufferSourceNode | TNativeIIRFilterNode>();

        const createAudioNode = async (proxy: IIIRFilterNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext) => {
            let nativeIIRFilterNode = getNativeAudioNode<T, TNativeIIRFilterNode>(proxy);

            // If the initially used nativeIIRFilterNode was not constructed on the same OfflineAudioContext it needs to be created again.
            const nativeIIRFilterNodeIsOwnedByContext = isOwnedByContext(nativeIIRFilterNode, nativeOfflineAudioContext);

            if (!nativeIIRFilterNodeIsOwnedByContext) {
                // @todo TypeScript defines the parameters of createIIRFilter() as arrays of numbers.
                nativeIIRFilterNode = nativeOfflineAudioContext.createIIRFilter(<number[]>feedforward, <number[]>feedback);
            }

            renderedNativeAudioNodes.set(nativeOfflineAudioContext, nativeIIRFilterNode);

            await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeIIRFilterNode);

            return nativeIIRFilterNode;
        };

        return {
            render(
                proxy: IIIRFilterNode<T>,
                nativeOfflineAudioContext: TNativeOfflineAudioContext
            ): Promise<TNativeAudioBufferSourceNode | TNativeIIRFilterNode> {
                const renderedNativeAudioNode = renderedNativeAudioNodes.get(nativeOfflineAudioContext);

                if (renderedNativeAudioNode !== undefined) {
                    return Promise.resolve(renderedNativeAudioNode);
                }

                return createAudioNode(proxy, nativeOfflineAudioContext);
            }
        };
    };
};
