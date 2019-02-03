import { TAnyAudioBuffer } from '../types';
import { IAudioNode } from './audio-node';

export interface IConvolverNode extends IAudioNode {

    buffer: null | TAnyAudioBuffer;

    normalize: boolean;

}
