import { assignNativeAudioNodeAudioParamValue } from '../helpers/assign-native-audio-node-audio-param-value';
import { assignNativeAudioNodeOption } from '../helpers/assign-native-audio-node-option';
import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeBiquadFilterNodeFactoryFactory } from '../types';

export const createNativeBiquadFilterNodeFactory: TNativeBiquadFilterNodeFactoryFactory = (createNativeAudioNode) => {
    return (nativeContext, options) => {
        const nativeBiquadFilterNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createBiquadFilter());

        assignNativeAudioNodeOptions(nativeBiquadFilterNode, options);

        assignNativeAudioNodeAudioParamValue(nativeBiquadFilterNode, options, 'Q');
        assignNativeAudioNodeAudioParamValue(nativeBiquadFilterNode, options, 'detune');
        assignNativeAudioNodeAudioParamValue(nativeBiquadFilterNode, options, 'frequency');
        assignNativeAudioNodeAudioParamValue(nativeBiquadFilterNode, options, 'gain');

        assignNativeAudioNodeOption(nativeBiquadFilterNode, options, 'type');

        return nativeBiquadFilterNode;
    };
};
