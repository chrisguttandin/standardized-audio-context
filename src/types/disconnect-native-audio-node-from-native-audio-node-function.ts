import { TNativeAudioNode } from './native-audio-node';

export type TDisconnectNativeAudioNodeFromNativeAudioNodeFunction = (
    nativeSourceAudioNode: TNativeAudioNode,
    nativeDestinationAudioNode: TNativeAudioNode,
    output: number,
    input: number
) => void;
