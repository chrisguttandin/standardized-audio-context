import { TEndedEventHandler } from '../types';
import { IAudioScheduledSourceNode } from './audio-scheduled-source-node';

export interface IAudioBufferSourceNode extends IAudioScheduledSourceNode {

    buffer: null | AudioBuffer;

    detune: AudioParam;

    loop: boolean;

    loopEnd: number;

    loopStart: number;

    onended: null | TEndedEventHandler;

    playbackRate: AudioParam;

    start (when?: number, offset?: number, duration?: number): void;

}
