import { IAudioNode } from './audio-node';
import { IMinimalAudioContext } from './minimal-audio-context';

export interface IMediaStreamTrackAudioSourceNode<T extends IMinimalAudioContext> extends IAudioNode<T> {

}
