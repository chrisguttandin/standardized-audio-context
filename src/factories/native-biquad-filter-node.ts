import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeBiquadFilterNodeFactory } from '../types';

export const createNativeBiquadFilterNode: TNativeBiquadFilterNodeFactory = (nativeContext, options) => {
    const nativeNode = nativeContext.createBiquadFilter();

    assignNativeAudioNodeOptions(nativeNode, options);

    if (options.Q !== nativeNode.Q.value) {
        nativeNode.Q.value = options.Q;
    }

    if (options.detune !== nativeNode.detune.value) {
        nativeNode.detune.value = options.detune;
    }

    if (options.frequency !== nativeNode.frequency.value) {
        nativeNode.frequency.value = options.frequency;
    }

    if (options.gain !== nativeNode.gain.value) {
        nativeNode.gain.value = options.gain;
    }

    if (options.type !== nativeNode.type) {
        nativeNode.type = options.type;
    }

    return nativeNode;
};
