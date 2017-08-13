import { IAudioScheduledSourceNode } from './audio-scheduled-source-node';

export interface IAudioBufferSourceNode extends IAudioScheduledSourceNode {

    buffer: null | AudioBuffer;

    detune: AudioParam;

    loop: boolean;

    loopEnd: number;

    loopStart: number;

    playbackRate: AudioParam;

    start (when?: number, offset?: number, duration?: number): void;

}
