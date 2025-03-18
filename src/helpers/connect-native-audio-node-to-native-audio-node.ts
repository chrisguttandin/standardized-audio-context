import { TConnectNativeAudioNodeToNativeAudioNodeFunction, TNativeAudioNode } from '../types';

export const connectNativeAudioNodeToNativeAudioNode: TConnectNativeAudioNodeToNativeAudioNodeFunction = (
    nativeSourceAudioNode: TNativeAudioNode,
    nativeDestinationAudioNode: TNativeAudioNode,
    output: number,
    input: number
): [TNativeAudioNode, number, number] => {
    nativeSourceAudioNode.connect(nativeDestinationAudioNode, output, input);

    return [nativeDestinationAudioNode, output, input];
};
