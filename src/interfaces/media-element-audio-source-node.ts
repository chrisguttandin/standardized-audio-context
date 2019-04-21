import { IAudioNode } from './audio-node';
import { IMinimalAudioContext } from './minimal-audio-context';

export interface IMediaElementAudioSourceNode<T extends IMinimalAudioContext> extends IAudioNode<T> {

    readonly mediaElement: HTMLMediaElement;

}
