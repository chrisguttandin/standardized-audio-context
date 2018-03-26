import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { IGainOptions } from '../interfaces';
import { TNativeGainNode, TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';

export const createNativeGainNode = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    options: Partial<IGainOptions> = { }
): TNativeGainNode => {
    const nativeNode = nativeContext.createGain();

    assignNativeAudioNodeOptions(nativeNode, options);

    if (options.gain !== undefined) {
        nativeNode.gain.value = options.gain;
    }

    return nativeNode;
};
