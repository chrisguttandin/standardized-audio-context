import { IAudioParam } from './audio-param';
import { IAudioScheduledSourceNode } from './audio-scheduled-source-node';

export interface IAudioBufferSourceNode extends IAudioScheduledSourceNode {

    buffer: null | AudioBuffer;

    readonly detune: IAudioParam;

    loop: boolean;

    loopEnd: number;

    loopStart: number;

    readonly playbackRate: IAudioParam;

    start (when?: number, offset?: number, duration?: number): void;

}
