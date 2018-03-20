import { IAudioNode } from './audio-node';

export interface IMediaElementAudioSourceNode extends IAudioNode {

    readonly mediaElement: HTMLMediaElement;

}
