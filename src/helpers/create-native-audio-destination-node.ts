import { TNativeAudioDestinationNode, TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';

export const createNativeAudioDestinationNode = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    channelCount: number,
    isNodeOfNativeOfflineAudioContext: boolean
): TNativeAudioDestinationNode => {
    const nativeNode = nativeContext.destination;

    // @todo Which bug is that covering?
    if (nativeNode.channelCount !== channelCount) {
        nativeNode.channelCount = channelCount;
    }

    // Bug #83: Edge & Safari do not have the correct channelCountMode.
    if (isNodeOfNativeOfflineAudioContext && nativeNode.channelCountMode !== 'explicit') {
        nativeNode.channelCountMode = 'explicit';
    }

    // Bug #47: The AudioDestinationNode in Edge and Safari do not initialize the maxChannelCount property correctly.
    if (nativeNode.maxChannelCount === 0) {
        Object.defineProperty(nativeNode, 'maxChannelCount', {
            get: () => nativeNode.channelCount
        });
    }

    return nativeNode;
};
