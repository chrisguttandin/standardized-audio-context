import { IAudioNode } from './audio-node';

export interface IMediaStreamAudioSourceNode extends IAudioNode {

    readonly mediaStream: MediaStream;

}
