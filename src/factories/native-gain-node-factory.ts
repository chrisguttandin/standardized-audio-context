import { assignNativeAudioNodeAudioParamValue } from '../helpers/assign-native-audio-node-audio-param-value';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeGainNodeFactoryFactory } from '../types';

export const createNativeGainNodeFactory: TNativeGainNodeFactoryFactory = (createNativeAudioNode) => {
    return (nativeContext, options) => {
        const nativeGainNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createGain());

        assignNativeAudioNodeOptions(nativeGainNode, options);

        assignNativeAudioNodeAudioParamValue(nativeGainNode, options, 'gain');

        return nativeGainNode;
    };
};
