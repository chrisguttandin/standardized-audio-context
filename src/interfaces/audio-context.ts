import { IBaseAudioContext } from './base-audio-context';
import { IMediaElementAudioSourceNode } from './media-element-audio-source-node';
import { IMediaStreamAudioSourceNode } from './media-stream-audio-source-node';
import { IMediaStreamTrackAudioSourceNode } from './media-stream-track-audio-source-node';
import { IMinimalAudioContext } from './minimal-audio-context';

export interface IAudioContext extends IBaseAudioContext, IMinimalAudioContext {

    createMediaElementSource (mediaElement: HTMLMediaElement): IMediaElementAudioSourceNode<this>;

    createMediaStreamSource (mediaStream: MediaStream): IMediaStreamAudioSourceNode<this>;

    createMediaStreamTrackSource (mediaStreamTrack: MediaStreamTrack): IMediaStreamTrackAudioSourceNode<this>;

}
