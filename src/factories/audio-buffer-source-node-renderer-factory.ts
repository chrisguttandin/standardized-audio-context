import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { IAudioBufferSourceNode, IAudioBufferSourceNodeRenderer, IMinimalOfflineAudioContext, IOfflineAudioContext } from '../interfaces';
import {
    TConnectAudioParamFunction,
    TGetNativeAudioNodeFunction,
    TNativeAudioBufferSourceNode,
    TNativeAudioBufferSourceNodeFactory,
    TNativeOfflineAudioContext,
    TRenderAutomationFunction,
    TRenderInputsOfAudioNodeFunction
} from '../types';

export const createAudioBufferSourceNodeRendererFactory = (
    connectAudioParam: TConnectAudioParamFunction,
    createNativeAudioBufferSourceNode: TNativeAudioBufferSourceNodeFactory,
    getNativeAudioNode: TGetNativeAudioNodeFunction,
    renderAutomation: TRenderAutomationFunction,
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => {
    return <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>(): IAudioBufferSourceNodeRenderer<T> => {
        const renderedNativeAudioBufferSourceNodes = new WeakMap<TNativeOfflineAudioContext, TNativeAudioBufferSourceNode>();

        let start: null | [number, number] | [number, number, number] = null;
        let stop: null | number = null;

        const createAudioBufferSourceNode = async (
            proxy: IAudioBufferSourceNode<T>,
            nativeOfflineAudioContext: TNativeOfflineAudioContext
        ) => {
            let nativeAudioBufferSourceNode = getNativeAudioNode<T, TNativeAudioBufferSourceNode>(proxy);

            /*
             * If the initially used nativeAudioBufferSourceNode was not constructed on the same OfflineAudioContext it needs to be created
             * again.
             */
            const nativeAudioBufferSourceNodeIsOwnedByContext = isOwnedByContext(nativeAudioBufferSourceNode, nativeOfflineAudioContext);

            if (!nativeAudioBufferSourceNodeIsOwnedByContext) {
                const options = {
                    buffer: nativeAudioBufferSourceNode.buffer,
                    channelCount: nativeAudioBufferSourceNode.channelCount,
                    channelCountMode: nativeAudioBufferSourceNode.channelCountMode,
                    channelInterpretation: nativeAudioBufferSourceNode.channelInterpretation,
                    detune: nativeAudioBufferSourceNode.detune.value,
                    loop: nativeAudioBufferSourceNode.loop,
                    loopEnd: nativeAudioBufferSourceNode.loopEnd,
                    loopStart: nativeAudioBufferSourceNode.loopStart,
                    playbackRate: nativeAudioBufferSourceNode.playbackRate.value
                };

                nativeAudioBufferSourceNode = createNativeAudioBufferSourceNode(nativeOfflineAudioContext, options);

                if (start !== null) {
                    nativeAudioBufferSourceNode.start(...start);
                }

                if (stop !== null) {
                    nativeAudioBufferSourceNode.stop(stop);
                }
            }

            renderedNativeAudioBufferSourceNodes.set(nativeOfflineAudioContext, nativeAudioBufferSourceNode);

            if (!nativeAudioBufferSourceNodeIsOwnedByContext) {
                await renderAutomation(nativeOfflineAudioContext, proxy.detune, nativeAudioBufferSourceNode.detune);
                await renderAutomation(nativeOfflineAudioContext, proxy.playbackRate, nativeAudioBufferSourceNode.playbackRate);
            } else {
                await connectAudioParam(nativeOfflineAudioContext, proxy.detune, nativeAudioBufferSourceNode.detune);
                await connectAudioParam(nativeOfflineAudioContext, proxy.playbackRate, nativeAudioBufferSourceNode.playbackRate);
            }

            await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativeAudioBufferSourceNode);

            return nativeAudioBufferSourceNode;
        };

        return {
            set start(value: [number, number] | [number, number, number]) {
                start = value;
            },
            set stop(value: number) {
                stop = value;
            },
            render(
                proxy: IAudioBufferSourceNode<T>,
                nativeOfflineAudioContext: TNativeOfflineAudioContext
            ): Promise<TNativeAudioBufferSourceNode> {
                const renderedNativeAudioBufferSourceNode = renderedNativeAudioBufferSourceNodes.get(nativeOfflineAudioContext);

                if (renderedNativeAudioBufferSourceNode !== undefined) {
                    return Promise.resolve(renderedNativeAudioBufferSourceNode);
                }

                return createAudioBufferSourceNode(proxy, nativeOfflineAudioContext);
            }
        };
    };
};
