import { IAudioWorkletNode } from './audio-worklet-node';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IProcessorErrorEventHandler<T extends IMinimalBaseAudioContext, U extends IAudioWorkletNode<T>> extends ThisType<U> {

    (event: Event): any;

}
