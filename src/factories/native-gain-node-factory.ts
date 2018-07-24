import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeGainNodeFactoryFactory } from '../types';

export const createNativeGainNodeFactory: TNativeGainNodeFactoryFactory = (createNativeAudioNode) => {
    return (nativeContext, options) => {
        const nativeGainNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createGain());

        assignNativeAudioNodeOptions(nativeGainNode, options);

        if (options.gain !== nativeGainNode.gain.value) {
            nativeGainNode.gain.value = options.gain;
        }

        return nativeGainNode;
    };
};
