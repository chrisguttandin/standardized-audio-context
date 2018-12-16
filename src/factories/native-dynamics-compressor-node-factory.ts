import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeDynamicsCompressorNodeFactoryFactory } from '../types';

export const createNativeDynamicsCompressorNodeFactory: TNativeDynamicsCompressorNodeFactoryFactory = (
    createNativeAudioNode,
    createNotSupportedError
) => {
    return (nativeContext, options) => {
        const nativeDynamicsCompressorNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createDynamicsCompressor());

        assignNativeAudioNodeOptions(nativeDynamicsCompressorNode, options);

        if (options.attack !== nativeDynamicsCompressorNode.attack.value) {
            nativeDynamicsCompressorNode.attack.value = options.attack;
        }

        // Bug #108: Only Chrome and Opera disallow a channelCount of three and above yet.
        if (options.channelCount > 2) {
            throw createNotSupportedError();
        }

        // Bug #109: Only Chrome and Opera disallow a channelCountMode of 'max'.
        if (options.channelCountMode === 'max') {
            throw createNotSupportedError();
        }

        if (options.knee !== nativeDynamicsCompressorNode.knee.value) {
            nativeDynamicsCompressorNode.knee.value = options.knee;
        }

        if (options.ratio !== nativeDynamicsCompressorNode.ratio.value) {
            nativeDynamicsCompressorNode.ratio.value = options.ratio;
        }

        if (options.release !== nativeDynamicsCompressorNode.release.value) {
            nativeDynamicsCompressorNode.release.value = options.release;
        }

        if (options.threshold !== nativeDynamicsCompressorNode.threshold.value) {
            nativeDynamicsCompressorNode.threshold.value = options.threshold;
        }

        return nativeDynamicsCompressorNode;
    };
};
