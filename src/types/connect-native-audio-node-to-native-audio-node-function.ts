import { TNativeAudioNode } from './native-audio-node';

export type TConnectNativeAudioNodeToNativeAudioNodeFunction = (
    nativeSourceAudioNode: TNativeAudioNode,
    nativeDestinationAudioNode: TNativeAudioNode,
    output: number,
    input: number
) => [TNativeAudioNode, number, number];
