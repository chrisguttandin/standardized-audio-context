import { assignNativeAudioNodeAudioParamValue } from '../helpers/assign-native-audio-node-audio-param-value';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeDynamicsCompressorNodeFactoryFactory } from '../types';

export const createNativeDynamicsCompressorNodeFactory: TNativeDynamicsCompressorNodeFactoryFactory = (
    createNativeAudioNode,
    createNotSupportedError
) => {
    return (nativeContext, options) => {
        const nativeDynamicsCompressorNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createDynamicsCompressor());

        assignNativeAudioNodeOptions(nativeDynamicsCompressorNode, options);

        // Bug #108: Only Chrome, Firefox and Opera disallow a channelCount of three and above yet.
        if (options.channelCount > 2) {
            throw createNotSupportedError();
        }

        // Bug #109: Only Chrome, Firefox and Opera disallow a channelCountMode of 'max'.
        if (options.channelCountMode === 'max') {
            throw createNotSupportedError();
        }

        assignNativeAudioNodeAudioParamValue(nativeDynamicsCompressorNode, options, 'attack');
        assignNativeAudioNodeAudioParamValue(nativeDynamicsCompressorNode, options, 'knee');
        assignNativeAudioNodeAudioParamValue(nativeDynamicsCompressorNode, options, 'ratio');
        assignNativeAudioNodeAudioParamValue(nativeDynamicsCompressorNode, options, 'release');
        assignNativeAudioNodeAudioParamValue(nativeDynamicsCompressorNode, options, 'threshold');

        return nativeDynamicsCompressorNode;
    };
};
