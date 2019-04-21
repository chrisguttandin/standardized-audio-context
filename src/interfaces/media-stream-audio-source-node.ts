import { IAudioNode } from './audio-node';
import { IMinimalAudioContext } from './minimal-audio-context';

export interface IMediaStreamAudioSourceNode<T extends IMinimalAudioContext> extends IAudioNode<T> {

    readonly mediaStream: MediaStream;

}
