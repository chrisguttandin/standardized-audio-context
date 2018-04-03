import { IAudioNodeRenderer } from '../interfaces';
import { TTypedArray } from './typed-array';

export type TIIRFilterNodeRendererFactory = (feedback: number[] | TTypedArray, feedforward: number[] | TTypedArray) => IAudioNodeRenderer;
