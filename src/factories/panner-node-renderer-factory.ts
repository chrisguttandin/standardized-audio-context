import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { IAudioNodeRenderer, IMinimalOfflineAudioContext, IOfflineAudioContext, IPannerNode } from '../interfaces';
import {
    TConnectAudioParamFunction,
    TGetNativeAudioNodeFunction,
    TNativeGainNode,
    TNativeOfflineAudioContext,
    TNativePannerNode,
    TNativePannerNodeFactory,
    TRenderAutomationFunction,
    TRenderInputsOfAudioNodeFunction
} from '../types';

export const createPannerNodeRendererFactory = (
    connectAudioParam: TConnectAudioParamFunction,
    createNativePannerNode: TNativePannerNodeFactory,
    getNativeAudioNode: TGetNativeAudioNodeFunction,
    renderAutomation: TRenderAutomationFunction,
    renderInputsOfAudioNode: TRenderInputsOfAudioNodeFunction
) => {
    return <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>(): IAudioNodeRenderer<T, IPannerNode<T>> => {
        const renderedNativeAudioNodes = new WeakMap<TNativeOfflineAudioContext, TNativeGainNode | TNativePannerNode>();

        const createAudioNode = async (proxy: IPannerNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext) => {
            let nativePannerNode = getNativeAudioNode<T, TNativePannerNode>(proxy);

            // If the initially used nativePannerNode was not constructed on the same OfflineAudioContext it needs to be created again.
            const nativePannerNodeIsOwnedByContext = isOwnedByContext(nativePannerNode, nativeOfflineAudioContext);

            if (!nativePannerNodeIsOwnedByContext) {
                const options = {
                    channelCount: nativePannerNode.channelCount,
                    channelCountMode: nativePannerNode.channelCountMode,
                    channelInterpretation: nativePannerNode.channelInterpretation,
                    coneInnerAngle: nativePannerNode.coneInnerAngle,
                    coneOuterAngle: nativePannerNode.coneOuterAngle,
                    coneOuterGain: nativePannerNode.coneOuterGain,
                    distanceModel: nativePannerNode.distanceModel,
                    maxDistance: nativePannerNode.maxDistance,
                    orientationX: nativePannerNode.orientationX.value,
                    orientationY: nativePannerNode.orientationY.value,
                    orientationZ: nativePannerNode.orientationZ.value,
                    panningModel: nativePannerNode.panningModel,
                    positionX: nativePannerNode.positionX.value,
                    positionY: nativePannerNode.positionY.value,
                    positionZ: nativePannerNode.positionZ.value,
                    refDistance: nativePannerNode.refDistance,
                    rolloffFactor: nativePannerNode.rolloffFactor
                };

                nativePannerNode = createNativePannerNode(nativeOfflineAudioContext, options);
            }

            renderedNativeAudioNodes.set(nativeOfflineAudioContext, nativePannerNode);

            if (!nativePannerNodeIsOwnedByContext) {
                await renderAutomation(nativeOfflineAudioContext, proxy.orientationX, nativePannerNode.orientationX);
                await renderAutomation(nativeOfflineAudioContext, proxy.orientationY, nativePannerNode.orientationY);
                await renderAutomation(nativeOfflineAudioContext, proxy.orientationZ, nativePannerNode.orientationZ);
                await renderAutomation(nativeOfflineAudioContext, proxy.positionX, nativePannerNode.positionX);
                await renderAutomation(nativeOfflineAudioContext, proxy.positionY, nativePannerNode.positionY);
                await renderAutomation(nativeOfflineAudioContext, proxy.positionZ, nativePannerNode.positionZ);
            } else {
                await connectAudioParam(nativeOfflineAudioContext, proxy.orientationX, nativePannerNode.orientationX);
                await connectAudioParam(nativeOfflineAudioContext, proxy.orientationY, nativePannerNode.orientationY);
                await connectAudioParam(nativeOfflineAudioContext, proxy.orientationZ, nativePannerNode.orientationZ);
                await connectAudioParam(nativeOfflineAudioContext, proxy.positionX, nativePannerNode.positionX);
                await connectAudioParam(nativeOfflineAudioContext, proxy.positionY, nativePannerNode.positionY);
                await connectAudioParam(nativeOfflineAudioContext, proxy.positionZ, nativePannerNode.positionZ);
            }

            await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativePannerNode);

            return nativePannerNode;
        };

        return {
            render(
                proxy: IPannerNode<T>,
                nativeOfflineAudioContext: TNativeOfflineAudioContext
            ): Promise<TNativeGainNode | TNativePannerNode> {
                const renderedNativeGainNodeOrNativePannerNode = renderedNativeAudioNodes.get(nativeOfflineAudioContext);

                if (renderedNativeGainNodeOrNativePannerNode !== undefined) {
                    return Promise.resolve(renderedNativeGainNodeOrNativePannerNode);
                }

                return createAudioNode(proxy, nativeOfflineAudioContext);
            }
        };
    };
};
