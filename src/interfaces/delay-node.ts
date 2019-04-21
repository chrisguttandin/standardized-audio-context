import { IAudioNode } from './audio-node';
import { IAudioParam } from './audio-param';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IDelayNode<T extends IMinimalBaseAudioContext> extends IAudioNode<T> {

    readonly delayTime: IAudioParam;

}
