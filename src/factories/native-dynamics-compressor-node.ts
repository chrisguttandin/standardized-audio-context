import { assignNativeAudioNodeAudioParamValue } from '../helpers/assign-native-audio-node-audio-param-value';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeDynamicsCompressorNodeFactory } from '../types';

export const createNativeDynamicsCompressorNode: TNativeDynamicsCompressorNodeFactory = (nativeContext, options) => {
    const nativeDynamicsCompressorNode = nativeContext.createDynamicsCompressor();

    assignNativeAudioNodeOptions(nativeDynamicsCompressorNode, options);

    assignNativeAudioNodeAudioParamValue(nativeDynamicsCompressorNode, options, 'attack');
    assignNativeAudioNodeAudioParamValue(nativeDynamicsCompressorNode, options, 'knee');
    assignNativeAudioNodeAudioParamValue(nativeDynamicsCompressorNode, options, 'ratio');
    assignNativeAudioNodeAudioParamValue(nativeDynamicsCompressorNode, options, 'release');
    assignNativeAudioNodeAudioParamValue(nativeDynamicsCompressorNode, options, 'threshold');

    return nativeDynamicsCompressorNode;
};
