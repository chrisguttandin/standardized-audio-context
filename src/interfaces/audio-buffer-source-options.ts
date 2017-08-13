import { IAudioBuffer } from './audio-buffer';
import { IAudioNodeOptions } from './audio-node-options';

export interface IAudioBufferSourceOptions extends IAudioNodeOptions {

    buffer: null | IAudioBuffer;

    detune: number;

    loop: boolean;

    loopEnd: number;

    loopStart: number;

    playbackRate: number;

}
