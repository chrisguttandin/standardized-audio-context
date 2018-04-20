import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeGainNodeFactory } from '../types';

export const createNativeGainNode: TNativeGainNodeFactory = (nativeContext, options) => {
    const nativeGainNode = nativeContext.createGain();

    assignNativeAudioNodeOptions(nativeGainNode, options);

    if (options.gain !== nativeGainNode.gain.value) {
        nativeGainNode.gain.value = options.gain;
    }

    return nativeGainNode;
};
