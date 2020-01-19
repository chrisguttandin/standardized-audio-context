import { IAudioNodeRenderer, IIIRFilterNode, IMinimalOfflineAudioContext, IOfflineAudioContext } from '../interfaces';
import { TTypedArray } from './typed-array';

export type TIIRFilterNodeRendererFactory = <T extends IMinimalOfflineAudioContext | IOfflineAudioContext>(
    feedback: number[] | TTypedArray,
    feedforward: number[] | TTypedArray
) => IAudioNodeRenderer<T, IIIRFilterNode<T>>;
