import { assignNativeAudioNodeOptions } from '../helpers/assign-native-audio-node-options';
import { TNativeMediaStreamAudioDestinationNodeFactory } from '../types';

export const createNativeMediaStreamAudioDestinationNode: TNativeMediaStreamAudioDestinationNodeFactory = (nativeAudioContext, options) => {
    const nativeMediaStreamAudioDestinationNode = nativeAudioContext.createMediaStreamDestination();

    assignNativeAudioNodeOptions(nativeMediaStreamAudioDestinationNode, options);

    return nativeMediaStreamAudioDestinationNode;
};
