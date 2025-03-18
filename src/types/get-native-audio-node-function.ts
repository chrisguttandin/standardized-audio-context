import { IAudioNode } from '../interfaces';
import { TContext } from './context';
import { TNativeAudioNode } from './native-audio-node';

export type TGetNativeAudioNodeFunction = <T extends TContext, U extends TNativeAudioNode>(audioNode: IAudioNode<T>) => U;
