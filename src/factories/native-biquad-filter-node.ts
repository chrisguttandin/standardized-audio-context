import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeBiquadFilterNodeFactory } from '../types';

export const createNativeBiquadFilterNode: TNativeBiquadFilterNodeFactory = (nativeContext, options) => {
    const nativeBiquadFilterNode = nativeContext.createBiquadFilter();

    assignNativeAudioNodeOptions(nativeBiquadFilterNode, options);

    if (options.Q !== nativeBiquadFilterNode.Q.value) {
        nativeBiquadFilterNode.Q.value = options.Q;
    }

    if (options.detune !== nativeBiquadFilterNode.detune.value) {
        nativeBiquadFilterNode.detune.value = options.detune;
    }

    if (options.frequency !== nativeBiquadFilterNode.frequency.value) {
        nativeBiquadFilterNode.frequency.value = options.frequency;
    }

    if (options.gain !== nativeBiquadFilterNode.gain.value) {
        nativeBiquadFilterNode.gain.value = options.gain;
    }

    if (options.type !== nativeBiquadFilterNode.type) {
        nativeBiquadFilterNode.type = options.type;
    }

    return nativeBiquadFilterNode;
};
