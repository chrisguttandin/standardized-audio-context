import { assignNativeAudioNodeAudioParamValue } from '../helpers/assign-native-audio-node-audio-param-value';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeDelayNodeFactoryFactory } from '../types';

export const createNativeDelayNodeFactory: TNativeDelayNodeFactoryFactory = (createNativeAudioNode) => {
    return (nativeContext, options) => {
        const nativeDelayNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createDelay(options.maxDelayTime));

        assignNativeAudioNodeOptions(nativeDelayNode, options);

        assignNativeAudioNodeAudioParamValue(nativeDelayNode, options, 'delayTime');

        return nativeDelayNode;
    };
};
