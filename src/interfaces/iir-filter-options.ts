import { TTypedArray } from '../types';
import { IAudioNodeOptions } from './audio-node-options';

export interface IIIRFilterOptions extends IAudioNodeOptions {

    feedback: number[] | TTypedArray;

    feedforward: number[] | TTypedArray;

}
