import { TOverSampleType } from '../types';
import { IAudioNode } from './audio-node';

export interface IWaveShaperNode extends IAudioNode {

    curve: null | Float32Array;

    oversample: TOverSampleType;

}
