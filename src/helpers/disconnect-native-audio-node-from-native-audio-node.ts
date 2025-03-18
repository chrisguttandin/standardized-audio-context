import { TDisconnectNativeAudioNodeFromNativeAudioNodeFunction } from '../types';

export const disconnectNativeAudioNodeFromNativeAudioNode: TDisconnectNativeAudioNodeFromNativeAudioNodeFunction = (
    nativeSourceAudioNode,
    nativeDestinationAudioNode,
    output,
    input
) => {
    nativeSourceAudioNode.disconnect(nativeDestinationAudioNode, output, input);
};
