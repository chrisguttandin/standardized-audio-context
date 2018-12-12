import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeDelayNodeFactoryFactory } from '../types';

export const createNativeDelayNodeFactory: TNativeDelayNodeFactoryFactory = (createNativeAudioNode) => {
    return (nativeContext, options) => {
        const nativeDelayNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createDelay(options.maxDelayTime));

        assignNativeAudioNodeOptions(nativeDelayNode, options);

        if (options.delayTime !== nativeDelayNode.delayTime.value) {
            nativeDelayNode.delayTime.value = options.delayTime;
        }

        return nativeDelayNode;
    };
};
