import { INativeAudioNodeFaker } from '../interfaces';
import { TConnectNativeAudioNodeToNativeAudioNodeFunction, TNativeAudioNode } from '../types';

export const connectNativeAudioNodeToNativeAudioNode: TConnectNativeAudioNodeToNativeAudioNodeFunction = (
    nativeSourceAudioNode: INativeAudioNodeFaker | TNativeAudioNode,
    nativeDestinationAudioNode: INativeAudioNodeFaker | TNativeAudioNode,
    output: number,
    input: number
): [ TNativeAudioNode, number, number ] => {
    const inputs = (<INativeAudioNodeFaker> nativeDestinationAudioNode).inputs;

    if (inputs !== undefined) {
        nativeSourceAudioNode.connect(inputs[input], output, 0);

        return [ inputs[input], output, 0 ];
    }

    nativeSourceAudioNode.connect(nativeDestinationAudioNode, output, input);

    return [ nativeDestinationAudioNode, output, input ];
};
