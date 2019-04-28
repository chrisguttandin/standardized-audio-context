import { INativeAudioNodeFaker } from '../interfaces';
import { TNativeAudioNode } from '../types';

export const disconnectNativeAudioNodeFromNativeAudioNode = (
    nativeSourceAudioNode: INativeAudioNodeFaker | TNativeAudioNode,
    nativeDestinationAudioNode: INativeAudioNodeFaker | TNativeAudioNode,
    output?: number,
    input?: number
): void => {
    const inputs = (<INativeAudioNodeFaker> nativeDestinationAudioNode).inputs;

    if (input === undefined || output === undefined) {
        nativeSourceAudioNode.disconnect(nativeDestinationAudioNode);
    } else if (inputs !== undefined) {
        nativeSourceAudioNode.disconnect(inputs[input], output, 0);
    } else {
        nativeSourceAudioNode.disconnect(nativeDestinationAudioNode, output, input);
    }
};
