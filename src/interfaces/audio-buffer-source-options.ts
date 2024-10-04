import { TAnyAudioBuffer } from '../types';
import { IAudioNodeOptions } from './audio-node-options';

export interface IAudioBufferSourceOptions extends IAudioNodeOptions {
    buffer: null | TAnyAudioBuffer;

    detune: number;

    loop: boolean;

    loopEnd: number;

    loopStart: number;

    playbackRate: number;
}
