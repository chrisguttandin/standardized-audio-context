import { TTypedArray } from '../types';
import { IAudioNodeRenderer } from './audio-node-renderer';
import { IIIRFilterNode } from './iir-filter-node';

export interface IIIRFilterNodeRendererConstructor {

    new (proxy: IIIRFilterNode, feedback: number[] | TTypedArray, feedforward: number[] | TTypedArray): IAudioNodeRenderer;

}
