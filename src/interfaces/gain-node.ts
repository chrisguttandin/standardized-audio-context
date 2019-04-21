import { IAudioNode } from './audio-node';
import { IAudioParam } from './audio-param';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IGainNode<T extends IMinimalBaseAudioContext> extends IAudioNode<T> {

    readonly gain: IAudioParam;

}
