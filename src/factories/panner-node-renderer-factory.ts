import { connectAudioParam } from '../helpers/connect-audio-param';
import { getNativeAudioNode } from '../helpers/get-native-audio-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { renderInputsOfAudioNode } from '../helpers/render-inputs-of-audio-node';
import { IMinimalOfflineAudioContext, INativePannerNodeFaker, IPannerNode, IPannerOptions } from '../interfaces';
import { TNativeOfflineAudioContext, TNativePannerNode, TPannerNodeRendererFactoryFactory } from '../types';

export const createPannerNodeRendererFactory: TPannerNodeRendererFactoryFactory = (createNativePannerNode) => {
    return <T extends IMinimalOfflineAudioContext>() => {
        let nativePannerNodePromise: null | Promise<TNativePannerNode> = null;

        const createPannerNode = async (proxy: IPannerNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext) => {
            let nativePannerNode = getNativeAudioNode<T, TNativePannerNode>(proxy);

            // If the initially used nativePannerNode was not constructed on the same OfflineAudioContext it needs to be created again.
            if (!isOwnedByContext(nativePannerNode, nativeOfflineAudioContext)) {
                const options: IPannerOptions = {
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

                await renderAutomation(proxy.context, nativeOfflineAudioContext, proxy.orientationX, nativePannerNode.orientationX);
                await renderAutomation(proxy.context, nativeOfflineAudioContext, proxy.orientationY, nativePannerNode.orientationY);
                await renderAutomation(proxy.context, nativeOfflineAudioContext, proxy.orientationZ, nativePannerNode.orientationZ);
                await renderAutomation(proxy.context, nativeOfflineAudioContext, proxy.positionX, nativePannerNode.positionX);
                await renderAutomation(proxy.context, nativeOfflineAudioContext, proxy.positionY, nativePannerNode.positionY);
                await renderAutomation(proxy.context, nativeOfflineAudioContext, proxy.positionZ, nativePannerNode.positionZ);
            } else {
                await connectAudioParam(proxy.context, nativeOfflineAudioContext, proxy.orientationX);
                await connectAudioParam(proxy.context, nativeOfflineAudioContext, proxy.orientationY);
                await connectAudioParam(proxy.context, nativeOfflineAudioContext, proxy.orientationZ);
                await connectAudioParam(proxy.context, nativeOfflineAudioContext, proxy.positionX);
                await connectAudioParam(proxy.context, nativeOfflineAudioContext, proxy.positionY);
                await connectAudioParam(proxy.context, nativeOfflineAudioContext, proxy.positionZ);
            }

            if ((<INativePannerNodeFaker> nativePannerNode).inputs !== undefined) {
                await renderInputsOfAudioNode(
                    proxy,
                    nativeOfflineAudioContext,
                    (<INativePannerNodeFaker> nativePannerNode).inputs[0]
                );
            } else {
                await renderInputsOfAudioNode(proxy, nativeOfflineAudioContext, nativePannerNode);
            }

            return nativePannerNode;
        };

        return {
            render (proxy: IPannerNode<T>, nativeOfflineAudioContext: TNativeOfflineAudioContext): Promise<TNativePannerNode> {
                if (nativePannerNodePromise === null) {
                    nativePannerNodePromise = createPannerNode(proxy, nativeOfflineAudioContext);
                }

                return nativePannerNodePromise;
            }
        };
    };
};
