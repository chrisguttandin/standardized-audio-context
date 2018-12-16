import { IAudioNode } from './audio-node';

export interface IConvolverNode extends IAudioNode {

    buffer: null | AudioBuffer;

    normalize: boolean;

}
