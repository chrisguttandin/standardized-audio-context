import { IAudioNode } from './audio-node';
import { IAudioParam } from './audio-param';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IDynamicsCompressorNode<T extends IMinimalBaseAudioContext> extends IAudioNode<T> {

    readonly attack: IAudioParam;

    readonly knee: IAudioParam;

    readonly ratio: IAudioParam;

    readonly reduction: number;

    readonly release: IAudioParam;

    readonly threshold: IAudioParam;

}
