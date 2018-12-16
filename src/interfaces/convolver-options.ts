import { IAudioBuffer } from './audio-buffer';
import { IAudioNodeOptions } from './audio-node-options';

export interface IConvolverOptions extends IAudioNodeOptions {

    buffer: null | IAudioBuffer;

    disableNormalization: boolean;

}
