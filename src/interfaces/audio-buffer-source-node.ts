import { TAnyAudioBuffer } from '../types';
import { IAudioParam } from './audio-param';
import { IAudioScheduledSourceNode } from './audio-scheduled-source-node';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IAudioBufferSourceNode<T extends IMinimalBaseAudioContext> extends IAudioScheduledSourceNode<T> {

    buffer: null | TAnyAudioBuffer;

    /*
     * Bug #149: Safari does not yet support the detune AudioParam.
     *
     * readonly detune: IAudioParam;
     */

    loop: boolean;

    loopEnd: number;

    loopStart: number;

    readonly playbackRate: IAudioParam;

    start (when?: number, offset?: number, duration?: number): void;

}
