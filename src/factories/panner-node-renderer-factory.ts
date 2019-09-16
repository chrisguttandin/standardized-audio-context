import { isNativeAudioNodeFaker } from '../guards/native-audio-node-faker';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { IMinimalOfflineAudioContext, IPannerNode } from '../interfaces';
import { TNativeOfflineAudioContext, TNativePannerNode, TPannerNodeRendererFactoryFactory } from '../types';

export const createPannerNodeRendererFactory: TPannerNodeRendererFactoryFactory = (
    connectAudioParam,
    createNativePannerNode,
    getNativeAudioNode,
    renderAutomation,
    renderInputsOfAudioNode
) => {
    return <T extends IMinimalOfflineAudioContext>() => {
        const renderedNativePannerNodes = new WeakMap<TNativeOfflineAudioContext, TNativePannerNode>();

        const createPannerNode = async (proxy: IPannerNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext) => {
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

            renderedNativePannerNodes.set(nativeOfflineAudioContext, nativePannerNode);

            if (!nativePannerNodeIsOwnedByContext) {
                await renderAutomation(nativeOfflineAudioContext, proxy.orientationX, nativePannerNode.orientationX);
                await renderAutomation(nativeOfflineAudioContext, proxy.orientationY, nativePannerNode.orientationY);
                await renderAutomation(nativeOfflineAudioContext, proxy.orientationZ, nativePannerNode.orientationZ);
                await renderAutomation(nativeOfflineAudioContext, proxy.positionX, nativePannerNode.positionX);
                await renderAutomation(nativeOfflineAudioContext, proxy.positionY, nativePannerNode.positionY);
                await renderAutomation(nativeOfflineAudioContext, proxy.positionZ, nativePannerNode.positionZ);
            } else {
                await connectAudioParam(nativeOfflineAudioContext, proxy.orientationX);
                await connectAudioParam(nativeOfflineAudioContext, proxy.orientationY);
                await connectAudioParam(nativeOfflineAudioContext, proxy.orientationZ);
                await connectAudioParam(nativeOfflineAudioContext, proxy.positionX);
                await connectAudioParam(nativeOfflineAudioContext, proxy.positionY);
                await connectAudioParam(nativeOfflineAudioContext, proxy.positionZ);
            }

            if (isNativeAudioNodeFaker(nativePannerNode)) {
                await renderInputsOfAudioNode(
                    proxy,
                    nativeOfflineAudioContext,
                    nativePannerNode.inputs[0]
                );
            } else {
                await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativePannerNode);
            }

            return nativePannerNode;
        };

        return {
            render (proxy: IPannerNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext): Promise<TNativePannerNode> {
                const renderedNativePannerNode = renderedNativePannerNodes.get(nativeOfflineAudioContext);

                if (renderedNativePannerNode !== undefined) {
                    return Promise.resolve(renderedNativePannerNode);
                }

                return createPannerNode(proxy, nativeOfflineAudioContext);
            }
        };
    };
};
