import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { IBiquadFilterOptions } from '../interfaces';
import { TNativeBiquadFilterNode, TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';

export const createNativeBiquadFilterNode = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    options: Partial<IBiquadFilterOptions> = { }
): TNativeBiquadFilterNode => {
    const nativeNode = nativeContext.createBiquadFilter();

    assignNativeAudioNodeOptions(nativeNode, options);

    if (options.Q !== undefined) {
        nativeNode.Q.value = options.Q;
    }

    if (options.detune !== undefined) {
        nativeNode.detune.value = options.detune;
    }

    if (options.frequency !== undefined) {
        nativeNode.frequency.value = options.frequency;
    }

    if (options.gain !== undefined) {
        nativeNode.gain.value = options.gain;
    }

    if (options.type !== undefined) {
        nativeNode.type = options.type;
    }

    return nativeNode;
};
