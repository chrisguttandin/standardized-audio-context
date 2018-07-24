import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeBiquadFilterNodeFactoryFactory } from '../types';

export const createNativeBiquadFilterNodeFactory: TNativeBiquadFilterNodeFactoryFactory = (createNativeAudioNode) => {
    return (nativeContext, options) => {
        const nativeBiquadFilterNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createBiquadFilter());

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
};
