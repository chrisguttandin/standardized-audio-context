import { IAudioNodeRenderer, IIIRFilterNode, IMinimalOfflineAudioContext } from '../interfaces';
import { TTypedArray } from './typed-array';

export type TIIRFilterNodeRendererFactory = <T extends IMinimalOfflineAudioContext>(
    feedback: number[] | TTypedArray,
    feedforward: number[] | TTypedArray
) => IAudioNodeRenderer<T, IIIRFilterNode<T>>;
