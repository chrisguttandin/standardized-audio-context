import { IAudioNode } from './audio-node';
import { IAudioParam } from './audio-param';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IStereoPannerNode<T extends IMinimalBaseAudioContext> extends IAudioNode<T> {

    readonly pan: IAudioParam;

}
