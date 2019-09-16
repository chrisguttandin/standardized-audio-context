import { IAudioNode, IMinimalBaseAudioContext, INativeAudioNodeFaker } from '../interfaces';
import { TNativeAudioNode } from './native-audio-node';

export type TGetNativeAudioNodeFunction = <T extends IMinimalBaseAudioContext, U extends TNativeAudioNode | INativeAudioNodeFaker>(
    audioNode: IAudioNode<T>
) => U;
