import { TOverSampleType } from '../types';
import { IAudioNode } from './audio-node';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IWaveShaperNode<T extends IMinimalBaseAudioContext> extends IAudioNode<T> {

    curve: null | Float32Array;

    oversample: TOverSampleType;

}
