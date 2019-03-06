import { TAnyAudioBuffer, TEndedEventHandler } from '../types';
import { IAudioParam } from './audio-param';
import { IAudioScheduledSourceNode } from './audio-scheduled-source-node';

export interface IAudioBufferSourceNode extends IAudioScheduledSourceNode {

    buffer: null | TAnyAudioBuffer;

    /*
     * Bug #149: Safari does not yet support the detune AudioParam.
     *
     * readonly detune: IAudioParam;
     */

    loop: boolean;

    loopEnd: number;

    loopStart: number;

    onended: null | TEndedEventHandler<IAudioBufferSourceNode>;

    readonly playbackRate: IAudioParam;

    start (when?: number, offset?: number, duration?: number): void;

}
