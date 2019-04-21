import { TAnyAudioBuffer } from '../types';
import { IAudioNode } from './audio-node';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IConvolverNode<T extends IMinimalBaseAudioContext> extends IAudioNode<T> {

    buffer: null | TAnyAudioBuffer;

    normalize: boolean;

}
