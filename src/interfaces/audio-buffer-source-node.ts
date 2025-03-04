import { TAnyAudioBuffer, TContext } from '../types';
import { IAudioParam } from './audio-param';
import { IAudioScheduledSourceNode } from './audio-scheduled-source-node';

export interface IAudioBufferSourceNode<T extends TContext> extends IAudioScheduledSourceNode<T> {
    buffer: null | TAnyAudioBuffer;

    readonly detune: IAudioParam;

    loop: boolean;

    loopEnd: number;

    loopStart: number;

    readonly playbackRate: IAudioParam;

    start(when?: number, offset?: number, duration?: number): void;
}
