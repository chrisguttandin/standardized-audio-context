import { INativeAudioNodeFaker } from '../interfaces';
import { TDisconnectNativeAudioNodeFromNativeAudioNodeFunction } from '../types';

export const disconnectNativeAudioNodeFromNativeAudioNode: TDisconnectNativeAudioNodeFromNativeAudioNodeFunction = (
    nativeSourceAudioNode,
    nativeDestinationAudioNode,
    output,
    input
) => {
    const inputs = (<INativeAudioNodeFaker> nativeDestinationAudioNode).inputs;

    if (inputs !== undefined) {
        nativeSourceAudioNode.disconnect(inputs[input], output, 0);
    } else {
        nativeSourceAudioNode.disconnect(nativeDestinationAudioNode, output, input);
    }
};
